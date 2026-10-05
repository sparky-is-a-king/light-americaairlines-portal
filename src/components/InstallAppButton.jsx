import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
  Box,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

/** True once the app is already running as an installed app. */
const isRunningInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: fullscreen)").matches ||
  window.matchMedia("(display-mode: minimal-ui)").matches ||
  window.navigator.standalone === true;

/** Which browser and device we are on — this decides the install instructions. */
const detectEnvironment = () => {
  const ua = window.navigator.userAgent || "";
  // iPadOS 13+ reports itself as a Mac; touch points give the real story away.
  const isIpadOs = /macintosh/i.test(ua) && window.navigator.maxTouchPoints > 1;
  const isIos = /iphone|ipad|ipod/i.test(ua) || isIpadOs;
  const isAndroid = /android/i.test(ua);
  const isFirefox = /firefox|fxios|focus/i.test(ua);
  const isEdge = /edg/i.test(ua);
  const isOpera = /opr\//i.test(ua);
  const isSamsung = /samsungbrowser/i.test(ua);
  const isChromium =
    /chrome|crios|crmo/i.test(ua) && !isEdge && !isOpera && !isSamsung;
  const isSafari =
    /safari/i.test(ua) && !isChromium && !isEdge && !isFirefox && !isAndroid;

  return {
    isIos,
    isAndroid,
    isFirefox,
    isEdge,
    isOpera,
    isSamsung,
    isChromium,
    isSafari,
    isMac: /macintosh|mac os x/i.test(ua) && !isIpadOs,
    isWindows: /windows/i.test(ua),
  };
};

/**
 * One step: a short instruction plus the icon that matches the button to tap.
 *
 * The icon is rendered here rather than as a bare `<Icon />` element name, so the
 * reference is a plain expression — this project lints without eslint-plugin-react,
 * so JSX element names are invisible to no-unused-vars.
 */
const step = (Icon, text) => ({
  icon: React.createElement(Icon, { fontSize: "small" }),
  text,
});

/**
 * Build the install walkthrough for this device.
 *
 * Chromium browsers can do this themselves via `beforeinstallprompt`; every
 * other browser has to be told by hand, so each gets its own real menu path
 * rather than a generic "check your browser menu".
 */
const describeInstall = (env) => {
  const origin = window.location.origin;

  if (env.isIos && !env.isSafari) {
    return {
      device: "phone",
      title: "Add American Airlines to your Home Screen",
      intro:
        "You are in a browser that cannot add Home Screen apps. On iPhone and iPad every browser is built on Safari, so open this page in Safari and add it from there.",
      steps: [
        step(OpenInNewIcon, "Open this site in Safari using the address below."),
        step(IosShareIcon, "Tap the Share button in Safari's toolbar."),
        step(AddBoxOutlinedIcon, "Scroll down and tap Add to Home Screen."),
      ],
      note: origin,
    };
  }

  if (env.isIos) {
    return {
      device: "phone",
      title: "Add American Airlines to your Home Screen",
      intro:
        "Safari installs apps from the Share menu, so there is no button we can press for you. Two taps and it behaves like any app on your phone.",
      steps: [
        step(IosShareIcon, "Tap the Share button in Safari's toolbar."),
        step(AddBoxOutlinedIcon, "Scroll the menu and tap Add to Home Screen."),
        step(DownloadDoneIcon, "Tap Add — the American Airlines icon appears on your Home Screen."),
      ],
    };
  }

  if (env.isAndroid && env.isSamsung) {
    return {
      device: "phone",
      title: "Install American Airlines on your phone",
      intro: "Samsung Internet installs apps from its own menu.",
      steps: [
        step(MoreVertIcon, "Tap the ☰ menu at the bottom right."),
        step(AddBoxOutlinedIcon, "Tap Add page to → Home screen."),
        step(DownloadDoneIcon, "Tap Add — American Airlines lands in your app drawer."),
      ],
    };
  }

  if (env.isAndroid && env.isFirefox) {
    return {
      device: "phone",
      title: "Add American Airlines to your Home Screen",
      intro: "Firefox adds a shortcut to the page, not a full app.",
      steps: [
        step(MoreVertIcon, "Tap the ⋮ menu in Firefox."),
        step(AddBoxOutlinedIcon, "Tap Add to Home screen."),
      ],
      note: "For the full app — its own window, offline boarding pass, no browser bar — open American Airlines in Chrome instead.",
    };
  }

  if (env.isAndroid) {
    return {
      device: "phone",
      title: "Install American Airlines on your phone",
      intro:
        "Chrome and Edge install this as a real Android app, no Play Store involved.",
      steps: [
        step(MoreVertIcon, "Tap the ⋮ menu at the top right."),
        step(AddBoxOutlinedIcon, "Tap Install app or Add to Home screen."),
        step(DownloadDoneIcon, "Confirm — American Airlines joins your app drawer and Home Screen."),
      ],
    };
  }

  if (env.isMac && env.isSafari) {
    return {
      device: "desktop",
      title: "Add American Airlines to your Dock",
      intro: "Safari keeps web apps in the Dock, beside your other apps.",
      steps: [
        step(DesktopWindowsIcon, "Open the File menu in Safari."),
        step(AddBoxOutlinedIcon, "Choose Add to Dock."),
        step(DownloadDoneIcon, "Click Add — American Airlines opens in its own window."),
      ],
      note: "Add to Dock needs macOS Sonoma or newer. On older Macs, open American Airlines in Chrome or Edge to install it.",
    };
  }

  // Desktop, but a browser with no install support at all.
  if (env.isFirefox && !env.isAndroid) {
    return {
      device: "desktop",
      title: "Install American Airlines on this computer",
      intro: "Firefox cannot install web apps.",
      steps: [
        step(OpenInNewIcon, "Open this site in Chrome, Edge or Safari."),
        step(AddBoxOutlinedIcon, "Use the install button in that browser's address bar."),
      ],
      note: `You can keep using Firefox as usual — just bookmark ${origin} and everything works.`,
    };
  }

  const finishStep = env.isWindows
    ? "Click Install — American Airlines is added to your Start Menu and can be pinned to the taskbar."
    : env.isMac
      ? "Click Install — American Airlines is added to your Applications folder and Dock."
      : "Click Install — American Airlines is added to your desktop app launcher.";

  if (env.isEdge) {
    return {
      device: "desktop",
      title: "Install American Airlines on this computer",
      intro: "Edge turns the site into a desktop app in its own window.",
      steps: [
        step(AddBoxOutlinedIcon, "Click the app icon in the address bar, or open ⋮ → Apps → Install this site as an app."),
        step(DownloadDoneIcon, finishStep),
      ],
    };
  }

  return {
    device: "desktop",
    title: "Install American Airlines on this computer",
    intro: "Click the install icon in the address bar, or open the browser menu.",
    steps: [
      step(AddBoxOutlinedIcon, "Click the install icon at the right of the address bar."),
      step(MoreVertIcon, "Or open ⋮ → Cast, save and share → Install page as app."),
      step(DownloadDoneIcon, finishStep),
    ],
  };
};

