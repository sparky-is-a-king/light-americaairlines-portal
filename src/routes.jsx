import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import HomePage from "./pages/HomePage";
import TrackFlightPage from "./pages/TrackFlightPage";
import BoardingPass from "./pages/BookedFlightPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

/**
 * The route table.
 *
 * It lives in its own module because the swipe-back gesture needs to render two
 * locations at once: the current screen and the one behind it. `location` picks
 * which to render, and `animated` turns the page transition off for the screen
 * revealed underneath the finger — it should already be at rest.
 */
const AppRoutes = ({ location, isLoggedIn, animated = true }) => {
  const page = (element, variant) =>
    animated ? <PageTransition variant={variant}>{element}</PageTransition> : element;

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
