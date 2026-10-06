/**
 * Reveal — a framer-motion equivalent of React Bits' FadeContent/AnimatedContent
 * (those ship GSAP; this project already has framer-motion, so we keep one motion
 * library). Fades, un-blurs and lifts its children into place the first time they
 * scroll into view. Falls back to static content under prefers-reduced-motion via
 * <MotionConfig reducedMotion="user"> in App.jsx.
 */
import { motion as Motion } from "framer-motion";

const Reveal = ({
  children,
  delay = 0,
  y = 28,
  duration = 0.7,
  once = true,
  amount = 0.15,
  className,
  ...rest
}) => (
  <Motion.div
    className={className}
    initial={{ opacity: 0, y, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once, amount }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >
    {children}
  </Motion.div>
);

export default Reveal;
