#!/usr/bin/env node
/**
 * verify-interview-notice.mjs
 *
 * Proves the consular interview notice is driven by the appointment's own clock
 * in Boise, not by the reader's clock or by a hardcoded string.
 *
 * Three things are checked:
 *
 *   1. The appointment instants. 10:45 AM on 2026-10-20 (the rescheduled Tuesday)
 *      in America/Boise has to resolve to the same UTC instant no matter which
 *      zone this script runs in, which is what makes "10:45 AM Boise time" true
 *      for a passenger reading the page from Tokyo.
 *
 *   2. The phase boundaries, including the exact millisecond each one flips:
 *      10:44:59.999 is still scheduled, 10:45:00.000 is in progress, and
 *      11:45:00.000 is completed.
 *
 *   3. The wiring, so the page cannot fall back to a fixed sentence: the notice
 *      component must ask for the phase, must carry all three states and the
 *      missed date, and must show the $500 stamping / signature fee.
 *
 * Usage:
 *   npm run verify:interview
 *
 * Exit codes:
 *   0  the notice follows the appointment
 *   1  it does not
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  INTERVIEW_DATE_LABEL,
  INTERVIEW_END,
  INTERVIEW_END_LABEL,
  INTERVIEW_FEE_AMOUNT,
  INTERVIEW_FEE_DISPLAY,
  INTERVIEW_FEE_LABEL,
  INTERVIEW_MISSED_DATE_LABEL,
  INTERVIEW_PHASE,
  INTERVIEW_START,
  INTERVIEW_START_LABEL,
  getInterviewPhase,
} from "../src/utils/interviewNotice.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = path.join(ROOT, "src", "pages", "BookedFlightPage.jsx");

/** Zones to prove the answer does not depend on. */
const OTHER_ZONES = ["Asia/Tokyo", "America/New_York", "Australia/Sydney"];

let failures = 0;

const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`  ${ok ? "✓" : "✗"} ${label.padEnd(46)} ${actual}${ok ? "" : `   (expected ${expected})`}`);
};

const minute = 60_000;

// Boise is on MDT (UTC-6) in October, so 10:45 AM there is 16:45 UTC. Written
// out rather than derived, so a time-zone conversion bug cannot hide behind the
// same arithmetic that produced it.
const EXPECTED_START_INSTANT = "2026-10-20T16:45:00.000Z";

/** The zone Node actually resolved, which is what the util's wall clock uses. */
const effectiveZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Re-run this file in other zones. The util builds its wall clock with the Date
 * constructor, so a bug that quietly depended on the host zone would only show
 * up when the host zone changes — which is exactly what a passenger abroad is.
 *
 * The child prints its own effective zone, and the exit status alone is not
 * enough: a Node build that ignored TZ would pass by re-running in the same
 * zone, so the reported zone has to actually differ.
 */
const recheckOtherZones = () => {
  const self = fileURLToPath(import.meta.url);
  for (const zone of OTHER_ZONES) {
    let result;
    try {
      result = { status: 0, output: execFileSync(process.execPath, [self], {
        env: { ...process.env, TZ: zone, INTERVIEW_VERIFY_CHILD: "1" },
        encoding: "utf8",
      }) };
    } catch (error) {
      result = { status: error.status, output: `${error.stdout || ""}${error.stderr || ""}` };
    }

    const ranInZone = result.output.includes(`zone=${zone}`);
    const ok = result.status === 0 && ranInZone;
    if (!ok) failures += 1;
    const detail = result.status === 0
      ? (ranInZone ? "exit 0" : "ran in the SAME zone — TZ was ignored")
      : `exit ${result.status}`;
    console.log(`  ${ok ? "✓" : "✗"} ${`same answer under TZ=${zone}`.padEnd(46)} ${detail}`);
    if (!ok) console.log(result.output);
  }
};

console.log(`\nInterview notice verification  (zone=${effectiveZone})\n`);

console.log("  Appointment instants");
check("starts 10:45 AM Boise time", INTERVIEW_START.toISOString(), EXPECTED_START_INSTANT);
check("ends 11:45 AM Boise time", INTERVIEW_END.toISOString(), "2026-10-20T17:45:00.000Z");
check("is a Tuesday", INTERVIEW_DATE_LABEL.split(" ")[0], "Tuesday");

