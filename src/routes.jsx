import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import PageTransition from "./components/PageTransition";

/**
 * Route-level code splitting: every screen arrives in its own chunk, so the
 * first paint only ships the shell. The heavy libraries each screen needs —
 * html2canvas on the boarding pass, gsap on the home page — travel with it
 * instead of sitting in the entry bundle.
 */
const HomePage = lazy(() => import("./pages/HomePage"));
const TrackFlightPage = lazy(() => import("./pages/TrackFlightPage"));
const BoardingPass = lazy(() => import("./pages/BookedFlightPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const PageFallback = () => (
  <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
    <CircularProgress size={28} />
  </Box>
);

/**
 * The route table.
 *
 * It lives in its own module because the swipe-back gesture needs to render two
 * locations at once: the current screen and the one behind it. `location` picks
 * which to render, and `animated` turns the page transition off for the screen
 * revealed underneath the finger — it should already be at rest.
 *
 * Each screen gets its own Suspense boundary so a chunk still in flight never
 * blanks the screen being swiped away from.
 */
const AppRoutes = ({ location, isLoggedIn, animated = true }) => {
  const page = (element, variant) => {
    const content = <Suspense fallback={<PageFallback />}>{element}</Suspense>;
    return animated ? <PageTransition variant={variant}>{content}</PageTransition> : content;
  };

  return (
    <Routes location={location}>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : page(<Login />, "sheet")}
      />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/" /> : page(<Register />, "sheet")}
      />

      <Route
        path="/"
        element={isLoggedIn ? page(<HomePage />, "fade-up") : <Navigate to="/login" />}
      />
      <Route
        path="/track"
        element={isLoggedIn ? page(<TrackFlightPage />, "fade-up") : <Navigate to="/login" />}
      />

      <Route
        path="/boarding-pass/:flightId"
        element={isLoggedIn ? page(<BoardingPass />, "push") : <Navigate to="/login" />}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
