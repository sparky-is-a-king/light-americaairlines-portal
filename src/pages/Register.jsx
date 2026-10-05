import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  CircularProgress,
  IconButton,
  InputAdornment,
  keyframes,
  useMediaQuery,
  alpha,
  Container,
  Fade,
  Zoom,
  Alert,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { supabase } from "../supabaseClient";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Force root styles to fix mobile overlapping
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.maxWidth = "100%";
      root.style.padding = "0";
      root.style.margin = "0";
      root.style.overflowX = "clip";
    }
    const styleId = "register-force-fix";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          overflow-x: clip;
        }
        #root {
          width: 100%;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow-x: clip !important;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: clip;
          background-color: #f8fafc;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const s = document.getElementById(styleId);
      if (s) s.remove();
    };
  }, []);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Registration error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        bgcolor: "#f8fafc",
        position: "relative",
        overflowX: "clip",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -50,
          width: { xs: 200, sm: 300 },
          height: { xs: 200, sm: 300 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(25,118,210,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -50,
          width: { xs: 250, sm: 400 },
          height: { xs: 250, sm: 400 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(25,118,210,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      />

      {/* Left Side — Premium Image Panel (Desktop only) */}
      {isDesktop && (
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              flex: 1.2,
              position: "relative",
              background: "linear-gradient(135deg, #0a2a5a 0%, #1e4a8b 50%, #2e6bb5 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 6,
              overflow: "hidden",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha("#fff", 0.1)} 0%, transparent 70%)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${float} ${Math.random() * 10 + 10}s infinite ease-in-out`,
                  pointerEvents: "none",
                }}
              />
            ))}
            <Zoom in={true} timeout={800} style={{ transitionDelay: "200ms" }}>
              <Box sx={{ position: "relative", zIndex: 2, maxWidth: 500, textAlign: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4 }}>
                  <FlightTakeoffIcon
                    sx={{
                      fontSize: 60,
                      color: "#FFD700",
                      filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                      animation: `${float} 4s ease-in-out infinite`,
                    }}
                  />
                  <Typography variant="h2" sx={{ color: "white", fontWeight: 800, fontSize: "3rem" }}>
                    AeroSpace
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3, fontSize: "2rem" }}>
                  Join Our Community!
                </Typography>
                <Typography variant="body1" sx={{ color: alpha("#fff", 0.8), mb: 4, fontSize: "1.1rem" }}>
                  Create your account to access exclusive flight deals, track your journeys, and experience premium aerospace services.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
                  {[
                    { value: "500+", label: "Flights Daily" },
                    { value: "24/7", label: "Support" },
                    { value: "99.9%", label: "Uptime" },
                  ].map((stat, index) => (
                    <Box key={index} sx={{ textAlign: "center" }}>
                      <Typography variant="h5" sx={{ color: "#FFD700", fontWeight: 800, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha("#fff", 0.7) }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Zoom>
          </Box>
        </Fade>
      )}

      {/* Right Side — Register Form - FIXED FOR MOBILE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          px: 0,
          overflowX: "clip",
        }}
      >
        <Container 
          maxWidth={false} 
          disableGutters 
          sx={{ 
            width: "100%", 
            display: "flex", 
            justifyContent: "center",
            px: { xs: 1, sm: 2 }
          }}
        >
          <Fade in={true} timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 4, md: 5 },
                borderRadius: 4,
                width: "100%",
                maxWidth: { xs: "calc(100% - 16px)", sm: 450, md: 480 },
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(25,118,210,0.1)",
                position: "relative",
                overflow: "hidden",
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "linear-gradient(90deg, #0a2a5a, #2e6bb5, #4a90e2)",
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 3 }}>
                <FlightTakeoffIcon
                  sx={{
                    fontSize: { xs: 36, sm: 40 },
                    color: "#0a2a5a",
                    animation: `${float} 3s ease-in-out infinite`,
                  }}
                />
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: "#0a2a5a", fontWeight: 800 }}>
                  AeroSpace
                </Typography>
              </Box>

              <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, color: "#1e293b", mb: 1, textAlign: "center" }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mb: { xs: 3, sm: 4 }, textAlign: "center" }}>
                Fill in your details to get started
              </Typography>

              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={handleInputChange(setName)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading || success}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    mb: { xs: 2, sm: 2.5 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#ffffff" },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                        boxShadow: "0 0 0 4px rgba(25,118,210,0.1)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon
                          sx={{
                            fontSize: { xs: 18, sm: 20 },
                            color: focusedField === "name" ? "#1976d2" : "#94a3b8",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading || success}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    mb: { xs: 2, sm: 2.5 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#ffffff" },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                        boxShadow: "0 0 0 4px rgba(25,118,210,0.1)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon
                          sx={{
                            fontSize: { xs: 18, sm: 20 },
                            color: focusedField === "email" ? "#1976d2" : "#94a3b8",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading || success}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    mb: { xs: 2, sm: 2.5 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#ffffff" },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                        boxShadow: "0 0 0 4px rgba(25,118,210,0.1)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{
                            fontSize: { xs: 18, sm: 20 },
                            color: focusedField === "password" ? "#1976d2" : "#94a3b8",
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading || success}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    mb: { xs: 2, sm: 2.5 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#ffffff" },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                        boxShadow: "0 0 0 4px rgba(25,118,210,0.1)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{
                            fontSize: { xs: 18, sm: 20 },
                            color: focusedField === "confirmPassword" ? "#1976d2" : "#94a3b8",
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Account created successfully! Redirecting to login...</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || success}
                  size="large"
                  sx={{
                    py: { xs: 1.2, sm: 1.5, md: 1.8 },
                    fontWeight: 700,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    borderRadius: 2,
                    background: "linear-gradient(45deg, #0a2a5a 0%, #1e4a8b 50%, #2e6bb5 100%)",
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(10, 42, 90, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #0f2b5e 0%, #1e4a8b 70%, #2e6bb5 100%)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Account"}
                </Button>

                <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Already have an account?{" "}
                    <MuiLink component={Link} to="/login" sx={{ color: "#1976d2", fontWeight: 600, textDecoration: "none" }}>
                      Sign In
                    </MuiLink>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}