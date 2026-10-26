/**
 * Baggage labels, in proper English.
 *
 * Baggage is free text in the database, and one booking was saved as
 * "4 luggage box". The pass prints "4 checked bags" instead (or "1 checked bag"),
 * and leaves any other label exactly as stored, so a wording fix here cannot
 * rewrite data the page does not understand.
 */

const BAGGAGE_BOX_PATTERN = /^(\d+)\s+luggage\s+box(?:es)?$/i;

export const formatBaggage = (label) => {
  const text = String(label ?? "").trim();
  const match = BAGGAGE_BOX_PATTERN.exec(text);
  if (!match) return label;

  const count = Number(match[1]);
  return `${count} checked ${count === 1 ? "bag" : "bags"}`;
};
