import React, { useState } from "react";
import { SERVER_URL } from "../constants.js";

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isAuthenticated, setAuth] = useState(false);

  return <div></div>;
}
export default Login;
