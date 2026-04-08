import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Tests from "./pages/Tests";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("dashboard");

  if (!auth) {
    return page === "register"
      ? <Register goLogin={() => setPage("login")} />
      : <Login setAuth={setAuth} goRegister={() => setPage("register")} />;
  }

 if (page === "patients")
  return <Patients setPage={setPage} setAuth={setAuth} />;

  if (page === "tests")
    return <Tests setAuth={setAuth} goDashboard={() => setPage("dashboard")} />;

  return <Dashboard
    setAuth={setAuth}
    goPatients={() => setPage("patients")}
    goTests={() => setPage("tests")}
  />;
}

export default App;