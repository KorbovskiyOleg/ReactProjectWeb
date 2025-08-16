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

// проверка комита
function AddOwner(props) {
  const [open, setOpen] = useState(false);
  const [owner, setOwner] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email:"",
    address: "",
    
  });
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      if (!owner.lastName.trim()) {
        newErrors.lastName = "Name is required";
        isValid = false;
      }
      if (!owner.firstName.trim()) {
        newErrors.firstName = "Surname is required";
        isValid = false;
      }
      if (!owner.phone.trim()) {
        newErrors.phone = "Phone is required";
        isValid = false;
      }
      if (!owner.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      }
      if (!owner.address.trim()) {
        newErrors.address = "Address is required";
        isValid = false;
      }
      

      setErrors(newErrors);
      setFormValid(isValid);
    };

    validateForm();
  }, [owner]);

  const handleClickOpen = () => {
    setOwner({
      lastName: "",
      firstName: "",
      phone:"",
      email:"",
      address:"",
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setOwner({ ...owner, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    if (!formValid) return;

    const newOwner = {
      firstName: owner.firstName.trim(),
      lastName: owner.lastName.trim(),
      phone:owner.phone.trim(),
      email:owner.email.trim(),
      address:owner.address.trim(),
    };

    props.addOwner(newOwner);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        New Owner
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
        <DialogTitle>New owner</DialogTitle>
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
              label="Name"
              name="firstName"
              autoFocus
              variant="standard"
              value={owner.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
            <TextField
              label="Surname"
              name="lastName"
              variant="standard"
              value={owner.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />

            <TextField
              label="Phone"
              name="phone"
              variant="standard"
              value={owner.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />

            <TextField
              label="Email"
              name="email"
              variant="standard"
              value={owner.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />

            <TextField
              label="Address"
              name="address"
              variant="standard"
              value={owner.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              required
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

export default AddOwner;