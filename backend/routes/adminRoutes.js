const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/login", (req, res) => {

  console.log("BODY RECEIVED:", req.body);

  const { username, password } = req.body;

  const sql = "SELECT * FROM admins WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    res.json({
      message: "Admin login successful",
      admin: {
        id: result[0].id,
        username: result[0].username
      }
    });

  });

});

module.exports = router;