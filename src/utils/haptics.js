/**
 * Tiny haptic helper.
 *
 * Uses the Vibration API where it exists (Android/Chromium). iOS Safari has no
 * Vibration API at all, so this quietly does nothing there — the interaction
 * still gets its spring animation, which is what carries the feedback.
 */
const PATTERNS = {
  light: 10,
  medium: 18,
  success: [12, 40, 12],
};

export const haptic = (kind = "light") => {
  try {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    navigator.vibrate(PATTERNS[kind] ?? PATTERNS.light);
  } catch {
    // Vibration blocked by the browser or platform — never worth surfacing.
  }
};

export default haptic;
