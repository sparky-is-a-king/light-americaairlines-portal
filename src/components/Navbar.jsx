import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InstallAppButton from "./InstallAppButton";
import { ios, glassSx } from "../theme";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Book Flight", path: "/#booking-form" },
  { title: "Track Flight", path: "/track" },
];

// Language options
const languages = [
  { code: "US", name: "English (US)", flag: "🇺🇸" },
  { code: "GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "JP", name: "日本語", flag: "🇯🇵" },
  { code: "CN", name: "中文", flag: "🇨🇳" },
];

/**
 * iOS-style floating navigation: a frosted "Liquid Glass" capsule that hovers
 * above the content layer (per Apple's guidance, navigation lives on its own
 * translucent layer). Like the iOS tab bar it minimizes while scrolling down
 * and slides back in when scrolling up. On phones the bottom TabBar takes over
 * navigation, so this bar slims down to logo + install + logout + overflow menu.
 */
const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // Default to US
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width:900px)");

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

  // Language menu handlers
  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    handleLanguageClose();
    // Here you would typically trigger a language change in your app
    console.log(`Language changed to: ${language.name}`);
  };

  // Handle "Book Flight" scroll smoothly
  const scrollToBookFlight = () => {
    const scrollToSection = () => {
      const section = document.getElementById("booking-form");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(scrollToSection, 150);
    } else {
      scrollToSection();
    }
  };

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
        alert("Network issue: cannot logout now!");
      }
    } catch (error) {
      console.error(error);
      alert("Error during logout.");
    } finally {
      setLoading(false);
    }
  };

  const isActive = (item) =>
    item.title !== "Book Flight" &&
    (item.path === "/" ? location.pathname === "/" : location.pathname === item.path);

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

            {/* === Desktop Links === */}
            {isDesktop && (
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {navLinks.map((item) => (
                  <Button
                    key={item.title}
                    onClick={item.title === "Book Flight" ? scrollToBookFlight : undefined}
                    component={item.title === "Book Flight" ? undefined : Link}
                    to={item.title === "Book Flight" ? undefined : item.path}
                    sx={{
                      color: isActive(item) ? ios.blue : ios.navy,
                      fontWeight: 700,
                      px: 2,
                      py: 0.9,
                      borderRadius: 999,
                      bgcolor: isActive(item) ? "rgba(13, 71, 161, 0.1)" : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(13, 71, 161, 0.08)",
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                ))}

                {/* === Language Indicator with US Flag === */}
                <Button
                  onClick={handleLanguageClick}
                  sx={{
                    color: ios.navy,
                    minWidth: "auto",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    border: `1px solid ${ios.hairline}`,
                    "&:hover": {
                      bgcolor: "rgba(13, 71, 161, 0.08)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{selectedLanguage.flag}</span>
                    <Typography variant="body2" sx={{ fontWeight: 600, mx: 0.5 }}>
                      {selectedLanguage.code}
                    </Typography>
                    <ArrowDropDownIcon />
                  </Box>
                </Button>

                {/* Language Menu — Liquid Glass popover */}
                <Menu
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
                  PaperProps={{
                    sx: {
                      ...glassSx,
                      mt: 1.5,
                      minWidth: 190,
                      borderRadius: 4,
                      p: 0.5,
                      boxShadow: ios.shadowLift,
                    },
                  }}
                >
                  {languages.map((language) => (
                    <MenuItem
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      selected={selectedLanguage.code === language.code}
                      sx={{
                        py: 1,
                        px: 2,
                        gap: 1.5,
                        "&.Mui-selected": {
                          bgcolor: "rgba(13, 71, 161, 0.1)",
                          color: ios.blue,
                          "&:hover": {
                            bgcolor: "rgba(13, 71, 161, 0.14)",
                          },
                        },
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{language.flag}</span>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {language.name}
                      </Typography>
                      {selectedLanguage.code === language.code && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: ios.blue,
                          }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Menu>

                {/* Install (only rendered when the browser can actually install) */}
                <InstallAppButton />

                {/* Desktop Logout button */}
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
                  Logout
                </Button>
              </Box>
            )}

            {/* === Mobile controls: install + logout + overflow menu === */}
            {!isDesktop && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {/* Language chip (compact) */}
                <Button
                  onClick={handleLanguageClick}
                  aria-label="Choose language"
                  sx={{
                    color: ios.navy,
                    minWidth: "auto",
                    px: 1,
                    py: 0.5,
                    borderRadius: 999,
                    border: `1px solid ${ios.hairline}`,
                    fontSize: "0.8rem",
                  }}
                >
                  <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{selectedLanguage.flag}</span>
                </Button>
                <InstallAppButton />
                <IconButton
                  aria-label="Logout"
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
                <IconButton
                  aria-label="More options"
                  onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
                  sx={{
                    color: ios.navy,
                    bgcolor: "rgba(13, 71, 161, 0.08)",
                    "&:hover": { bgcolor: "rgba(13, 71, 161, 0.14)" },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>

                {/* Overflow menu (book / track) */}
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={() => setMobileMenuAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      ...glassSx,
                      mt: 1.5,
                      minWidth: 190,
                      borderRadius: 4,
                      p: 0.5,
                      boxShadow: ios.shadowLift,
                    },
                  }}
                >
                  {navLinks
                    .filter((item) => item.title !== "Home")
                    .map((item) => (
                      <MenuItem
                        key={item.title}
                        onClick={() => {
                          setMobileMenuAnchor(null);
                          if (item.title === "Book Flight") scrollToBookFlight();
                          else navigate(item.path);
                        }}
                        sx={{ py: 1.25, gap: 1.5, fontWeight: 600 }}
                      >
                        {item.title}
                      </MenuItem>
                    ))}
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer so page content starts below the floating capsule */}
      <Box sx={{ height: { xs: 76, md: 88 } }} />
    </>
  );
};

export default Navbar;
