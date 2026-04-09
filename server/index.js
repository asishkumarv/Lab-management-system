const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("ENV FILE PATH:", __dirname + "/.env");
console.log("DB URL:", process.env.DATABASE_URL);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
    [name, email, hashed]
  );

  res.json({ message: "User registered" });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (user.rows.length === 0) {
    return res.status(401).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user.rows[0].id }, "secretkey", {
    expiresIn: "1h",
  });

  res.json({ token });
});

// GET patients
app.get("/patients", async (req, res) => {
  const data = await pool.query("SELECT * FROM patients ORDER BY id DESC");
  res.json(data.rows);
});

// ADD patient
// app.post("/patients", async (req, res) => {
//   const { name, age, gender, phone } = req.body;

//   const result = await pool.query(
//     "INSERT INTO patients (name, age, gender, phone) VALUES ($1,$2,$3,$4) RETURNING *",
//     [name, age, gender, phone]
//   );

//   res.json(result.rows[0]);
// });

app.get("/dashboard", async (req, res) => {
  const patients = await pool.query("SELECT COUNT(*) FROM patients");
  const tests = await pool.query("SELECT COUNT(*) FROM tests");
  const done = await pool.query("SELECT COUNT(*) FROM patient_tests WHERE status='done'");
  const pending = await pool.query("SELECT COUNT(*) FROM patient_tests WHERE status='pending'");

  res.json({
    patients: patients.rows[0].count,
    tests: tests.rows[0].count,
    done: done.rows[0].count,
    pending: pending.rows[0].count,
  });
});

app.post("/tests", async (req, res) => {
  const { category, test_name, price, parameters } = req.body;

  // 1. Insert test
  const test = await pool.query(
    "INSERT INTO tests (category, test_name, price) VALUES ($1,$2,$3) RETURNING *",
    [category, test_name, price]
  );

  const testId = test.rows[0].id;

  // 2. Insert parameters
  for (let p of parameters) {
    await pool.query(
      "INSERT INTO test_parameters (test_id, parameter_name, standard_value) VALUES ($1,$2,$3)",
      [testId, p.name, p.value]
    );
  }

  res.json({ message: "Test + Parameters added" });
});

app.get("/tests", async (req, res) => {
  const data = await pool.query("SELECT * FROM tests");
  res.json(data.rows);
});

app.post("/assign-test", async (req, res) => {
  const { patient_id, test_id } = req.body;

  const test = await pool.query("SELECT price FROM tests WHERE id=$1", [test_id]);

  const price = test.rows[0].price;

  await pool.query(
    "INSERT INTO patient_tests (patient_id, test_id, total_price) VALUES ($1,$2,$3)",
    [patient_id, test_id, price]
  );

  res.json({ message: "Assigned" });
});

//add patient
app.post("/patients", async (req, res) => {
  const { name, age, gender, phone, tests } = req.body;

  // 1. Insert patient
  const patient = await pool.query(
    "INSERT INTO patients (name, age, gender, phone) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, age, gender, phone]
  );

  const patientId = patient.rows[0].id;

  // 2. Insert selected tests
  for (let testId of tests) {
    const test = await pool.query(
      "SELECT price FROM tests WHERE id=$1",
      [testId]
    );

    await pool.query(
      "INSERT INTO patient_tests (patient_id, test_id, price) VALUES ($1,$2,$3)",
      [patientId, testId, test.rows[0].price]
    );
  }

res.json({ 
  message: "Patient + Tests Added",
  patient_id: patientId   // ✅ ADD THIS
});
console.log("API RESPONSE:", res.data);
});

//get patient test
app.get("/patient-tests/:patientId", async (req, res) => {
  const { patientId } = req.params;

  const data = await pool.query(`
    SELECT pt.id, pt.test_id, t.test_name, pt.status
    FROM patient_tests pt
    JOIN tests t ON pt.test_id = t.id
    WHERE pt.patient_id = $1
  `, [patientId]);

  res.json(data.rows);
});

app.get("/test-parameters/:testId", async (req, res) => {
  const { testId } = req.params;

  const data = await pool.query(
    "SELECT * FROM test_parameters WHERE test_id=$1",
    [testId]
  );

  res.json(data.rows);
});

app.post("/submit-results", async (req, res) => {
  const { patient_id, test_id, results } = req.body;

  for (let r of results) {
    await pool.query(
      `INSERT INTO patient_test_results 
       (patient_id, test_id, parameter_id, actual_value)
       VALUES ($1,$2,$3,$4)`,
      [patient_id, test_id, r.parameter_id, r.value]
    );
  }

  // update status
  await pool.query(
    "UPDATE patient_tests SET status='done' WHERE patient_id=$1 AND test_id=$2",
    [patient_id, test_id]
  );

  res.json({ message: "Results saved" });
});

app.get("/report/:patientId/:testId", async (req, res) => {
  const { patientId, testId } = req.params;

  const patient = await pool.query(
    "SELECT * FROM patients WHERE id=$1",
    [patientId]
  );

  const results = await pool.query(`
    SELECT tp.parameter_name, tp.standard_value, pr.actual_value
    FROM patient_test_results pr
    JOIN test_parameters tp ON pr.parameter_id = tp.id
    WHERE pr.patient_id=$1 AND pr.test_id=$2
  `, [patientId, testId]);

  res.json({
    patient: patient.rows[0],
    results: results.rows
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));