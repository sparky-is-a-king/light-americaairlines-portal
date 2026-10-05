import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  Modal,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
  LinearProgress,
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FlightTakeoff,
  FlightLand,
  AirplanemodeActive,
  Refresh,
  QrCodeScanner,
  Map,
  Timeline,
  Notifications,
  Download,
  Share,
  Close,
  CheckCircle,
  Schedule,
  RadioButtonUnchecked,
  Cloud,
  Speed,
  Height,
  WbSunny,
  Opacity,
  Flight,
  AccessTime,
  Info,
  ArrowBack,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

// ==================== MOCK DATA (fallback for other flights) ====================
const MOCK_FLIGHTS = {
  "SQ408": {
    id: "SQ408",
    airline: "Singapore Airlines",
    flightNumber: "SQ408",
    from: {
      code: "SIN",
      city: "Singapore",
    },
    to: {
      code: "LHR",
      city: "London",
    },
    aircraft: "Airbus A380-800",
    departure: {
      scheduled: "2024-03-20T23:55:00",
      terminal: "3",
      gate: "A1",
    },
    arrival: {
      scheduled: "2024-03-21T06:35:00",
      terminal: "2",
      gate: "B44",
    },
    duration: "13h 45m",
    distance: "10874 km",
    status: "SCHEDULED",
    statusDetails: "On time",
    progress: 0,
    timeline: [
      { time: "21:00", event: "Check-in opens", status: "completed" },
      { time: "22:00", event: "Boarding starts", status: "upcoming" },
      { time: "23:45", event: "Gate closes", status: "upcoming" },
    ],
    lastUpdated: new Date().toISOString(),
  },
  "GA1028": {
    id: "GA1028",
    airline: "Garuda Indonesia",
    flightNumber: "GA1028",
    from: {
      code: "CGK",
      city: "Jakarta",
    },
    to: {
      code: "DPS",
      city: "Denpasar",
    },
    aircraft: "Boeing 737-800",
    departure: {
      scheduled: "2024-03-20T09:00:00",
      terminal: "2",
      gate: "C5",
    },
    arrival: {
      scheduled: "2024-03-20T11:30:00",
      terminal: "D",
      gate: "8",
    },
    duration: "1h 30m",
    distance: "983 km",
    status: "SCHEDULED",
    statusDetails: "On time",
    progress: 0,
    timeline: [],
    lastUpdated: new Date().toISOString(),
  },
};

// ==================== UTILITY FUNCTIONS ====================
const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const getStatusColor = (status) => {
  const colors = {
    SCHEDULED: "info",
    BOARDING: "warning",
    IN_FLIGHT: "success",
    DELAYED: "error",
    LANDED: "secondary",
    CANCELLED: "error",
  };
  return colors[status] || "default";
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'IN_FLIGHT': return <Flight />;
    case 'SCHEDULED': return <Schedule />;
    case 'BOARDING': return <AirplanemodeActive />;
    case 'LANDED': return <FlightLand />;
    default: return <Info />;
  }
};

