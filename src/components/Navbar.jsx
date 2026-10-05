import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InstallAppButton from "./InstallAppButton";

const BOOK_SECTION_ID = "booking-form";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Book Flight", path: `/#${BOOK_SECTION_ID}` },
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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // Default to US
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      const section = document.getElementById(BOOK_SECTION_ID);
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

  // Drawer content for mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <FlightTakeoffIcon />
        Aerospace
      </Typography>
      
      {/* Language selector in drawer */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          onClick={handleLanguageClick}
          sx={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 2,
            px: 2,
            py: 0.5,
          }}
        >
          <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>{selectedLanguage.flag}</span>
          {selectedLanguage.code}
          <ArrowDropDownIcon />
        </Button>
      </Box>
      
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            {item.title === "Book Flight" ? (
              <ListItemButton onClick={scrollToBookFlight} sx={{ textAlign: "center" }}>
                <ListItemText primary={item.title} />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to={item.path} sx={{ textAlign: "center" }}>
                <ListItemText primary={item.title} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />

      {/* Install (only rendered when the browser can actually install) */}
      <InstallAppButton fullWidth sx={{ mt: 1 }} />

      {/* Logout button in Drawer */}
      <Button
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        fullWidth
        disabled={loading}
        sx={{
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.4)",
          mt: 1.5,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : "Logout"}
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "primary.main",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* === Logo === */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#fff",
              fontWeight: 700,
              gap: 1,
            }}
          >
            <FlightTakeoffIcon />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Aerospace
            </Typography>
          </Box>

          {/* === Desktop Links === */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
            {navLinks.map((item) =>
              item.title === "Book Flight" ? (
                <Button
                  key={item.title}
                  onClick={scrollToBookFlight}
                  sx={{ color: "#fff", fontWeight: 600 }}
                >
                  {item.title}
                </Button>
              ) : (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{ color: "#fff", fontWeight: 600 }}
                >
                  {item.title}
                </Button>
              )
            )}

            {/* === Language Indicator with US Flag === */}
            <Button
              onClick={handleLanguageClick}
              sx={{
                color: "#fff",
                minWidth: "auto",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{selectedLanguage.flag}</span>
                <Typography variant="body2" sx={{ fontWeight: 500, mx: 0.5 }}>
                  {selectedLanguage.code}
                </Typography>
                <ArrowDropDownIcon fontSize="small" />
              </Box>
            </Button>

            {/* Language Menu */}
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
                  mt: 1,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
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
                      bgcolor: "primary.light",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.light",
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
                        bgcolor: "primary.main",
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
              startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <LogoutIcon />}
              onClick={handleLogout}
              disabled={loading}
              sx={{
                color: "#fff",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.5)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              {!loading && "Logout"}
            </Button>
          </Box>

          {/* === Hamburger for mobile === */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Language Menu for mobile (when drawer is open) - handled in drawer */}
      
      {/* === Drawer for mobile === */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 260,
            bgcolor: "primary.main",
            color: "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
};

export default Navbar;