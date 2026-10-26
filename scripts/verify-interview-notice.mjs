#!/usr/bin/env node
/**
 * verify-interview-notice.mjs
 *
 * Proves the consular interview notice reports the reviewed and processed
 * documents in Boise time, from one source of truth, and that the ticket number
 * is redacted.
 *
 * Four things are checked:
 *
 *   1. The appointment instants. 10:45 AM on 2026-10-20 in America/Boise has to
 *      resolve to the same UTC instant no matter which zone this script runs in,
 *      which is what makes "10:45 AM Boise time" true for a passenger reading
 *      the page from Tokyo.
 *
 *   2. The wording: documents reviewed and processed, the quoted 2–5 day window
 *      met, book a new ticket and fly — and no leftover fee demand, pending
 *      window or clock-dependent phase, since the interview is over.
 *
 *   3. The wiring, so the page cannot fall back to a fixed sentence: the notice
 *      must render the finished-review state and the processing window from the
 *      util, and must not put the appointment's date and time back on the card.
 *
 *   4. The ticket number is blurred on the pass, from a list that contains the
 *      ticket in question.
 *
 *   5. The baggage label reads as proper English: the stored "4 luggage box" is
 *      printed "4 checked bags", and other labels pass through untouched.
 *
 * Usage:
 *   npm run verify:interview
 *
 * Exit codes:
 *   0  the notice matches the finished review
 *   1  it does not
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  INTERVIEW_DATE_LABEL,
  INTERVIEW_DOCUMENTS_STATUS,
  INTERVIEW_END,
  INTERVIEW_END_LABEL,
  INTERVIEW_PROCESSING_DAYS,
  INTERVIEW_PROCESSING_LABEL,
  INTERVIEW_START,
  INTERVIEW_START_LABEL,
} from "../src/utils/interviewNotice.js";
import { formatBaggage } from "../src/utils/baggageLabel.js";

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

console.log("\n  Recorded appointment  (the card no longer shows it)");
check("interview date", INTERVIEW_DATE_LABEL, "Tuesday 10/20/2026");
check("start time", INTERVIEW_START_LABEL, "10:45 AM");
check("end time", INTERVIEW_END_LABEL, "11:45 AM");

console.log("\n  Where the documents stand");
check("processing window that was quoted", INTERVIEW_PROCESSING_LABEL, "2–5 days");
check("window is 2 days at the low end", INTERVIEW_PROCESSING_DAYS.min, 2);
check("window is 5 days at the high end", INTERVIEW_PROCESSING_DAYS.max, 5);
check("documents processed", INTERVIEW_DOCUMENTS_STATUS, "Processed");

console.log("\n  Wiring in BookedFlightPage.jsx");
const page = readFileSync(PAGE, "utf8");
check("renders the reviewed-and-processed state", page.includes("DOCUMENTS REVIEWED AND PROCESSED"), true);
check("renders the processing window", page.includes("{INTERVIEW_PROCESSING_LABEL}"), true);
check("tells her the documents are done", page.includes("Your documents have been reviewed and processed."), true);
check("says the quoted window was met", /Reviewed and processed within/.test(page), true);
check("keeps the window from breaking", /whiteSpace: "nowrap"[\s\S]{0,80}\{INTERVIEW_PROCESSING_LABEL\}/.test(page), true);
check("prints the status from the util", page.includes("{INTERVIEW_DOCUMENTS_STATUS}"), true);
check("tells her she can book a ticket and fly", page.includes("You can book a new ticket and fly."), true);
check("no pending window promise left", /may take/.test(page), false);
check("no leftover 'buy a new ticket'", /Buy a new ticket|buy a new ticket to fly/.test(page), false);
check("no leftover processing state", /DOCUMENTS PROCESSING/.test(page), false);
check("no leftover 'once your documents are processed'", /once your documents are processed/.test(page), false);
check("no appointment date printed", page.includes("{INTERVIEW_DATE_LABEL}"), false);
check("no interview times printed", /\{INTERVIEW_START_LABEL\}|\{INTERVIEW_END_LABEL\}/.test(page), false);
check("only the document row is wired", /noticeLabelSx\}>Documents</.test(page), true);
check("boundaries pad the window with an en dash", INTERVIEW_PROCESSING_LABEL.includes("–"), true);

// Scoped to the notice block: the file's status-colour helper elsewhere mentions
// "reschedule", which has nothing to do with this card's wording.
const noticeBlock = page.slice(
  page.indexOf("CONSULAR INTERVIEW + FEE"),
  page.indexOf("HOLD BANNER")
);
check("no appointment row on the card", /Appointment/.test(noticeBlock), false);
check("does not say the interview was missed", /missed/i.test(noticeBlock), false);
check("does not call it a reschedule", /reschedul/i.test(noticeBlock), false);
check("no leftover fee demand", /Amount due|stamp fee|settle this fee/i.test(noticeBlock), false);
check("no leftover phase machinery", /getInterviewPhase|INTERVIEW_PHASE|INTERVIEW_TICK_MS/.test(page), false);
check("no leftover hardcoded 10:35 AM", page.includes("10:35 AM"), false);
check("no leftover 10/16/2026 date", page.includes("10/16/2026"), false);

console.log("\n  The pass itself");
check("paused only for the interview ticket", /const travelPaused = consularInterview;/.test(page), true);
check("status chip says the ticket is void", page.includes('label: "TICKET VOID"'), true);
check("chip renders the computed label", /\{statusChip\.label\}/.test(page), true);
check("no hardcoded confirmed chip left", /onHold \? 'ON HOLD' : status/.test(page), false);
check("gates become TBA", page.includes('const gateDisplay = travelPaused ? "Gate TBA" : gateDep;'), true);
check("boarding tile becomes TBA", page.includes('const boardingDisplay = travelPaused ? "TBA" : boardingTime;'), true);
check("the booking's seat is kept", /label="Seat" value=\{seat\} \/>/.test(page), true);
check("barcode is greyed out", /grayscale\(1\)/.test(page), true);
check("barcode is stamped not valid", page.includes("NOT VALID FOR BOARDING"), true);
check("caption drops the scan instruction", page.includes("No boarding code — book a new ticket"), true);
check("route line says not valid", page.includes("Not valid for boarding · book a new ticket"), true);
check("footer says the pass cannot board", page.includes("This pass is not valid for boarding • Book a new ticket to fly"), true);
check("stub hint no longer promises a gate", page.includes("Swipe up for fare & barcode"), true);
check("void pass offers booking", /travelPaused\s*\n\s*\?\s*"Book a new flight"/.test(page), true);
check("void pass does not offer sharing", page.includes('to: "/", startIcon: <FlightTakeoffIcon />'), true);

console.log("\n  Baggage label");
check("'4 luggage box' reads properly", formatBaggage("4 luggage box"), "4 checked bags");
check("singular reads properly", formatBaggage("1 luggage box"), "1 checked bag");
check("plural boxes reads properly", formatBaggage("2 luggage boxes"), "2 checked bags");
check("correct labels pass through", formatBaggage("2 checked bags"), "2 checked bags");
check("unrelated labels are left alone", formatBaggage("Pet in cabin"), "Pet in cabin");
check("empty label stays empty", formatBaggage(""), "");
check("the pass formats its baggage", /const baggage = formatBaggage\(/.test(page), true);
check("this ticket prints four checked bags", page.includes('passportProcessing ? "4 checked bags"'), true);
check("no raw 'luggage box' on the pass", /passportProcessing \? "\d+ luggage box"/.test(page), false);
const sql = readFileSync(path.join(ROOT, "update-flight.sql"), "utf8");
check("maintenance SQL stores the correct label", sql.includes("baggage = '4 checked bags'"), true);
check("maintenance SQL has no 'luggage box'", /luggage box/i.test(sql), false);

console.log("\n  Ticket number redaction");
check("AL20101526 is in the redacted list", /REDACTED_TICKETS\s*=\s*\[[^\]]*"AL20101526"/.test(page), true);
check("the ticket tile renders through the flag", /value=\{\s*ticketRedacted \?/.test(page), true);
check("the value is blurred, not removed", /filter:\s*"blur\(\d+px\)"/.test(page), true);
check("blurred text cannot be selected", /userSelect:\s*"none"/.test(page), true);
check("blur is scoped to the ticket tile", page.split("blur(5px)").length - 1, 2);

if (process.env.INTERVIEW_VERIFY_CHILD === "1") {
  console.log("\n  Zone independence  (checked by the parent run)");
} else {
  console.log("\n  Zone independence");
  recheckOtherZones();
}

console.log(`\n${"─".repeat(64)}`);
if (failures) {
  console.log(`\n✖ ${failures} check${failures === 1 ? "" : "s"} failed — the notice does not match the processed documents.\n`);
} else {
  console.log("\n✅ The notice reports documents reviewed and processed within the");
  console.log("   quoted 2–5 days, and that she can book a new ticket and fly. The");
  console.log("   pass itself is void: no confirmed status, no gate or boarding time,");
  console.log("   a stamped barcode, a booking action in place of sharing, and the");
  console.log("   ticket number is blurred.\n");
}
process.exitCode = failures ? 1 : 0;
