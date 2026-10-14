import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  alpha,
  useMediaQuery,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import { Link, useNavigate } from "react-router-dom";
import InstallAppButton from "./InstallAppButton";
import Magnet from "./reactbits/Magnet";
import LocaleFlag from "./LocaleFlag";
import { ios, glassSx } from "../theme";
import { LOCALES, useLocale } from "../i18n";

const LANGUAGE_MENU_ID = "language-menu";

/**
 * iOS-style floating navigation: a frosted "Liquid Glass" capsule that hovers
 * above the content layer (per Apple's guidance, navigation lives on its own
 * translucent layer). Like the iOS tab bar it minimizes while scrolling down
 * and slides back in when scrolling up. Home / Book / Track live in the bottom
 * Dock on every width, so this bar carries the brand and the session controls
 * (language, install, logout) instead of a second set of destination links.
 */
const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const lastScrollY = useRef(0);

  // The chosen locale lives in LocaleProvider (persisted to localStorage); this
  // bar only reads it and asks for changes, so every screen re-renders in step.
  const { locale, setLocale, t } = useLocale();
  const selectedLanguage = LOCALES.find((entry) => entry.code === locale) || LOCALES[0];

  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width:900px)");

  // The magnet is a pointer flourish: only run it for a real cursor, and never
  // for guests who asked for reduced motion.
  const hasPointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const magnetEnabled = hasPointer && !prefersReducedMotion;

  // Tab-bar minimize behaviour: hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      setMinimized(goingDown && y > 120);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The trigger is a different DOM node in the phone and desktop layouts, so a
  // breakpoint change while the menu is open would leave MUI anchored to a
  // detached element. Closing on the switch keeps the anchor valid.
  useEffect(() => {
    setLanguageAnchor(null);
  }, [isDesktop]);

  // Language menu handlers
  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageSelect = (language) => {
    setLocale(language.code);
    handleLanguageClose();
  };

  /**
   * One trigger for both widths: flag, locale code and a chevron that flips
   * while the menu is open. Built once and shared so the control can't drift
   * between the desktop and phone layouts.
   */
  const languageButton = (
    <Button
      onClick={handleLanguageClick}
      aria-label={t("nav.language")}
      aria-haspopup="menu"
      aria-expanded={Boolean(languageAnchor)}
      aria-controls={LANGUAGE_MENU_ID}
      sx={{
        color: ios.navy,
        minWidth: "auto",
        height: 40,
        px: 1.25,
        py: 0,
        gap: 0.75,
        borderRadius: 999,
        border: `1px solid ${ios.hairline}`,
        bgcolor: ios.glass,
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.7)",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
        "&:hover": {
          bgcolor: ios.glassStrong,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 16px -10px rgba(10, 42, 90, 0.5)",
        },
        "&:active": { transform: "scale(0.97)" },
        "&.Mui-focusVisible": {
          boxShadow: `0 0 0 3px ${alpha(ios.blue, 0.35)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
        },
      }}
    >
      <LocaleFlag code={locale} />
      <Typography
        component="span"
        sx={{ fontWeight: 800, fontSize: "0.74rem", letterSpacing: "0.06em", lineHeight: 1 }}
      >
        {selectedLanguage.code}
      </Typography>
      <ArrowDropDownIcon
        sx={{
          fontSize: 19,
          ml: -0.25,
          opacity: 0.7,
          transition: "transform 0.25s ease",
          transform: languageAnchor ? "rotate(180deg)" : "none",
        }}
      />
    </Button>
  );

  // Simulate network check
  const simulateNetworkCheck = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  };

  // Handle Logout with loading
  const handleLogout = async () => {
    setLoading(true);
    try {
      const networkOk = await simulateNetworkCheck();
      if (networkOk) {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      } else {
        alert(t("nav.error.network"));
      }
    } catch (error) {
      console.error(error);
      alert("Error during logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          backgroundImage: "none",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            transform: minimized ? "translateY(-140%)" : "translateY(0)",
            transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Frosted glass capsule */}
          <Box
            sx={{
              ...glassSx,
              width: "100%",
              maxWidth: 1240,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              borderRadius: 999,
              px: { xs: 1.5, md: 2 },
              py: 0.75,
              minHeight: 56,
              boxShadow: ios.shadowSoft,
            }}
          >
            {/* === Logo === */}
            <Magnet disabled={!magnetEnabled} padding={70} magnetStrength={7}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: ios.navy,
                gap: 1.25,
                ml: { xs: 0.5, md: 1 },
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "12px",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  background: `linear-gradient(135deg, ${ios.blue} 0%, ${ios.blueBright} 100%)`,
                  boxShadow: "0 6px 14px -6px rgba(13, 71, 161, 0.7)",
                }}
              >
                <FlightTakeoffIcon sx={{ fontSize: 19 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, letterSpacing: "-0.02em", display: { xs: "none", sm: "block" } }}
              >
                American Airlines
              </Typography>
            </Box>
            </Magnet>

            {/* === Desktop controls: language, install, session === */}
            {isDesktop && (
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {/* === Language selector === */}
                <Magnet disabled={!magnetEnabled} padding={50} magnetStrength={6}>
                  {languageButton}
                </Magnet>

                {/* Install (only rendered when the browser can actually install) */}
                <Magnet disabled={!magnetEnabled} padding={50} magnetStrength={6}>
                  <InstallAppButton />
                </Magnet>

                {/* Desktop Logout button */}
                <Magnet disabled={!magnetEnabled} padding={50} magnetStrength={6}>
                <Button
                  startIcon={
                    loading ? <CircularProgress size={20} sx={{ color: ios.navy }} /> : <LogoutIcon />
                  }
                  onClick={handleLogout}
                  disabled={loading}
                  sx={{
                    color: ios.navy,
                    fontWeight: 700,
                    border: `1px solid ${ios.hairline}`,
                    "&:hover": {
                      bgcolor: "rgba(13, 71, 161, 0.08)",
                    },
                  }}
                >
                  {t("nav.logout")}
                </Button>
                </Magnet>
              </Box>
            )}

            {/* === Mobile controls: language, install, session === */}
            {!isDesktop && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {/* Language selector (same control, tighter padding) */}
                {languageButton}
                <InstallAppButton />
                <IconButton
                  aria-label={t("nav.logout")}
                  onClick={handleLogout}
                  disabled={loading}
                  sx={{
                    color: ios.navy,
                    bgcolor: "rgba(13, 71, 161, 0.08)",
                    "&:hover": { bgcolor: "rgba(13, 71, 161, 0.14)" },
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: ios.navy }} /> : <LogoutIcon />}
                </IconButton>
              </Box>
            )}

            {/* Language Menu — Liquid Glass popover.

                Rendered once, outside the desktop/mobile branches: both the
                desktop button and the phone chip set `languageAnchor`, so
                nesting the menu in the desktop block left the chip inert on
                phones. MUI portals it to <body>, so its position here is only
                for readability. */}
            <Menu
              id={LANGUAGE_MENU_ID}
              anchorEl={languageAnchor}
              open={Boolean(languageAnchor)}
              onClose={handleLanguageClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    ...glassSx,
                    mt: 1.25,
                    width: 248,
                    // Never wider than the phone it opens on.
                    maxWidth: "calc(100vw - 24px)",
                    borderRadius: "18px",
                    p: 0,
                    boxShadow: ios.shadowLift,
                    overflow: "hidden",
                  },
                },
                list: { sx: { py: 0.75, px: 0.75 } },
              }}
            >
              {/* Decorative: the trigger already announces the menu, and a
                  plain text node inside role="menu" would break its ARIA. */}
              <Typography
                aria-hidden="true"
                sx={{
                  px: 1.5,
                  pt: 0.5,
                  pb: 0.75,
                  color: alpha(ios.navy, 0.5),
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {t("nav.language")}
              </Typography>
              <Divider sx={{ mb: 0.75, borderColor: ios.hairline }} />

              {LOCALES.map((language) => {
                const isActive = selectedLanguage.code === language.code;
                return (
                  <MenuItem
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    selected={isActive}
                    sx={{
                      minHeight: 0,
                      py: 0.85,
                      px: 1.25,
                      mb: 0.25,
                      gap: 1.25,
                      borderRadius: "12px",
                      transition: "background-color 0.15s ease",
                      "&:hover": { bgcolor: alpha(ios.blue, 0.06) },
                      "&.Mui-selected": {
                        bgcolor: alpha(ios.blue, 0.09),
                        "&:hover": { bgcolor: alpha(ios.blue, 0.13) },
                      },
                    }}
                  >
                    <LocaleFlag code={language.code} width={22} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? ios.blue : ios.navy,
                          lineHeight: 1.25,
                        }}
                      >
                        {language.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.66rem", color: alpha(ios.navy, 0.45), lineHeight: 1.35 }}>
                        {language.tag}
                      </Typography>
                    </Box>
                    {isActive && <CheckIcon sx={{ fontSize: 18, color: ios.blue }} />}
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer so page content starts below the floating capsule */}
      <Box sx={{ height: { xs: 76, md: 88 } }} />
    </>
  );
};

export default Navbar;
