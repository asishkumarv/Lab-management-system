import React, { useEffect, useState } from "react";
import { getDashboard } from "../api";
import Navbar from "../components/Navbar";
import { Box, Typography } from "@mui/material";
function Dashboard({ setAuth, goPatients, goTests, goViewPatients }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    getDashboard(token).then(res => setData(res.data));
  }, []);

  return (
    <>
      <Navbar setAuth={setAuth} showLogout={true} />

      <div style={{ padding: "20px" }}>
        <Typography variant="h5" textAlign="center" mt={2}>
  Dashboard
</Typography>

<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    mt: 5,
    flexDirection: "row",     // ✅ force row
    flexWrap: "nowrap",       // ✅ prevent vertical stacking
    overflowX: "auto"         // ✅ scroll on small screens
  }}
>
  {[
    { label: "Patients", value: data.patients, color: "#1976d2", filled: true },
    { label: "Tests Available", value: data.tests, color: "#9c27b0", filled: true },
    { label: "Done", value: data.done, color: "#4caf50", filled: false },
    { label: "Pending", value: data.pending, color: "#f44336", filled: false }
  ].map((item, i) => (
    <Box
      key={i}
      sx={{
        width: { xs: 100, sm: 130, md: 150 },
        height: { xs: 100, sm: 130, md: 150 },
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        // ✅ Filled vs Outlined
        background: item.filled ? item.color : "transparent",
        border: item.filled ? "none" : `2px solid ${item.color}`,
        color: item.filled ? "white" : item.color,

        boxShadow: item.filled
          ? "0 4px 10px rgba(0,0,0,0.2)"
          : "none",

        transition: "0.3s"
      }}
    >
      <Typography variant="h5">
        {item.value || 0}
      </Typography>

      <Typography variant="body2">
        {item.label}
      </Typography>
    </Box>
  ))}
</Box>

        <br />

<div style={{
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "40px"
}}>
  <button onClick={goPatients} style={{
    padding: "12px 25px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }}>
    Add Patient
  </button>

  <button onClick={goTests} style={{
    padding: "12px 25px",
    background: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }}>
    Tests
  </button>
<button onClick={goViewPatients} style={{
  padding: "12px 25px",
  background: "#2196f3",
  color: "white",
  border: "none",
  borderRadius: "8px"
}}>
  View Patients
</button>
</div>
      </div>
    </>
  );
}

export default Dashboard;