/**
 * Installing the app on any phone or computer.
 *
 * Chrome, Edge and Samsung Internet fire `beforeinstallprompt`, which we hold on
 * to and trigger from our own button. Everything else — Safari, Firefox — gets a
 * walkthrough with the exact menu path for that browser, so the button is never
 * a dead end. It disappears once the app is already running installed.
 */
const InstallAppButton = ({ fullWidth = false, sx = {} }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isRunningInstalled);
  const [helpOpen, setHelpOpen] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const [env, setEnv] = useState(null);

  useEffect(() => {
    setEnv(detectEnvironment());

    const handleBeforeInstall = (event) => {
      event.preventDefault(); // keep the prompt so our button can trigger it
      setDeferredPrompt(event);
    };
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
      setJustInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed || !env) return null;

  const guide = describeInstall(env);

  const handleClick = async (event) => {
    // The mobile drawer closes on any click inside it, which would unmount this
    // dialog before it could be read. Keep the click to ourselves.
    event.stopPropagation();

    if (!deferredPrompt) {
      setHelpOpen(true);
      return;
    }

    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } finally {
      // The event can only be used once, so drop it either way.
      setDeferredPrompt(null);
    }
  };

  const GuideIcon = guide.device === "phone" ? PhoneIphoneIcon : DesktopWindowsIcon;

  return (
    <>
      <Button
        onClick={handleClick}
        fullWidth={fullWidth}
        startIcon={<InstallMobileIcon />}
        sx={{
          bgcolor: "secondary.main",
          color: "primary.main",
          fontWeight: 700,
          borderRadius: 2,
          px: 2,
          py: 0.75,
          textTransform: "none",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
          "&:hover": { bgcolor: "#ffca28" },
          ...sx,
        }}
      >
        Install app
      </Button>

      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            fontWeight: 700,
            pr: 5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <GuideIcon fontSize="small" />
          </Box>
          {guide.title}
          <IconButton
            aria-label="Close"
            onClick={() => setHelpOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2.5 }}>{guide.intro}</DialogContentText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            {guide.steps.map(({ icon, text }, index) => (
              <Box key={text} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body2" sx={{ pt: 0.5, flex: 1 }}>
                  {text}
                </Typography>
                <Box sx={{ color: "primary.main", mt: 0.4, display: "grid", placeItems: "center" }}>
                  {icon}
                </Box>
              </Box>
            ))}
          </Box>

          {guide.note && (
            <Box
              sx={{
                mt: 2.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "#fff",
                opacity: 0.95,
                display: "flex",
                gap: 1.25,
                alignItems: "flex-start",
              }}
            >
              <LightbulbOutlinedIcon fontSize="small" sx={{ mt: 0.2 }} />
              <Typography variant="caption" sx={{ lineHeight: 1.6, wordBreak: "break-word" }}>
                {guide.note}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setHelpOpen(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={justInstalled}
        autoHideDuration={6000}
        onClose={() => setJustInstalled(false)}
        message="American Airlines is installed — open it from your Home Screen, Dock or Start Menu."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{ sx: { bgcolor: "primary.main", borderRadius: 2 } }}
      />
    </>
  );
};

export default InstallAppButton;
