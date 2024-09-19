import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
import mysql from "mysql2";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: `${process.env.DOMAIN}`,
    credentials: "true",
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("error", err);
    return;
  } else {
    console.log("db connected");
  }
});

// form submission
app.post("/submit-form", (req, res) => {
  const { request_type_id, email, phno, company_name, company_site, message } =
    req.body;

  // Validate required fields
  if (!request_type_id || !email || !phno || !company_name || !company_site) {
    return res.status(400).send("All required fields must be filled");
  }

  const query = `
        INSERT INTO glform (request_type_id, email, phno, company_name, company_site, message) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [request_type_id, email, phno, company_name, company_site, message || null],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("Database error");
      }
      res.status(200).send("Form submitted successfully");
    }
  );
});

// Fetch all glform data
app.get("/glform-data", (req, res) => {
  const query = `SELECT * FROM glform`;

  // Execute the query to fetch data
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Database error");
    }
    // Send the fetched data as JSON
    res.status(200).json(results);
  });
});

// Get Request Types
app.get("/request-types", (req, res) => {
  const query = `SELECT * FROM request_type`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching request types:", err);
      return res.status(500).send("Database error");
    }
    res.status(200).json(results);
  });
});

// testing
app.get("/test", (req, res) => {
  res.json({ msg: "it's working" });
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
