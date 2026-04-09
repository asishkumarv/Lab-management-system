import React, { useEffect, useState } from "react";
import {
  getPatients,
  getPatientTests,
  getTestParameters,
  submitResults,
  getReport
} from "../api";
import Navbar from "../components/Navbar";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

function ViewPatients({ setAuth, goDashboard }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [tests, setTests] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const [parameters, setParameters] = useState([]);
  const [results, setResults] = useState({});

  const [report, setReport] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  // 🔥 OPEN TESTS POPUP
  const openTests = async (patientId) => {
    setSelectedPatient(patientId);
    const res = await getPatientTests(patientId);
    setTests(res.data);
    setOpen(true);
  };
const handleClose = () => {
  setOpen(false);

  // reset everything
  setTests([]);
  setParameters([]);
  setResults({});
  setReport(null);
  setSelectedTest(null);
};
  // 🔥 ENTER RESULTS
  const handleEnterResults = async (test) => {
    setSelectedTest(test.test_id);
    setReport(null);

    const res = await getTestParameters(test.test_id);
    setParameters(res.data);
    setResults({});
  };

  // 🔥 SAVE RESULTS
  const saveResults = async () => {
    const formatted = Object.keys(results).map((key) => ({
      parameter_id: key,
      value: results[key]
    }));

    await submitResults({
      patient_id: selectedPatient,
      test_id: selectedTest,
      results: formatted
    });

    alert("Results Saved ✅");

    // refresh tests
    openTests(selectedPatient);
    setParameters([]);
  };

  // 🔥 VIEW REPORT
  const handleReport = async (test) => {
    const res = await getReport(selectedPatient, test.test_id);
    setReport(res.data);
    setParameters([]);
  };
const handlePrint = () => {
  const printContent = document.getElementById("report-section").innerHTML;

  const newWindow = window.open("", "", "width=800,height=600");
  newWindow.document.write(`
    <html>
      <head>
        <title>Lab Report</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        <h2>LAB REPORT</h2>
        ${printContent}
      </body>
    </html>
  `);

  newWindow.document.close();
  newWindow.print();
};
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    String(p.id).includes(search)
  );

  return (
    <>
      <Navbar setAuth={setAuth} showLogout={true} />

      <div style={{ padding: "20px" }}>
        <h2>Patients List</h2>

        {/* SEARCH */}
      <Box
  display="flex"
  alignItems="center"
  gap={2}
  mb={2}
>
  <TextField
    label="Search by ID / Name / Phone"
    variant="outlined"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    size="small"
    sx={{ width: 300 }}
  />

  <Button
    variant="outlined"
    startIcon={<ArrowBackIcon />}
    onClick={goDashboard}
  >
    Back
  </Button>
</Box>

        {/* TABLE */}
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Tests</th>
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
                <td>
                  <Button
                    variant="contained"
                    onClick={() => openTests(p.id)}
                  >
                    View Tests
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 TESTS POPUP */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle
  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
>
  Patient Tests

  <IconButton onClick={handleClose}>
    <CloseIcon />
  </IconButton>
</DialogTitle>

        <DialogContent>
          {/* TEST LIST */}
          {tests.map((t) => (
            <Box key={t.test_id} mb={2}>
              <Typography>{t.test_name}</Typography>

              {t.status === "done" ? (
                <Button onClick={() => handleReport(t)}>
                  View Report
                </Button>
              ) : (
                <Button onClick={() => handleEnterResults(t)}>
                  Submit Results
                </Button>
              )}
            </Box>
          ))}

          {/* 🔥 ENTER RESULTS FORM */}
          {parameters.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Enter Results</Typography>

              {parameters.map((p) => (
                <TextField
                  key={p.id}
                  label={`${p.parameter_name} (${p.standard_value})`}
                  fullWidth
                  margin="normal"
                  onChange={(e) =>
                    setResults((prev) => ({
                      ...prev,
                      [p.id]: e.target.value
                    }))
                  }
                />
              ))}

              <Button variant="contained" onClick={saveResults}>
                Save Results
              </Button>
            </Box>
          )}

          {/* 🔥 REPORT VIEW */}
         {report && (
  <Box mt={3}>
    <div id="report-section">
  <Typography variant="h5" align="center" gutterBottom>
    LAB REPORT
  </Typography>

  <Typography variant="h6">
    🧪 Test: {report.test_name}
  </Typography>

  <Typography>Patient ID: {report.patient.id}</Typography>
  <Typography>Name: {report.patient.name}</Typography>
  <Typography>Age: {report.patient.age}</Typography>
  <Typography>Gender: {report.patient.gender}</Typography>
  <Typography>Phone: {report.patient.phone}</Typography>

  <br />

  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Parameter</TableCell>
        <TableCell>Standard</TableCell>
        <TableCell>Actual</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {report.results.map((r, i) => (
        <TableRow key={i}>
          <TableCell>{r.parameter_name}</TableCell>
          <TableCell>{r.standard_value}</TableCell>
          <TableCell>{r.actual_value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
    {/* 🔥 PRINT BUTTON */}
    <Button
      variant="contained"
      color="success"
      sx={{ mt: 2 }}
      onClick={handlePrint}
    >
      Print Report
    </Button>
  </Box>
)}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViewPatients;