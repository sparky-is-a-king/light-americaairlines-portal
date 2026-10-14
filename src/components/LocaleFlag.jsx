import React from "react";
import { Box } from "@mui/material";

/**
 * Miniature flags for the locale picker.
 *
 * Drawn inline rather than using the 🇺🇸 flag emoji, because Windows has no
 * colour flag glyphs and renders them as the letters "US" — which turned the
 * language menu into a confusing duplicate of the locale codes. These are
 * simple shapes, but they are the real flags at 20×14 and, being SVG, they look
 * the same everywhere and cost no extra request.
 */

const star =
  "M0,-2.6 L0.75,-0.8 L2.6,-0.8 L1.2,0.4 L1.7,2.2 L0,1.2 L-1.7,2.2 L-1.2,0.4 L-2.6,-0.8 L-0.75,-0.8 Z";

const FLAGS = {
  // Thirteen stripes, blue canton, a suggestion of stars.
  US: (
    <>
      <rect width="20" height="14" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="2" fill="#B22234" />
      ))}
      <rect width="8.6" height="7" fill="#3C3B6E" />
      {[1.6, 3.5, 5.4].map((y) =>
        [1.5, 3.3, 5.1, 6.9].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.42" fill="#FFFFFF" />
        ))
      )}
    </>
  ),

  // Union flag: diagonals under a centred cross.
  GB: (
    <>
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0 L20 14 M20 0 L0 14" stroke="#FFFFFF" strokeWidth="2.8" />
      <path d="M0 0 L20 14 M20 0 L0 14" stroke="#C8102E" strokeWidth="1.1" />
      <path d="M10 0 V14 M0 7 H20" stroke="#FFFFFF" strokeWidth="4.6" />
      <path d="M10 0 V14 M0 7 H20" stroke="#C8102E" strokeWidth="2.4" />
    </>
  ),

  // Rojo, amarillo, rojo.
  ES: (
    <>
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </>
  ),

  // Bleu, blanc, rouge.
  FR: (
    <>
      <rect width="6.67" height="14" fill="#002395" />
      <rect x="6.67" width="6.66" height="14" fill="#FFFFFF" />
      <rect x="13.33" width="6.67" height="14" fill="#ED2939" />
    </>
  ),

  // Schwarz, rot, gold.
  DE: (
    <>
      <rect width="20" height="4.67" fill="#000000" />
      <rect y="4.67" width="20" height="4.66" fill="#DD0000" />
      <rect y="9.33" width="20" height="4.67" fill="#FFCE00" />
    </>
  ),

  // Hinomaru.
  JP: (
    <>
      <rect width="20" height="14" fill="#FFFFFF" />
      <circle cx="10" cy="7" r="4" fill="#BC002D" />
    </>
  ),

  // Red field, one large star with four small ones.
  CN: (
    <>
      <rect width="20" height="14" fill="#DE2910" />
      <path d={star} fill="#FFDE00" transform="translate(4.6 4.6) scale(1.5)" />
      <path d={star} fill="#FFDE00" transform="translate(9.2 2.1) scale(0.5)" />
      <path d={star} fill="#FFDE00" transform="translate(11.2 4.3) scale(0.5)" />
      <path d={star} fill="#FFDE00" transform="translate(11.2 7.2) scale(0.5)" />
      <path d={star} fill="#FFDE00" transform="translate(9.2 9.4) scale(0.5)" />
    </>
  ),
};

/**
 * A flag in a rounded tile. `width` sets the tile width; the height follows the
 * 10:7 flag ratio, and an unknown locale falls back to a neutral tile.
 */
const LocaleFlag = ({ code, width = 20, sx }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      flexShrink: 0,
      width,
      height: Math.round((width * 14) / 20),
      borderRadius: "3px",
      overflow: "hidden",
      bgcolor: "#cbd5e1",
      boxShadow: "inset 0 0 0 1px rgba(15, 43, 94, 0.18)",
      ...sx,
    }}
  >
    <svg
      viewBox="0 0 20 14"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {FLAGS[code] ?? <rect width="20" height="14" fill="#cbd5e1" />}
    </svg>
  </Box>
);

export default LocaleFlag;
