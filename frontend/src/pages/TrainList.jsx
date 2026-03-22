import { useNavigate } from "react-router-dom";
import trainBg from "../assets/train-bg.jpg";
import { useState, useEffect } from "react";

function TrainList() {
  const navigate = useNavigate();
  useEffect(() => {
  const fetchTrains = async () => {
    const from = localStorage.getItem("from");
    const to = localStorage.getItem("to");

    try {
      const response = await fetch("http://localhost:5000/api/trains");
      const data = await response.json();

      // 🔥 FILTER BASED ON USER INPUT
      const filtered = data.filter(
        (train) =>
          train.from.toLowerCase().trim() === from.toLowerCase().trim() &&
          train.to.toLowerCase().trim() === to.toLowerCase().trim()
      );

      setTrains(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  fetchTrains();
}, []);

  const [trains, setTrains] = useState([]);

  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.card}>

        <h2 style={styles.title}>Available Trains</h2>
        <p style={styles.subtitle}>
          Select a train to continue seat booking
        </p>

        {trains.map((train) => (
          <div key={train.id} style={styles.trainRow}>

            <div style={styles.left}>
              <h3>{train.name}</h3>
              <p>⏱ Duration: {train.duration}</p>
            </div>

            <div style={styles.middle}>
             <p>🚆 Departure: {train.departure_time}</p>
<p>🏁 Arrival: {train.arrival_time}</p>
<p>💺 Class: {localStorage.getItem("class")}</p>
<h3 style={{ color: "#0a2a66" }}>₹ 500</h3>
            </div>

            <div style={styles.right}>

              <button
  style={styles.selectBtn}
  onClick={() => {
localStorage.setItem("trainId", train.id);   // ✅ ADD THIS
   navigate(`/seatselection/${train.id}`, {
  state: { 
    ticketPrice: 500, // temporary fixed price
    totalSeats: train.total_seats  // 🔥 IMPORTANT
  }
});
  }}
>
  Select Seat
</button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: `linear-gradient(rgba(10,42,102,0.7), rgba(10,42,102,0.7)), url(${trainBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative"
  },

  backBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "900px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    textAlign: "center",
    marginBottom: "5px"
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px"
  },

  trainRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "12px"
  },

  left: {
    width: "40%"
  },

  middle: {
    width: "35%"
  },

  right: {
    width: "25%",
    textAlign: "right"
  },

  selectBtn: {
    marginTop: "8px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default TrainList;
