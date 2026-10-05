import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

// ---------- Palette ----------
const NAVY = "#0f2b5e";
const NAVY_DEEP = "#0a2a5a";
const NOTCH = "#eef2f7";

// ---------- Static Fallback ----------
const WENDY_FLIGHT = {
  flight_number: 'AA173',
  airline_name: 'American',
  airline_code: 'AA',
  operated_by: 'American',
  departure_airport_code: 'LHR',
  departure_city: 'London, UK',
  arrival_airport_code: 'RDU',
  arrival_city: 'Raleigh, NC',
  departure_time: '12:00', // Updated to 12:00 PM
  arrival_time: '15:40',   // Updated to 3:40 PM
  total_journey_duration: '8h 40m',
  flight_date: '2026-09-14', // Updated to Mon, Sep 14
  status: 'Confirmed',
  class: 'Economy',
  boarding_group: 'B',
  passenger_name: 'Wendy Lupastean',
  ticket_number: 'AA173-001',
  seat: '23A',
  baggage: '1 carry-on, 1 checked',
  gate_departure: 'Gate B44',
  gate_arrival: 'Terminal 2',
  total_price: '1580.00',
  currency: '$',
  trip_type: 'ONE WAY',
  passport_status: 'Verified',
  // New fields from screenshot
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
      borderRadius: 2.5,
      bgcolor: alpha(accent, 0.045),
      border: `1px solid ${alpha(accent, 0.12)}`,
      display: "flex",
      flexDirection: "column",
      gap: 0.6,
      minWidth: 0,
      textAlign: align,
      transition: "border-color 0.2s ease, background-color 0.2s ease",
      "&:hover": {
        bgcolor: alpha(accent, 0.08),
        borderColor: alpha(accent, 0.28),
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
      borderTop: "2px dashed #cbd5e1",
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
        borderRadius: 1.5,
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

// ---------- Main Component ----------
const BoardingPass = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const forceHold = queryParams.get('hold') === 'true';

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const passRef = useRef(null);
  const abortControllerRef = useRef(null);

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
        // Fall back to the sample pass so the page is never blank.
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

  // ---------- Download Handler ----------
  const handleDownload = async () => {
    if (!passRef.current) return;
    try {
      const canvas = await html2canvas(passRef.current, {
        backgroundColor: "#fff",
        scale: 2,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `boarding-pass-${flight?.flight_number || "flight"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
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

  // Boarding usually starts 45 minutes before departure.
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
    if (lowerStatus.includes("confirm") || lowerStatus.includes("on time") || lowerStatus.includes("ontime") ||
        lowerStatus.includes("scheduled") || lowerStatus.includes("active") || lowerStatus.includes("ready for") ||
        lowerStatus.includes("reschedule") || lowerStatus.includes("rechedule")) return "#acfdb0";
    if (lowerStatus.includes("board")) return "#ff9800";
    if (lowerStatus.includes("flight") || lowerStatus.includes("depart") || lowerStatus.includes("airborne")) return "#2196f3";
    return "#cbd5e1";
  };

  const getStatusTextColor = (status) => {
    if (!status) return "#475569";
    const lowerStatus = status.toLowerCase().trim();
    if (lowerStatus.includes("cancel") || lowerStatus.includes("delay")) return "#d32f2f";
    if (lowerStatus.includes("confirm") || lowerStatus.includes("on time") || lowerStatus.includes("ontime") ||
        lowerStatus.includes("scheduled") || lowerStatus.includes("active") || lowerStatus.includes("ready for") ||
        lowerStatus.includes("reschedule") || lowerStatus.includes("rechedule")) return "#2e7d32";
    if (lowerStatus.includes("board")) return "#ed6c02";
    if (lowerStatus.includes("flight") || lowerStatus.includes("depart") || lowerStatus.includes("airborne")) return "#0288d1";
    return "#475569";
  };

  const getStatusBackgroundColor = (status) => {
    const borderColor = getStatusBorderColor(status);
    return alpha(borderColor, 0.2);
  };

  // ---------- Determine if ticket should be ON HOLD ----------
  const isTicketOnHold = () => {
    if (forceHold) return true;
    if (!flight) return false;
    return flight.passport_status?.toLowerCase() === 'missing';
  };

  const onHold = isTicketOnHold();

  // ---------- Passport document under processing / review (per-ticket note) ----------
  const PASSPORT_PROCESSING_TICKETS = ["AL08106563"]; // Gina Wells
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
  const seat = flight.seat;
  // Baggage for the passport-processing ticket is 4 box 1.
  const baggage = passportProcessing ? "4 box 1" : flight.baggage;
  const flightDate = formatDate(flight.flight_date);
  const flightWeekday = formatWeekday(flight.flight_date);
  // ---------- Money ----------
  const currencySymbol = flight.currency || "$";
  const totalPrice = `${currencySymbol}${flight.total_price || "1,850"}`;
  const gateDep = flight.gate_departure || "Gate 4";
  const gateArr = flight.gate_arrival || "Gate 2";
  const status = flight.status || "Confirmed";
  const airline = flight.airline_name;
  const airlineCode = flight.airline_code;
  const operated = flight.operated_by;
  const flightNum = flight.flight_number;
  const tripType = flight.trip_type || "ONE WAY";
  const classLabel = flight.class;
  const boardGroup = flight.boarding_group;

  // New fields
  const aircraftType = flight.aircraft_type || "Boeing 777";
  const legroom = flight.legroom || "Average legroom (31 in)";
  const wifiInfo = flight.wifi || "Wi-Fi for a fee";
  const powerInfo = flight.power || "In-seat power & USB outlets";
  const entertainment = flight.entertainment || "On-demand video";
  const emissions = flight.emissions_co2e || "538 kg CO2e";
  const contrail = flight.contrail_warming || "Low";

  const hasPet = baggage?.toLowerCase().includes('pet') || false;
  const statusColor = onHold ? "#d32f2f" : getStatusTextColor(status);

  // ---------- Render ----------
  return (
    <Box
      key={renderKey}
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "clip",
        background: "radial-gradient(circle at 12% 18%, #ffffff 0%, #f1f5f9 45%, #dde5ef 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <motion.div
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
            borderRadius: { xs: 3, sm: 4 },
            overflow: "hidden",
            bgcolor: "#ffffff",
            boxShadow: "0 30px 60px -20px rgba(15, 43, 94, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.9)",
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
            {/* ---- HOLD BANNER ---- */}
            {onHold && (
              <Alert
                severity="error"
                icon={<WarningIcon />}
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: alpha('#d32f2f', 0.08),
                  color: '#b71c1c',
                  border: '1px solid rgba(211, 47, 47, 0.4)',
                  '& .MuiAlert-icon': { color: '#d32f2f' },
                }}
              >
                <Typography variant="subtitle2" fontWeight="800" sx={{ letterSpacing: "0.02em" }}>
                  🚫 PASSPORT REQUIRED — TICKET ON HOLD
                </Typography>
                <Typography variant="body2">
                  Please present a valid physical passport immediately at the check‑in counter to release this ticket.
                  Your seat may be released if not resolved before departure.
                </Typography>
              </Alert>
            )}

            {/* ---- PASSPORT PROCESSING / REVIEW NOTE ---- */}
            {passportProcessing && (
              <Alert
                severity="warning"
                icon={<HourglassBottomIcon />}
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
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
                    borderRadius: 2,
                    bgcolor: "#ffffff",
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
                    borderRadius: 2.5,
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
                          bgcolor: onHold ? "#ffffff" : statusColor,
                          boxShadow: `0 0 0 3px ${alpha(onHold ? "#ffffff" : statusColor, 0.25)}`,
                        }}
                      />
                      {onHold ? 'ON HOLD' : status}
                    </Box>
                  }
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "0.58rem", sm: "0.7rem" },
                    mb: 0.5,
                    height: { xs: 22, sm: 26 },
                    borderRadius: 1.5,
                    backgroundColor: onHold ? '#d32f2f' : getStatusBackgroundColor(status),
                    color: onHold ? '#ffffff' : getStatusTextColor(status),
                    border: onHold ? '1px solid #b71c1c' : `1px solid ${alpha(getStatusBorderColor(status), 0.9)}`,
                  }}
                />
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: { xs: "0.55rem", sm: "0.7rem" },
                    fontWeight: 600,
                  }}
                >
                  {classLabel} • Group {boardGroup}
                </Typography>
              </Box>
            </Box>

            {/* ---- ROUTE ---- */}
            <Box
              sx={{
                mt: { xs: 2, sm: 2.5 },
                background: "linear-gradient(135deg, #f8fafc 0%, #eef3fa 100%)",
                borderRadius: 3,
                p: { xs: 1.75, sm: 2.5 },
                border: "1px solid rgba(219, 228, 240, 0.9)",
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
                    {gateDep}
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
                    {gateArr}
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
                  <TimelineIcon sx={{ fontSize: 15, color: "#0891b2" }} />
                  <Typography sx={{ color: "#0891b2", fontWeight: 700, fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>
                    {tripType} • Non‑stop
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ---- FARE / SEAT TILES ---- */}
            <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mt: { xs: 2, sm: 2.5 } }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile icon={<ConfirmationNumberIcon sx={{ fontSize: 15 }} />} label="Ticket" value={ticket} />
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
                borderRadius: 3,
                p: { xs: 1.75, sm: 2.25 },
                color: "#ffffff",
                boxShadow: "0 16px 34px -20px rgba(15, 43, 94, 0.9)",
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
                borderRadius: 3,
                border: "1px solid #e6ecf4",
                bgcolor: "#fcfdff",
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

          {/* ---- PERFORATION (body / stub split) ---- */}
          <Perforation />

          {/* ---- STUB ---- */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 3.5 }, pt: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 } }}>
            <SectionHeading icon={<FlightLandIcon sx={{ fontSize: 15 }} />}>
              Boarding essentials
            </SectionHeading>

            <Grid container spacing={{ xs: 1, sm: 1.5 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent="#0891b2" icon={<FlightTakeoffIcon sx={{ fontSize: 15 }} />} label="Gate" value={gateDep} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent="#059669" icon={<TimelineIcon sx={{ fontSize: 15 }} />} label="Boarding" value={boardingTime} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent={NAVY} icon={<EventSeatIcon sx={{ fontSize: 15 }} />} label="Seat" value={seat} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoTile align="center" accent="#b45309" icon={<ConfirmationNumberIcon sx={{ fontSize: 15 }} />} label="Group" value={boardGroup} />
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
                borderRadius: 3,
                bgcolor: alpha(NAVY, 0.035),
                border: `1px dashed ${alpha(NAVY, 0.2)}`,
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
              <ModernBarcode />
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
              <Typography sx={{ color: "#64748b", fontSize: { xs: "0.5rem", sm: "0.68rem" }, mt: 0.5 }}>
                Scan for mobile boarding • {tripType} • {flightDate}
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

          {/* Footer */}
          <Box
            sx={{
              bgcolor: "#f7f9fc",
              borderTop: "1px solid #e6ecf4",
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 1.75 },
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#94a3b8", fontSize: { xs: "0.5rem", sm: "0.68rem" }, lineHeight: 1.5 }}>
              Please arrive at the gate at least 30 minutes before departure • Have your ID ready
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.25, sm: 1.5 },
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            maxWidth: 660,
            px: { xs: 1, sm: 0 },
            mt: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            fullWidth
            sx={{
              flex: 1,
              minWidth: { sm: 165 },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderRadius: 3,
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 700,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              bgcolor: alpha("#ffffff", 0.7),
              "&:hover": { borderColor: NAVY, color: NAVY, bgcolor: "#ffffff" },
            }}
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/track")}
            variant="outlined"
            startIcon={<TravelExploreIcon />}
            fullWidth
            sx={{
              flex: 1,
              minWidth: { sm: 165 },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderRadius: 3,
              borderColor: NAVY,
              color: NAVY,
              fontWeight: 700,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": { bgcolor: alpha(NAVY, 0.06), borderColor: NAVY },
            }}
          >
            Track a Flight
          </Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            startIcon={<DownloadIcon />}
            fullWidth
            sx={{
              flex: 1.4,
              minWidth: { sm: 200 },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderRadius: 3,
              background: "linear-gradient(135deg, #0f2b5e 0%, #1e4a8b 55%, #2e6bb5 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              boxShadow: "0 14px 26px -12px rgba(15, 43, 94, 0.7)",
              "&:hover": {
                background: "linear-gradient(135deg, #0a2a5a 0%, #1a3f77 55%, #28619f 100%)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Download Boarding Pass
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default BoardingPass;