// ==================== COMPONENTS ====================
const FlightTimeline = ({ events }) => {
  const getEventIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'current': return <Schedule sx={{ color: '#2196f3', fontSize: 20 }} />;
      default: return <RadioButtonUnchecked sx={{ color: '#9e9e9e', fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'current': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ position: 'relative', ml: 2 }}>
      {events.map((event, index) => (
        <Box key={index} sx={{ mb: 3, position: 'relative' }}>
          <Box sx={{ position: 'absolute', left: -28, top: 4 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: getStatusColor(event.status),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              zIndex: 2,
            }}>
              {getEventIcon(event.status)}
            </Box>
            {index < events.length - 1 && (
              <Box sx={{
                position: 'absolute',
                top: 32,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 2,
                height: 50,
                bgcolor: getStatusColor(event.status),
                opacity: 0.3,
              }} />
            )}
          </Box>
          
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              ml: 4,
              border: '1px solid',
              borderColor: event.status === 'current' ? 'primary.main' : 'divider',
              bgcolor: event.status === 'current' ? alpha('#2196f3', 0.05) : 'background.paper',
            }}
          >
            <Typography variant="body2" fontWeight="600">
              {event.event}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {event.time}
              </Typography>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

const FlightMapVisualization = ({ from, to, progress }) => {
  return (
    <Box sx={{ 
      height: { xs: 300, md: 400 },
      borderRadius: 2, 
      position: 'relative',
      bgcolor: alpha('#1976d2', 0.03),
      border: '1px solid',
      borderColor: 'divider',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 30%, ${alpha('#2196f3', 0.1)} 0%, transparent 30%),
                    radial-gradient(circle at 80% 70%, ${alpha('#4caf50', 0.1)} 0%, transparent 30%)`,
      }} />

      <Box sx={{
        position: 'absolute',
        top: '40%',
        left: '10%',
        width: '80%',
        height: '20%',
        border: '2px dashed',
        borderColor: alpha('#2196f3', 0.3),
        borderRadius: '50%',
      }} />

      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: `${10 + (progress * 0.8)}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
      }}>
        <Paper
          elevation={3}
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flight sx={{ color: 'white' }} />
        </Paper>
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'primary.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {progress}% Complete
        </Typography>
      </Box>

      <Box sx={{
        position: 'absolute',
        left: '10%',
        top: '40%',
        textAlign: 'center',
      }}>
        <Paper sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 1,
        }}>
          <FlightTakeoff fontSize="small" />
        </Paper>
        <Typography variant="caption" fontWeight="600" display="block">
          {from.code}
        </Typography>
      </Box>

      <Box sx={{
        position: 'absolute',
        right: '10%',
        top: '40%',
        textAlign: 'center',
      }}>
        <Paper sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'success.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 1,
        }}>
          <FlightLand fontSize="small" />
        </Paper>
        <Typography variant="caption" fontWeight="600" display="block">
          {to.code}
        </Typography>
      </Box>
    </Box>
  );
};

