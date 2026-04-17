const express = require("express");
const db = require("../config/db");

const router = express.Router();

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

router.post("/add", (req, res) => {

  const {
    name,
    number,
    from,
    to,
    departure_time,
    arrival_time,
    duration,
    total_seats,
    sleeper_price,
  ac3_price,
  ac2_price,
  ac1_price,
  general_price,
  chair_price,
  days
  } = req.body;

  const sql = `
   INSERT INTO trains 
    (name, number, \`from\`, \`to\`, departure_time, arrival_time, duration, total_seats,
     sleeper_price, ac3_price, ac2_price, ac1_price, general_price, chair_price, days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, number, from, to, departure_time, arrival_time, duration, Number(total_seats),

  Number(sleeper_price),
  Number(ac3_price),
  Number(ac2_price),
  Number(ac1_price),
  Number(general_price),
  Number(chair_price),
  days],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Train added successfully" });
    }
  );
});

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