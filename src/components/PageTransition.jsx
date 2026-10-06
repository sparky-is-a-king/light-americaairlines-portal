import React from "react";
import { motion as Motion } from "framer-motion";
import { NAV_BACK, navigationDirection, transitionOverride } from "../utils/navigation";

/**
 * Page transitions for the router.
 *
 * Each route renders inside <PageTransition>, which AnimatePresence in PageStack
 * keeps mounted long enough to play its `exit` animation before the next page
 * enters. Presets are the "styles": pick one per route to match how that screen
 * arrives (detail pages push in, auth screens rise like a sheet, the rest ease up).
 *
 * iOS-ish easing curve — fast out of the gate, gently settling.
 */
const EASE = [0.32, 0.72, 0, 1];

// How far a pushed page travels. Entering travels further than exiting so the
// motion reads as "opening" rather than "sliding sideways".
const PUSH_IN = 44;
const PUSH_OUT = 28;

// Every preset is resolved through this. It exists for two reasons:
//   • the push preset reads the live navigation direction, and
//   • a swipe-back sets transitionOverride.skip so the route it already slid
//     into place mounts at rest instead of animating a second time.
const RESTING = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  filter: "blur(0px)",
  transition: { duration: 0 },
};

const resolve = (target) => () => {
  if (transitionOverride.skip) return RESTING;
  return typeof target === "function" ? target() : target;
};

/**
 * Named variants. `transition` lives inside each target so enter and exit can
 * run at different speeds: entering is a touch slower and more deliberate than
 * the quick exit, which keeps navigation feeling responsive.
 */
const PRESETS = {
  // Default — content eases up into place.
  "fade-up": {
    initial: resolve({ opacity: 0, y: 18 }),
    animate: resolve({ opacity: 1, y: 0, transition: { duration: 0.36, ease: EASE } }),
    exit: resolve({ opacity: 0, y: -12, transition: { duration: 0.18, ease: EASE } }),
  },
  // Plain cross-fade, for screens that already animate themselves.
  fade: {
    initial: resolve({ opacity: 0 }),
    animate: resolve({ opacity: 1, transition: { duration: 0.3, ease: EASE } }),
    exit: resolve({ opacity: 0, transition: { duration: 0.16, ease: EASE } }),
  },
  // Forward navigation — slides in from the right; going back reverses it.
  push: {
    initial: resolve(() => ({
      opacity: 0,
      x: navigationDirection.current === NAV_BACK ? -PUSH_IN : PUSH_IN,
    })),
    animate: resolve({ opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } }),
    exit: resolve(() => ({
      opacity: 0,
      x: navigationDirection.current === NAV_BACK ? PUSH_OUT : -PUSH_OUT,
      transition: { duration: 0.2, ease: EASE },
    })),
  },
  // Modal-ish screens (login / register) rise with a soft glass blur-in.
  sheet: {
    initial: resolve({ opacity: 0, scale: 0.985, filter: "blur(8px)" }),
    animate: resolve({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.38, ease: EASE },
    }),
    exit: resolve({
      opacity: 0,
      scale: 1.008,
      filter: "blur(8px)",
      transition: { duration: 0.2, ease: EASE },
    }),
  },
};

const PageTransition = ({ children, variant = "fade-up" }) => {
  const preset = PRESETS[variant] || PRESETS["fade-up"];

  return (
    <Motion.div
      data-page-transition=""
      variants={preset}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: "100%", willChange: "transform, opacity" }}
    >
      {children}
    </Motion.div>
  );
};

export default PageTransition;
