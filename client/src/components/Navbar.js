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
      padding: "20px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2 style={{ margin: 0, fontSize: "18px" }}>
        Lab Management System
      </h2>

      <button
        onClick={logout}
        style={{
          background: "#e53935",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "13px"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;