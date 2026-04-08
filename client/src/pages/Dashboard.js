import React, { useEffect, useState } from "react";
import { getDashboard } from "../api";
import Navbar from "../components/Navbar";

function Dashboard({ setAuth, goPatients, goTests }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    getDashboard(token).then(res => setData(res.data));
  }, []);

  return (
    <>
      <Navbar setAuth={setAuth} />

      <div style={{ padding: "20px" }}>
        <h2>Dashboard</h2>

<div style={{ display: "flex", gap: "30px", justifyContent: "center", marginTop: "40px" }}>
  {[
    { label: "Patients", value: data.patients },
    { label: "Tests", value: data.tests },
    { label: "Done", value: data.done },
    { label: "Pending", value: data.pending }
  ].map((item, i) => (
    <div key={i} style={{
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      background: "#1976d2",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    }}>
      <h2>{item.value || 0}</h2>
      <p>{item.label}</p>
    </div>
  ))}
</div>

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
</div>
      </div>
    </>
  );
}

export default Dashboard;