import React, { useState } from "react";
import { loginUser } from "../api";

function Login({ setAuth, goRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      setAuth(true);
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={e => setForm({...form, email: e.target.value})} /><br />

      <input type="password" placeholder="Password"
        onChange={e => setForm({...form, password: e.target.value})} /><br />

      <button onClick={login}>Login</button>
      <p onClick={goRegister} style={{ cursor: "pointer" }}>
        Create Account
      </p>
    </div>
  );
}

export default Login;