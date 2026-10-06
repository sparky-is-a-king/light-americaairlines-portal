import { useRef } from "react";

/**
 * Navigation history, direction and the swipe-back gesture's needs.
 *
 * The push transition and the edge-swipe back gesture both need to know where
 * the user came from and whether they moved forward or back. We work that out by
 * tracking this session's visited locations: a location we've seen before (and
 * that isn't the newest one) means the user stepped back.
 *
 * `navigationDirection` and `transitionOverride` are deliberately mutable boxes
 * rather than React state. An exiting page is frozen by AnimatePresence, so its
 * exit animation can only learn the new direction (or that it should finish
 * instantly) by reading a live value when the animation actually starts.
 */
export const NAV_FORWARD = "forward";
export const NAV_BACK = "back";

export const navigationDirection = { current: NAV_FORWARD };

/**
 * Set while a swipe-back commits. The gesture has already animated the pages
 * itself, so the incoming route must mount at rest instead of replaying a
 * transition on top of it.
 */
export const transitionOverride = { skip: false };

/**
 * Records the current location and decides the direction of this navigation.
 * Called during render so the entering page picks its direction immediately.
 * The mutations below are idempotent, so a double render (e.g. StrictMode)
 * settles on the same answer.
 *
 * Returns the screen behind this one, which the swipe-back gesture reveals.
 */
export const useNavigationHistory = (location) => {
  const entriesRef = useRef([]);
  const entries = entriesRef.current;
  const seenAt = entries.findIndex((entry) => entry.key === location.key);

  if (seenAt === -1) {
    // A brand-new entry — forward.
    entries.push(location);
    navigationDirection.current = NAV_FORWARD;
  } else if (seenAt < entries.length - 1) {
    // We've popped back to an earlier entry; drop the abandoned entries so a
    // later re-forward reads as forward again.
    const trimmed = entries.slice(0, seenAt + 1);
    trimmed[seenAt] = location;
    entriesRef.current = trimmed;
    navigationDirection.current = NAV_BACK;
  } else {
    // Same entry re-rendering — refresh it, keep the direction.
    entriesRef.current[seenAt] = location;
  }

  const index = entriesRef.current.findIndex((entry) => entry.key === location.key);

  return {
    previousLocation: index > 0 ? entriesRef.current[index - 1] : null,
    canGoBack: index > 0,
  };
};
