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
import Login from "./components/Login";
import Carlist from "./components/Carlist";
import { styled } from "@mui/material/styles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// Создаем кастомную тему
const theme = createTheme({
  palette: {
    primary: {
      main: "#5d4037",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
});

const AppContainer = styled("div")({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

function App() {
  const [isAuthenticated, setAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginSuccess = () => {
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
      <CssBaseline />
      <AppContainer>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            {isAuthenticated && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
            >
              <DirectionsCarIcon
                sx={{
                  mr: 1.5,
                  fontSize: "1.8rem",
                  background:
                    "linear-gradient(45deg, #5d4037 30%, #d84315 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />
              CarShop Manager
            </Typography>

            {isAuthenticated && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(216, 20, 20, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Боковое меню (пример реализации) */}
        {menuOpen && (
          <Box
            sx={{
              width: 250,
              height: "100%",
              backgroundColor: "#5d4037",
              color: "white",
              p: 2,
              position: "fixed",
              left: 0,
              top: 64,
              zIndex: 1200,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.2)" }}
            >
              Меню
            </Typography>
            <Button
              color="inherit"
              fullWidth
              sx={{ justifyContent: "flex-start", mt: 1 }}
            >
              Профиль
            </Button>
            <Button
              color="inherit"
              fullWidth
              sx={{ justifyContent: "flex-start" }}
            >
              Настройки
            </Button>
          </Box>
        )}

        <MainContent>
          {isAuthenticated ? (
            <Carlist />
          ) : showLogin ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="80vh"
            >
              <Login onLoginSuccess={handleLoginSuccess} />
            </Box>
          ) : null}
        </MainContent>

        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            backgroundColor: "#d5d5d5",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} CarShop Manager - All rights reserved
          </Typography>
        </Box>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
