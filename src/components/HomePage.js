import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import {
  DirectionsCar as CarsIcon,
  People as OwnersIcon,
  Settings as SettingsIcon,
  BarChart as StatsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Анимация для карточек
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: "Car manegement",
      icon: <CarsIcon fontSize="large" />,
      action: () => navigate("/cars"),
      color: theme.palette.primary.main,
    },
    {
      title: "Owners",
      icon: <OwnersIcon fontSize="large" />,
      action: () => navigate("/owners"),
      color: theme.palette.secondary.main,
    },
    {
      title: "Statistic",
      icon: <StatsIcon fontSize="large" />,
      action: () => navigate("/stats"),
      color: "#4caf50",
    },
    {
      title: "Settings",
      icon: <SettingsIcon fontSize="large" />,
      action: () => navigate("/settings"),
      color: "#ff9800",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Welcome to CarShop Manager!
        </Typography>
      </motion.div>

      {/* Быстрые действия */}
      <Grid container spacing={4}>
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial="offscreen"
              animate="onscreen"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
              onClick={item.action}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box
                  sx={{
                    color: item.color,
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                  Go to
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Последние действия/статистика */}

        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Last activity
        </Typography>
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <Typography>Statistic and react activity...</Typography>
        </Box>
      </Box>
      </motion.div>
    </Box>
  );
};

export default HomePage;
