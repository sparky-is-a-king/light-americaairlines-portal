import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
// Global reset: box-sizing, body margin and #root centring. Without this the
// browser's own 8px body margin and content-box sizing push full-width sections
// off centre (and clip them on the right).
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

// Register the service worker so the app can be installed on phones and
// desktops, and reopened offline. Production only: a worker in dev would keep
// serving stale bundles while files are changing.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => console.error("Service worker registration failed:", error));
  });
}
