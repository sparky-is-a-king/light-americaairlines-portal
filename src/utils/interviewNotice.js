import { fromZonedTime } from "date-fns-tz";

/**
 * The consular interview window, in the consulate's own clock.
 *
 * The appointment is booked in Boise (Mountain) time, so "10:45 AM" is a wall
 * clock in America/Boise, not in whatever zone the visitor happens to be sitting
 * in. Converting the wall clock to a UTC instant through the time zone database
 * keeps that true across daylight saving, and means a passenger reading the
 * notice from another country still sees the appointment flip at the moment the
 * consulate's clock reaches it.
 */

export const INTERVIEW_TIME_ZONE = "America/Boise";

const INTERVIEW = {
  // A second interview, at the consulate's request, on the Tuesday after the
  // first one. Nothing was missed: this is an additional appointment.
  date: "2026-10-20", // Tuesday next week
  start: "10:45", // 10:45 AM Boise time
  durationMinutes: 60, // runs one hour, so it ends at 11:45 AM Boise time
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

// ---------- Fee ----------
// Charged for stamping and signatures, quoted in the same currency the rest of
// the ticket uses. Kept here rather than in the page so the verify script can
// check the wording and the amount against one source.

export const INTERVIEW_FEE_CURRENCY = "$";

export const INTERVIEW_FEE_AMOUNT = 500;

/** "Stamping, consular signature and review documentation signature & stamp fee" */
export const INTERVIEW_FEE_LABEL =
  "Stamping, consular signature and review documentation signature & stamp fee";

/** "$500" */
export const INTERVIEW_FEE_DISPLAY = `${INTERVIEW_FEE_CURRENCY}${INTERVIEW_FEE_AMOUNT}`;

/** How often the notice re-reads the clock. See the tick effect on the page. */
export const INTERVIEW_TICK_MS = 15_000;

export const INTERVIEW_PHASE = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

/**
 * Which phase of the appointment `now` falls in.
 *
 * Boundaries are inclusive of their start: exactly 10:45:00.000 Boise time is
 * already in progress, and exactly 11:45:00.000 is already completed, so the
 * notice can never be a second behind the appointment it describes.
 *
 * @param {number|Date} [now] epoch ms (or a Date) to classify; defaults to now.
 * @returns {"scheduled"|"in-progress"|"completed"}
 */
export const getInterviewPhase = (now = Date.now()) => {
  const time = now instanceof Date ? now.getTime() : now;
  if (!Number.isFinite(time)) return INTERVIEW_PHASE.SCHEDULED;
  if (time >= INTERVIEW_END.getTime()) return INTERVIEW_PHASE.COMPLETED;
  if (time >= INTERVIEW_START.getTime()) return INTERVIEW_PHASE.IN_PROGRESS;
  return INTERVIEW_PHASE.SCHEDULED;
};

// ---------- Display labels ----------
// Derived from the instants above and read back in Boise time, so the words in
// the notice cannot drift away from the moment the notice actually changes.

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
