import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  useTheme 
} from "@mui/material";
import { 
  DirectionsCar as CarsIcon,
  People as OwnersIcon,
  Settings as SettingsIcon,
  BarChart as StatsIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: "Car manegement",
      icon: <CarsIcon fontSize="large" />,
      action: () => navigate("/cars"),
      color: theme.palette.primary.main
    },
    {
      title: "Owners",
      icon: <OwnersIcon fontSize="large" />,
      action: () => navigate("/owners"),
      color: theme.palette.secondary.main
    },
    {
      title: "Statistic",
      icon: <StatsIcon fontSize="large" />,
      action: () => navigate("/stats"),
      color: "#4caf50"
    },
    {
      title: "Settings",
      icon: <SettingsIcon fontSize="large" />,
      action: () => navigate("/settings"),
      color: "#ff9800"
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Заголовок и приветствие */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
         Welcome to CarShop Manager!
      </Typography>
      <Typography variant="body1">
        This is your dashboard. Use the menu to navigate.
      </Typography>
      
      {/* Быстрые действия */}
      <Grid container spacing={4}>
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6
                }
              }}
              onClick={item.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ 
                  color: item.color,
                  mb: 2
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                >
                  Go to
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Последние действия/статистика */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Last activity
        </Typography>
        <Box sx={{ 
          p: 3, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2
        }}>
          <Typography>Statistic and react activity...</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;