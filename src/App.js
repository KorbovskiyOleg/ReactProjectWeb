import { useState,useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Login from "./components/Login";
import Carlist from "./components/Carlist";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { styled, alpha } from "@mui/material/styles";

const backgroundImageUrl = "https://avatars.mds.yandex.net/i?id=ad5823f7184ca4b975ed9a4a999960e1_l-5519086-images-thumbs&ref=rim&n=13&w=2048&h=1152";
// Улучшенная кастомная тема
const theme = createTheme({
  palette: {
    primary: {
      main: "#5d4037",
      light: "#8b6b61",
      dark: "#321911",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5c7f",
      dark: "#a30021",
    },
    background: {
      default: "rgba(249, 249, 249, 0.4)", // Полупрозрачный фон для лучшей читаемости
      paper: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: "0.5px",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const AppContainer = styled("div")({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  "&::before": {
    content: '""',
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Затемнение фона для лучшей читаемости
    zIndex: -1,
  },
});

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  backgroundColor: theme.palette.background.default,
  backdropFilter: "blur(1px)", // Эффект размытия
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backdropFilter: "blur(10px)",
}));

const MenuButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  padding: theme.spacing(1.5, 3),
  margin: theme.spacing(0.5, 0),
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    transform: "translateX(5px)",
  },
}));

function App() {
  const [isAuthenticated, setAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef(null);

  const handleLoginSuccess = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Перематываем на начало
      audioRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    }
    setAuth(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    setAuth(false);
    setShowLogin(true);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <audio 
        ref={audioRef} 
        src="/sounds/engine.mp3" 
        preload="auto"
      />
      <CssBaseline />
      <AppContainer>
        <StyledAppBar position="static" elevation={0}>
          <Toolbar>
            {isAuthenticated && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMenu}
                sx={{ mr: 2 }}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}

            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                fontWeight: 700,
              }}
            >
              <DirectionsCarIcon
                sx={{
                  mr: 1.5,
                  fontSize: "1.8rem",
                  background:
                    "linear-gradient(45deg, #ffb74d 30%, #ff9100 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transform: "rotate(-5deg)",
                }}
              />
              <Box
                component="span"
                sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              >
                CarShop Manager
              </Box>
            </Typography>

            {isAuthenticated && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderWidth: 2,
                  },
                }}
              >
                Exit
              </Button>
            )}
          </Toolbar>
        </StyledAppBar>

        
        {menuOpen && (
          <Box
            sx={{
              width: 280,
              height: "calc(100vh - 64px)",
              backgroundColor: alpha(theme.palette.primary.dark, 0.95),
              color: "white",
              position: "fixed",
              left: 0,
              top: 64,
              zIndex: 1200,
              boxShadow: 24,
              transition: "transform 0.3s ease-out",
              transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
              display: "flex",
              flexDirection: "column",
              p: 3,
              backdropFilter: "blur(5px)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                p: 2,
                mb: 2,
                borderBottom: `1px solid ${alpha("#fff", 0.2)}`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "secondary.main",
                  borderRadius: "50%",
                  mr: 1.5,
                }}
              />
              Navigation
            </Typography>

            <MenuButton startIcon={<span>🏠</span>}>Home</MenuButton>
            <MenuButton startIcon={<span>🚗</span>}>Cars</MenuButton>
            <MenuButton startIcon={<span>👤</span>}>Profile</MenuButton>
            <MenuButton startIcon={<span>⚙️</span>}>Settings</MenuButton>

            <Box sx={{ flexGrow: 1 }} />

            <Typography
              variant="caption"
              sx={{
                mt: 2,
                p: 2,
                color: alpha("#fff", 0.6),
                textAlign: "center",
              }}
            >
              Version 1.0.0
            </Typography>
          </Box>
        )}

        <MainContent>
          {isAuthenticated ? (
            <Carlist />
          ) : showLogin ? (
              <Login onLoginSuccess={handleLoginSuccess} />
           // </Box>
          ) : null}
        </MainContent>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            backgroundColor: alpha(theme.palette.primary.dark, 0.9),
            color: "#fff",
            textAlign: "center",
            mt: "auto",
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} CarShop Manager. All right reserved.
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, opacity: 0.7 }}
          >
            Application version: 1.0.0
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              opacity: 0.7,
              textDecoration: "underline", // Добавляем подчеркивание
              textUnderlineOffset: "3px", // Отступ подчеркивания от текста (опционально)
              textDecorationColor: "rgba(255,255,255,0.3)", // Цвет подчеркивания (опционально)
            }}
          >
            Author: Car_b1t
          </Typography>
        </Box>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
