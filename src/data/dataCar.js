import EditCar from "../components/EditCar";
import { SERVER_URL } from "../constants";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { motion,  } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// src/data/carData.js

export const carColumns = (cars, clickedCartId, addToCart, setClickedCartId, onDelClick, updateCar) => [
  {
    field: "brand",
    headerName: "Brand",
    flex: 0.5,
    minWidth: 150,
  },
  {
    field: "model",
    headerName: "Model",
    flex: 0.5,
    minWidth: 150,
  },
  {
    field: "color",
    headerName: "Color",
    flex: 0.5,
    minWidth: 150,
  },
  {
    field: "make",
    headerName: "Year",
    flex: 0.5,
    minWidth: 100,
  },
  {
    field: "price",
    headerName: "Price",
    flex: 0.5,
    minWidth: 150,
    cellClassName: "price-cell",
    valueFormatter: (params) => {
      return params.value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  {
    field: "owner",
    headerName: "Owner",
    flex: 0.5,
    minWidth: 150,
    renderCell: (params) => {
      return (
        <Link
          to={`/owners/${params.row.ownerId}`}
          style={{
            textDecoration: "none",
            color: "#1976d2",
            fontWeight: 500,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {params.row.ownerFirstName} {params.row.ownerLastName}
        </Link>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.5,
    sortable: false,
    width: 250,
    renderCell: (params) => {
      const isClicked = clickedCartId === params.row.id;
      return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <EditCar
            data={{ row: params.row, id: params.row.id }}
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
                setClickedCartId(params.row.id);
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
            onClick={() => onDelClick(params.row.id)}
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
      );
    },
  },
];

export const carServices = {
  fetchCars: (setCars, setIsLoading) => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/cars", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setCars(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  },

  deleteCar: (carId, fetchCars, setOpen) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const token = sessionStorage.getItem("jwt");
      fetch(`${SERVER_URL}api/cars/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
  },

  updateCar: (car, carId, fetchCars) => {
    const token = sessionStorage.getItem("jwt");
    fetch(`${SERVER_URL}api/cars/${carId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  },

  addCar: (car, fetchCars) => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  },
};

export const exportCarData = (cars) => {
  return cars.map((car) => ({
    Марка: car.brand,
    Модель: car.model,
    Год: car.year,
    Цвет: car.color,
    Цена: car.price,
    VIN: car.vin,
  }));
};
