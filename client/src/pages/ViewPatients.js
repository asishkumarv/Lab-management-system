import React, { useEffect, useState } from "react";
import { getPatients } from "../api";
import Navbar from "../components/Navbar";

function ViewPatients({ setAuth, goDashboard }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

const loadPatients = async () => {
  const res = await getPatients();
  setPatients(res.data);   // ✅ correct
};

const filtered = patients.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase()) ||
  p.phone.includes(search) ||
  String(p.id).includes(search)   // ✅ FIX
);

  return (
    <>
      <Navbar setAuth={setAuth} />

      <div style={{ padding: "20px" }}>
        <h2>Patients List</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by id or name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
<button
  onClick={goDashboard}
  style={{
    padding: "10px 20px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  ⬅ Back to Dashboard
</button>
        {/* Table */}
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />

        <button onClick={goDashboard}>Back</button>
      </div>
    </>
  );
}

export default ViewPatients;