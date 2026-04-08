import React, { useState } from "react";
import { addPatient } from "../api";
import Navbar from "../components/Navbar";

function Patients({ setAuth, goDashboard }) {
  const [form, setForm] = useState({
    name: "", age: "", gender: "", phone: ""
  });

  const submit = async () => {
    await addPatient(form);
    alert("Patient added");
  };

  return (
    <>
      <Navbar setAuth={setAuth} />

      <div style={{ padding: "20px" }}>
        <h2>Add Patient</h2>

        <input placeholder="Name"
          onChange={e => setForm({...form, name: e.target.value})} /><br />

        <input placeholder="Age"
          onChange={e => setForm({...form, age: e.target.value})} /><br />

        <input placeholder="Gender"
          onChange={e => setForm({...form, gender: e.target.value})} /><br />

        <input placeholder="Phone"
          onChange={e => setForm({...form, phone: e.target.value})} /><br />

        <button onClick={submit}>Submit</button>
        <button onClick={goDashboard}>Back</button>
      </div>
    </>
  );
}

export default Patients;