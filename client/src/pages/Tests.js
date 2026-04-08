import React, { useState } from "react";
import { addTest } from "../api";
import Navbar from "../components/Navbar";

function Tests({ setAuth, goDashboard }) {
  const [form, setForm] = useState({
    category: "", test_name: "", price: ""
  });

  const submit = async () => {
    await addTest(form);
    alert("Test added");
  };

  return (
    <>
      <Navbar setAuth={setAuth} />

      <div style={{ padding: "20px" }}>
        <h2>Tests</h2>

        <select onChange={e => setForm({...form, category: e.target.value})}>
          <option>Blood Tests</option>
          <option>Urine Tests</option>
          <option>Diabetes Tests</option>
          <option>Thyroid Tests</option>
          <option>Liver Function Tests</option>
          <option>Kidney Function Tests</option>
          <option>Other Tests</option>
        </select><br />

        <input placeholder="Test Name"
          onChange={e => setForm({...form, test_name: e.target.value})} /><br />

        <input placeholder="Price"
          onChange={e => setForm({...form, price: e.target.value})} /><br />

        <button onClick={submit}>Add Test</button>
        <button onClick={goDashboard}>Back</button>
      </div>
    </>
  );
}

export default Tests;