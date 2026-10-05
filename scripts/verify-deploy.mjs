#!/usr/bin/env node
/**
 * verify-deploy.mjs
 *
 * Answers two questions:
 *
 *   1. Is the deployed site serving the bundle produced by THIS checkout?
 *      It compares the hashed entry chunk referenced by the live HTML with the
 *      one referenced by dist/index.html, then compares that chunk's bytes too.
 *
 *   2. Does it route the way this checkout's vercel.json says it should?
 *      A missing /assets/* path must 404 instead of falling through to the SPA
 *      rewrite, which would answer with index.html and HTTP 200 and make a
 *      broken asset path look like a success.
 *
 * Why the comparison is trustworthy: the chunk filename is derived from the
 * bundle's contents, so a stale CDN response can only ever cause a temporary
 * false MISMATCH, never a false MATCH.
 *
 * Usage:
 *   npm run verify:deploy
 *   npm run verify:deploy -- https://example.vercel.app
 *   npm run verify:deploy -- --build        # rebuild dist/ first
 *
 * Exit codes:
 *   0  production matches this checkout
 *   1  production does NOT match this checkout
 *   2  could not verify (missing build, network failure)
 */

import { execFileSync } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DEFAULT_TARGET = "https://light-americanairlines-portal.vercel.app";
const ENTRY_CHUNK = /assets\/index-[A-Za-z0-9_.-]+\.js/;

/**
 * Routing probes. vercel.json's SPA fallback excludes /assets/*, which is the
 * only reason a missing asset 404s. These two probes pin that behaviour down
 * from both sides: assets fail loudly, real routes still serve the app.
 */
const MISSING_ASSET_PROBE = "/assets/__verify_deploy_probe__.js";
const SPA_ROUTE_PROBE = "/__verify_deploy_route__";

/**
 * Inputs that change the built bundle. Deliberately excludes package.json and
 * eslint config: editing scripts or lint rules does not alter dist/, and
 * including them would raise a false "stale build" warning on every such edit.
 */
const BUILD_INPUTS = ["src", "index.html", "vite.config.js"];

const line = (label, value) => console.log(`  ${label.padEnd(15)} ${value}`);
const rule = () => console.log(`  ${"─".repeat(58)}`);

function humanAge(ms) {
  if (!Number.isFinite(ms)) return "unknown";
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 90) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 36) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function shortName(chunk) {
  return chunk ? chunk.replace("assets/", "") : null;
}

function entryChunkOf(html) {
  const match = html.match(ENTRY_CHUNK);
  return match ? match[0] : null;
}

async function get(url) {
  return fetch(url, {
    headers: { "cache-control": "no-cache", pragma: "no-cache" },
    redirect: "follow",
  });
}

/**
 * Newest mtime across the build inputs. Comparing this to the build time tells
 * us whether dist/ can still be trusted — which is more accurate than comparing
 * against commit dates, since a commit that changes no source is irrelevant.
 */
async function newestSourceMtime(root) {
  let newest = 0;

  const visit = async (target) => {
    let stats;
    try {
      stats = await stat(target);
    } catch {
      return;
    }

    if (!stats.isDirectory()) {
      if (stats.mtimeMs > newest) newest = stats.mtimeMs;
      return;
    }

    let entries;
    try {
      entries = await readdir(target);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      await visit(path.join(target, entry));
    }
  };

  for (const input of BUILD_INPUTS) await visit(path.join(root, input));
  return newest;
}

function abort(message, hint) {
  console.error("\n✖ Could not verify the deploy.\n");
  console.error(`  ${message}`);
  if (hint) console.error(`\n  ${hint}`);
  console.error();
  return 2;
}

