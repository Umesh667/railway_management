const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "nozomi.proxy.rlwy.net",
  user: "root",
  password: "yDDrhWVlZEQCLJFUpqxPAiiaNTpChHVc",
  database: "railway",
  port: 33622
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = db;