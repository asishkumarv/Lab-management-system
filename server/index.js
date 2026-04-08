const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());



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

// GET patients
app.get("/patients", async (req, res) => {
  const data = await pool.query("SELECT * FROM patients ORDER BY id DESC");
  res.json(data.rows);
});

// ADD patient
app.post("/patients", async (req, res) => {
  const { name, age, gender, phone } = req.body;

  const result = await pool.query(
    "INSERT INTO patients (name, age, gender, phone) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, age, gender, phone]
  );

  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));