const QRScannerModal = ({ open, onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      // ✅ SCAN THE CORRECT ID: DL80289608
      onScan("DL80289608");
      setScanning(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          outline: 'none',
        }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="700">
                Scan QR Code
              </Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            
            <Box sx={{ 
              width: '100%', 
              height: 300, 
              bgcolor: '#1a1a1a',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              mb: 2,
            }}>
              {scanning ? (
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={48} sx={{ color: 'white' }} />
                  <Typography sx={{ color: 'white', mt: 2 }}>
                    Scanning...
                  </Typography>
                </Box>
              ) : (
                <>
                  <QrCodeScanner sx={{ fontSize: 80, color: alpha('#fff', 0.3) }} />
                  <Box sx={{
                    position: 'absolute',
                    width: 180,
                    height: 180,
                    border: '2px solid',
                    borderColor: alpha('#fff', 0.5),
                    borderRadius: 2,
                  }} />
                </>
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
              Position the QR code from your boarding pass within the frame
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSimulateScan}
              disabled={scanning}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              {scanning ? 'Scanning...' : 'Scan QR Code'}
            </Button>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};

// ==================== MAIN COMPONENT ====================
const TrackFlightPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  const [flightNumber, setFlightNumber] = useState("");
  const [trackedFlight, setTrackedFlight] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [shareDialog, setShareDialog] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const flightParam = params.get('flight');
    if (flightParam) {
      setFlightNumber(flightParam.toUpperCase());
      setTimeout(() => handleTrack(flightParam.toUpperCase()), 500);
    }
  }, [location]);

  useEffect(() => {
    let interval;
    if (trackedFlight && autoRefresh && !trackedFlight.isBoardingPass) {
      interval = setInterval(updateFlightStatus, 30000);
    }
    return () => clearInterval(interval);
  }, [trackedFlight, autoRefresh]);

  const updateFlightStatus = () => {
    if (!trackedFlight || trackedFlight.isBoardingPass) return;
    const updatedFlight = { ...trackedFlight };
    if (updatedFlight.status === "IN_FLIGHT" && updatedFlight.progress < 100) {
      updatedFlight.progress = Math.min(100, updatedFlight.progress + 2);
      updatedFlight.lastUpdated = new Date().toISOString();
      if (updatedFlight.progress === 100) {
        updatedFlight.status = "LANDED";
        showNotification(`Flight ${updatedFlight.flightNumber} has landed!`, "success");
      }
    }
    setTrackedFlight(updatedFlight);
  };

  const handleTrack = async (flightNum = null) => {
    const input = (flightNum || flightNumber).trim().toUpperCase();
    if (!input) {
      setError("Please enter a flight number");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 🔍 Search by id, ticket_number, or flight_number
      console.log("Searching for:", input);
      
      const { data: flightData, error: supabaseError } = await supabase
        .from("flights")
        .select("id, ticket_number, flight_number")
        .or(`id.ilike.${input},ticket_number.ilike.${input},flight_number.ilike.${input}`)
        .maybeSingle();

      console.log("Supabase result:", flightData, supabaseError);

      if (!supabaseError && flightData) {
        showNotification(`Flight ${input} found! Redirecting to boarding pass...`, "success");
        navigate(`/boarding-pass/${flightData.id}`);
        setLoading(false);
        return;
      }

      // Fallback to mock data
      if (MOCK_FLIGHTS[input]) {
        const flightData = { ...MOCK_FLIGHTS[input], isBoardingPass: false };
        setTrackedFlight(flightData);
        navigate(`/track?flight=${input}`, { replace: true });
        showNotification(`Flight ${input} found successfully!`, "success");
      } else {
        setError("Flight not found. Please check and try again.");
        showNotification("Flight not found", "error");
      }
    } catch (err) {
      console.error("Error checking Supabase:", err);
      setError("Network error. Please try again.");
      showNotification("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (result) => {
    setFlightNumber(result);
    handleTrack(result);
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleTrack();
  };

  const clearTrackedFlight = () => {
    setTrackedFlight(null);
    setFlightNumber("");
    navigate("/track");
  };

  // ==================== RENDER ====================
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 }, px: { xs: 1, sm: 0 } }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="800">
            Flight Tracker
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Search */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 24 }}>
              <Typography variant="h6" gutterBottom fontWeight="700" sx={{ mb: 3 }}>
                Track Your Flight
              </Typography>
              
              <TextField
                inputRef={inputRef}
                fullWidth
                label="Flight Number"
                variant="outlined"
                value={flightNumber}
                onChange={(e) => {
                  setFlightNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AirplanemodeActive color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Scan QR Code">
                        <IconButton onClick={() => setShowQRScanner(true)}>
                          <QrCodeScanner />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                placeholder="e.g., DL80289608, AA173, or AA173-001"
                sx={{ mb: 2 }}
                error={!!error}
                helperText={error}
                size={isMobile ? "small" : "medium"}
              />
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleTrack()}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: "700", mb: 2 }}
              >
                {loading ? "Searching..." : "Track Flight"}
              </Button>

              {trackedFlight && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<Notifications />} size="small" onClick={() => showNotification("Alert set for this flight!", "info")}>
                        Alert
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<Share />} size="small" onClick={() => setShareDialog(true)}>
                        Share
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<Download />} size="small" onClick={() => showNotification("PDF downloaded!", "success")}>
                        PDF
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<Refresh />} size="small" onClick={updateFlightStatus}>
                        Refresh
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Flight Details */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {trackedFlight ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: alpha('#1976d2', 0.02), borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                            {trackedFlight.airline[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="800">
                              {trackedFlight.airline}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {trackedFlight.flightNumber} • {trackedFlight.aircraft}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={getStatusIcon(trackedFlight.status)}
                            label={trackedFlight.status.replace('_', ' ')}
                            color={getStatusColor(trackedFlight.status)}
                            sx={{ fontWeight: 600 }}
                          />
                          <Tooltip title="Clear flight">
                            <IconButton size="small" onClick={clearTrackedFlight}>
                              <Close fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                            {trackedFlight.from.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trackedFlight.from.city}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(trackedFlight.departure.scheduled)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <FlightTakeoff sx={{ transform: 'rotate(90deg)', color: 'primary.main', fontSize: 30 }} />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {trackedFlight.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                            {trackedFlight.to.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trackedFlight.to.city}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(trackedFlight.arrival.scheduled)}
                          </Typography>
                        </Box>
                      </Box>

                      {trackedFlight.statusDetails && (
                        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                          {trackedFlight.statusDetails}
                        </Alert>
                      )}
                    </Box>

                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <ToggleButtonGroup value={viewMode} exclusive onChange={(e, newMode) => newMode && setViewMode(newMode)} size={isMobile ? "small" : "medium"}>
                        <ToggleButton value="overview">Overview</ToggleButton>
                        <ToggleButton value="timeline"><Timeline sx={{ mr: 1 }} />Timeline</ToggleButton>
                        <ToggleButton value="map"><Map sx={{ mr: 1 }} />Map</ToggleButton>
                      </ToggleButtonGroup>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip label="Auto-refresh" color={autoRefresh ? "primary" : "default"} onClick={() => setAutoRefresh(!autoRefresh)} size="small" />
                      </Box>
                    </Box>

                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                      {viewMode === "overview" && (
                        <Box>
                          {trackedFlight.progress > 0 && (
                            <Box sx={{ mb: 4 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Flight Progress</Typography>
                                <Typography variant="body2" fontWeight="600">{trackedFlight.progress}%</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={trackedFlight.progress} sx={{ height: 8, borderRadius: 4, bgcolor: alpha('#1976d2', 0.1) }} />
                            </Box>
                          )}
                          <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                <Speed sx={{ color: 'primary.main', mb: 1 }} />
                                <Typography variant="caption" color="text.secondary" display="block">Speed</Typography>
                                <Typography variant="h6" fontWeight="700">{trackedFlight.speed || '0'} km/h</Typography>
                              </Paper>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                <Height sx={{ color: 'primary.main', mb: 1 }} />
                                <Typography variant="caption" color="text.secondary" display="block">Altitude</Typography>
                                <Typography variant="h6" fontWeight="700">{trackedFlight.altitude?.toLocaleString() || '0'} ft</Typography>
                              </Paper>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                <Flight sx={{ color: 'primary.main', mb: 1 }} />
                                <Typography variant="caption" color="text.secondary" display="block">Distance</Typography>
                                <Typography variant="h6" fontWeight="700">{trackedFlight.distance}</Typography>
                              </Paper>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                <AccessTime sx={{ color: 'primary.main', mb: 1 }} />
                                <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
                                <Typography variant="h6" fontWeight="700">{trackedFlight.duration}</Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="h6" gutterBottom fontWeight="600">Departure</Typography>
                              <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Scheduled</Typography><Typography variant="body2" fontWeight="500">{formatTime(trackedFlight.departure.scheduled)}</Typography></Grid>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Estimated</Typography><Typography variant="body2" fontWeight="500">{formatTime(trackedFlight.departure.estimated || trackedFlight.departure.scheduled)}</Typography></Grid>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Terminal</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.departure.terminal}</Typography></Grid>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Gate</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.departure.gate}</Typography></Grid>
                                </Grid>
                              </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="h6" gutterBottom fontWeight="600">Arrival</Typography>
                              <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Scheduled</Typography><Typography variant="body2" fontWeight="500">{formatTime(trackedFlight.arrival.scheduled)}</Typography></Grid>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Estimated</Typography><Typography variant="body2" fontWeight="500">{formatTime(trackedFlight.arrival.estimated || trackedFlight.arrival.scheduled)}</Typography></Grid>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Terminal</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.arrival.terminal}</Typography></Grid>
                                  <Grid size={6}><Typography variant="caption" color="text.secondary">Gate</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.arrival.gate}</Typography></Grid>
                                  {trackedFlight.baggage && (
                                    <Grid size={12}><Typography variant="caption" color="text.secondary">Baggage Claim</Typography><Typography variant="body2" fontWeight="500">Carousel {trackedFlight.baggage.carousel} • {trackedFlight.baggage.claimTime}</Typography></Grid>
                                  )}
                                </Grid>
                              </Paper>
                            </Grid>
                          </Grid>
                          {trackedFlight.weather && (
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="h6" gutterBottom fontWeight="600">Weather</Typography>
                              <Grid container spacing={2}>
                                <Grid size={4}><Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}><WbSunny sx={{ color: '#f57c00', mb: 1 }} /><Typography variant="caption" color="text.secondary" display="block">Departure</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.weather.departure.condition}</Typography><Typography variant="body2" fontWeight="700">{trackedFlight.weather.departure.temperature}</Typography></Paper></Grid>
                                <Grid size={4}><Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}><Cloud sx={{ color: '#78909c', mb: 1 }} /><Typography variant="caption" color="text.secondary" display="block">Enroute</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.weather.enroute.condition}</Typography><Typography variant="body2" fontWeight="700">{trackedFlight.weather.enroute.temperature}</Typography></Paper></Grid>
                                <Grid size={4}><Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}><Opacity sx={{ color: '#2196f3', mb: 1 }} /><Typography variant="caption" color="text.secondary" display="block">Arrival</Typography><Typography variant="body2" fontWeight="500">{trackedFlight.weather.arrival.condition}</Typography><Typography variant="body2" fontWeight="700">{trackedFlight.weather.arrival.temperature}</Typography></Paper></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Box>
                      )}
                      {viewMode === "timeline" && trackedFlight.timeline && (
                        <Box><Typography variant="h6" gutterBottom fontWeight="600">Flight Timeline</Typography><FlightTimeline events={trackedFlight.timeline} /></Box>
                      )}
                      {viewMode === "map" && (
                        <Box><Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>Flight Path</Typography><FlightMapVisualization from={trackedFlight.from} to={trackedFlight.to} progress={trackedFlight.progress || 0} /></Box>
                      )}
                    </Box>
                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: alpha('#1976d2', 0.02) }}>
                      <Typography variant="caption" color="text.secondary">Last updated: {new Date(trackedFlight.lastUpdated).toLocaleTimeString()}</Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </AnimatePresence>
            ) : (
              <Paper sx={{ p: { xs: 4, sm: 6 }, textAlign: "center", borderRadius: 3, border: "2px dashed", borderColor: "divider", minHeight: { xs: 400, md: 500 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                  <AirplanemodeActive sx={{ fontSize: { xs: 60, md: 80 }, color: "action.disabled", mb: 3 }} />
                </motion.div>
                <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">No Flight Tracked</Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500 }}>Enter a flight number above to track real-time status, get live updates, and monitor your journey.</Typography>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={() => inputRef.current?.focus()} sx={{ mt: 2 }}>Search Flight</Button>
              </Paper>
            )}
          </Grid>
        </Grid>

        <QRScannerModal open={showQRScanner} onClose={() => setShowQRScanner(false)} onScan={handleQRScan} />
        <Modal open={shareDialog} onClose={() => setShareDialog(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 400 }, outline: 'none' }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">Share Flight</Typography>
              <TextField fullWidth value={window.location.href} variant="outlined" size="small" sx={{ mt: 2, mb: 2 }} InputProps={{ readOnly: true }} />
              <Button fullWidth variant="contained" onClick={() => { navigator.clipboard.writeText(window.location.href); showNotification("Link copied to clipboard!", "success"); setShareDialog(false); }}>Copy Link</Button>
            </Paper>
          </Box>
        </Modal>

        <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ borderRadius: 2 }}>{notification.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TrackFlightPage;