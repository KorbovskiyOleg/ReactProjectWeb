import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { motion, AnimatePresence } from "framer-motion";
import AddCar from "./AddCar";
import EditCar from "./EditCar";
import { SERVER_URL } from "../constants";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ModelIcon from "@mui/icons-material/PrecisionManufacturing";
import PaletteIcon from "@mui/icons-material/Palette";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";
import { useCart } from "./CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExportData from "./ExportData";

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

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const StyledHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: "1.8rem",
}));

export default function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [clickedCartId, setClickedCartId] = useState(null);
  const [isVisible] = useState(true); // Добавляем состояние для анимации

  const updateCar = (car, link) => {
    const token = sessionStorage.getItem("jwt");
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) {
          fetchCars();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };

  const addCar = (car) => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) {
          fetchCars();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "brand",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Brand ({cars.length})</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 150,
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
          {params.value}
        </motion.div>
      ),
    },
    {
      field: "model",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ModelIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Model</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.3}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },
    {
      field: "color",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PaletteIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Color</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.6}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: params.value.toLowerCase(),
              width: 20,
              height: 20,
              borderRadius: "50%",
              marginRight: 1,
              border: "1px solid #ddd",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              color: "#333",
              fontWeight: 500,
            }}
          >
            {params.value}
          </Typography>
        </motion.div>
      ),
    },
    {
      field: "make",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Year</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.9}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },
    {
      field: "price",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Price</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 150,
      cellClassName: "price-cell",
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 1.2}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </motion.div>
      ),
    },
    {
      field: "actions",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Actions</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      sortable: false,
      width: 250,
      renderCell: (params) => {
        const isClicked = clickedCartId === params.row._links.self.href;

        return (
          <motion.div
            custom={params.rowIndex + 1.5}
            variants={itemVariants}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <EditCar
                data={{ row: params.row, id: params.id }}
                updateCar={updateCar}
              />

              <motion.div
                animate={{
                  scale: isClicked ? [1, 1.2, 1] : 1,
                  rotate: isClicked ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <IconButton
                  onClick={() => {
                    addToCart(params.row);
                    setClickedCartId(params.row._links.self.href);
                  }}
                  sx={{
                    color: "#1976d2",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                    },
                  }}
                >
                  <ShoppingCartIcon fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Add
                  </Typography>
                </IconButton>
              </motion.div>

              <IconButton
                onClick={() => onDelClick(params.row._links.self.href)}
                sx={{
                  color: "#ff4444",
                  "&:hover": {
                    backgroundColor: "rgba(255, 68, 68, 0.1)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Delete
                </Typography>
              </IconButton>
            </Box>
          </motion.div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/cars", {
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedCars = data._embedded.cars.map((car) => ({
          ...car,
          price: car.price ? Number(car.price) : 0,
        }));
        setCars(formattedCars);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const onDelClick = (url) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const token = sessionStorage.getItem("jwt");
      fetch(url, {
        method: "DELETE",
        headers: { Authorization: token },
      })
        .then((response) => {
          if (response.ok) {
            fetchCars();
            setOpen(true);
          } else {
            alert("Something went wrong!");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const exportData = cars.map((car) => ({
    Марка: car.brand,
    Модель: car.model,
    Год: car.year,
    Цвет: car.color,
    Цена: car.price,
    VIN: car.vin,
  }));

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <StyledHeader
                variant="h4"
                sx={{
                  fontSize: "3rem",
                  fontWeight: 500,
                  color: "rgba(255, 68, )",
                  fontStyle: ["italic", "normal"],
                }}
              >
                Car Inventory
              </StyledHeader>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4 }}
            >
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <AddCar addCar={addCar} />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <ExportData data={exportData} fileName="cars_export" />
                </Box>
              </Box>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={!isLoading ? "visible" : "hidden"}
              exit="exit"
            >
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
                  columns={columns.map((col) => ({
                    ...col,
                    renderCell: (params) => (
                      <motion.div
                        custom={params.rowIndex}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          transitionDelay: `${params.rowIndex * 0.1}s`,
                        }}
                      >
                        {col.renderCell ? col.renderCell(params) : params.value}
                      </motion.div>
                    ),
                  }))}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  getRowId={(row) => row._links.self.href}
                  disableSelectionOnClick
                  disableColumnSelector
                  
                />
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Car deleted successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
