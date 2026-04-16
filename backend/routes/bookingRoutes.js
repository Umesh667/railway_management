const express = require("express");
const db = require("../config/db");

const router = express.Router();


// ================= ADD BOOKING =================
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

  // ✅ GET ALL CLASS PRICES
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

    // ✅ CLASS BASED PRICE
    if (travelClass === "SLEEPER") basePrice = result[0].sleeper_price;
    else if (travelClass === "3-AC") basePrice = result[0].ac3_price;
    else if (travelClass === "2-AC") basePrice = result[0].ac2_price;
    else if (travelClass === "1-AC") basePrice = result[0].ac1_price;
    else if (travelClass === "GENERAL") basePrice = result[0].general_price;
    else if (travelClass === "CHAIR CAR") basePrice = result[0].chair_price;

    // ✅ APPLY DISCOUNT
    let finalAmount = basePrice;

    if (passenger_age >= 60) {
      finalAmount = basePrice * 0.6;
    }

    // ✅ MULTIPLY BY PASSENGERS
    finalAmount = finalAmount * passengers;

    // ================= INSERT =================
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


// ================= GET ALL BOOKINGS =================
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


// ================= GET BOOKING BY PNR =================
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

module.exports = router;