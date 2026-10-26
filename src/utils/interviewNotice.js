import { fromZonedTime } from "date-fns-tz";

/**
 * The consular interview, in the consulate's own clock.
 *
 * The appointment was booked in Boise (Mountain) time, so "10:45 AM" is a wall
 * clock in America/Boise, not in whatever zone the visitor happens to be sitting
 * in. Converting the wall clock to a UTC instant through the time zone database
 * keeps that true across daylight saving, so the notice prints the appointment
 * the consulate would agree with.
 */

export const INTERVIEW_TIME_ZONE = "America/Boise";

const INTERVIEW = {
  // The interview has happened. It was a second appointment, at the consulate's
  // request, on the Tuesday after the first one; nothing was ever missed.
  date: "2026-10-20", // Tuesday
  start: "10:45", // 10:45 AM Boise time
  durationMinutes: 60, // ran one hour, so it ended at 11:45 AM Boise time
};

/**
 * A wall clock in INTERVIEW_TIME_ZONE, as a Date whose *local* getters carry
 * those digits. fromZonedTime() reads those getters, so this stays correct no
 * matter which zone the browser (or Node) is running in.
 */
const wallClock = (date, time) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

export const INTERVIEW_START = fromZonedTime(
  wallClock(INTERVIEW.date, INTERVIEW.start),
  INTERVIEW_TIME_ZONE
);

export const INTERVIEW_END = new Date(
  INTERVIEW_START.getTime() + INTERVIEW.durationMinutes * 60_000
);

// ---------- Where the document stands ----------
// The consulate's review is finished and the passport document has since been
// processed, so the notice reports the outcome on its own. The delivery window
// that was quoted while it was pending is deliberately gone: once the file is
// done, a countdown only reads as a deadline still running.

/** The outcome the notice prints now that the documents are done. */
export const INTERVIEW_DOCUMENTS_STATUS = "Processed";

// ---------- Display labels ----------
// Derived from the instants above and read back in Boise time, so the words in
// the notice cannot drift away from the appointment it describes.

const inBoise = (options) =>
  new Intl.DateTimeFormat("en-US", { ...options, timeZone: INTERVIEW_TIME_ZONE });

/** "Tuesday 10/20/2026" */
const dateLabel = (instant) =>
  `${inBoise({ weekday: "long" }).format(instant)} ${inBoise({
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(instant)}`;

export const INTERVIEW_DATE_LABEL = dateLabel(INTERVIEW_START);

const clockLabel = (instant) =>
  inBoise({ hour: "numeric", minute: "2-digit", hour12: true })
    .format(instant)
    .toUpperCase();

/** "10:45 AM" */
export const INTERVIEW_START_LABEL = clockLabel(INTERVIEW_START);

/** "11:45 AM" */
export const INTERVIEW_END_LABEL = clockLabel(INTERVIEW_END);
