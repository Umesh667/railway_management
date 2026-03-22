const express = require("express");
const db = require("../config/db");

const router = express.Router();


// ================= GET ALL TRAINS =================
router.get("/", (req, res) => {

  const sql = "SELECT * FROM trains ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(result);
  });
});


// ================= ADD TRAIN =================
router.post("/add", (req, res) => {

  const {
    name,
    number,
    from,
    to,
    departure_time,
    arrival_time,
    duration,
    total_seats
  } = req.body;

  const sql = `
    INSERT INTO trains 
    (name, number, \`from\`, \`to\`, departure_time, arrival_time, duration, total_seats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, number, from, to, departure_time, arrival_time, duration, total_seats],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Train added successfully" });
    }
  );
});


// ================= DELETE TRAIN =================
router.delete("/:id", (req, res) => {

  const trainId = req.params.id;

  const sql = "DELETE FROM trains WHERE id = ?";

  db.query(sql, [trainId], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Train deleted successfully" });

  });
});


module.exports = router;