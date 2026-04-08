import React, { useEffect, useState } from "react";
import { addPatient, getTests } from "../api";

function Patients({ setPage }) {
  const [form, setForm] = useState({});
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(() => {
    getTests().then(res => setTests(res.data));
  }, []);

  // ✅ CLEAN toggle (NO total logic here)
  const toggleTest = (id) => {
    setSelectedTests(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  // ✅ CALCULATE TOTAL (CORRECT WAY)
  const total = tests
    .filter(t => selectedTests.includes(t.id))
    .reduce((sum, t) => sum + t.price, 0);

  const submit = async () => {
    await addPatient({ ...form, tests: selectedTests });
    alert("Added");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Patient</h2>

      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      /><br />

      <input
        placeholder="Age"
        onChange={e => setForm({ ...form, age: e.target.value })}
      /><br />

      <input
        placeholder="Gender"
        onChange={e => setForm({ ...form, gender: e.target.value })}
      /><br />

      <input
        placeholder="Phone"
        onChange={e => setForm({ ...form, phone: e.target.value })}
      /><br />

      <h3>Select Tests</h3>

      {tests.map(t => (
        <div key={t.id} style={{ marginBottom: "5px" }}>
          <input
            type="checkbox"
            checked={selectedTests.includes(t.id)}
            onChange={() => toggleTest(t.id)}
          />
          <span style={{ marginLeft: "8px" }}>
            {t.test_name} - ₹{t.price}
          </span>
        </div>
      ))}

      <br />

      <h3>Selected Tests</h3>

      <ul>
        {tests
          .filter(t => selectedTests.includes(t.id))
          .map(t => (
            <li key={t.id}>
              {t.test_name} - ₹{t.price}
            </li>
          ))}
      </ul>

      <h2 style={{ color: "green" }}>
        Total: ₹{total}
      </h2>

      <br />

      <button onClick={submit}>Submit</button>

      <button
        style={{
          marginLeft: "10px",
          padding: "8px 15px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
        onClick={() => setPage("dashboard")}
      >
        Back
      </button>
    </div>
  );
}

export default Patients;