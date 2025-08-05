import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { motion, AnimatePresence } from "framer-motion";
import AddOwner from "./AddOwner";
//import EditCar from "./EditCar";
import { SERVER_URL } from "../constants";
import { Snackbar } from "@mui/material";
//import IconButton from "@mui/material/IconButton";
//import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
//import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
//import ModelIcon from "@mui/icons-material/PrecisionManufacturing";
//import PaletteIcon from "@mui/icons-material/Palette";
//import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
//import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
//import SettingsIcon from "@mui/icons-material/Settings";
//import { useCart } from "./CartContext";
//import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
//import ExportData from "./ExportData";

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

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible] = useState(true);


  const addOwner = (owner) => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/owners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(owner),
    })
      .then((response) => {
        if (response.ok) {
          fetchOwners();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwt");

    fetch(SERVER_URL + "api/owners", {
      headers: {
        Authorization: `Bearer ${token}`, // ← Исправлено
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          }); // Читаем текст ошибки
        }
        return response.json();
      })
      .then((data) => {
        setOwners(data._embedded.owners || []); // Защита от undefined
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div>Загрузка данных...</div>; // ← Добавлено
  }

  const columns = [
    {
      field: "firstName",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span>Name ({owners.length})</span>
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
      field: "lastName",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span>Surname</span>
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
  ];

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
                Car owners
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
                  <AddOwner addOwner={addOwner} />
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
                  rows={owners}
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
