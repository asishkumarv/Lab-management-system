import React, { useState } from "react";
import { registerUser } from "../api";

function Register({ goLogin }) {
  const [form, setForm] = useState({
    name: "", email: "", password: ""
  });

  const register = async () => {
    await registerUser(form);
    alert("Registered!");
    goLogin();
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={e => setForm({...form, name: e.target.value})} /><br />

      <input placeholder="Email"
        onChange={e => setForm({...form, email: e.target.value})} /><br />

      <input type="password" placeholder="Password"
        onChange={e => setForm({...form, password: e.target.value})} /><br />

      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;