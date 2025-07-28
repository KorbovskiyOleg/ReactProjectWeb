// src/components/HomePage.js
import React from "react";
import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to CarShop Manager!
      </Typography>
      <Typography variant="body1">
        This is your dashboard. Use the menu to navigate.
      </Typography>
    </Box>
  );
};

export default HomePage;