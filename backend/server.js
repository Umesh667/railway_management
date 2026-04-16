const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const trainRoutes = require("./routes/trainRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(5000, () => {
  console.log("Server running on ${import.meta.env.VITE_API_URL}");
});
