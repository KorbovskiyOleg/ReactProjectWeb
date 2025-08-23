import { useState } from "react";
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
import OwnersList from "./components/OwnersList";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { styled, alpha } from "@mui/material/styles";
import { CartProvider } from "./components/CartContext";
import { CartIcon } from "./components/CartIcon";
import { CartDrawer } from "./components/CartDrawer";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import StatsPage from "./components/StatsPage";
import SettingsPage from "./components/SettingsPage";
//import MainPage from './components/MainPage'; 
import { AudioProvider } from './context/AudioContext';
import { useAudio } from './context/AudioContext'; 
import OwnerDetails from "./components/OwnerDetails";


const backgroundImage = "/images/imagback.webp";

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
      default: "rgba(249, 249, 249, 0.4)",
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
  backgroundImage: `url(${backgroundImage})`,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
  backdropFilter: "blur(1px)",
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(45deg, ${alpha(
    theme.palette.primary.dark,
    0.9
  )} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
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

const menuVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: 0.15,
    },
  },
};

const backdropVariants = {
  open: { opacity: 0.5 },
  closed: { opacity: 0 },
};

function App() {
  const [isAuthenticated, setAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  //const audioRef = useRef(null);
  //const [isMusicAllowed, setIsMusicAllowed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isMusicAllowed, enableMusic } = useAudio();

  //const enableMusic = () => {
  //  setIsMusicAllowed(true);
  //  localStorage.setItem("musicAllowed", "true");
  //  if (audioRef.current) {
  //    audioRef.current.play().catch((e) => console.log("Play error:", e));
   // }
 // };

  //useEffect(() => {
   // if (localStorage.getItem("musicAllowed") === "true") {
   //   setIsMusicAllowed(true);
   // }
  //}, []);

 // useEffect(() => {
  //  if (isMusicAllowed && audioRef.current) {
  //    audioRef.current.loop = true;
  //    audioRef.current.volume = 0.2;
  //    audioRef.current.play().catch((e) => console.log("Auto-play blocked"));
  //  }
 // }, [isMusicAllowed]);

  const handleLoginSuccess = () => {
   // if (audioRef.current) {
   //   audioRef.current.currentTime = 5;
   //   audioRef.current.play().catch((e) => console.log("Auto-play prevented:", e));
   // }
    setAuth(true);
    setShowLogin(false);
    navigate("/");// перенаправление на страницу
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    setAuth(false);
    setShowLogin(true);
    setMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <CartProvider>
      <ThemeProvider theme={theme}>
        

        {!isMusicAllowed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "10px 15px",
              borderRadius: "8px",
              zIndex: 1000,
              cursor: "pointer",
            }}
            onClick={enableMusic}
          >
            ♫ Включить фоновую музыку
          </motion.div>
        )}

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
                <motion.div
                  animate={menuOpen ? { rotate: 10 } : { rotate: -5 }}
                  transition={{ type: "spring" }}
                >
                  <DirectionsCarIcon
                    sx={{
                      mr: 1.5,
                      fontSize: "1.8rem",
                      background:
                        "linear-gradient(45deg, #ffb74d 30%, #ff9100 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </motion.div>
                <Box
                  component="span"
                  sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                >
                  CarShop Manager
                </Box>
              </Typography>

              {isAuthenticated && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={() => setCartOpen(true)}
                    sx={{ mr: 2 }}
                  >
                    <CartIcon />
                  </IconButton>
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
                </>
              )}
            </Toolbar>
          </StyledAppBar>

          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  variants={backdropVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  onClick={toggleMenu}
                  style={{
                    position: "fixed",
                    top: 64,
                    left: 0,
                    width: "100vw",
                    height: "calc(100vh - 64px)",
                    backgroundColor: "black",
                    zIndex: 1100,
                  }}
                />

                <Box
                  component={motion.div}
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{
                    width: 280,
                    height: "calc(100vh - 64px)",
                    backgroundColor: alpha(theme.palette.primary.dark, 0.4),
                    color: "white",
                    position: "fixed",
                    left: 0,
                    top: 64,
                    zIndex: 1200,
                    boxShadow: 24,
                    display: "flex",
                    flexDirection: "column",
                    padding: 24,
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

                  <MenuButton
                    //startIcon={<span>🏠</span>}
                    sx={{ 
                      color: "white",
                      backgroundColor: location.pathname === "/" ? alpha(theme.palette.primary.light, 0.3) : "transparent"
                    }}
                    onClick={() => handleNavigation("/")}
                  >
                    Home
                  </MenuButton>
                  <MenuButton
                    //startIcon={<span>🚗</span>}
                    sx={{ 
                      color: "white",
                      backgroundColor: location.pathname === "/cars" ? alpha(theme.palette.primary.light, 0.3) : "transparent"
                    }}
                    onClick={() => handleNavigation("/cars")}
                  >
                    Cars
                  </MenuButton>
                  <MenuButton
                    //startIcon={<span>👤</span>}
                    sx={{ 
                      color: "white",
                      backgroundColor: location.pathname === "/owners" ? alpha(theme.palette.primary.light, 0.3) : "transparent"
                    }}
                    onClick={() => handleNavigation("/owners")}
                  >
                    Owners
                  </MenuButton>
                  <MenuButton
                    //startIcon={<span>⚙️</span>}
                    sx={{ 
                      color: "white",
                      backgroundColor: location.pathname === "/settings" ? alpha(theme.palette.primary.light, 0.3) : "transparent"
                    }}
                    onClick={() => handleNavigation("/settings")}
                  >
                    Settings
                  </MenuButton>
                  <MenuButton
                    //startIcon={<span>⚙️</span>}
                    sx={{ 
                      color: "white",
                      backgroundColor: location.pathname === "/about me" ? alpha(theme.palette.primary.light, 0.3) : "transparent"
                    }}
                    onClick={() => handleNavigation("/about me")}
                  >
                    ABOUT ME
                  </MenuButton>

                  <Box sx={{ flexGrow: 1 }} />

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      p: 2,
                      color: alpha("#fff", 0.5),
                      textAlign: "center",
                    }}
                  >
                    Version 1.0.0
                  </Typography>
                </Box>
              </>
            )}
          </AnimatePresence>

          <MainContent>
            <Routes>
              <Route path="/" element={
    isAuthenticated ? <HomePage /> : showLogin ? <Login onLoginSuccess={handleLoginSuccess} /> : null
  } />
  <Route path="/home" element={isAuthenticated ? <HomePage /> : <Login onLoginSuccess={handleLoginSuccess} />} />
  <Route path="/cars" element={isAuthenticated ? <Carlist /> : <Login onLoginSuccess={handleLoginSuccess} />} />
  <Route path="/owners" element={isAuthenticated ? <OwnersList /> : <Login onLoginSuccess={handleLoginSuccess} />} />
  {/* Добавьте этот новый маршрут для страницы конкретного владельца */}
  
  <Route path="/settings" element={isAuthenticated ? <SettingsPage/> : <Login onLoginSuccess={handleLoginSuccess} />} />
  <Route path="/stats" element={isAuthenticated ? <StatsPage /> : <Login onLoginSuccess={handleLoginSuccess} />} />
  <Route path="/owners/:ownerId" element={<OwnerDetails />} />
              
            </Routes>
          </MainContent>

          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

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
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationColor: "rgba(255,255,255,0.3)",
              }}
            >
              Author: Car_b1t
            </Typography>
          </Box>
        </AppContainer>
      </ThemeProvider>
    </CartProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AudioProvider>
      <App />
      </AudioProvider>
    </Router>
    
  );
}
