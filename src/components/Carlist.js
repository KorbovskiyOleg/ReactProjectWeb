import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddCar from "./AddCar";
import EditCar from "./EditCar";
import { SERVER_URL } from "../constants";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: 15,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backgroundColor: "#ffffff",
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: "1.8rem",
}));

export default function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);

  // Функция для обновления автомобиля
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

  // Функция для добавления автомобиля
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
      headerName: "🚗 Brand",
      headerClassName: "header-theme",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "model",
      headerName: "🏎 Model",
      headerClassName: "header-theme",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "color",
      headerName: "🎨 Color",
      headerClassName: "header-theme",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
        </Box>
      ),
    },
    {
      field: "make",
      headerName: "📅 Year",
      headerClassName: "header-theme",
      type: "number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "price",
      headerName: "💰 Price ($)",
      headerClassName: "header-theme",
      type: "number",
      flex: 1,
      minWidth: 150,
      cellClassName: "price-cell",
    },
    {
      field: "actions",
      headerName: "⚙️ Actions",
      headerClassName: "header-theme",
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <EditCar
            data={{ row: params.row, id: params.id }}
            updateCar={updateCar}
          />
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
      ),
    },
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
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
      })
      .catch((err) => console.error(err));
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

  return (
    <StyledPaper>
      <StyledHeader variant="h4">Car Inventory</StyledHeader>

      <Box sx={{ mb: 3 }}>
        <AddCar addCar={addCar} />
      </Box>

      <Box
        sx={{
          height: 600,
          width: "100%",
          "& .header-theme": {
            backgroundColor: "#1976d2 !important ",
            color: "#ffffff ",
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
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row) => row._links.self.href}
          disableSelectionOnClick
        />
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Car deleted successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </StyledPaper>
  );
}
