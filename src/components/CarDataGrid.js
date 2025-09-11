// src/components/CarDataGrid.js
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ModelIcon from "@mui/icons-material/PrecisionManufacturing";
import PaletteIcon from "@mui/icons-material/Palette";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Person } from '@mui/icons-material';
import SettingsIcon from "@mui/icons-material/Settings";
import { carColumns } from "../data/dataCar";

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: (i) => (i % 3 === 0 ? -50 : i % 3 === 1 ? 50 : 0),
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      type: "spring",
      stiffness: 100,
      damping: 15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const CarDataGrid = ({ 
  cars, 
  isLoading, 
  clickedCartId, 
  addToCart, 
  onDelClick, 
  updateCar 
}) => {
  const columns = carColumns(cars, clickedCartId, addToCart, onDelClick, updateCar);

  const enhancedColumns = columns.map((col) => ({
    ...col,
    headerName: (
      <motion.div variants={headerVariants}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {getHeaderIcon(col.field)}
          <span>{getHeaderText(col.field)}</span>
        </Box>
      </motion.div>
    ),
    renderCell: (params) => (
      <motion.div
        custom={params.rowIndex}
        variants={itemVariants}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {col.renderCell ? col.renderCell(params) : (
          <Typography variant="body2">
            {col.valueFormatter ? col.valueFormatter(params) : params.value}
          </Typography>
        )}
      </motion.div>
    ),
  }));

  return (
    <Box
      sx={{
        height: 600,
        width: "100%",
        "& .header-theme": {
          backgroundColor: "#1976d2 !important",
          color: "#ffffff !important",
          fontSize: "0.875rem",
          fontWeight: "bold",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "1px solid #f0f0f0",
          "&.price-cell": {
            fontWeight: "bold",
            color: "#2e7d32",
          },
        },
        "& .MuiDataGrid-root": {
          border: "none",
          borderRadius: 2,
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#1976d2 !important",
          color: "#fff",
        },
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
      }}
    >
      <DataGrid
        rows={cars}
        columns={enhancedColumns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        getRowId={(row) => row.id}
        disableSelectionOnClick
        disableColumnSelector
        loading={isLoading}
        components={{
          LoadingOverlay: () => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ fontSize: "3rem" }}
              >
                🚗
              </motion.div>
            </Box>
          ),
        }}
      />
    </Box>
  );
};

// Вспомогательные функции
const getHeaderIcon = (field) => {
  const icons = {
    brand: <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} />,
    model: <ModelIcon fontSize="small" sx={{ mr: 1 }} />,
    color: <PaletteIcon fontSize="small" sx={{ mr: 1 }} />,
    make: <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />,
    price: <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />,
    owner: <Person fontSize="small" sx={{ mr: 1 }} />,
    actions: <SettingsIcon fontSize="small" sx={{ mr: 1 }} />,
  };
  return icons[field] || null;
};

const getHeaderText = (field) => {
  const texts = {
    brand: `Brand`,
    model: "Model",
    color: "Color",
    make: "Year",
    price: "Price",
    owner: "Owner",
    actions: "Actions",
  };
  return texts[field] || field;
};

export default CarDataGrid;