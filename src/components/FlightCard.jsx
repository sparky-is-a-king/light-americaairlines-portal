import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

// Updated flight data with realistic airlines
const flights = [
  { airline: "Delta Airlines", from: "JKIA", to: "ITIA", time: "14h 45m", price: "2100" },
  { airline: "British Airways", from: "DPS", to: "CGK", time: "10h 50m", price: "2020" },
  { airline: "Qatar Airways", from: "JKIA", to: "ITIA", time: "12h 30m", price: "1900" },
  { airline: "Emirates", from: "DPS", to: "CGK", time: "12h 15m", price: "2160" },
  { airline: "Ethiopian Airlines", from: "JKIA", to: "ITIA", time: "13h 10m", price: "1800" },
  { airline: "Aeroflot Russian Airlines", from: "DPS", to: "CGK", time: "13h 25m", price: "2800" },
  { airline: "Air Canada", from: "JKIA", to: "CGK", time: "14h 00m", price: "2200" },
  { airline: "Singapore Airlines", from: "DPS", to: "ITIA", time: "14h 30m", price: "2400" },
  { airline: "Qantas Airways", from: "JKIA", to: "CGK", time: "15h 15m", price: "2600" },
  { airline: "Turkish Airlines", from: "CGK", to: "ITIA", time: "15h 45m", price: "2800" },
];

const FlightCard = ({ flight, onBook }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e6ecf4",
        boxShadow: "0 4px 16px rgba(13, 71, 161, 0.06)",
        width: "100%",
        overflow: "hidden",
        transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 14px 30px rgba(13, 71, 161, 0.14)",
          borderColor: "rgba(13, 71, 161, 0.25)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
          flexWrap: { xs: "wrap", sm: "nowrap" },
          p: { xs: 1.75, sm: 2.25 },
          "&:last-child": { pb: { xs: 1.75, sm: 2.25 } },
        }}
      >
        {/* Airline badge */}
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
            background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 60%, #42a5f5 100%)",
            boxShadow: "0 8px 18px -10px rgba(13, 71, 161, 0.9)",
          }}
        >
          {flight.airline?.[0] || "A"}
        </Box>

        {/* Flight Info */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#1e293b", fontSize: { xs: "0.95rem", sm: "1.05rem" } }}
          >
            {flight.airline}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Typography sx={{ fontWeight: 700, color: "#0d47a1", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
              {flight.from}
            </Typography>
            <FlightTakeoffIcon sx={{ fontSize: 18, color: "#90a4ae" }} />
            <Typography sx={{ fontWeight: 700, color: "#0d47a1", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
              {flight.to}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: { xs: "0.75rem", sm: "0.8rem" }, ml: { xs: 0, sm: 1 } }}>
              • {flight.time}
            </Typography>
          </Box>
        </Box>

        {/* Price + action */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2 },
            ml: { xs: "auto", sm: 2 },
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em" }}>
              FROM
            </Typography>
            <Typography
              sx={{ fontWeight: 800, color: "#0d47a1", fontSize: { xs: "1rem", sm: "1.15rem" }, lineHeight: 1.2 }}
            >
              ${flight.price}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => onBook?.(flight)}
            sx={{
              px: { xs: 2.5, sm: 3 },
              py: 1,
              fontWeight: 700,
              borderRadius: 2.5,
              textTransform: "none",
              background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)",
              boxShadow: "0 8px 18px -10px rgba(13, 71, 161, 0.9)",
              "&:hover": { background: "linear-gradient(135deg, #08306b 0%, #0d47a1 100%)" },
            }}
          >
            Book
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export { FlightCard, flights };
