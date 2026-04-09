import React, { useState } from "react";
import { registerUser } from "../api";
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

function Register({ goLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const register = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    await registerUser({
      name: form.name,
      email: form.email,
      password: form.password
    });

    alert("Registered Successfully ✅");
    goLogin();
  };

  return (
    <>
      <Navbar showLogout={false} />

      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Register
            </Typography>

            <TextField
              fullWidth
              label="Name"
              margin="normal"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

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

            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              margin="normal"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <Box mt={2}>
              <Button fullWidth variant="contained" onClick={register}>
                Register
              </Button>
            </Box>

            <Typography
              mt={2}
              sx={{ cursor: "pointer", textAlign: "center" }}
              onClick={goLogin}
            >
              Already have an account? Login
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Register;