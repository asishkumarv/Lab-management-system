import React, { useEffect, useState } from "react";
import {
  getPatients,
  getPatientTests,
  getTestParameters,
  submitResults,
  getReport
} from "../api";
import Navbar from "../components/Navbar";

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

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    String(p.id).includes(search)
  );

  return (
    <>
      <Navbar setAuth={setAuth} />

      <div style={{ padding: "20px" }}>
        <h2>Patients List</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by id or name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button onClick={goDashboard}>⬅ Back</button>

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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Patient Tests</DialogTitle>

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
              <Typography variant="h6">
                {report.patient.name} | Age: {report.patient.age}
              </Typography>

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
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViewPatients;