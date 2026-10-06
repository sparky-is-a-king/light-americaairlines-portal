import { createTheme } from "@mui/material/styles";

/**
 * iOS-flavored design tokens for American Airlines.
 *
 * Follows Apple's Liquid Glass guidance (iOS 26): translucent glass only on the
 * functional layer (nav, buttons, floating controls), content stays legible,
 * rounder concentric corners, and system fonts throughout.
 */
export const ios = {
  bg: "#F2F2F7", // iOS systemGroupedBackground
  navy: "#0A2A5A", // American Airlines deep navy
  navyDeep: "#081F45",
  blue: "#0D47A1",
  blueBright: "#1976D2",
  gold: "#FFC107",
  glass: "rgba(255, 255, 255, 0.72)",
  glassStrong: "rgba(255, 255, 255, 0.86)",
  glassBorder: "rgba(255, 255, 255, 0.65)",
  hairline: "rgba(15, 43, 94, 0.10)",
  shadowSoft: "0 12px 32px -18px rgba(10, 42, 90, 0.28)",
  shadowLift: "0 24px 48px -20px rgba(10, 42, 90, 0.32)",
  radiusCard: 24,
  radiusControl: 14,
};

/** Frosted-glass surface used by the navbar, cards and sheets. */
export const glassSx = {
  backgroundColor: ios.glass,
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: `1px solid ${ios.glassBorder}`,
};

const theme = createTheme({
  palette: {
    primary: { main: ios.blue, dark: ios.navy, light: ios.blueBright },
    secondary: { main: ios.gold },
    background: { default: ios.bg, paper: "#ffffff" },
    text: { primary: "#0A1F3C", secondary: "#5B6B7F" },
    divider: ios.hairline,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.025em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.015em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 600 },
    body1: { letterSpacing: "-0.005em" },
    body2: { letterSpacing: "-0.005em" },
  },
  shape: { borderRadius: 16 },
  components: {
    // iOS capsule buttons.
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: "none",
          paddingInline: 20,
        },
        contained: {
          boxShadow: "0 10px 24px -12px rgba(10, 42, 90, 0.55)",
          "&:hover": { boxShadow: "0 14px 28px -12px rgba(10, 42, 90, 0.6)" },
        },
        outlined: {
          borderColor: "rgba(15, 43, 94, 0.2)",
          "&:hover": { borderColor: "rgba(15, 43, 94, 0.4)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: ios.radiusCard,
          backgroundImage: "none",
          boxShadow: ios.shadowSoft,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: ios.radiusCard },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: ios.radiusControl,
          backgroundColor: "rgba(242, 242, 247, 0.9)",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.95)" },
          "&.Mui-focused": {
            backgroundColor: "#ffffff",
            boxShadow: "0 0 0 4px rgba(13, 71, 161, 0.12)",
          },
          "& fieldset": { borderColor: "rgba(15, 43, 94, 0.14)" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 28 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { borderRadius: 10, marginInline: 6 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 10, fontSize: "0.75rem" },
      },
    },
  },
});

export default theme;
