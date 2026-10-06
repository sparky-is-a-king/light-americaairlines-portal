import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  AnimatePresence,
  animate,
  motion as Motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../routes";
import { transitionOverride } from "../utils/navigation";
import { haptic } from "../utils/haptics";

/**
 * The screen stack.
 *
 * Renders the current route, and — while an edge swipe is in progress — the
 * previous route underneath it, so the two move together under the finger the
 * way iOS pushes and pops views.
 *
 * On phones only, a drag that starts within EDGE_ZONE of the left edge pulls the
 * current screen to the right. Releasing past COMMIT_RATIO of the width (or with
 * enough velocity) completes the back navigation; otherwise it springs back.
 */

const EDGE_ZONE = 28; // px from the left edge where the gesture may start
const COMMIT_RATIO = 0.32; // fraction of the width that completes the swipe
const COMMIT_VELOCITY = 550; // px/s that also completes it
const UNDERLAY_SHIFT = 0.28; // how far the revealed screen slides in from the left

const PageStack = ({ location, previousLocation, canGoBack, isLoggedIn, hidden }) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const controls = useDragControls();

  const containerRef = useRef(null);
  const committingRef = useRef(false);

  const x = useMotionValue(0);
  const [revealed, setRevealed] = useState(false);
  const [width, setWidth] = useState(0);

  const gestureEnabled = isPhone && canGoBack && !hidden;

  // The revealed screen slides in from the left and its scrim lifts as the
  // gesture progresses, so it settles into place exactly when the swipe commits.
  const progress = useTransform(x, (value) => (width ? Math.min(Math.max(value / width, 0), 1) : 0));
  const underlayX = useTransform(progress, (value) => -(1 - value) * width * UNDERLAY_SHIFT);
  const scrimOpacity = useTransform(progress, (value) => 0.5 * (1 - value));

  useEffect(() => {
    const measure = () => setWidth(containerRef.current?.offsetWidth || window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Once a gesture commits, the route has already changed: snap the stack back
  // so the screen that was revealed simply becomes the current screen. This runs
  // before paint, so the reset is never visible.
  useLayoutEffect(() => {
    if (!committingRef.current) return;
    committingRef.current = false;
    x.set(0);
    setRevealed(false);
    transitionOverride.skip = false;
  }, [location.key, x]);

  // While a reveal is showing, put it away if the pointer is released without the
  // page having actually moved — a tap, or a gesture that locked to a vertical
  // scroll. Bound to the window in the capture phase because the drag swallows
  // the event on the element itself. A drag that did move is left to handleDragEnd.
  useEffect(() => {
    if (!revealed) return undefined;
    const settle = () => {
      if (committingRef.current) return;
      if (x.get() !== 0) return;
      setRevealed(false);
    };
    window.addEventListener("pointerup", settle, true);
    window.addEventListener("pointercancel", settle, true);
    return () => {
      window.removeEventListener("pointerup", settle, true);
      window.removeEventListener("pointercancel", settle, true);
    };
  }, [revealed, x]);

  const startGesture = (event) => {
    if (!gestureEnabled) return;
    if (event.pointerType === "mouse") return;
    if (event.clientX > EDGE_ZONE) return;
    setRevealed(true);
    controls.start(event);
  };

  const handleDragEnd = (event, info) => {
    const travel = width || window.innerWidth || 1;
    const shouldCommit =
      info.offset.x > travel * COMMIT_RATIO || info.velocity.x > COMMIT_VELOCITY;

    if (shouldCommit) {
      committingRef.current = true;
      transitionOverride.skip = true;
      haptic("light");
      // Carry the swipe through, then hand over to the router.
      animate(x, travel, { type: "spring", stiffness: 380, damping: 44 }).then(() => {
        navigate(-1);
      });
      // Backstop: the layout effect above normally resets this the moment the
      // route changes, but never leave the transition suppressed if it doesn't.
      setTimeout(() => {
        if (!committingRef.current) return;
        committingRef.current = false;
        transitionOverride.skip = false;
        x.set(0);
        setRevealed(false);
      }, 1200);
      return;
    }

    animate(x, 0, { type: "spring", stiffness: 520, damping: 44 }).then(() => {
      if (!committingRef.current) setRevealed(false);
    });
  };

  return (
    <Box
      ref={containerRef}
      onPointerDown={startGesture}
      sx={{
        position: "relative",
        flex: 1,
        width: "100%",
        maxWidth: "100%",
        overflowX: "clip",
      }}
    >
      {/* The screen behind, revealed as the current one slides away */}
      {revealed && previousLocation && (
        <Motion.div
          key={previousLocation.key}
          data-swipe-underlay=""
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            x: underlayX,
            pointerEvents: "none",
          }}
        >
          <AppRoutes location={previousLocation} isLoggedIn={isLoggedIn} animated={false} />
          <Motion.div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#000",
              opacity: scrimOpacity,
              pointerEvents: "none",
            }}
          />
        </Motion.div>
      )}

      {/* The current screen — pulled to the right by the edge gesture */}
      <Motion.div
        drag="x"
        dragControls={controls}
        dragListener={false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: width }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        style={{ x, position: "relative", zIndex: 1, width: "100%", touchAction: "pan-y" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <AppRoutes key={location.pathname} location={location} isLoggedIn={isLoggedIn} />
        </AnimatePresence>
      </Motion.div>
    </Box>
  );
};

export default PageStack;
