import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function Navbar({ setAuth, showLogout = false }) {
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          Lab Management System
        </Typography>

        {showLogout && (
          <Button color="error" variant="contained" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;