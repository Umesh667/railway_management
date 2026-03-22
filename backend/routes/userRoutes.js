const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {

  const {
    first,
    last,
    age,
    gender,
    phone,
    email,
    username,
    password,
    city,
    state,
    pincode
  } = req.body;

  // Basic validation
  if (!first || !last || !age || !gender || !phone || !username || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    // Check if username already exists
    const checkUserSql = "SELECT * FROM users WHERE username = ?";
    
    db.query(checkUserSql, [username], async (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users 
        (first_name, last_name, age, gender, phone, email, username, password, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [first, last, age, gender, phone, email, username, hashedPassword, city, state, pincode],
        (err, result) => {

          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to register user" });
          }

          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name
      }
    });

  });
});


module.exports = router;