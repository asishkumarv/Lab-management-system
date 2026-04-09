import React, { useState } from "react";
import { loginUser } from "../api";
import Navbar from "../components/Navbar";

import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box
} from "@mui/material";

function Login({ setAuth, goRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const login = async () => {
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      setAuth(true);
    } catch {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <>
      <Navbar showLogout={false} />

      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <Box mt={2}>
              <Button fullWidth variant="contained" onClick={login}>
                Login
              </Button>
            </Box>

            <Typography
              mt={2}
              sx={{ cursor: "pointer", textAlign: "center" }}
              onClick={goRegister}
            >
              Create Account
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Login;