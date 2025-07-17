import React, { useState } from "react";
import { SERVER_URL } from "../constants.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";

function Login({ onLoginSuccess }) {
  // Принимаем пропс из App.js
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const login = () => {
    fetch(SERVER_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        const jwtToken = res.headers.get("Authorization");
        if (jwtToken !== null) {
          sessionStorage.setItem("jwt", jwtToken);
          onLoginSuccess(); // Вызываем колбэк из App.js вместо setAuth
        } else {
          setOpen(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setOpen(true);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Stack spacing={2} alignItems="center" sx={{ width: 300 }}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          fullWidth
          onChange={handleChange}
        />
        <Button variant="contained" fullWidth onClick={login} sx={{ mt: 2 }}>
          Login
        </Button>
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Login failed: Check your username and password"
      />
    </Box>
  );
}

export default Login;
