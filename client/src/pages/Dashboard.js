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

        <div style={{ display: "flex", gap: "20px" }}>
          <div>Patients: {data.patients}</div>
          <div>Tests: {data.tests}</div>
          <div>Done: {data.done}</div>
          <div>Pending: {data.pending}</div>
        </div>

        <br />

        <button onClick={goPatients}>Add Patient</button>
        <button onClick={goTests}>Tests</button>
      </div>
    </>
  );
}

export default Dashboard;