const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();


router.post("/register", async (req, res) => {

  const {
    first_name,
    last_name,
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

  if (!first_name || !last_name || !age || !gender || !phone || !username || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const checkUserSql = "SELECT * FROM users WHERE username = ? OR phone = ?";
db.query(checkUserSql, [username, phone], async (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
  const user = result[0];

  if (user.username === username) {
    return res.status(400).json({ message: "Username already exists" });
  }

  if (user.phone === phone) {
    return res.status(400).json({ message: "Phone number already exists" });
  }
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
        [first_name, last_name, age, gender, phone, email, username, hashedPassword, city, state, pincode],
        (err, result) => {

          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
  return res.status(400).json({
    message: "User already exists (phone or username)"
  });
}
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