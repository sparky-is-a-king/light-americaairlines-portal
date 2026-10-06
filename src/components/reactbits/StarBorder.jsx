/**
 * StarBorder — from React Bits (https://reactbits.dev, MIT + Commons Clause).
 * A button with two travelling light "comets" along its border. Note: if you
 * pass `style`, it replaces the container's built-in padding (upstream quirk).
 * Adapted: always renders a <button> (upstream also supports `as`, which this
 * project lints as an unused destructured param).
 */
import "./StarBorder.css";

const StarBorder = ({
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  backgroundColor = "#000000",
  textColor = "#ffffff",
  borderColor = "#222222",
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content" style={{ background: backgroundColor, color: textColor, borderColor }}>
        {children}
      </div>    </button>
  );
};
export default StarBorder;
