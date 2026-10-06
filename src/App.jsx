import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import TabBar from "./components/TabBar";
import HomePage from "./pages/HomePage";
import TrackFlightPage from "./pages/TrackFlightPage";
import BoardingPass from "./pages/BookedFlightPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop"; // 👈 import the new component

function App() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

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
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <Register />}
          />

          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/track"
            element={isLoggedIn ? <TrackFlightPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/boarding-pass/:flightId"
            element={isLoggedIn ? <BoardingPass /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

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