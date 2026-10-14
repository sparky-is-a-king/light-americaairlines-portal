import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useLocale } from "../i18n";

const FlightCard = ({ flight, onBook }) => {
  const { t } = useLocale();
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "22px",
        border: "1px solid rgba(255, 255, 255, 0.85)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(16px) saturate(160%)",
        boxShadow: "0 10px 30px -16px rgba(10, 42, 90, 0.22)",
        width: "100%",
        overflow: "hidden",
        transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 20px 40px -18px rgba(10, 42, 90, 0.32)",
          borderColor: "rgba(13, 71, 161, 0.22)",
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
            borderRadius: "15px", /* iOS squircle-ish app-icon shape */
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
            background: "linear-gradient(135deg, #0a2a5a 0%, #0d47a1 55%, #1976d2 100%)",
            boxShadow: "0 8px 18px -10px rgba(13, 71, 161, 0.9), inset 0 1px 0 rgba(255,255,255,0.25)",
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
              {t("flight.from")}
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
              borderRadius: 999,
              textTransform: "none",
              background: "linear-gradient(135deg, #0a2a5a 0%, #0d47a1 100%)",
              boxShadow: "0 8px 18px -10px rgba(13, 71, 161, 0.9)",
              "&:hover": { background: "linear-gradient(135deg, #081f45 0%, #0a2a5a 100%)" },
            }}
          >
            {t("flight.book")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export { FlightCard };
