import React, { useState } from "react";
import { addTest } from "../api";
import Navbar from "../components/Navbar";

function Tests({ setPage, setAuth }) {
  const [form, setForm] = useState({
    category: "",
    test_name: "",
    price: ""
  });

  const [parameters, setParameters] = useState([]);

  const addParameter = () => {
    setParameters([...parameters, { name: "", value: "" }]);
  };

  const updateParam = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  const submit = async () => {
    await addTest({ ...form, parameters });
    alert("Test added");
  };

  return (
    <>
      <Navbar setAuth={setAuth} />

      <div style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto"
      }}>
        <h2>Add Test</h2>

        <select
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          <option>Select Category</option>
          <option>Blood Tests</option>
          <option>Urine Tests</option>
          <option>Diabetes Tests</option>
          <option>Thyroid Tests</option>
          <option>Liver Function Tests</option>
          <option>Kidney Function Tests</option>
          <option>Other Tests</option>
        </select><br /><br />

        <input
          placeholder="Test Name"
          onChange={e => setForm({ ...form, test_name: e.target.value })}
        /><br /><br />

        <input
          placeholder="Price"
          onChange={e => setForm({ ...form, price: e.target.value })}
        /><br /><br />

        <h3>Parameters</h3>

        {parameters.map((p, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              placeholder="Parameter Name"
              onChange={e => updateParam(i, "name", e.target.value)}
            />
            <input
              placeholder="Standard Value"
              onChange={e => updateParam(i, "value", e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>
        ))}

        <button onClick={addParameter}>+ Add Parameter</button>

        <br /><br />

        <button onClick={submit}>Save Test</button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => setPage("dashboard")}
        >
          Back
        </button>
      </div>
    </>
  );
}

export default Tests;