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
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Импортируем иконку автомобиля

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
      default: "#e0e2e5",
    },
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      "sans-serif",
    ].join(","),
    h6: {
      fontWeight: 700,
      letterSpacing: "0.03em",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #5d4037 30%, #8d6e63 90%)",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders: {
          backgroundColor: "#5d4037",
          color: "#ffffff",
        },
      },
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
        `}
      </style>

      <AppContainer>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: "1.3rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <DirectionsCarIcon
                sx={{
                  fontSize: "1.8rem",
                  color: "#fff",
                  transform: "rotateY(180deg)",
                }}
              />
              CarShop Manager
            </Typography>
            {isAuthenticated && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  letterSpacing: "0.03em",
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

export default App;*/

import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Login from './components/Login';
import Carlist from './components/Carlist';
import { styled } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Добавляем недостающую иконку
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: "#5d4037",
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: grey[100],
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '0.03em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #5d4037 30%, #8d6e63 90%)',
          boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        text: {
          textTransform: 'none',
        },
      },
    },
  },
});

const AppContainer = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

function App() {
  const [isAuthenticated, setAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSuccess = () => {
    setAuth(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwt');
    setAuth(false);
    setShowLogin(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
        `}
      </style>
      
      <AppContainer>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexGrow: 1,
              gap: 2,
            }}>
              <DirectionsCarIcon 
                sx={{ 
                  fontSize: 32,
                  color: 'inherit',
                  transform: 'rotateY(180deg)',
                }} 
              />
              <Typography 
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  letterSpacing: '0.05em',
                }}
              >
                CARSHOP MANEGER
              </Typography>
            </Box>
            
            {isAuthenticated && (
              <Button 
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Выйти
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <MainContent>
          {isAuthenticated ? <Carlist /> : showLogin ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </Box>
          ) : null}
        </MainContent>

        <Box component="footer" sx={{ py: 3, backgroundColor: grey[200], textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} CarShop Manager. All rights reserved.
          </Typography>
        </Box>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;