// src/CarList.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCar from "./AddCar";
import { Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useCart } from "./CartContext";
import ExportData from "./ExportData";
import { carServices, exportCarData } from "../data/dataCar";
import CarDataGrid from "./CarDataGrid";

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
  const [isVisible] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    carServices.fetchCars(setCars, setIsLoading);
  };

  const onDelClick = (carId) => {
    carServices.deleteCar(carId, fetchCars, setOpen);
  };

  const updateCar = (car, carId) => {
    carServices.updateCar(car, carId, fetchCars);
  };

  const addCar = (car) => {
    carServices.addCar(car, fetchCars);
  };

  const exportData = exportCarData(cars);

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
              <CarDataGrid
                cars={cars}
                isLoading={isLoading}
                clickedCartId={clickedCartId}
                addToCart={addToCart}
                onDelClick={onDelClick}
                updateCar={updateCar}
                setClickedCartId={setClickedCartId}
              />
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
