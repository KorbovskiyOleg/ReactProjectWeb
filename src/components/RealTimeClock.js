import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
//import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion } from "framer-motion";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "none",
          background: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "black",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatTime(currentTime)}
            </Typography>
            
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RealTimeClock;