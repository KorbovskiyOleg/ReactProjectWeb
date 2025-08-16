import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// проверка комита
function AddCar(props) {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    color: "",
    make: "",
    fuel: "",
    price: "",
    owner: {
      firstName:"",
      lastName:""
    }
  });
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      if (!car.brand.trim()) {
        newErrors.brand = "Brand is required";
        isValid = false;
      }
      if (!car.model.trim()) {
        newErrors.model = "Model is required";
        isValid = false;
      }
      if (!car.color.trim()) {
        newErrors.color = "Color is required";
        isValid = false;
      }
      if (!car.make.trim()) {
        newErrors.make = "Make is required";
        isValid = false;
      }
      if (!car.price || isNaN(car.price)) {
        newErrors.price = "Valid price is required";
        isValid = false;
      }

      // Валидация полей владельца
      if (!car.owner.firstName.trim()) {
        newErrors.ownerFirstName = "Owner first name is required";
        isValid = false;
      }
      if (!car.owner.lastName.trim()) {
        newErrors.ownerLastName = "Owner last name is required";
        isValid = false;
      }

      setErrors(newErrors);
      setFormValid(isValid);
    };

    validateForm();
  }, [car]);

  const handleClickOpen = () => {
    setCar({
      brand: "",
      model: "",
      color: "",
      make: "",
      fuel: "",
      price: "",
      owner: {
        firstName: "",
        lastName: ""
      }
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    if (name.startsWith("owner.")) {
      const ownerField = name.split(".")[1];
      setCar({
        ...car,
        owner: {
          ...car.owner,
          [ownerField]: value
        }
      });
    } else {
      setCar({ ...car, [name]: value });
    }
  };

  const handleSave = () => {
    if (!formValid) return;

    const newCar = {
      brand: car.brand.trim(),
      model: car.model.trim(),
      color: car.color.trim(),
      make: car.make.trim(),
      fuel: car.fuel.trim(),
      price: parseFloat(car.price),
      ownerFirstName: car.owner.firstName.trim(),
      ownerLastName: car.owner.lastName.trim()
    };

    props.addCar(newCar);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        New Car
      </Button>
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
        <DialogTitle>New car</DialogTitle>
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
              label="Make"
              name="make"
              variant="standard"
              value={car.make}
              onChange={handleChange}
              error={!!errors.make}
              helperText={errors.make}
              required
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
            />
            {/* Поля владельца */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="subtitle1" gutterBottom>
                Owner Information
              </Typography>
              <TextField
                label="Name"
                name="owner.firstName"
                variant="standard"
                value={car.owner.firstName}
                onChange={handleChange}
                error={!!errors.ownerFirstName}
                helperText={errors.ownerFirstName}
                required
                fullWidth
              />
              <TextField
                label="Surname"
                name="owner.lastName"
                variant="standard"
                value={car.owner.lastName}
                onChange={handleChange}
                error={!!errors.ownerLastName}
                helperText={errors.ownerLastName}
                required
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>

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

export default AddCar;
