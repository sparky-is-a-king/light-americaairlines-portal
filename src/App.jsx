import React from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import TabBar from "./components/TabBar";
import PageStack from "./components/PageStack";
import { useNavigationHistory } from "./utils/navigation";
import ScrollToTop from "./components/ScrollToTop"; // 👈 import the new component

function App() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Tracks where we came from, so the push transition can mirror the motion and
  // the edge-swipe can reveal the previous screen (see utils/navigation.js).
  const { previousLocation, canGoBack } = useNavigationHistory(location);

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <MotionConfig reducedMotion="user">
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        // "clip" not "hidden": overflow:hidden makes this a scroll container
        // (CSS forces overflow-y to auto), which can add its own scrollbar and
        // steal ~17px from every section inside it. clip just clips.
        overflowX: "clip",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!hideNavbar && <Navbar />}

      <Box
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "100%",
          overflowX: "clip",
        }}
      >
        <PageStack
          location={location}
          previousLocation={previousLocation}
          canGoBack={canGoBack}
          isLoggedIn={isLoggedIn}
          hidden={hideNavbar}
        />

        {/* iOS-style bottom tab bar on phones (matches navbar visibility) */}
        {!hideNavbar && <TabBar />}

        {/* 👇 Scroll to top on every route change */}
        <ScrollToTop />
      </Box>

      <Analytics />
    </Box>
    </MotionConfig>
  );
}

export default App;