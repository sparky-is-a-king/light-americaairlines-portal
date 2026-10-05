import React, { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Fade,
  Grow,
  Zoom,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Link } from "react-router-dom";
import { FlightCard, flights } from "../components/FlightCard";
import {
  FlightTakeoff,
  FlightLand,
  LocationOn,
  ArrowForward,
  PlayCircleOutline,
  TrendingUp,
  Shield,
  Star,
  CalendarToday
} from "@mui/icons-material";
import womanImage from "../assets/images/lady.PNG";
import { keyframes } from "@mui/system";

// Animation keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideInFromRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeInUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const bounceScroll = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(30px); opacity: 0; }
`;

const carouselImages = [
  "https://images.unsplash.com/photo-1503424886307-b090341d25d1?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&w=2000&q=80",
  "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=2000&q=80",
];

const popularDestinations = [
  { city: "New York", code: "JFK", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300&q=80", deals: 24 },
  { city: "Los Angeles", code: "LAX", image: "https://images.unsplash.com/photo-1515896769750-31548aa180f9?auto=format&fit=crop&w=300&q=80", deals: 18 },
  { city: "Miami", code: "MIA", image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=300&q=80", deals: 32 },
  { city: "Chicago", code: "ORD", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80", deals: 15 },
  { city: "London", code: "LHR", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80", deals: 28 },
  { city: "Tokyo", code: "NRT", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80", deals: 21 },
  { city: "Dubai", code: "DXB", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80", deals: 19 },
  { city: "Sydney", code: "SYD", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=300&q=80", deals: 16 },
];

const features = [
  { icon: "⚡", title: "Instant Booking", desc: "Get confirmed tickets in minutes" },
  { icon: "🛡️", title: "Flexible Cancellation", desc: "Free cancellation up to 24 hours" },
  { icon: "💰", title: "Best Price Guarantee", desc: "We'll match any lower price" },
  { icon: "📱", title: "Mobile App", desc: "Book & track flights on the go" },
];

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [searchValues, setSearchValues] = useState({
    from: "",
    to: "",
    date: "",
    travelers: 1
  });
  const [appliedSearch, setAppliedSearch] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-form");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchChange = (field) => (event) => {
    setSearchValues({ ...searchValues, [field]: event.target.value });
  };

  const matchesQuery = (flight, query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return true;
    return [flight.airline, flight.from, flight.to].some((field) =>
      String(field || "").toLowerCase().includes(q)
    );
  };

  const visibleFlights = flights.filter(
    (flight) =>
      matchesQuery(flight, appliedSearch?.from) && matchesQuery(flight, appliedSearch?.to)
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setAppliedSearch({ from: searchValues.from, to: searchValues.to });
    // Keep the flow going: bring the results into view.
    setTimeout(() => {
      document
        .getElementById("available-flights")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleClearSearch = () => {
    setAppliedSearch(null);
    setSearchValues({ from: "", to: "", date: "", travelers: 1 });
  };

  // Choosing a listed flight pre-fills the search form so the user can continue.
  const handleBook = (flight) => {
    setSearchValues((prev) => ({ ...prev, from: flight.from, to: flight.to }));
    scrollToBooking();
  };

  const getHeroFontSize = () => {
    if (isMobile) return "2rem";
    if (isTablet) return "2.8rem";
    return "3.5rem";
  };

  const getSubtitleFontSize = () => {
    if (isMobile) return "0.9rem";
    if (isTablet) return "1.1rem";
    return "1.3rem";
  };

  return (
    <Box sx={{ 
      // See App.jsx: "clip" keeps this a plain box instead of a scroll container,
      // so full-width sections line up with the navbar edge.
      overflowX: "clip", 
      width: "100%",
      maxWidth: "100%",
      minHeight: "100vh",
      bgcolor: "#ffffff"
    }}>
      {/* Airport Image Carousel - FULL WIDTH */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          height: { xs: "12vh", sm: "13vh", md: "14vh", lg: "15vh" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${carouselImages[currentImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: { xs: "12px", md: "20px" },
            transition: "background-image 1s ease-in-out",
          }}
        />
      </Box>

      {/* Enhanced Hero Section - FULL WIDTH */}
      <Box
        id="hero-section"
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          mt: { xs: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { 
              xs: "85vh", 
              sm: "90vh", 
              md: "95vh", 
              lg: "100vh" 
            },
            minHeight: { xs: "600px", sm: "650px", md: "700px", lg: "750px" },
            background: `
              linear-gradient(135deg, 
                rgba(10, 50, 120, 0.97) 0%, 
                rgba(20, 90, 180, 0.95) 40%, 
                rgba(40, 120, 220, 0.92) 80%, 
                rgba(60, 150, 250, 0.9) 100%),
              url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "16px", md: "24px" },
            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(45deg, transparent 60%, rgba(255,255,255,0.1) 100%)",
              zIndex: 1,
            },
          }}
        >
          {/* Animated Background Elements */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {[...Array(10)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: Math.random() * 60 + 30,
                  height: Math.random() * 60 + 30,
                  background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.2}) 0%, transparent 70%)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${floatAnimation} ${Math.random() * 10 + 10}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`,
                  display: { xs: "none", sm: "block" }
                }}
              />
            ))}
          </Box>

          {/* Floating Aircraft */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: "5%", sm: "8%", md: "10%" },
              top: { xs: "25%", sm: "28%", md: "30%" },
              animation: `${floatAnimation} 6s infinite ease-in-out`,
              zIndex: 2,
            }}
          >
            <FlightTakeoff sx={{ 
              fontSize: { xs: 40, sm: 50, md: 60, lg: 80 }, 
              color: "rgba(255,255,255,0.9)" 
            }} />
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: { xs: "10%", sm: "12%", md: "15%" },
              bottom: { xs: "15%", sm: "18%", md: "20%" },
              animation: `${floatAnimation} 8s infinite ease-in-out`,
              animationDelay: "1s",
              zIndex: 2,
            }}
          >
            <FlightLand sx={{ 
              fontSize: { xs: 30, sm: 40, md: 50, lg: 60 }, 
              color: "rgba(255,255,255,0.7)" 
            }} />
          </Box>

          {/* Corporate Woman Image */}
          <Fade in={true} timeout={1000}>
            <Box
              component="img"
              src={womanImage}
              alt="Professional Traveler"
              sx={{
                position: "absolute",
                left: { xs: "-15%", sm: "-10%", md: "-5%", lg: "5%" },
                bottom: 0,
                height: { 
                  xs: "65%", 
                  sm: "70%", 
                  md: "80%", 
                  lg: "90%" 
                },
                zIndex: 3,
                filter: "drop-shadow(-20px 20px 30px rgba(0,0,0,0.3))",
                animation: `${slideInFromLeft} 1s ease-out`,
                objectFit: "contain",
                maxWidth: { xs: "70%", sm: "60%", md: "50%", lg: "45%" },
              }}
            />
          </Fade>

          {/* Main Content - CENTERED */}
          <Container 
            sx={{ 
              position: "relative", 
              zIndex: 4,
              animation: `${slideInFromRight} 1s ease-out`,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-end" },
              textAlign: { xs: "center", md: "right" },
            }}
          >
            {/* On phones and tablets the hero copy centres; from md up it sits
                right, opposite the traveller image. `mr: auto` is what keeps it
                centred below md — `ml: auto` alone would push it hard right. */}
            <Box sx={{ maxWidth: { xs: "100%", sm: "90%", md: "550px", lg: "600px" }, ml: "auto", mr: { xs: "auto", md: 0 } }}>
              {/* Badge */}
              <Grow in={true} timeout={800}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    mb: { xs: 2, sm: 3 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.3)",
                    width: "fit-content",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ 
                    color: "#ffffff", 
                    fontWeight: 700, 
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                  }}>
                    ⭐ 4.9/5 RATED BY 50K+ TRAVELERS
                  </Typography>
                  <Star sx={{ color: "#FFD700", fontSize: { xs: 14, sm: 16 } }} />
                </Box>
              </Grow>

              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: { xs: 2, sm: 3 },
                  fontSize: getHeroFontSize(),
                  color: "#FFFFFF",
                  textShadow: "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.6)",
                  lineHeight: { xs: 1.1, sm: 1.2, md: 1.1 },
                }}
              >
                Elevate Your
                <Box component="span" sx={{ 
                  display: "block", 
                  color: "#FFD700",
                  textShadow: "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.6)",
                }}>
                  Journey Experience
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  mb: { xs: 3, sm: 4 },
                  color: "#FFFFFF",
                  fontSize: getSubtitleFontSize(),
                  fontWeight: 500,
                  lineHeight: { xs: 1.5, sm: 1.6 },
                  textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                Fly with confidence. Track in real-time. Experience premium service across 500+ destinations worldwide.
              </Typography>

              {/* Stats */}
              <Box sx={{ 
                display: "flex", 
                gap: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
                mb: { xs: 3, sm: 4, md: 5 }, 
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-end" },
              }}>
                {[
                  { value: "500+", label: "Destinations" },
                  { value: "24/7", label: "Support" },
                  { value: "99.8%", label: "On-time Rate" },
                  { value: "1M+", label: "Happy Travelers" },
                ].map((stat, index) => (
                  <Zoom in={true} timeout={1000} key={index} style={{ transitionDelay: `${index * 200}ms` }}>
                    <Box sx={{ 
                      minWidth: { xs: "70px", sm: "80px" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "center", md: "flex-end" },
                      bgcolor: "rgba(0, 0, 0, 0.3)",
                      backdropFilter: "blur(5px)",
                      borderRadius: 2,
                      p: { xs: 0.5, sm: 1 },
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                      <Typography variant="h4" sx={{ 
                        color: "#FFD700", 
                        fontWeight: 800, 
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: "#FFFFFF", 
                        fontWeight: 600,
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                      }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Zoom>
                ))}
              </Box>

              {/* CTA Buttons */}
              <Box sx={{ 
                display: "flex", 
                gap: { xs: 1.5, sm: 2 }, 
                flexWrap: "wrap", 
                mb: { xs: 3, sm: 4 },
                justifyContent: { xs: "center", md: "flex-end" },
              }}>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={scrollToBooking}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: { xs: 2.5, sm: 3, md: 4 },
                    py: { xs: 1.25, sm: 1.5, md: 1.8 },
                    fontWeight: 700,
                    borderRadius: 3,
                    background: "linear-gradient(45deg, #FFD700 0%, #FFA500 100%)",
                    color: "#0a2a5a",
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" },
                    textShadow: "0 1px 2px rgba(255,255,255,0.3)",
                    animation: `${pulseAnimation} 2s infinite`,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    '&:hover': {
                      background: "linear-gradient(45deg, #FFC107 0%, #FF8C00 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
                    },
                    minWidth: { xs: "140px", sm: "150px", md: "160px" },
                  }}
                >
                  Book Flight
                </Button>

                <Button
                  component={Link}
                  to="/track"
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  startIcon={<PlayCircleOutline />}
                  sx={{
                    px: { xs: 2.5, sm: 3, md: 4 },
                    py: { xs: 1.25, sm: 1.5, md: 1.8 },
                    fontWeight: 700,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#0a2a5a",
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" },
                    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                    border: "2px solid #FFD700",
                    '&:hover': {
                      background: "#FFFFFF",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
                      border: "2px solid #FFA500",
                    },
                    minWidth: { xs: "140px", sm: "150px", md: "160px" },
                  }}
                >
                  Track Flight
                </Button>
              </Box>

              {/* Trust Indicators */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: { xs: 1.5, sm: 2, md: 3 }, 
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-end" },
                bgcolor: "rgba(0, 0, 0, 0.25)",
                backdropFilter: "blur(5px)",
                borderRadius: 3,
                p: { xs: 1, sm: 1.5 },
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5, 
                  flexDirection: { xs: "row", md: "row-reverse" }
                }}>
                  <Typography variant="body2" sx={{ 
                    color: "#FFFFFF", 
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                  }}>
                    Best Price Guarantee
                  </Typography>
                  <TrendingUp sx={{ 
                    color: "#FFD700", 
                    fontSize: { xs: 16, sm: 18, md: 20, lg: 24 },
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                  }} />
                </Box>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5, 
                  flexDirection: { xs: "row", md: "row-reverse" }
                }}>
                  <Typography variant="body2" sx={{ 
                    color: "#FFFFFF", 
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                  }}>
                    Secure Booking
                  </Typography>
                  <Shield sx={{ 
                    color: "#4CAF50", 
                    fontSize: { xs: 16, sm: 18, md: 20, lg: 24 },
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                  }} />
                </Box>
              </Box>
            </Box>
          </Container>

          {/* Scroll Indicator */}
          {!isMobile && (
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 4,
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ 
                  color: "#FFFFFF", 
                  display: "block", 
                  mb: 1, 
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  bgcolor: "rgba(0,0,0,0.3)",
                  backdropFilter: "blur(5px)",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                Scroll to explore
              </Typography>
              <Box
                sx={{
                  width: 2,
                  height: 50,
                  bgcolor: "rgba(255,255,255,0.3)",
                  mx: "auto",
                  position: "relative",
                  '&::after': {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "30%",
                    bgcolor: "#FFD700",
                    animation: `${bounceScroll} 2s infinite`,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Book Your Flight Section - CENTERED */}
      <Container 
        id="booking-form" 
        maxWidth="lg"
        sx={{ 
          py: { xs: 4, sm: 5, md: 6 }, 
          animation: `${fadeInUp} 0.8s ease-out`,
          px: { xs: 2, sm: 3, md: 4 },
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4 },
            textAlign: "center",
            color: "#0d47a1",
            fontWeight: 700,
            fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" }
          }}
        >
          Book Your Flight
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1.5, sm: 2 },
            justifyContent: "center",
            alignItems: "center",
            mb: { xs: 4, sm: 5, md: 6 },
            bgcolor: "#f5f5f5",
            p: { xs: 1.5, sm: 2, md: 3 },
            borderRadius: { xs: 2, md: 3 },
            boxShadow: "0 8px 25px rgba(13, 71, 161, 0.1)",
            width: "100%",
          }}
        >
          <TextField
            label="From"
            placeholder="e.g. JKIA"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            value={searchValues.from}
            onChange={handleSearchChange("from")}
            sx={{ 
              minWidth: { xs: "100%", sm: 140 }, 
              bgcolor: "white",
              flex: 1
            }}
            InputProps={{
              startAdornment: (
                <LocationOn sx={{ color: "#0d47a1", mr: 1 }} />
              ),
            }}
          />
          <TextField
            label="To"
            placeholder="e.g. CGK"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            value={searchValues.to}
            onChange={handleSearchChange("to")}
            sx={{ 
              minWidth: { xs: "100%", sm: 140 }, 
              bgcolor: "white",
              flex: 1
            }}
            InputProps={{
              startAdornment: (
                <FlightTakeoff sx={{ color: "#0d47a1", mr: 1 }} />
              ),
            }}
          />
          <TextField
            label="Departure Date"
            type="date"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            value={searchValues.date}
            onChange={handleSearchChange("date")}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              minWidth: { xs: "100%", sm: 160 }, 
              bgcolor: "white",
              flex: 1
            }}
            InputProps={{
              startAdornment: (
                <CalendarToday sx={{ color: "#0d47a1", mr: 1 }} />
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size={isMobile ? "medium" : "large"}
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              bgcolor: "#1976d2",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 3,
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: 140 },
              '&:hover': { 
                bgcolor: "#0d47a1",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(13, 71, 161, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Search Flights
          </Button>
        </Box>

        {/* Popular Global Destinations */}
        <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between", 
            // "stretch" (not "flex-start") so the heading block fills the full
            // width on phones: in a column flex box, flex-start shrinks it to its
            // content, which wraps the heading early and leaves a gap on the right.
            alignItems: { xs: "stretch", sm: "center" }, 
            mb: { xs: 3, sm: 4 },
            gap: { xs: 2, sm: 0 }
          }}>
            <Box>
              <Chip 
                label="🌍 Global Destinations" 
                sx={{ 
                  mb: { xs: 1, sm: 2 }, 
                  bgcolor: "rgba(13, 71, 161, 0.1)", 
                  color: "#0d47a1",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  py: { xs: 0.5, sm: 1 }
                }} 
              />
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: "#1e293b", 
                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" } 
              }}>
                Popular Destinations Worldwide
              </Typography>
              <Typography variant="body1" sx={{ 
                color: "#64748b", 
                mt: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" }
              }}>
                Discover amazing flight deals across the globe
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              sx={{ 
                color: "#0d47a1", 
                borderColor: "#0d47a1",
                fontWeight: 600,
                borderRadius: 3,
                mt: { xs: 1, sm: 0 },
                '&:hover': {
                  bgcolor: "rgba(13, 71, 161, 0.1)",
                  transform: "translateY(-2px)",
                }
              }}
            >
              View All →
            </Button>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {popularDestinations.map((dest, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card sx={{ 
                  borderRadius: { xs: 2, sm: 3 }, 
                  overflow: "hidden",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  '&:hover': {
                    transform: "translateY(-8px)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                  }
                }}>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={dest.image}
                      alt={dest.city}
                      sx={{ 
                        transition: "transform 0.3s ease",
                        height: { xs: 160, sm: 180 },
                        '&:hover': {
                          transform: "scale(1.1)"
                        }
                      }}
                    />
                    <Box sx={{ 
                      position: "absolute", 
                      top: 12, 
                      right: 12,
                      bgcolor: "rgba(13, 71, 161, 0.9)",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontWeight: 600,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }
                    }}>
                      {dest.deals} deals
                    </Box>
                  </Box>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: "1rem", sm: "1.125rem" }
                        }}>
                          {dest.city}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: "#64748b",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" }
                        }}>
                          {dest.code} Airport
                        </Typography>
                      </Box>
                      <IconButton sx={{ 
                        color: "#0d47a1", 
                        p: { xs: 0.5, sm: 1 },
                        '&:hover': { bgcolor: "rgba(13, 71, 161, 0.1)" } 
                      }}>
                        <LocationOn sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Available Flights */}
        <Box
          id="available-flights"
          sx={{ animation: `${fadeInUp} 0.8s ease-out`, scrollMarginTop: { xs: "80px", md: "90px" } }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 2.5 },
              textAlign: "center",
              color: "#0d47a1",
              fontWeight: 700,
              fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" }
            }}
          >
            Available Flights
          </Typography>

          {(appliedSearch?.from || appliedSearch?.to) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1, sm: 1.5 },
                flexWrap: "wrap",
                mb: { xs: 2.5, sm: 3 },
              }}
            >
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                Showing {visibleFlights.length} of {flights.length} flights
              </Typography>
              {appliedSearch.from && (
                <Chip
                  size="small"
                  label={`From: ${appliedSearch.from}`}
                  onDelete={handleClearSearch}
                  sx={{ bgcolor: "rgba(13, 71, 161, 0.08)", color: "#0d47a1", fontWeight: 600 }}
                />
              )}
              {appliedSearch.to && (
                <Chip
                  size="small"
                  label={`To: ${appliedSearch.to}`}
                  onDelete={handleClearSearch}
                  sx={{ bgcolor: "rgba(13, 71, 161, 0.08)", color: "#0d47a1", fontWeight: 600 }}
                />
              )}
              <Button size="small" onClick={handleClearSearch} sx={{ textTransform: "none", fontWeight: 600 }}>
                Clear search
              </Button>
            </Box>
          )}

          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: { xs: 1, sm: 1.5 },
            alignItems: "center",
            width: "100%"
          }}>
            {visibleFlights.map((flight, index) => (
              <Box key={index} sx={{ width: "100%" }}>
                <FlightCard flight={flight} onBook={handleBook} />
              </Box>
            ))}

            {visibleFlights.length === 0 && (
              <Box
                sx={{
                  width: "100%",
                  textAlign: "center",
                  py: { xs: 5, sm: 6 },
                  px: 2,
                  borderRadius: 3,
                  bgcolor: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700, mb: 1 }}>
                  No flights match your search
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                  Try another airport code, or clear the filters to see every available route.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleClearSearch}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 4,
                    bgcolor: "#0d47a1",
                    "&:hover": { bgcolor: "#08306b" },
                  }}
                >
                  Clear search
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Features Section - CENTERED */}
      <Box sx={{ 
        bgcolor: "rgba(13, 71, 161, 0.02)", 
        py: { xs: 6, sm: 7, md: 8 }, 
        animation: `${fadeInUp} 0.8s ease-out`,
        width: "100%",
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: "center", 
              mb: { xs: 4, sm: 5, md: 6 }, 
              fontWeight: 800, 
              color: "#1e293b", 
              fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" }
            }}
          >
            Why Choose Aerospace?
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
          >
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{ 
                  textAlign: "center", 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: { xs: 2, sm: 3 },
                  bgcolor: "white",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    transform: "translateY(-5px)",
                    bgcolor: "rgba(13, 71, 161, 0.02)"
                  }
                }}>
                  <Typography variant="h3" sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    fontSize: { xs: "2rem", sm: "2.25rem", md: "2.5rem" } 
                  }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    mb: { xs: 1, sm: 1.5, md: 2 }, 
                    fontWeight: 700, 
                    color: "#1e293b",
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" }
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: "#64748b",
                    fontSize: { xs: "0.875rem", sm: "0.9rem", md: "1rem" }
                  }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;