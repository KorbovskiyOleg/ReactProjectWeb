import React, { useState } from "react";
import { SERVER_URL } from "../constants.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isAuthenticated, setAuth] = useState(false);

   const handleChange = (event) => {
  setUser({...user, 
     [event.target.name] : event.target.value});
 }

  return (
    <div>
      <Stack spacing={2} alignItems="center" mt={2}>
        <TextField name="username" label="Username" onChange={handleChange} />
        <TextField
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
        />
        <Button variant="outlined" color="primary" onClick={login}>
          Login
        </Button>
      </Stack>
    </div>
  );
}
export default Login;
