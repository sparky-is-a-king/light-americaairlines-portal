import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  ButtonBase,
  Avatar,
  Chip,
  Divider,
  Drawer,
  Snackbar,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import DownloadIcon from "@mui/icons-material/Download";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LuggageIcon from "@mui/icons-material/Luggage";
import WifiIcon from "@mui/icons-material/Wifi";
import PowerIcon from "@mui/icons-material/Power";
import TimelineIcon from "@mui/icons-material/Timeline";
import PetsIcon from "@mui/icons-material/Pets";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import MovieIcon from "@mui/icons-material/Movie";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import FlightIcon from "@mui/icons-material/Flight";
import PublicIcon from "@mui/icons-material/Public";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IosShareIcon from "@mui/icons-material/IosShare";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import html2canvas from "html2canvas";
import { motion as Motion, useDragControls } from "framer-motion";
import { supabase } from "../supabaseClient";
import { formatBaggage } from "../utils/baggageLabel";
import { haptic } from "../utils/haptics";
import { INTERVIEW_DOCUMENTS_STATUS } from "../utils/interviewNotice";

// ---------- Palette ----------
const NAVY = "#0f2b5e";
const NAVY_DEEP = "#0a2a5a";
const NOTCH = "#F2F2F7"; // iOS systemGroupedBackground — matches page bg so notches blend

// Restriction palette — warm amber/rose instead of hard red so the notice reads
// as an official pause, not a crisis.
const AMBER = "#b45309";
const AMBER_DEEP = "#7c3d00";
const AMBER_SOFT = "#fff7ed";

// ---------- Redacted fields ----------
const REDACTED_TICKETS = ["AL20101526"]; // Gina Wells

// ---------- Connections ----------
const CONNECTION_AIRPORTS = {
  AL102037886: ["DFW"], // Gina Wells — BOI → DFW → FWA
};

// ---------- Static Fallback ----------
const WENDY_FLIGHT = {
  flight_number: 'AA173',
  airline_name: 'American Airlines',
  airline_code: 'AA',
  operated_by: 'American Airlines',
  departure_airport_code: 'LHR',
  departure_city: 'London, UK',
  arrival_airport_code: 'RDU',
  arrival_city: 'Raleigh, NC',
  departure_time: '12:00',
  arrival_time: '15:40',
  total_journey_duration: '8h 40m',
  flight_date: '2026-09-14',
  status: 'Confirmed',
  class: 'Economy',
  boarding_group: 'B',
  passenger_name: 'Wendy Lupastean',
  ticket_number: 'AA173-001',
  seat: '23A',
  baggage: '4 luggage box',
  gate_departure: 'Gate B44',
  gate_arrival: 'Terminal 2',
  total_price: '1209.00',
  currency: '$',
  trip_type: 'ONE WAY',
  passport_status: 'Verified',
  aircraft_type: 'Boeing 777',
  legroom: 'Average legroom (31 in)',
  wifi: 'Wi-Fi for a fee',
  power: 'In-seat power & USB outlets',
  entertainment: 'On-demand video',
  emissions_co2e: '538 kg CO2e',
  contrail_warming: 'Low',
};

// ---------- Section Heading ----------
const SectionHeading = ({ icon, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.75 }}>
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: 1.25,
        display: "grid",
        placeItems: "center",
        bgcolor: alpha(NAVY, 0.08),
        color: NAVY,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        color: NAVY,
        fontWeight: 800,
        letterSpacing: "0.08em",
        fontSize: { xs: "0.6rem", sm: "0.72rem" },
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  </Box>
);

// ---------- Blurred document thumbnails ----------
const DOCUMENT_THUMBS = [
  { photo: "left", photoWidth: "34%", lines: [76, 100, 58] },
  { photo: "right", photoWidth: "30%", lines: [100, 62, 86, 48] },
  { cover: true, lines: [] },
];

const DocumentThumb = ({ layout }) => (
  <Box
    aria-hidden="true"
    sx={{
      position: "relative",
      width: { xs: 42, sm: 52 },
      height: { xs: 30, sm: 37 },
      p: "3px",
      display: "flex",
      flexDirection: layout.photo === "right" ? "row-reverse" : "row",
      gap: "3px",
      borderRadius: "5px",
      bgcolor: layout.cover ? "#234a80" : "#eef3fa",
      border: "1px solid rgba(15, 43, 94, 0.18)",
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      filter: "blur(1.4px)",
      opacity: 0.9,
      flexShrink: 0,
      overflow: "hidden",
    }}
  >
    {layout.cover ? (
      <>
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 11,
            height: 11,
            borderRadius: "50%",
            border: "1.5px solid #cdb782",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 5,
            right: 5,
            bottom: 4,
            height: 3,
            borderRadius: 1,
            bgcolor: "#cdb782",
            opacity: 0.75,
          }}
        />
      </>
    ) : (
      <>
        <Box sx={{ width: layout.photoWidth, borderRadius: "3px", bgcolor: "#a9bcd4" }} />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "3px",
            minWidth: 0,
          }}
        >
          {layout.lines.map((width) => (
            <Box
              key={width}
              sx={{ height: 3, width: `${width}%`, borderRadius: 1, bgcolor: "#b9c8dc" }}
            />
          ))}
        </Box>
      </>
    )}
  </Box>
);

// ---------- Modern Barcode ----------
const ModernBarcode = () => (
  <Box sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: { xs: 0.3, sm: 0.8 },
    my: 2,
    flexWrap: "wrap",
    overflowX: "auto",
  }}>
    {[
      42, 28, 35, 48, 22, 38, 45, 32, 40, 25, 52, 30, 44, 38, 42, 35, 48, 28,
      52, 36,
    ].map((height, i) => (
      <Box
        key={i}
        sx={{
          width: { xs: i % 3 === 0 ? 2 : 1.5, sm: i % 3 === 0 ? 4 : 2 },
          height: { xs: height * 0.35, sm: height * 0.7, md: height },
          background: "linear-gradient(180deg, #1a1a1a 0%, #333 100%)",
          borderRadius: "2px 2px 0 0",
          flexShrink: 0,
        }}
      />
    ))}
  </Box>
);

