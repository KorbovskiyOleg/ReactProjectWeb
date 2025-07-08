import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

function EditCar(props) {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    color: "",
    make: "",
    fuel: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);

  // Validate form on car change
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      if (!car.brand?.trim()) {
        newErrors.brand = "Brand is required";
        isValid = false;
      }
      if (!car.model?.trim()) {
        newErrors.model = "Model is required";
        isValid = false;
      }
      if (!car.color?.trim()) {
        newErrors.color = "Color is required";
        isValid = false;
      }
      if (!car.make) {
        // Для числового поля make просто проверяем наличие
        newErrors.make = "Make is required";
        isValid = false;
      }
      if (!car.price || isNaN(car.price)) {
        newErrors.price = "Valid price is required";
        isValid = false;
      }

      setErrors(newErrors);
      setFormValid(isValid);
    };

    validateForm();
  }, [car]);

  // Open the modal form and update the car state
  const handleClickOpen = () => {
    setCar({
      brand: props.data.row.brand,
      model: props.data.row.model,
      color: props.data.row.color,
      make: props.data.row.make,
      fuel: props.data.row.fuel,
      price: props.data.row.price,
    });
    setErrors({});
    setOpen(true);
  };

  // Close the modal form
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCar({
      ...car,
      [name]: name === "make" || name === "price" ? Number(value) : value,
    });
  };

  // Update car and close modal form
  const handleSave = () => {
    if (!formValid) return;

    const updatedCar = {
      brand: car.brand.trim(),
      model: car.model.trim(),
      color: car.color.trim(),
      make: car.make, // Числовое значение, не триммим
      fuel: car.fuel?.trim(), // Опциональное поле
      price: parseFloat(car.price),
    };

    props.updateCar(updatedCar, props.data.id);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            style: {
              minHeight: "500px",
              maxHeight: "80vh",
            },
          },
        }}
      >
        <DialogTitle>Edit car</DialogTitle>
        <DialogContent dividers sx={{ paddingBottom: "20px" }}>
          <Box height="56px">
            {!formValid && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Please fill all required fields correctly
              </Alert>
            )}
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Brand"
              name="brand"
              autoFocus
              variant="standard"
              value={car.brand}
              onChange={handleChange}
              error={!!errors.brand}
              helperText={errors.brand}
              required
            />
            <TextField
              label="Model"
              name="model"
              variant="standard"
              value={car.model}
              onChange={handleChange}
              error={!!errors.model}
              helperText={errors.model}
              required
            />
            <TextField
              label="Color"
              name="color"
              variant="standard"
              value={car.color}
              onChange={handleChange}
              error={!!errors.color}
              helperText={errors.color}
              required
            />
            <TextField
              label="Make (Year)"
              name="make"
              variant="standard"
              value={car.make}
              onChange={handleChange}
              error={!!errors.make}
              helperText={errors.make}
              required
              type="number"
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
            />
            <TextField
              label="Price"
              name="price"
              variant="standard"
              value={car.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              required
              type="number"
              inputProps={{ min: 0 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!formValid}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditCar;
