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
  CurrencyExchange as CurrencyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WeatherWidget from "./WeatherWidget";
import AudioVisualizer from "./AudioVisualizer";
import CalendarWidget from "./CalendarWidget";

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

// Компонент для отображения курса валют
const CurrencyRates = () => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "none",
        background: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CurrencyIcon sx={{ color: "white", mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ color: "black" }}>
            Курс валют
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: "black",
          }}
        >
          <Typography variant="body1">USD: 73.50 ₽</Typography>
          <Typography variant="body1">EUR: 80.20 ₽</Typography>
          <Typography variant="body1">CNY: 10.50 ₽</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        p: 4,
        position: "relative",
        minHeight: "80vh",
        gap: 4,
      }}
    >
      {/* Левая колонка - Основной контент */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Заголовок и описание */}
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
              maxWidth: "90%",
            }}
          >
            Hello! My name is Oleg Korbovsky and this is my first
            application!! I hope you like everything!!!
          </Typography>
        </motion.div>

        {/* Блок с курсом валют, погодой и календарем */}
        <Box>
          {/* Курс валют */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CurrencyRates />
          </motion.div>

          {/* Погода и календарь в одной строке */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 2,
            alignItems: 'stretch',
            height: '320px',
            minHeight: '320px' // Добавляем минимальную высоту
          }}>
            {/* Погода - теперь без вложенной карточки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ flex: 1 }}
            >
              <WeatherWidget 
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[3],
                  backdropFilter: 'blur(8px)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  p: 2
                }}
              />
            </motion.div>

            {/* Календарь */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{ flex: 1 }}
            >
              <CalendarWidget />
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Правая колонка - Навигационные карточки и визуализатор */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Блок с карточками */}
        <Stack spacing={3} sx={{ flex: 1 }}>
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

        {/* Аудио-визуализатор */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            paddingRight: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              width: "60%",
              maxWidth: "400px",
            }}
          >
            <AudioVisualizer
              sx={{
                width: "100%",
                canvas: {
                  width: "100%!important",
                  height: "150px!important",
                },
              }}
            />
          </motion.div>
        </Box>
      </Box>
    </Container>
  </>
);
};

export default HomePage;