// ---------- Info Tile ----------
const InfoTile = ({ icon, label, value, accent = NAVY, align = "left" }) => (
  <Box
    sx={{
      height: "100%",
      p: { xs: 1.25, sm: 1.6 },
      borderRadius: "16px",
      bgcolor: alpha("#ffffff", 0.75),
      backdropFilter: "blur(12px) saturate(150%)",
      WebkitBackdropFilter: "blur(12px) saturate(150%)",
      border: `1px solid ${alpha(accent, 0.16)}`,
      display: "flex",
      flexDirection: "column",
      gap: 0.6,
      minWidth: 0,
      textAlign: align,
      transition: "border-color 0.2s ease, background-color 0.2s ease",
      "&:hover": {
        bgcolor: alpha("#ffffff", 0.95),
        borderColor: alpha(accent, 0.35),
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        color: accent,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      {icon}
      <Typography
        sx={{
          color: alpha(accent, 0.9),
          fontWeight: 800,
          letterSpacing: "0.07em",
          fontSize: { xs: "0.5rem", sm: "0.62rem" },
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Typography
      sx={{
        fontWeight: 700,
        color: NAVY_DEEP,
        fontSize: { xs: "0.82rem", sm: "1rem" },
        lineHeight: 1.25,
        wordBreak: "break-word",
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

// ---------- Ticket Perforation with edge notches ----------
const Perforation = () => (
  <Box
    sx={{
      position: "relative",
      borderTop: "2px dashed rgba(15, 43, 94, 0.22)",
      mt: { xs: 0.5, sm: 1 },
    }}
  >
    {["left", "right"].map((side) => (
      <Box
        key={side}
        sx={{
          position: "absolute",
          top: -17,
          [side]: -17,
          width: 34,
          height: 34,
          borderRadius: "50%",
          bgcolor: NOTCH,
          border: "1px solid rgba(214, 222, 234, 0.9)",
        }}
      />
    ))}
  </Box>
);

// ---------- Amenity Row ----------
const AmenityRow = ({ icon, text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.25, minWidth: 0 }}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "10px",
        display: "grid",
        placeItems: "center",
        bgcolor: alpha(NAVY, 0.07),
        color: NAVY,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: "#475569",
        fontSize: { xs: "0.75rem", sm: "0.85rem" },
        lineHeight: 1.35,
        minWidth: 0,
      }}
    >
      {text}
    </Typography>
  </Box>
);

// ---------- Share Sheet Row ----------
const ShareRow = ({ icon, label, onClick, disabled = false }) => (
  <ButtonBase
    onClick={onClick}
    disabled={disabled}
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 1.5,
      px: 2,
      py: 1.5,
      color: NAVY,
      "&:hover": { bgcolor: alpha(NAVY, 0.05) },
    }}
  >
    <Box sx={{ display: "grid", placeItems: "center", color: NAVY, "& svg": { fontSize: 21 } }}>
      {icon}
    </Box>
    <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", sm: "0.95rem" } }}>{label}</Typography>
  </ButtonBase>
);

// ---------- Main Component ----------
const BoardingPass = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const forceHold = queryParams.get('hold') === 'true';

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const passRef = useRef(null);
  const abortControllerRef = useRef(null);

  const stubControls = useDragControls();
  const stubDragged = useRef(false);
  const [stubExpanded, setStubExpanded] = useState(true);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [sharePreview, setSharePreview] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });

  // Force fix for horizontal scroll
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.maxWidth = "100%";
      root.style.width = "100%";
      root.style.padding = "0";
      root.style.margin = "0";
      root.style.overflowX = "clip";
    }
    document.body.style.overflowX = "clip";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    const styleId = "boarding-pass-final-fix";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        * { max-width: 100%; box-sizing: border-box; }
        #root { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; overflow-x: clip !important; }
        body { overflow-x: clip !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        .MuiPaper-root { overflow-x: clip !important; }
        img, svg { max-width: 100%; height: auto; }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const s = document.getElementById(styleId);
      if (s) s.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ---------- Data Loading ----------
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!flightId) {
      setFlight(WENDY_FLIGHT);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchFlight = async () => {
      setLoading(true);

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      try {
        const { data, error } = await supabase
          .from("flights")
          .select("*") 
          .eq("id", flightId)
          .single();

        clearTimeout(timeoutId);

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Flight not found");
        }

        setFlight(data);
        setRenderKey(prev => prev + 1);
      } catch (err) {
        console.error("Error fetching flight:", err);
        setFlight(WENDY_FLIGHT);
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();

    return () => {
      controller.abort();
      clearTimeout();
    };
  }, [flightId]);

  const showToast = (message) => {
    setTimeout(() => setToast({ open: true, message }), 0);
  };

  // ---------- Pass image ----------
  const passFileName = `boarding-pass-${flight?.flight_number || "flight"}.png`;

  const renderPassCanvas = async () => {
    if (!passRef.current) return null;
    if (!stubExpanded) {
      setStubExpanded(true);
      await new Promise((resolve) => setTimeout(resolve, 420));
    }
    return html2canvas(passRef.current, {
      backgroundColor: "#fff",
      scale: 2,
      logging: false,
    });
  };

  const buildPassImage = async () => {
    const canvas = await renderPassCanvas();
    if (!canvas) return null;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return null;
    return {
      blob,
      file: new File([blob], passFileName, { type: "image/png" }),
      dataUrl: canvas.toDataURL("image/png"),
    };
  };

  // ---------- Share ----------
  const handleShare = async () => {
    setShareBusy(true);
    try {
      const image = await buildPassImage();
      if (!image) return;
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [image.file] })) {
        await navigator.share({
          files: [image.file],
          title: `Boarding pass ${flightNum}`,
          text: `${depCode} → ${arrCode} • ${flightDate} • Seat ${seat}`,
        });
        return;
      }
      setSharePreview(image.dataUrl);
      setShareSheetOpen(true);
    } catch (err) {
      console.error("Share failed:", err);
      setSharePreview("");
      setShareSheetOpen(true);
    } finally {
      setShareBusy(false);
    }
  };

  const handleSaveImage = async () => {
    setShareBusy(true);
    try {
      const image = sharePreview || (await buildPassImage())?.dataUrl;
      if (!image) return;
      const link = document.createElement("a");
      link.download = passFileName;
      link.href = image;
      link.click();
      showToast("Boarding pass saved");
      setShareSheetOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Couldn't save the image");
    } finally {
      setShareBusy(false);
    }
  };

  const handleCopyImage = async () => {
    setShareBusy(true);
    try {
      const image = await buildPassImage();
      if (!image) return;
      if (navigator.clipboard?.write && window.ClipboardItem) {
        await navigator.clipboard.write([new window.ClipboardItem({ "image/png": image.blob })]);
        showToast("Boarding pass copied");
        setShareSheetOpen(false);
      } else {
        showToast("Copying images isn't supported here — saving instead");
        await handleSaveImage();
      }
    } catch (err) {
      console.error("Copy image failed:", err);
      showToast("Couldn't copy the image");
    } finally {
      setShareBusy(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied");
      setShareSheetOpen(false);
    } catch (err) {
      console.error("Copy link failed:", err);
      showToast("Couldn't copy the link");
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `Boarding pass ${flightNum}`,
        text: `${depCode} → ${arrCode} • ${flightDate}`,
        url: window.location.href,
      });
      setShareSheetOpen(false);
    } catch (err) {
      if (err?.name !== "AbortError") showToast("Sharing isn't available");
    }
  };

  // ---------- Wallet-style stub gesture ----------
  const handleStubDragEnd = (event, info) => {
    const draggedUp = info.offset.y < -36 || info.velocity.y < -320;
    const draggedDown = info.offset.y > 36 || info.velocity.y > 320;
    if (draggedUp) {
      setStubExpanded(true);
      haptic("light");
    } else if (draggedDown) {
      setStubExpanded(false);
      haptic("light");
    }
  };

  // ---------- Helper Functions ----------
  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const shiftTime = (timeStr, minutes) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const total = (h * 60 + m + minutes + 1440) % 1440;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatWeekday = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getStatusBorderColor = (status) => {
    if (!status) return "#cbd5e1";
    const lowerStatus = status.toLowerCase().trim();
    if (lowerStatus.includes("cancel") || lowerStatus.includes("delay")) return "#f44336";
    if (lowerStatus.includes("reschedule") || lowerStatus.includes("rechedule")) return "#f59e0b";
    if (lowerStatus.includes("confirm") || lowerStatus.includes("on time") || lowerStatus.includes("ontime") ||
        lowerStatus.includes("scheduled") || lowerStatus.includes("active") || lowerStatus.includes("ready for")) return "#acfdb0";
    if (lowerStatus.includes("board")) return "#ff9800";
    if (lowerStatus.includes("flight") || lowerStatus.includes("depart") || lowerStatus.includes("airborne")) return "#2196f3";
    return "#cbd5e1";
  };

  const getStatusTextColor = (status) => {
    if (!status) return "#475569";
    const lowerStatus = status.toLowerCase().trim();
    if (lowerStatus.includes("cancel") || lowerStatus.includes("delay")) return "#d32f2f";
    if (lowerStatus.includes("reschedule") || lowerStatus.includes("rechedule")) return "#b45309";
    if (lowerStatus.includes("confirm") || lowerStatus.includes("on time") || lowerStatus.includes("ontime") ||
        lowerStatus.includes("scheduled") || lowerStatus.includes("active") || lowerStatus.includes("ready for")) return "#2e7d32";
    if (lowerStatus.includes("board")) return "#ed6c02";
    if (lowerStatus.includes("flight") || lowerStatus.includes("depart") || lowerStatus.includes("airborne")) return "#0288d1";
    return "#475569";
  };

  const getStatusBackgroundColor = (status) => {
    const borderColor = getStatusBorderColor(status);
    return alpha(borderColor, 0.2);
  };

  // ---------- ON HOLD reasons ----------
  const ON_HOLD_REASONS = {};

  const heldTicketKey = () => {
    if (!flight) return null;
    const ticketKey = `${flight.ticket_number || ""} ${flight.id || ""}`.toUpperCase();
    return Object.keys(ON_HOLD_REASONS).find((t) => ticketKey.includes(t)) || null;
  };

  const isTicketOnHold = () => {
    if (forceHold) return true;
    if (!flight) return false;
    if (heldTicketKey()) return true;
    return flight.passport_status?.toLowerCase() === 'missing';
  };

  const onHold = isTicketOnHold();
  const holdReasonKey = heldTicketKey();
  const holdReason = holdReasonKey ? ON_HOLD_REASONS[holdReasonKey] : null;

  // ---------- Passport processing ----------
  const PASSPORT_PROCESSING_TICKETS = ["AL08106563"];
  const isPassportProcessing = () => {
    if (!flight) return false;
    const ticketKey = `${flight.ticket_number || ""} ${flight.id || ""}`.toUpperCase();
    const docStatus = (flight.passport_status || "").toLowerCase();
    return (
      PASSPORT_PROCESSING_TICKETS.some((t) => ticketKey.includes(t)) ||
      docStatus === "processing" ||
      docStatus === "under review"
    );
  };
  const passportProcessing = isPassportProcessing();

  // ---------- Consular interview ----------
  const CONSULAR_INTERVIEW_TICKETS = ["AL20101526"];
  const consularInterview = (() => {
    if (!flight) return false;
    const ticketKey = `${flight.ticket_number || ""} ${flight.id || ""}`.toUpperCase();
    return CONSULAR_INTERVIEW_TICKETS.some((t) => ticketKey.includes(t));
  })();

  // ---------- Administrative travel restriction ----------
  // This ticket is restricted from flying until the date below pending
  // administrative review. The passenger must visit the consulate office for
  // further questioning before travel is permitted.
  const RESTRICTED_TICKETS = {
    AL102037886: {
      until: "December 7th",
      title: "Travel temporarily paused",
      kicker: "Administrative review",
      body: "You're restricted to fly till December 7th for administrative issues. For further questioning, visit the consulate office. Thank you.",
      nextStep: "Visit the consulate office",
    },
  };

  const restrictedKey = (() => {
    if (!flight) return null;
    const ticketKey = `${flight.ticket_number || ""} ${flight.id || ""}`.toUpperCase();
    return Object.keys(RESTRICTED_TICKETS).find((t) => ticketKey.includes(t)) || null;
  })();
  const restricted = Boolean(restrictedKey);
  const restrictedNotice = restrictedKey ? RESTRICTED_TICKETS[restrictedKey] : null;

  // ---------- Loading ----------
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!flight) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="error">Flight data not available</Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>Back to Home</Button>
      </Box>
    );
  }

  // ---------- Destructure Flight Data ----------
  const depCode = flight.departure_airport_code;
  const depCity = flight.departure_city;
  const arrCode = flight.arrival_airport_code;
  const arrCity = flight.arrival_city;
  const depTime = formatTime(flight.departure_time);
  const arrTime = formatTime(flight.arrival_time);
  const boardingTime = formatTime(shiftTime(flight.departure_time, -45));
  const totalDuration = flight.total_journey_duration;
  const passengerName = flight.passenger_name;
  const ticket = flight.ticket_number;
  const ticketRedacted = REDACTED_TICKETS.includes((ticket || "").toUpperCase());
  const seat = flight.seat;
  const baggage = formatBaggage(passportProcessing ? "4 checked bags" : flight.baggage);
  const flightDate = formatDate(flight.flight_date);
  const flightWeekday = formatWeekday(flight.flight_date);
  const currencySymbol = flight.currency || "$";
  const rawPrice = flight.total_price ?? "1,850";
  const priceLabel =
    typeof rawPrice === "number"
      ? rawPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })
      : String(rawPrice);
  const totalPrice = `${currencySymbol}${priceLabel}`;
  const gateDep = flight.gate_departure || "Gate 4";
  const gateArr = flight.gate_arrival || "Gate 2";
  const status = flight.status || "Confirmed";
  const airline = flight.airline_name;
  const airlineCode = flight.airline_code;
  const operated = flight.operated_by;
  const flightNum = flight.flight_number;
  const tripType = flight.trip_type || "ONE WAY";

  const legCount = String(flightNum || "")
    .split("/")
    .map((leg) => leg.trim())
    .filter(Boolean).length;
  const stopCount = Math.max(0, legCount - 1);
  const stopsLabel = stopCount === 0 ? "Non‑stop" : `${stopCount} stop${stopCount === 1 ? "" : "s"}`;
  const connections = CONNECTION_AIRPORTS[(ticket || "").toUpperCase()] || [];
  const classLabel = flight.class;
  const boardGroup = flight.boarding_group;

  const aircraftType = flight.aircraft_type || "Boeing 777";
  const legroom = flight.legroom || "Average legroom (31 in)";
  const wifiInfo = flight.wifi || "Wi-Fi for a fee";
  const powerInfo = flight.power || "In-seat power & USB outlets";
  const entertainment = flight.entertainment || "On-demand video";
  const emissions = flight.emissions_co2e || "538 kg CO2e";
  const contrail = flight.contrail_warming || "Low";

  const hasPet = baggage?.toLowerCase().includes('pet') || false;

  const travelPaused = consularInterview || restricted;
  const statusIsHold = /\bhold\b/i.test(String(status));
  const statusChip = onHold || statusIsHold
    ? { label: "ON HOLD", dot: "#ffffff", bg: "#d32f2f", text: "#ffffff", border: "#b71c1c" }
    : restricted
      ? {
          label: "RESTRICTED",
          dot: AMBER_DEEP,
          bg: alpha(AMBER, 0.12),
          text: AMBER_DEEP,
          border: alpha(AMBER, 0.45),
        }
      : travelPaused
        ? {
            label: "TICKET VOID",
            dot: "#b45309",
            bg: alpha("#b45309", 0.14),
            text: "#7c3d00",
            border: alpha("#b45309", 0.55),
          }
        : {
            label: status,
            dot: getStatusTextColor(status),
            bg: getStatusBackgroundColor(status),
            text: getStatusTextColor(status),
            border: alpha(getStatusBorderColor(status), 0.9),
          };
  const gateDisplay = travelPaused ? "Gate TBA" : gateDep;
  const gateArrDisplay = travelPaused ? "Gate TBA" : gateArr;
  const boardingDisplay = travelPaused ? "TBA" : boardingTime;

  const noticeLabelSx = {
    color: "#64748b",
    fontSize: { xs: "0.55rem", sm: "0.62rem" },
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1.4,
  };

  const interviewNotice = {
    severity: "success",
    icon: <CheckCircleIcon />,
    color: "#2e7d32",
    text: "#1b5e20",
    title: "✅ DOCUMENTS REVIEWED AND PROCESSED",
    note: "You can travel again",
  };

  // ---------- Render ----------
  return (
    <Box
      key={renderKey}
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "clip",
        background: "radial-gradient(circle at 12% 18%, #ffffff 0%, #F2F2F7 45%, #e2e8f3 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 8px",
        }}
      >
        <Paper
          key={flight?.id || "static"}
          ref={passRef}
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "100%",
            borderRadius: "32px",
            overflow: "hidden",
            bgcolor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "0 30px 60px -24px rgba(10, 42, 90, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.7)",
          }}
        >
          {/* Decorative Top Bar */}
          <Box
            sx={{
              height: 7,
              background: "linear-gradient(90deg, #0a2a5a 0%, #1e4a8b 45%, #3b82c4 100%)",
            }}
          />

          <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
            {/* ---- CONSULAR INTERVIEW ---- */}
            {consularInterview && (
              <Alert
                severity={interviewNotice.severity}
                icon={interviewNotice.icon}
                sx={{
                  mb: 2.5,
                  borderRadius: "20px",
                  py: 0.5,
                  bgcolor: alpha(interviewNotice.color, 0.08),
                  color: interviewNotice.text,
                  border: `1px solid ${alpha(interviewNotice.color, 0.4)}`,
                  '& .MuiAlert-icon': { color: interviewNotice.color },
                  '& .MuiAlert-message': { width: "100%", minWidth: 0 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="800" sx={{ letterSpacing: "0.02em" }}>
                    {interviewNotice.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.62rem", sm: "0.68rem" },
                      fontWeight: 700,
                      opacity: 0.75,
                    }}
                  >
                    {interviewNotice.note}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 0.9,
                    borderRadius: "14px",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    border: `1px solid ${alpha(interviewNotice.color, 0.28)}`,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      px: 1.25,
                      py: 0.8,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={noticeLabelSx}>Documents</Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: "#1b5e20",
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {INTERVIEW_DOCUMENTS_STATUS}
                    </Typography>
                  </Box>

                  <Box
                    role="img"
                    aria-label="Three passport copies on file, blurred"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 0.75 },
                      px: 1.25,
                      pb: 0.9,
                    }}
                  >
                    {DOCUMENT_THUMBS.map((layout, index) => (
                      <DocumentThumb key={index} layout={layout} />
                    ))}
                  </Box>
                </Box>

                <Typography
                  sx={{
                    mt: 0.9,
                    color: interviewNotice.text,
                    fontSize: { xs: "0.66rem", sm: "0.72rem" },
                    fontWeight: 600,
                    lineHeight: 1.45,
                  }}
                >
                  Your documents have been reviewed and processed. You can book a new ticket and fly.
                </Typography>
              </Alert>
            )}

            {/* ---- ADMINISTRATIVE TRAVEL RESTRICTION (soft redesigned notice) ---- */}
            {restricted && (
              <Box
                role="status"
                aria-live="polite"
                sx={{
                  mb: 2.5,
                  borderRadius: "22px",
                  bgcolor: AMBER_SOFT,
                  border: `1px solid ${alpha(AMBER, 0.28)}`,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px -16px rgba(180, 83, 9, 0.5)",
                }}
              >
                {/* Header band: icon + title + status pill */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: { xs: 1.75, sm: 2.25 },
                    py: { xs: 1.5, sm: 1.75 },
                    bgcolor: alpha(AMBER, 0.06),
                    borderBottom: `1px solid ${alpha(AMBER, 0.18)}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: alpha(AMBER, 0.14),
                      color: AMBER,
                      flexShrink: 0,
                    }}
                  >
                    <PauseCircleOutlineIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        color: AMBER_DEEP,
                        fontWeight: 800,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {restrictedNotice.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: alpha(AMBER_DEEP, 0.75),
                        fontWeight: 600,
                        fontSize: { xs: "0.62rem", sm: "0.7rem" },
                        letterSpacing: "0.04em",
                        mt: 0.2,
                      }}
                    >
                      {restrictedNotice.kicker}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Until ${restrictedNotice.until}`}
                    size="small"
                    sx={{
                      bgcolor: "#ffffff",
                      color: AMBER_DEEP,
                      border: `1px solid ${alpha(AMBER, 0.35)}`,
                      fontWeight: 800,
                      fontSize: { xs: "0.6rem", sm: "0.68rem" },
                      height: { xs: 24, sm: 28 },
                      borderRadius: 999,
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {/* Body */}
                <Box sx={{ px: { xs: 1.75, sm: 2.25 }, py: { xs: 1.5, sm: 1.75 } }}>
                  <Typography
                    sx={{
                      color: "#3f2a12",
                      fontSize: { xs: "0.78rem", sm: "0.86rem" },
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    {restrictedNotice.body}
                  </Typography>

                  {/* Next step row */}
                  <Box
                    sx={{
                      mt: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                      pt: 1.25,
                      borderTop: `1px dashed ${alpha(AMBER, 0.3)}`,
                    }}
                  >
                    <Typography
                      sx={{
                        color: alpha(AMBER_DEEP, 0.8),
                        fontSize: { xs: "0.62rem", sm: "0.7rem" },
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                      }}
                    >
                      Next step
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: AMBER_DEEP,
                        fontWeight: 800,
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      }}
                    >
                      {restrictedNotice.nextStep}
                      <ArrowForwardIcon sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* ---- HOLD BANNER ---- */}
            {onHold && (
              <Alert
                severity="error"
                icon={<WarningIcon />}
                sx={{
                  mb: 2.5,
                  borderRadius: "20px",
                  fontWeight: 600,
                  bgcolor: alpha('#d32f2f', 0.08),
                  color: '#b71c1c',
                  border: '1px solid rgba(211, 47, 47, 0.4)',
                  '& .MuiAlert-icon': { color: '#d32f2f' },
                }}
              >
                <Typography variant="subtitle2" fontWeight="800" sx={{ letterSpacing: "0.02em" }}>
                  {holdReason
                    ? "🚫 PASSPORT DOCUMENTS UNDER REVIEW — TICKET ON HOLD"
                    : "🚫 PASSPORT REQUIRED — TICKET ON HOLD"}
                </Typography>
                {holdReason && (
                  <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25 }}>
                    {holdReason}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: holdReason ? 0.75 : 0 }}>
                  {holdReason
                    ? "This ticket stays on hold until the review is completed. Please contact the U.S. Department of State / Bureau of Consular Affairs for the status of your documents."
                    : "Please present a valid physical passport immediately at the check‑in counter to release this ticket. Your seat may be released if not resolved before departure."}
                </Typography>
              </Alert>
            )}

            {/* ---- PASSPORT PROCESSING NOTE ---- */}
            {passportProcessing && (
              <Alert
                severity="warning"
                icon={<HourglassBottomIcon />}
                sx={{
                  mb: 2.5,
                  borderRadius: "20px",
                  bgcolor: alpha('#ed6c02', 0.08),
                  color: '#7c3d00',
                  border: '1px solid rgba(237, 108, 2, 0.45)',
                  '& .MuiAlert-icon': { color: '#ed6c02' },
                }}
              >
                <Typography variant="subtitle2" fontWeight="800" sx={{ letterSpacing: "0.02em" }}>
                  ⚠️ IMPORTANT — PASSPORT DOCUMENT UNDER PROCESSING / REVIEW
                </Typography>
                <Typography variant="body2">
                  The passport document on file for this ticket is currently under processing and review. This is the reason the passenger is unable to fly at this time.
                </Typography>
                <Box
                  sx={{
                    mt: 1.25,
                    p: { xs: 1.1, sm: 1.35 },
                    borderRadius: "14px",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(237, 108, 2, 0.45)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: { xs: 16, sm: 19 }, mt: 0.1 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#2e7d32",
                        fontSize: { xs: "0.55rem", sm: "0.66rem" },
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Payment already settled
                    </Typography>
                    <Typography sx={{ color: "#334155", fontSize: { xs: "0.62rem", sm: "0.74rem" }, mt: 0.25, lineHeight: 1.5 }}>
                      No further payment is required for this ticket. A new travel date will be added automatically — no further action needed from the passenger.
                    </Typography>
                  </Box>
                </Box>
              </Alert>
            )}

            {/* ---- HEADER ---- */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #0f2b5e 0%, #2e6bb5 100%)",
                    width: { xs: 44, sm: 58 },
                    height: { xs: 44, sm: 58 },
                    borderRadius: "18px",
                    fontSize: { xs: 14, sm: 20 },
                    fontWeight: 800,
                    letterSpacing: "0.03em",
                    color: "white",
                    boxShadow: "0 10px 22px -10px rgba(15, 43, 94, 0.8)",
                    flexShrink: 0,
                  }}
                >
                  {airlineCode}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: { xs: "0.58rem", sm: "0.72rem" },
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {airline}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: NAVY,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        fontSize: { xs: "1.15rem", sm: "1.6rem" },
                      }}
                    >
                      {flightNum}
                    </Typography>
                    <Chip
                      label={tripType}
                      size="small"
                      sx={{
                        bgcolor: alpha(NAVY, 0.08),
                        color: NAVY,
                        fontWeight: 800,
                        fontSize: "0.58rem",
                        height: 20,
                        letterSpacing: "0.05em",
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: "#94a3b8", fontSize: { xs: "0.55rem", sm: "0.7rem" } }}>
                    Operated by {operated}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: "right", ml: "auto" }}>
                <Chip
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: statusChip.dot,
                          boxShadow: `0 0 0 3px ${alpha(statusChip.dot, 0.25)}`,
                        }}
                      />
                      {statusChip.label}
                    </Box>
                  }
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "0.58rem", sm: "0.7rem" },
                    mb: 0.5,
                    height: { xs: 22, sm: 26 },
                    borderRadius: 999,
                    backgroundColor: statusChip.bg,
                    color: statusChip.text,
                    border: `1px solid ${statusChip.border}`,
                  }}
                />
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: { xs: "0.55rem", sm: "0.7rem" },
                    fontWeight: 600,
                  }}
                >
                  {classLabel} • Group {travelPaused ? "TBA" : boardGroup}
                </Typography>
              </Box>
            </Box>

            {/* ---- ROUTE ---- */}
            <Box
              sx={{
                mt: { xs: 2, sm: 2.5 },
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(16px) saturate(160%)",
                WebkitBackdropFilter: "blur(16px) saturate(160%)",
                borderRadius: "22px",
                p: { xs: 1.75, sm: 2.5 },
                border: "1px solid rgba(255, 255, 255, 0.85)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.9)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Box sx={{ textAlign: "center", minWidth: { xs: 62, sm: 92 } }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: NAVY,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      fontSize: { xs: "1.6rem", sm: "2.3rem" },
                    }}
                  >
                    {depCode}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: { xs: "0.6rem", sm: "0.75rem" }, mt: 0.5 }}>
                    {depCity ? depCity.split(",")[0] : depCode}
                  </Typography>
                  <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: { xs: "0.72rem", sm: "0.9rem" }, mt: 0.75 }}>
                    {depTime}
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: { xs: "0.5rem", sm: "0.65rem" }, mt: 0.25 }}>
                    {gateDisplay}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, minWidth: 40, px: { xs: 0.5, sm: 1 } }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#0891b2",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      fontSize: { xs: "0.55rem", sm: "0.7rem" },
                      mb: 0.75,
                    }}
                  >
                    {totalDuration}
                  </Typography>
                  <Box sx={{ position: "relative", height: 2, bgcolor: "#c3cede", borderRadius: 1 }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translate(-20%, -50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: NAVY,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translate(20%, -50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#0e9f6e",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "#ffffff",
                        borderRadius: "50%",
                        p: 0.45,
                        display: "grid",
                        placeItems: "center",
                        boxShadow: "0 2px 8px rgba(15,43,94,0.18)",
                      }}
                    >
                      <FlightTakeoffIcon sx={{ fontSize: { xs: 12, sm: 15 }, color: NAVY }} />
                    </Box>
                  </Box>
                  {connections.length > 0 && (
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: { xs: "0.5rem", sm: "0.62rem" },
                        mt: 0.75,
                      }}
                    >
                      via {connections.join(" · ")}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: "center", minWidth: { xs: 62, sm: 92 } }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: NAVY,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      fontSize: { xs: "1.6rem", sm: "2.3rem" },
                    }}
                  >
                    {arrCode}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: { xs: "0.6rem", sm: "0.75rem" }, mt: 0.5 }}>
                    {arrCity ? arrCity.split(",")[0] : arrCode}
                  </Typography>
                  <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: { xs: "0.72rem", sm: "0.9rem" }, mt: 0.75 }}>
                    {arrTime}
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: { xs: "0.5rem", sm: "0.65rem" }, mt: 0.25 }}>
                    {gateArrDisplay}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  mt: 2,
                  pt: 1.5,
                  borderTop: "1px dashed #cbd5e1",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CalendarMonthIcon sx={{ fontSize: 15, color: "#64748b" }} />
                  <Typography sx={{ color: "#475569", fontWeight: 700, fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>
                    {flightWeekday}, {flightDate}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TimelineIcon
                    sx={{ fontSize: 15, color: travelPaused ? AMBER : "#0891b2" }}
                  />
                  <Typography
                    sx={{
                      color: travelPaused ? AMBER_DEEP : "#0891b2",
                      fontWeight: 700,
                      fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    }}
                  >
                    {restricted
                      ? `Restricted until ${restrictedNotice.until}`
                      : travelPaused
                        ? "Not valid for boarding · book a new ticket"
                        : `${tripType} • ${stopsLabel}`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ---- FARE / SEAT TILES ---- */}
            <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mt: { xs: 2, sm: 2.5 } }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile
                  icon={<ConfirmationNumberIcon sx={{ fontSize: 15 }} />}
                  label="Ticket"
                  value={
                    ticketRedacted ? (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          filter: "blur(5px)",
                          WebkitFilter: "blur(5px)",
                          userSelect: "none",
                        }}
                      >
                        {ticket}
                      </Box>
                    ) : (
                      ticket
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile icon={<EventSeatIcon sx={{ fontSize: 15 }} />} label="Seat" value={seat} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile icon={<LuggageIcon sx={{ fontSize: 15 }} />} label="Baggage" value={baggage} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile icon={<CalendarMonthIcon sx={{ fontSize: 15 }} />} label="Flight date" value={flightDate} />
              </Grid>
            </Grid>

            {/* ---- PASSENGER ---- */}
            <Box
              sx={{
                mt: { xs: 2, sm: 2.5 },
                background: "linear-gradient(135deg, #0f2b5e 0%, #1e4a8b 55%, #2e6bb5 100%)",
                borderRadius: "22px",
                p: { xs: 1.75, sm: 2.25 },
                color: "#ffffff",
                boxShadow: "0 16px 34px -20px rgba(15, 43, 94, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: -30,
                  top: -30,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: alpha("#ffffff", 0.06),
                }}
              />
              <Typography
                sx={{
                  color: alpha("#ffffff", 0.72),
                  fontSize: { xs: "0.55rem", sm: "0.64rem" },
                  letterSpacing: "0.16em",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                Passenger
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                  fontSize: { xs: "1.1rem", sm: "1.5rem" },
                  mt: 0.25,
                }}
              >
                {passengerName}
              </Typography>
            </Box>

            {/* ---- AIRCRAFT & AMENITIES ---- */}
            <Box
              sx={{
                mt: { xs: 2, sm: 2.5 },
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: "22px",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                bgcolor: "rgba(255, 255, 255, 0.78)",
                backdropFilter: "blur(16px) saturate(160%)",
                WebkitBackdropFilter: "blur(16px) saturate(160%)",
              }}
            >
              <SectionHeading icon={<FlightIcon sx={{ fontSize: 15 }} />}>
                Aircraft & amenities
              </SectionHeading>

              <Grid container spacing={{ xs: 0, sm: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AmenityRow icon={<FlightIcon sx={{ fontSize: 16 }} />} text={aircraftType} />
                  <AmenityRow icon={<AirlineSeatReclineNormalIcon sx={{ fontSize: 16 }} />} text={legroom} />
                  <AmenityRow icon={<WifiIcon sx={{ fontSize: 16 }} />} text={wifiInfo} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AmenityRow icon={<PowerIcon sx={{ fontSize: 16 }} />} text={powerInfo} />
                  <AmenityRow icon={<MovieIcon sx={{ fontSize: 16 }} />} text={entertainment} />
                  <AmenityRow icon={<PublicIcon sx={{ fontSize: 16 }} />} text={`Emissions: ${emissions}`} />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 0.5,
                  pt: 1.5,
                  borderTop: "1px dashed #d6deea",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <WarningIcon sx={{ color: "#94a3b8", fontSize: 15 }} />
                <Typography sx={{ color: "#64748b", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                  Contrail warming potential: <strong style={{ color: NAVY }}>{contrail}</strong>
                </Typography>
                <InfoIcon sx={{ color: "#cbd5e1", fontSize: 14 }} />
              </Box>
            </Box>
          </Box>

          {/* ---- PERFORATION ---- */}
          <Perforation />

          {/* ---- GRABBER ---- */}
          <Motion.div
            drag="y"
            dragControls={stubControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.35}
            whileTap={{ scale: 0.995 }}
            onDragStart={() => {
              stubDragged.current = false;
              haptic("light");
            }}
            onDrag={() => {
              stubDragged.current = true;
            }}
            onDragEnd={(event, info) => {
              handleStubDragEnd(event, info);
              setTimeout(() => {
                stubDragged.current = false;
              }, 0);
            }}
            style={{ touchAction: "none" }}
          >
            <ButtonBase
              onPointerDown={(e) => stubControls.start(e)}
              onClick={() => {
                if (stubDragged.current) return;
                haptic("light");
                setStubExpanded((v) => !v);
              }}
              aria-expanded={stubExpanded}
              aria-label={stubExpanded ? "Collapse boarding pass stub" : "Expand boarding pass stub"}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                pt: 1.25,
                pb: 0.75,
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <Box sx={{ width: 44, height: 5, borderRadius: 999, bgcolor: alpha(NAVY, 0.22) }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.55rem", sm: "0.68rem" },
                    fontWeight: 700,
                    color: "#64748b",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stubExpanded
                    ? "Swipe down to collapse"
                    : travelPaused
                      ? "Swipe up for fare & barcode"
                      : "Swipe up for gate, total paid & barcode"}
                </Typography>
                <Motion.span
                  animate={{ rotate: stubExpanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  style={{ display: "inline-flex" }}
                >
                  <KeyboardArrowUpIcon sx={{ fontSize: 16, color: "#64748b" }} />
                </Motion.span>
              </Box>
            </ButtonBase>
          </Motion.div>

          {/* ---- STUB ---- */}
          <Motion.div
            initial={false}
            animate={{ height: stubExpanded ? "auto" : 168 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{ overflow: "hidden", position: "relative" }}
          >
          <Box sx={{ px: { xs: 2, sm: 3, md: 3.5 }, pt: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 } }}>
            <SectionHeading icon={<FlightLandIcon sx={{ fontSize: 15 }} />}>
              Boarding essentials
            </SectionHeading>

            <Grid container spacing={{ xs: 1, sm: 1.5 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent="#0891b2" icon={<FlightTakeoffIcon sx={{ fontSize: 15 }} />} label="Gate" value={travelPaused ? "TBA" : gateDep} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent="#059669" icon={<TimelineIcon sx={{ fontSize: 15 }} />} label="Boarding" value={boardingDisplay} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent={NAVY} icon={<EventSeatIcon sx={{ fontSize: 15 }} />} label="Seat" value={seat} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent="#b45309" icon={<ConfirmationNumberIcon sx={{ fontSize: 15 }} />} label="Group" value={travelPaused ? "TBA" : boardGroup} />
              </Grid>
            </Grid>

            {/* Fare summary */}
            <Box
              sx={{
                mt: { xs: 2, sm: 2.5 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                p: { xs: 1.5, sm: 2 },
                borderRadius: "18px",
                bgcolor: alpha("#ffffff", 0.8),
                backdropFilter: "blur(12px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.55rem", sm: "0.65rem" },
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Total paid
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: NAVY,
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "1.1rem", sm: "1.6rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {totalPrice}
                </Typography>
              </Box>
              <Chip
                label={classLabel}
                sx={{
                  bgcolor: alpha(NAVY, 0.09),
                  color: NAVY,
                  fontWeight: 800,
                  fontSize: { xs: "0.6rem", sm: "0.72rem" },
                }}
              />
            </Box>

            {/* Barcode */}
            <Box sx={{ textAlign: "center", mt: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ position: "relative" }}>
                <Box sx={travelPaused ? { filter: "grayscale(1)", opacity: 0.28 } : undefined}>
                  <ModernBarcode />
                </Box>
                {travelPaused && (
                  <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                    <Typography
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        color: AMBER_DEEP,
                        border: `1px solid ${alpha(AMBER, 0.45)}`,
                        fontWeight: 900,
                        fontSize: { xs: "0.5rem", sm: "0.6rem" },
                        letterSpacing: "0.1em",
                      }}
                    >
                      {restricted ? "TRAVEL PAUSED" : "NOT VALID FOR BOARDING"}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: { xs: "0.65rem", sm: "0.85rem" } }}>
                  {depCode} → {arrCode}
                </Typography>
                <QrCode2Icon sx={{ color: NAVY, fontSize: { xs: 18, sm: 26 } }} />
              </Box>
              <Typography sx={{ color: travelPaused ? AMBER_DEEP : "#64748b", fontSize: { xs: "0.5rem", sm: "0.68rem" }, mt: 0.5 }}>
                {restricted
                  ? "No boarding code — visit the consulate office for further questioning"
                  : travelPaused
                    ? "No boarding code — book a new ticket"
                    : `Scan for mobile boarding • ${tripType} • ${flightDate}`}
              </Typography>
            </Box>

            {/* Extras */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label="Snacks"
                size="small"
                variant="outlined"
                sx={{
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: { xs: "0.55rem", sm: "0.68rem" },
                  height: { xs: 22, sm: 26 },
                  borderColor: "#dbe3ee",
                }}
              />
              {hasPet && (
                <Chip
                  icon={<PetsIcon sx={{ fontSize: { xs: 11, sm: 15 } }} />}
                  label="Pet on board"
                  size="small"
                  sx={{
                    bgcolor: alpha('#9b59b6', 0.12),
                    color: '#6c3483',
                    fontWeight: 700,
                    fontSize: { xs: "0.55rem", sm: "0.68rem" },
                    height: { xs: 22, sm: 26 },
                    border: `1px solid ${alpha('#9b59b6', 0.5)}`,
                  }}
                />
              )}
            </Box>
          </Box>

            {!stubExpanded && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 64,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.96) 78%)",
                }}
              />
            )}
          </Motion.div>

          {/* Footer */}
          <Box
            sx={{
            bgcolor: "rgba(255, 255, 255, 0.65)",
            borderTop: "1px solid rgba(15, 43, 94, 0.08)",
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 1.75 },
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: travelPaused ? AMBER_DEEP : "#94a3b8", fontWeight: travelPaused ? 700 : 400, fontSize: { xs: "0.5rem", sm: "0.68rem" }, lineHeight: 1.5 }}>
              {restricted
                ? "This pass cannot be used until the restriction lifts — visit the consulate office for further questioning"
                : travelPaused
                  ? "This pass is not valid for boarding • Book a new ticket to fly"
                  : "Please arrive at the gate at least 30 minutes before departure • Have your ID ready"}
            </Typography>
          </Box>
        </Paper>
      </Motion.div>

      {/* Action Buttons */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            px: { xs: 1, sm: 0 },
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {restricted ? (
            <Button
              component={Link}
              to="/"
              startIcon={<InfoIcon />}
              variant="contained"
              fullWidth
              sx={{
                py: { xs: 1.35, sm: 1.6 },
                borderRadius: 999,
                background: `linear-gradient(135deg, ${AMBER_DEEP} 0%, ${AMBER} 100%)`,
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                boxShadow: `0 14px 30px -14px ${alpha(AMBER, 0.75)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, #6a3200 0%, ${AMBER_DEEP} 100%)`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Visit consulate office for questioning
            </Button>
          ) : travelPaused ? (
            <Button
              component={Link}
              to="/"
              startIcon={<FlightTakeoffIcon />}
              variant="contained"
              fullWidth
              sx={{
                py: { xs: 1.35, sm: 1.6 },
                borderRadius: 999,
                background: "linear-gradient(135deg, #0a2a5a 0%, #0d47a1 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                boxShadow: "0 14px 30px -14px rgba(10, 42, 90, 0.75)",
                "&:hover": {
                  background: "linear-gradient(135deg, #081f45 0%, #0a2a5a 100%)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Book a new flight
            </Button>
          ) : (
            <Button
              onClick={handleShare}
              disabled={shareBusy}
              startIcon={shareBusy ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              ) : (
                <IosShareIcon />
              )}
              variant="contained"
              fullWidth
              sx={{
                py: { xs: 1.35, sm: 1.6 },
                borderRadius: 999,
                background: "linear-gradient(135deg, #0a2a5a 0%, #0d47a1 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                boxShadow: "0 14px 30px -14px rgba(10, 42, 90, 0.75)",
                "&:hover": {
                  background: "linear-gradient(135deg, #081f45 0%, #0a2a5a 100%)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.8)",
                  background: "linear-gradient(135deg, #475569 0%, #64748b 100%)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {shareBusy ? "Preparing pass…" : "Share Boarding Pass"}
            </Button>
          )}

          <Typography
            sx={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: { xs: "0.6rem", sm: "0.68rem" },
              fontWeight: 600,
              letterSpacing: "0.03em",
              mt: 0.25,
            }}
          >
            {restricted
              ? `Travel is paused until ${restrictedNotice.until} pending administrative review`
              : travelPaused
                ? "This pass is void • A new booking issues a valid boarding pass"
                : "Save as image, copy, or send — all from the share sheet"}
          </Typography>
        </Box>
      </Motion.div>

      {/* ---- Share sheet ---- */}
      <Drawer
        anchor="bottom"
        open={shareSheetOpen}
        onClose={() => setShareSheetOpen(false)}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "28px",
            borderTopRightRadius: "28px",
            bgcolor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.85)",
            boxShadow: "0 -20px 60px -24px rgba(10, 42, 90, 0.45)",
            pb: "calc(16px + env(safe-area-inset-bottom))",
            width: "100%",
            maxWidth: 520,
            mx: "auto",
          },
        }}
      >
        <Box sx={{ pt: 1.25, px: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ width: 44, height: 5, borderRadius: 999, bgcolor: alpha(NAVY, 0.22), mx: "auto" }} />

          <Typography sx={{ textAlign: "center", fontWeight: 800, color: NAVY, fontSize: "0.95rem" }}>
            Share boarding pass
          </Typography>

          {sharePreview && (
            <Box
              component="img"
              src={sharePreview}
              alt="Boarding pass preview"
              sx={{
                width: "100%",
                maxHeight: 200,
                objectFit: "contain",
                borderRadius: "18px",
                border: "1px solid rgba(15, 43, 94, 0.08)",
                bgcolor: "#ffffff",
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid rgba(15, 43, 94, 0.08)",
              bgcolor: "rgba(255, 255, 255, 0.85)",
            }}
          >
            <ShareRow
              icon={<DownloadIcon />}
              label="Save image"
              onClick={handleSaveImage}
              disabled={shareBusy}
            />
            <Divider />
            <ShareRow
              icon={<ContentCopyIcon />}
              label="Copy image"
              onClick={handleCopyImage}
              disabled={shareBusy}
            />
            <Divider />
            <ShareRow
              icon={<LinkIcon />}
              label="Copy link"
              onClick={handleCopyLink}
              disabled={shareBusy}
            />
            {typeof navigator !== "undefined" && navigator.share && (
              <>
                <Divider />
                <ShareRow
                  icon={<IosShareIcon />}
                  label="Share…"
                  onClick={handleNativeShare}
                  disabled={shareBusy}
                />
              </>
            )}
          </Box>

          <Button
            onClick={() => setShareSheetOpen(false)}
            fullWidth
            sx={{
              borderRadius: "18px",
              py: 1.4,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              color: NAVY,
              fontWeight: 700,
              border: "1px solid rgba(15, 43, 94, 0.08)",
              "&:hover": { bgcolor: "#ffffff" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Drawer>

      <Snackbar
        open={toast.open}
        autoHideDuration={2600}
        onClose={() => setToast({ open: false, message: "" })}
        message={toast.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{ sx: { borderRadius: 999, bgcolor: NAVY, fontWeight: 600 } }}
      />
    </Box>
  );
};

export default BoardingPass;