import React, { useEffect, useState } from "react";
import { addPatient, getTests } from "../api";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  // Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
   MenuItem
} from "@mui/material";

function Patients({ setPage, setAuth }) {
  const [form, setForm] = useState({});
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");
const [filteredTests, setFilteredTests] = useState([]);
const [selectedTestId, setSelectedTestId] = useState("");
const categories = [...new Set(tests.map(t => t.category))];

  useEffect(() => {
    getTests().then((res) => setTests(res.data));
  }, []);

  // const toggleTest = (id) => {
  //   setSelectedTests((prev) =>
  //     prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
  //   );
  // };
const handleCategoryChange = (category) => {
  setSelectedCategory(category);

  const filtered = tests.filter(t => t.category === category);
  setFilteredTests(filtered);

  setSelectedTestId(""); // reset test dropdown
};
const addSelectedTest = () => {
  if (!selectedTestId) return;

  if (!selectedTests.includes(selectedTestId)) {
    setSelectedTests([...selectedTests, selectedTestId]);
  }
};
  const total = tests
    .filter((t) => selectedTests.includes(t.id))
    .reduce((sum, t) => sum + t.price, 0);

const submit = async () => {
  const res = await addPatient({ ...form, tests: selectedTests });

  const patientId = res.data.patient_id;  // ✅ get ID

  generatePDF(patientId);  // pass ID

  alert("Patient Added + PDF Generated");

  setPage("dashboard");
};
//pdf generation with jsPDF
const generatePDF = (patientId) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("LAB MANAGEMENT SYSTEM", 60, 20);

  doc.setFontSize(12);
doc.text(`Patient ID: ${patientId}`, 150, 30);
  doc.text(`Name: ${form.name || ""}`, 20, 40);
  doc.text(`Age: ${form.age || ""}`, 20, 50);
  doc.text(`Gender: ${form.gender || ""}`, 20, 60);
  doc.text(`Phone: ${form.phone || ""}`, 20, 70);
doc.setFontSize(10);
doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 40);
doc.text(`Time: ${new Date().toLocaleTimeString()}`, 150, 50);
  const selected = tests.filter(t => selectedTests.includes(t.id));

  const tableData = selected.map((t, i) => [
    i + 1,
    t.category,
    t.test_name,
    `Rs. ${t.price}`
  ]);

  autoTable(doc, {
    startY: 90,
    head: [["#", "Category", "Test Name", "Price"]],
    body: tableData,
  });

  doc.text(`Total: Rs. ${total}`, 150, doc.lastAutoTable.finalY + 10);

  // 👉 PRINT instead of download
  const pdfBlob = doc.output("blob");
  const url = URL.createObjectURL(pdfBlob);

  const printWindow = window.open(url);

  printWindow.onload = () => {
    printWindow.print();
  };
};
  return (
    <>
      <Navbar setAuth={setAuth} showLogout={true} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Add Patient
            </Typography>

            {/* Patient Details */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Name"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  onChange={(e) =>
                    setForm({ ...form, age: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Gender"
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </Grid>
            </Grid>



{/* Select Tests (Dropdown UI) */}
<Box mt={4}>
  <Typography variant="h6" gutterBottom>
    Select Tests
  </Typography>

  {/* Category Dropdown */}
  <TextField
    select
    fullWidth
    label="Select Category"
    value={selectedCategory}
    onChange={(e) => handleCategoryChange(e.target.value)}
    sx={{ mb: 2 }}
  >
    {categories.map((cat, i) => (
      <MenuItem key={i} value={cat}>
        {cat}
      </MenuItem>
    ))}
  </TextField>

  {/* Test Dropdown */}
  <TextField
    select
    fullWidth
    label="Select Test"
    value={selectedTestId}
    onChange={(e) => setSelectedTestId(Number(e.target.value))}
    sx={{ mb: 2 }}
    disabled={!selectedCategory}
  >
    {filteredTests.map((t) => (
      <MenuItem key={t.id} value={t.id}>
        {t.test_name} - ₹{t.price}
      </MenuItem>
    ))}
  </TextField>

  <Button variant="contained" onClick={addSelectedTest}>
    Add Test
  </Button>
</Box>

{/* Selected Tests Table */}
<Box mt={4}>
  <Typography variant="h6">Selected Tests</Typography>

  <TableContainer component={Paper} sx={{ mt: 1 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Test Name</TableCell>
          <TableCell>Price</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {tests
          .filter((t) => selectedTests.includes(t.id))
          .map((t, index) => (
            <TableRow key={t.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell>{t.test_name}</TableCell>
              <TableCell>₹{t.price}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

{/* Total */}
<Box mt={3} textAlign="right">
  <Typography variant="h6" color="green">
    Total: ₹{total}
  </Typography>
</Box>

            {/* Buttons */}
            <Box mt={4} display="flex"  gap={2}>


<Button variant="contained" onClick={submit}>
  Submit
</Button>

<Button
  variant="outlined"
  sx={{ ml: 2 }}
  onClick={() => setPage("dashboard")}
>
  Back
</Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Patients;