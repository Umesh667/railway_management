import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import trainBg from "../assets/train-bg.jpg";

function TicketSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read data sent from Payment page OR from localStorage
  const [summary, setSummary] = useState({
    from: localStorage.getItem("from") || "Not Provided",
    to: localStorage.getItem("to") || "Not Provided",
    date: localStorage.getItem("date") || "Not Provided",
    travelClass: localStorage.getItem("class") || "Not Provided",
    passengers: localStorage.getItem("passengers") || "0",
    seats: JSON.parse(localStorage.getItem("lastSeats") || "[]"),
    trainName: localStorage.getItem("trainName") || "Not Selected",
    amount: location.state?.amount || localStorage.getItem("lastAmount") || "0"
  });

  useEffect(() => {
    // Save amount so page refresh doesn't break
    if (location.state?.amount) {
      localStorage.setItem("lastAmount", location.state.amount);
    }
  }, []);

  const downloadTicket = () => {
    const ticketText = `
🚆 RAILWAY E-TICKET
----------------------------
Train: ${summary.trainName}
From: ${summary.from}
To: ${summary.to}
Date: ${summary.date}
Class: ${summary.travelClass}
Passengers: ${summary.passengers}
Seats Booked: ${summary.seats.join(", ")}
Total Paid: ₹ ${summary.amount}
Payment Status: SUCCESSFUL
----------------------------
Thank you for booking!
    `;

    const blob = new Blob([ticketText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Railway_Ticket.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.card}>

        <h2 style={styles.title}>🎟 Ticket Summary</h2>
        <p style={{ textAlign: "center", color: "green", fontWeight: "600" }}>
          ✅ Payment Successful
        </p>

        <div style={styles.box}>
          <p><b>Train:</b> {summary.trainName}</p>
          <p><b>From:</b> {summary.from}</p>
          <p><b>To:</b> {summary.to}</p>
          <p><b>Date:</b> {summary.date}</p>
          <p><b>Class:</b> {summary.travelClass}</p>
          <p><b>Passengers:</b> {summary.passengers}</p>
          <p><b>Seats Booked:</b> {summary.seats.join(", ")}</p>
          <p><b>Total Paid:</b> ₹ {summary.amount}</p>
        </div>

        <button style={styles.downloadBtn} onClick={downloadTicket}>
          ⬇ Download Ticket
        </button>

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
    position: "relative"
  },

  backBtn: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "550px",
    textAlign: "left",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    textAlign: "center",
    marginBottom: "10px"
  },

  box: {
    background: "#f0f4ff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px"
  },

  downloadBtn: {
    width: "100%",
    padding: "12px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  }
};

export default TicketSummary;