console.log("\n  Labels the notice prints");
check("rescheduled date", INTERVIEW_DATE_LABEL, "Tuesday 10/20/2026");
check("missed date", INTERVIEW_MISSED_DATE_LABEL, "Friday 10/16/2026");
check("start time", INTERVIEW_START_LABEL, "10:45 AM");
check("end time", INTERVIEW_END_LABEL, "11:45 AM");

console.log("\n  Fee she was told to pay");
check("amount", INTERVIEW_FEE_DISPLAY, "$500");
check("amount (numeric)", INTERVIEW_FEE_AMOUNT, 500);
check(
  "description",
  INTERVIEW_FEE_LABEL,
  "Stamping, consular signature and review documentation signature & stamp fee"
);

console.log("\n  Phases around the boundaries");
const start = INTERVIEW_START.getTime();
const end = INTERVIEW_END.getTime();
check("30 min before start", getInterviewPhase(start - 30 * minute), INTERVIEW_PHASE.SCHEDULED);
check("1 ms before start", getInterviewPhase(start - 1), INTERVIEW_PHASE.SCHEDULED);
check("exactly at start", getInterviewPhase(start), INTERVIEW_PHASE.IN_PROGRESS);
check("30 min into the interview", getInterviewPhase(start + 30 * minute), INTERVIEW_PHASE.IN_PROGRESS);
check("1 ms before the hour mark", getInterviewPhase(end - 1), INTERVIEW_PHASE.IN_PROGRESS);
check("exactly at the hour mark", getInterviewPhase(end), INTERVIEW_PHASE.COMPLETED);
check("a day later", getInterviewPhase(end + 24 * 60 * minute), INTERVIEW_PHASE.COMPLETED);
check("a Date works as well as ms", getInterviewPhase(new Date(start)), INTERVIEW_PHASE.IN_PROGRESS);
check("a broken clock reads as not started", getInterviewPhase(NaN), INTERVIEW_PHASE.SCHEDULED);

console.log("\n  Wiring in BookedFlightPage.jsx");
const page = readFileSync(PAGE, "utf8");
check("asks the util for the phase", /getInterviewPhase\(interviewNow\)/.test(page), true);
check("re-reads the clock on a tick", /setInterval\(\(\) => setInterviewNow\(Date\.now\(\)\)/.test(page), true);
check("clears that timer", /clearInterval\(timer\)/.test(page), true);
check("renders the scheduled state", page.includes("CONSULAR INTERVIEW RESCHEDULED"), true);
check("renders the in-progress state", page.includes("CONSULAR INTERVIEW IN PROGRESS"), true);
check("renders the completed state", page.includes("CONSULAR INTERVIEW COMPLETED"), true);
check("says what the appointment moved from", page.includes("${INTERVIEW_MISSED_DATE_LABEL}"), true);
check("shows the fee description", page.includes("{INTERVIEW_FEE_LABEL}"), true);
check("shows the amount due", page.includes("{INTERVIEW_FEE_DISPLAY}"), true);
check("asks for payment", page.includes("PAYMENT REQUIRED"), true);
check("no leftover hardcoded 10:35 AM", page.includes("10:35 AM"), false);
check("no leftover schedule dated 10/16/2026", /scheduled for Friday 10\/16\/2026/.test(page), false);

if (process.env.INTERVIEW_VERIFY_CHILD === "1") {
  console.log("\n  Zone independence  (checked by the parent run)");
} else {
  console.log("\n  Zone independence");
  recheckOtherZones();
}

console.log(`\n${"─".repeat(64)}`);
if (failures) {
  console.log(`\n✖ ${failures} check${failures === 1 ? "" : "s"} failed — the notice does not follow the appointment.\n`);
} else {
  console.log("\n✅ The notice tracks the rescheduled appointment: Tuesday 10/20/2026 at");
  console.log("   10:45 AM Boise time, in progress until 11:45 AM, completed after that —");
  console.log("   in every zone, with the $500 stamping / signature fee shown.\n");
}
process.exitCode = failures ? 1 : 0;
