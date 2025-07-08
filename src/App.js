/*import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
 import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Carshop
          </Typography>
        </Toolbar>
      </AppBar>
       <Login />
    </div>
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

// Создаем кастомную тему
const theme = createTheme({
  palette: {
    primary: {
      main: "#5d4037",//'#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#e0e2e5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders: {
          //backgroundColor: '#1976d2',
          //color: '#ffffff',
          //fontSize: '0.875rem',
          //fontWeight: 'bold',
        },
        //columnHeaderTitle: {
        //  color: '#ffffff',
        //  fontWeight: 'bold',
        //},
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
      <AppContainer>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🚗 CarShop Manager
            </Typography>
            {isAuthenticated && (
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(216, 20, 20, 0.1)'
                  }
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
            backgroundColor: '#d5d5d5',
            textAlign: 'center',
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
