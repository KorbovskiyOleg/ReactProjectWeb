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
import CalendarWidget from "./CalendarWidget";
import NotesWidget from "./NotesWidget";
import RealTimeClock from "./RealTimeClock";
import CurrencyWidget from './CurrencyWidget';


// Анимация для карточек справа
const cardVariants = {
  offscreen: {
    x: 100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

// Анимация для компонентов слева
const leftSlideVariants = {
  offscreen: {
    x: -100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  },
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
          flexDirection: { xs: "column", md: "row" }, // ← Адаптивное направление
          p: { xs: 2, md: 4 }, // ← Адаптивные отступы
          position: "relative",
          minHeight: "80vh",
          gap: 4,
          overflow: "hidden", 
          width: "100%", 
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
            initial="offscreen"
            animate="onscreen"
            variants={leftSlideVariants}
            transition={{ delay: 0.1 }}
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

          <motion.div
            initial="offscreen"
            animate="onscreen"
            variants={leftSlideVariants}
            transition={{ delay: 0.2 }}
          >
            <RealTimeClock />
          </motion.div>

          {/* Блок с курсом валют, погодой и календарем */}
          <Box>
            {/* Курс валют */}
            <motion.div
              initial="offscreen"
              animate="onscreen"
              variants={leftSlideVariants}
              transition={{ delay: 0.3 }}
            >
              <CurrencyWidget />
            </motion.div>

            {/* Погода и календарь в одной строке */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                alignItems: "stretch",
                height: "320px",
                minHeight: "320px", // Добавляем минимальную высоту
              }}
            >
              {/* Погода - теперь без вложенной карточки */}
              <motion.div
                initial="offscreen"
                animate="onscreen"
                variants={leftSlideVariants}
                transition={{ delay: 0.4 }}
                style={{ flex: 1 }}
              >
                <WeatherWidget
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: theme.shadows[3],
                    backdropFilter: "blur(8px)",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    p: 2,
                  }}
                />
              </motion.div>

              {/* Календарь */}
              <motion.div
                initial="offscreen"
                animate="onscreen"
                variants={leftSlideVariants}
                transition={{ delay: 0.5 }}
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
            width: { xs: "100%", md: "50%" }, // ← Адаптивная ширина
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flexShrink: 0, // ← Добавь
          }}
        >
          {/* Добавляем компонент часов */}

          {/* Блок с карточками */}
          <Stack spacing={3} sx={{ flex: 1 }}>
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial="offscreen"
                animate="onscreen"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ delay: 0.2 + index * 0.15 }}
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

          {/* Блокнот */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 3,
              width: "100%",
            }}
          >
            {/* Блокнот */}
            <motion.div
              initial="offscreen"
              animate="onscreen"
              variants={cardVariants}
              transition={{ delay: 0.8 }}
              style={{ width: "50%" }}
            >
              <NotesWidget showOnlyFirst={true} />
            </motion.div>

          </Box>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
