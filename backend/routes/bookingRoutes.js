const express = require("express");
const db = require("../config/db");

const router = express.Router();


router.post("/add", (req, res) => {

  console.log("Booking API HIT");
  console.log(req.body);

  const {
    train_name,
    from,
    to,
    date,
    class: travelClass,
    passengers,
    seats,
    passenger_name,
    passenger_age
  } = req.body;

  const generatePNR = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const pnr = generatePNR();

  const getPriceSql = `
    SELECT sleeper_price, ac3_price, ac2_price, ac1_price, general_price, chair_price 
    FROM trains WHERE name = ?
  `;

  db.query(getPriceSql, [train_name], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Train not found" });
    }

    let basePrice = 0;

    if (travelClass === "SLEEPER") basePrice = result[0].sleeper_price;
    else if (travelClass === "3-AC") basePrice = result[0].ac3_price;
    else if (travelClass === "2-AC") basePrice = result[0].ac2_price;
    else if (travelClass === "1-AC") basePrice = result[0].ac1_price;
    else if (travelClass === "GENERAL") basePrice = result[0].general_price;
    else if (travelClass === "CHAIR CAR") basePrice = result[0].chair_price;

    let finalAmount = basePrice;

    if (passenger_age >= 60) {
      finalAmount = basePrice * 0.6;
    }

    finalAmount = finalAmount * passengers;

    const sql = `
      INSERT INTO bookings 
      (train_name, from_station, to_station, travel_date, \`class\`, passengers, seats, amount, passenger_name, passenger_age, pnr)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        train_name,
        from,
        to,
        date,
        travelClass,
        passengers,
        seats,
        finalAmount,
        passenger_name,
        passenger_age,
        pnr
      ],
      (err, result) => {

        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          message: "Booking successful",
          pnr,
          finalAmount
        });
      }
    );

  });
});


router.get("/", (req, res) => {

  const sql = "SELECT * FROM bookings ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(result);
  });
});


router.get("/pnr/:pnr", (req, res) => {
  const { pnr } = req.params;

  const sql = "SELECT * FROM bookings WHERE pnr = ?";

  db.query(sql, [pnr], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "PNR not found" });
    }

    res.json(result[0]);
  });
});
// ❌ CANCEL TICKET API (FINAL VERSION)
router.put("/cancel/:pnr", (req, res) => {
  const { pnr } = req.params;

  // Step 1: Get booking details
  const getSql = "SELECT seats, status FROM bookings WHERE pnr = ?";

  db.query(getSql, [pnr], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "PNR not found" });
    }

    // 🔥 NEW CHECK
    if (result[0].status === "CANCELLED") {
      return res.json({ message: "Ticket already cancelled" });
    }

    const seats = result[0].seats;

    // Step 2: Update status
    const updateSql = "UPDATE bookings SET status = 'CANCELLED' WHERE pnr = ?";

    db.query(updateSql, [pnr], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        message: "Ticket cancelled successfully",
        seats
      });
    });
  });
});
module.exports = router;