async function main() {
  const argv = process.argv.slice(2);
  const shouldBuild = argv.includes("--build");
  const target = (
    argv.find((arg) => /^https?:\/\//i.test(arg)) ||
    process.env.VERIFY_DEPLOY_URL ||
    DEFAULT_TARGET
  ).replace(/\/+$/, "");

  const distDir = path.resolve("dist");
  const distHtmlPath = path.join(distDir, "index.html");

  if (typeof fetch !== "function") {
    return abort("This script needs Node 18+ for the global fetch API.");
  }

  if (shouldBuild) {
    console.log("\nBuilding the local bundle (npm run build)…\n");
    execFileSync("npm run build", { stdio: "inherit", shell: true });
  }

  // ---------- Local build ----------
  let localHtml;
  let distBuiltAt;
  try {
    localHtml = await readFile(distHtmlPath, "utf8");
    distBuiltAt = (await stat(distHtmlPath)).mtimeMs;
  } catch {
    return abort(
      `No local build found at ${path.relative(process.cwd(), distHtmlPath)}.`,
      "Run `npm run build`, or use `npm run verify:deploy -- --build`."
    );
  }

  const localChunk = entryChunkOf(localHtml);
  if (!localChunk) {
    return abort(`Could not find an entry chunk in ${path.relative(process.cwd(), distHtmlPath)}.`);
  }

  const newestSource = await newestSourceMtime(process.cwd());
  const sourceTouchedAfterBuild = newestSource > distBuiltAt;

  // ---------- Live site ----------
  let liveResponse;
  try {
    liveResponse = await get(`${target}/?verify=${Date.now()}`);
  } catch (error) {
    return abort(
      `Request to ${target} failed: ${error.message}`,
      "Check the URL and your connection."
    );
  }

  if (!liveResponse.ok) {
    return abort(`${target} responded with HTTP ${liveResponse.status}.`);
  }

  const liveHtml = await liveResponse.text();
  const liveChunk = entryChunkOf(liveHtml);
  const edgeCache = [
    liveResponse.headers.get("x-vercel-cache"),
    liveResponse.headers.get("age") !== null && `age ${liveResponse.headers.get("age")}s`,
  ]
    .filter(Boolean)
    .join(", ");

  // ---------- Compare ----------
  let contentLine = null;
  let contentMatches = null;

  if (liveChunk && liveChunk === localChunk) {
    try {
      const [localFile, liveFile] = await Promise.all([
        readFile(path.join(distDir, localChunk)),
        get(`${target}/${liveChunk}`),
      ]);
      const localBytes = localFile;
      const liveBytes = Buffer.from(await liveFile.arrayBuffer());
      contentMatches = localBytes.equals(liveBytes);
      contentLine = contentMatches
        ? `byte-identical (${(localBytes.length / 1024).toFixed(0)} KB)`
        : "SAME FILENAME, DIFFERENT BYTES";
    } catch (error) {
      contentLine = `could not compare (${error.message})`;
    }
  }

  // ---------- Routing probes ----------
  const probe = async (pathname) => {
    try {
      const response = await get(`${target}${pathname}?verify=${Date.now()}`);
      return {
        status: response.status,
        type: response.headers.get("content-type") || "",
      };
    } catch (error) {
      return { status: null, type: `request failed: ${error.message}` };
    }
  };

  const [missingAsset, spaRoute] = await Promise.all([
    probe(MISSING_ASSET_PROBE),
    probe(SPA_ROUTE_PROBE),
  ]);

  const missingAssetIsHonest = missingAsset.status === 404;
  const spaRouteServes = spaRoute.status === 200 && /text\/html/i.test(spaRoute.type);
  const routingOk = missingAssetIsHonest && spaRouteServes;

  // ---------- Report ----------
  console.log("\nDeploy verification\n");
  line("target", target);
  line("local build", `${shortName(localChunk)}  (built ${humanAge(Date.now() - distBuiltAt)})`);
  line("live bundle", shortName(liveChunk) || "no entry chunk found");
  if (edgeCache) line("edge cache", edgeCache);
  if (contentLine) line("content", contentLine);
  line(
    "missing asset",
    missingAssetIsHonest
      ? "404 ✓  (not the app shell)"
      : `${missingAsset.status ?? "?"} ✗  ${missingAsset.type || "no content-type"}`
  );
  line(
    "spa route",
    spaRouteServes
      ? "200 ✓  (app shell)"
      : `${spaRoute.status ?? "?"} ✗  ${spaRoute.type || "no content-type"}`
  );
  rule();

  let code;
  if (!liveChunk) {
    console.log("\n⚠ The live HTML did not reference a hashed entry chunk.");
    console.log("  The deployment may serve different output than this project's build.");
    code = 2;
  } else if (liveChunk !== localChunk) {
    console.log("\n✖ MISMATCH — production is NOT serving this checkout's build.\n");
    console.log("  A new build may not have been deployed yet, or dist/ is stale.\n");
    console.log("  Next steps:");
    console.log("    • wait ~1–2 min for the deployment to finish, then re-run");
    console.log("    • rebuild locally:  npm run verify:deploy -- --build");
    console.log("    • list deployments: vercel ls American Airlines");
    code = 1;
  } else if (contentMatches === false) {
    console.log("\n✖ MISMATCH — chunk names match but their contents differ.");
    code = 1;
  } else if (contentMatches === null) {
    console.log("\n⚠ Chunk names match, but the contents could not be compared.");
    code = 2;
  } else if (!routingOk) {
    console.log("\n✖ MISMATCH — the bundle matches, but the routing does not.\n");
    console.log(
      `  ${MISSING_ASSET_PROBE}  →  ${missingAsset.status}  (expected 404)`
    );
    console.log(`  ${SPA_ROUTE_PROBE}  →  ${spaRoute.status}  (expected 200)`);
    console.log("\n  vercel.json keeps /assets/* out of the SPA fallback so broken asset");
    console.log("  paths fail loudly instead of returning the app shell. Production has");
    console.log("  not picked that config up yet — push it and re-run.\n");
    code = 1;
  } else {
    console.log(`\n✅ MATCH — ${target} is serving exactly this checkout's build and routing.`);
    code = 0;
  }

  if (sourceTouchedAfterBuild) {
    console.log(
      "\n⚠ Files under src/ (or the build config) are newer than this dist/ build,"
    );
    console.log("  so the answer above describes a stale bundle. Re-run with:");
    console.log("\n      npm run verify:deploy -- --build\n");
  } else {
    console.log();
  }

  return code;
}

// Set the exit code rather than calling process.exit(): exiting while pipes are
// still closing trips a libuv assertion on Windows and corrupts the exit status.
try {
  process.exitCode = await main();
} catch (error) {
  console.error(`\n✖ Verification crashed: ${error?.stack || error}\n`);
  process.exitCode = 2;
}
