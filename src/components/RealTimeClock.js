import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
//import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material";

const RealTimeClock = () => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    //const theme = useTheme();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.1 }}
    style={{
      display: 'inline-block',
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: 'bold',
        fontSize: { xs: '2.5rem', sm: '3rem' },
        color: theme.palette.primary.dark,
        textShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
        p: 1, // Небольшой внутренний отступ
      }}
    >
      {formatTime(currentTime)}
    </Typography>
  </motion.div>
);
};

export default RealTimeClock;
