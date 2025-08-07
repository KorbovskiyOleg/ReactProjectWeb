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
//import { fireEvent } from "@testing-library/dom";

function EditOwner(props) {
  const [open, setOpen] = useState(false);
  const [owner, setOwner] = useState({
    firstName: "",
    lastName: "",
    
  });
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);

  // Validate form on car change
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      if (!owner.firstName?.trim()) {
        newErrors.firstName = "Name is required";
        isValid = false;
      }
      if (!owner.lastName?.trim()) {
        newErrors.lastName = "Surname is required";
        isValid = false;
      }
      

      setErrors(newErrors);
      setFormValid(isValid);
    };

    validateForm();
  }, [owner]);

  // Open the modal form and update the car state
  const handleClickOpen = () => {
    setOwner({
      firstName: props.data.row.firstName,
      lastName: props.data.row.lastName,
      
    });
    setErrors({});
    setOpen(true);
  };

  // Close the modal form
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setOwner({ ...owner, [event.target.name]: event.target.value });
  };

  // Update car and close modal form
  const handleSave = () => {
    if (!formValid) return;

    const updatedOwner = {
      firstName: owner.firstName.trim(),
      lastName: owner.lastName.trim(),
      
    };

    props.updatedOwner(updatedOwner, props.data.id);
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
        <DialogTitle>Edit owner</DialogTitle>
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

export default EditOwner;