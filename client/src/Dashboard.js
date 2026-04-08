import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://lab-management-system-nz8y.onrender.com"; // change later after deployment

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });

  // Fetch patients
  const fetchPatients = async () => {
    const res = await axios.get(`${API}/patients`);
    setPatients(res.data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add patient
  const addPatient = async () => {
    await axios.post(`${API}/patients`, form);
    fetchPatients();
    setForm({ name: "", age: "", gender: "", phone: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h2>Total Patients: {patients.length}</h2>

      <h3>Add Patient</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

      <br /><br />
      <button onClick={addPatient}>Add Patient</button>

      <h3>Patient List</h3>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} - {p.age} - {p.gender} - {p.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;