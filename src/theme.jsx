import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0D47A1" },
    secondary: { main: "#FFC107" },
    background: { default: "#f4f6f8", paper: "#fff" },
    text: { primary: "#1a1a1a", secondary: "#555" },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

export default theme;
