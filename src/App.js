/*import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Login from "./components/Login";
import Carlist from "./components/Carlist";
import { styled } from "@mui/material/styles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Paper from "@mui/material/Paper";

const backgroundImage =
  "https://avatars.mds.yandex.net/i?id=ad5823f7184ca4b975ed9a4a999960e1_l-5519086-images-thumbs&ref=rim&n=13&w=2048&h=1152";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5d4037",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "rgba(255,255,255,0.8)",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: "0.03em",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(45deg, rgba(93,64,55,0.9) 30%, rgba(141,110,99,0.9) 90%)",
          boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
        },
      },
    },
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
});

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  display: "flex",
  justifyContent: "center",
  alignItems: "center", // Центрирование по вертикали
  width: "100%",
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  width: "95%",
  maxWidth: "none", // Ширина 90% от ширины экрана
  minHeight: "80vh", // Высота 80% от высоты экрана
  padding: theme.spacing(4),
  margin: theme.spacing(2, "auto"),
  borderRadius: 16, // Увеличено скругление углов
  boxShadow: theme.shadows[10], // Более выраженная тень
  //display: 'flex',
  //flexDirection: 'column',
  overflow: "auto", // Добавляем прокрутку при необходимости
}));

function App() {
  const [isAuthenticated, setAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSuccess = () => {
    setAuth(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    setAuth(false);
    setShowLogin(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
          body { margin: 0; }
        `}
      </style>

      <AppContainer>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                gap: 2,
              }}
            >
              <DirectionsCarIcon
                sx={{
                  fontSize: 32,
                  color: "inherit",
                  transform: "rotateY(180deg)",
                }}
              />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  letterSpacing: "0.05em",
                }}
              >
                CarShop Manager
              </Typography>
            </Box>
            {isAuthenticated && (
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Выйти
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <MainContent>
          {isAuthenticated ? (
            <ContentPaper sx={{ width: "98vw", mx: "auto" }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  mb: 3,
                  color: "#5d4037",
                  textAlign: "center",
                }}
              >
                Car Inventory
              </Typography>
              <Box sx={{ width: "100%", height: "65vh", overflow: "auto" }}>
                <Carlist fullWidth={true} />
              </Box>
            </ContentPaper>
          ) : showLogin ? (
            <ContentPaper
              sx={{
                maxWidth: 500,
                minHeight: "auto",
              }}
            >
              <Login onLoginSuccess={handleLoginSuccess} />
            </ContentPaper>
          ) : null}
        </MainContent>

        <Box
          component="footer"
          sx={{
            py: 3,
            backgroundColor: "rgba(0,0,0,0.7)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="#fff">
            © {new Date().getFullYear()} CarShop Manager. All rights reserved.
          </Typography>
        </Box>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
*/
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

export default function App() {
  return (
    <AppBar position="fixed">
      <Container fixed>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">CarShop</Typography>
          <Box>
            <Button color="secondary" variant="contained">Sign up</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
