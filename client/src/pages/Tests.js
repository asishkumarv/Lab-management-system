import React, { useState } from "react";
import { addTest } from "../api";
import Navbar from "../components/Navbar";

// MUI
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function Tests({ setPage, setAuth }) {
  const [form, setForm] = useState({
    category: "",
    test_name: "",
    price: ""
  });

  const [parameters, setParameters] = useState([]);

  const addParameter = () => {
    setParameters([...parameters, { name: "", value: "" }]);
  };

  const removeParameter = (index) => {
    const updated = parameters.filter((_, i) => i !== index);
    setParameters(updated);
  };

  const updateParam = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

const submit = async () => {
  // 🔴 Validate main fields
  if (!form.category || !form.test_name || !form.price) {
    alert("Please fill all test details ❗");
    return;
  }

  // 🔴 Validate price
  if (form.price <= 0) {
    alert("Enter valid price ❗");
    return;
  }

  // 🔴 Validate parameters
  if (parameters.length === 0) {
    alert("Please add at least one parameter ❗");
    return;
  }

  // 🔴 Validate each parameter
  for (let i = 0; i < parameters.length; i++) {
    if (!parameters[i].name || !parameters[i].value) {
      alert(`Fill all fields in parameter ${i + 1} ❗`);
      return;
    }
  }

  // ✅ If valid
  await addTest({ ...form, parameters });

  alert("Test added successfully ✅");

  setPage("dashboard");
};

  return (
    <>
      <Navbar setAuth={setAuth} showLogout={true} />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Add Test
            </Typography>

            {/* Category */}
            <TextField
              select
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              margin="normal"
              required
            >
              {["Blood Tests", "Urine Tests", "Diabetes Tests", "Thyroid Tests", "Liver Function Tests", "Kidney Function Tests", "Other Tests"].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Test Name */}
            <TextField
              fullWidth
              label="Test Name"
              value={form.test_name}
              onChange={(e) =>
                setForm({ ...form, test_name: e.target.value })
              }
              margin="normal"
              required
            />

            {/* Price */}
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              margin="normal"
              required
            />

            {/* Parameters Section */}
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Parameters
              </Typography>

              {parameters.map((p, i) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={i}
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Parameter Name"
                      value={p.name}
                      onChange={(e) =>
                        updateParam(i, "name", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Standard Value"
                      value={p.value}
                      onChange={(e) =>
                        updateParam(i, "value", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() => removeParameter(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addParameter}
                sx={{ mt: 1 }}
              >
                Add Parameter
              </Button>
            </Box>

            {/* Actions */}
            <Box mt={4} display="flex" justifyContent="space-between">

              <Button variant="contained" onClick={submit}>
                Save Test
              </Button>

              <Button
                variant="outlined"
                color="secondary"
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

export default Tests;
