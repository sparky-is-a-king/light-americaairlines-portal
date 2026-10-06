import React from "react";
import { Box, ButtonBase } from "@mui/material";
import { motion as Motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import RadarIcon from "@mui/icons-material/Radar";
import { useLocation, useNavigate } from "react-router-dom";
import { ios } from "../theme";
import { haptic } from "../utils/haptics";

const BOOK_SECTION_ID = "booking-form";

/**
 * iOS-style bottom tab bar (Home / Book / Track), shown on phones only.
 * Frosted "Liquid Glass" bar pinned to the bottom edge with safe-area padding,
 * like a native UIKit tab bar. On md+ screens the top navbar takes over.
 */
const tabs = [
  { label: "Home", icon: HomeIcon, path: "/" },
  { label: "Book", icon: FlightTakeoffIcon, action: "book" },
  { label: "Track", icon: RadarIcon, path: "/track" },
];

const TabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (tab) => {
    if (tab.action === "book") return location.hash === `#${BOOK_SECTION_ID}`;
    if (tab.path === "/") {
      // Detail pages pushed from Home keep the Home tab selected, like a
      // native navigation stack.
      return location.pathname === "/" || location.pathname.startsWith("/boarding-pass");
    }
    return location.pathname === tab.path;
  };

  const handleTab = (tab) => {
    haptic("light");
    if (tab.action === "book") {
      const scrollToSection = () => {
        const section = document.getElementById(BOOK_SECTION_ID);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      };
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(scrollToSection, 150);
      } else {
        scrollToSection();
      }
      return;
    }
    navigate(tab.path);
  };

  return (
    <>
      {/* Spacer so page content is never hidden behind the fixed bar */}
      <Box sx={{ display: { xs: "block", md: "none" }, height: "calc(76px + env(safe-area-inset-bottom))" }} />

      <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          display: { xs: "block", md: "none" },
          px: { xs: 1.5, sm: 3 },
          pb: "calc(10px + env(safe-area-inset-bottom))",
          pt: 1,
        }}
      >
        {/* Frosted glass tab bar */}
        <Box
          sx={{
            maxWidth: 440,
            mx: "auto",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-around",
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
            borderRadius: "28px",
            boxShadow: "0 18px 40px -18px rgba(10, 42, 90, 0.4)",
            px: 1,
            py: 1,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            return (
              <ButtonBase
                key={tab.label}
                onClick={() => handleTab(tab)}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                sx={{
                  flexDirection: "column",
                  gap: 0.25,
                  py: 0.75,
                  px: 2,
                  borderRadius: "20px",
                  color: active ? ios.blue : "#5B6B7F",
                  transition: "background-color 0.25s ease, color 0.25s ease",
                  bgcolor: active ? "rgba(13, 71, 161, 0.1)" : "transparent",
                }}
              >
                <Motion.div
                  whileTap={{ scale: 0.84 }}
                  transition={{ type: "spring", stiffness: 520, damping: 28 }}
                  style={{ display: "inline-flex" }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Motion.div>
                <Box sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "-0.01em" }}>{tab.label}</Box>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default TabBar;
