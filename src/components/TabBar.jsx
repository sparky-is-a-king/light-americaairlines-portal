import React from "react";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import RadarIcon from "@mui/icons-material/Radar";
import { useLocation, useNavigate } from "react-router-dom";
import Dock from "./reactbits/Dock";
import { haptic } from "../utils/haptics";

const BOOK_SECTION_ID = "booking-form";

/**
 * iOS-style bottom tab bar (Home / Book / Track) on every screen size.
 * Built on the React Bits Dock: the frosted "Liquid Glass" panel is pinned to
 * the bottom edge with safe-area padding, and icons magnify by proximity to the
 * cursor — or to a finger dragged across the bar.
 *
 * It stays mounted on md+ rather than handing navigation to the top navbar: the
 * two read as a macOS menu bar plus a dock. The dock is the only place the
 * proximity magnification is visible, and it lives where a cursor is — so it
 * keeps the phone layout intact and gains the desktop one.
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

  const dockItems = tabs.map((tab) => {
    const Icon = tab.icon;
    return {
      label: tab.label,
      active: isActive(tab),
      onClick: () => handleTab(tab),
      icon: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.25,
            lineHeight: 1,
          }}
        >
          <Icon sx={{ fontSize: 22 }} />
          <Box sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {tab.label}
          </Box>
        </Box>
      ),
    };
  });

  return (
    <>
      {/* Spacer so page content is never hidden behind the floating dock */}
      <Box sx={{ height: "calc(76px + env(safe-area-inset-bottom))" }} />

      <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          px: { xs: 1.5, sm: 3 },
          pb: { xs: "calc(10px + env(safe-area-inset-bottom))", md: "calc(18px + env(safe-area-inset-bottom))" },
          pt: 1,
        }}
      >
        {/* A narrower pill on desktop reads as a floating dock rather than a
            full-width tab bar. */}
        <Box sx={{ maxWidth: { xs: 440, md: 360 }, mx: "auto" }}>
          <Dock
            items={dockItems}
            baseItemSize={46}
            magnification={62}
            distance={120}
            panelHeight={58}
            dockHeight={72}
          />
        </Box>
      </Box>
    </>
  );
};

export default TabBar;
