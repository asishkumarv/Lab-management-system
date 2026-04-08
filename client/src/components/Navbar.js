import React from "react";

function Navbar({ setAuth }) {
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <div style={{
      background: "#1976d2",
      color: "white",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <h2>Lab Management System</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;