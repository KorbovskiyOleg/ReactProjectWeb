import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  Container,
  Stack,
} from "@mui/material";
import {
  DirectionsCar as CarsIcon,
  People as OwnersIcon,
  Settings as SettingsIcon,
  BarChart as StatsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WeatherWidget from "./WeatherWidget";
import AudioVisualizer from "./AudioVisualizer";
//import { useAudio } from "../context/AudioContext";

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
  //const { isMusicAllowed } = useAudio();

  const features = [
    {
      title: "Car management",
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
    <>
      {/* Визуализатор звука */}
      

      <Container maxWidth="xl" sx={{ display: "flex", p: 4 }}>
        {/* Левая часть - Приветствие и контент */}

        <Box
        sx={{
          flex: 1,
          pr: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 3,
              fontWeight: 700,
              color: theme.palette.primary.dark,
            }}
          >
            Welcome to CarShop Manager!
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              fontSize: "1.1rem",
              lineHeight: 1.9,
            }}
          >
            Hello! My name is Oleg Korbovsky and this is my first application!!
            I hope you like everything!!!
          </Typography>
          
          {/* Добавленный визуализатор */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <AudioVisualizer />
          </motion.div>
        </motion.div>

        {/* Погодный виджет теперь под визуализатором */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginTop: 'auto' }}
        >
          <WeatherWidget />
        </motion.div>
      </Box>

        {/* Правая часть - Карточки */}
        <Box
          sx={{
            width: "45%",
            position: "relative",
          }}
        >
          <Stack spacing={3}>
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial="offscreen"
                animate="onscreen"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={item.action}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        color: item.color,
                        mr: 3,
                        fontSize: "2rem",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                      <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                        Go to →
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
