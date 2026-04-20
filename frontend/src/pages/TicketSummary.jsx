import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import trainBg from "../assets/train-bg.jpg";
import jsPDF from "jspdf"; 

function TicketSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSaved = useRef(false);
const ticketRef = useRef();
  const [summary, setSummary] = useState({
    passengerName: localStorage.getItem("passengerName") || "Not Provided",
    passengerAge: localStorage.getItem("passengerAge") || "Not Provided",
    from: localStorage.getItem("from") || "Not Provided",
    to: localStorage.getItem("to") || "Not Provided",
    date: localStorage.getItem("date") || "Not Provided",
    travelClass: localStorage.getItem("class") || "Not Provided",
    passengers: localStorage.getItem("passengers") || "0",
    seats: JSON.parse(localStorage.getItem("lastSeats") || "[]"),
    trainName: localStorage.getItem("trainName") || "Not Selected",
    amount: location.state?.amount || 0,
    pnr: localStorage.getItem("pnr") || "Generating..."
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeScale {
        from {opacity:0; transform:scale(0.9);}
        to {opacity:1; transform:scale(1);}
      }

      @keyframes moveBg {
        0% {background-position:center;}
        100% {background-position:center 30px;}
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const saveBooking = async () => {
      try {
        const passengerName = localStorage.getItem("passengerName");
        const passengerAge = localStorage.getItem("passengerAge");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            train_name: localStorage.getItem("trainName"),
            from: localStorage.getItem("from"),
            to: localStorage.getItem("to"),
            date: localStorage.getItem("date"),
            class: localStorage.getItem("class"),
            passengers: localStorage.getItem("passengers"),
            seats: JSON.parse(localStorage.getItem("lastSeats") || "[]").join(", "),
            passenger_name: passengerName,
            passenger_age: passengerAge
          })
        });

        const data = await res.json();

        localStorage.setItem("pnr", data.pnr);
        localStorage.setItem("finalAmount", data.finalAmount);

        setSummary((prev) => ({
          ...prev,
          pnr: data.pnr
        }));
      } catch (error) {
        console.log(error);
      }
    };

    saveBooking();
  }, []);

  const copyPNR = () => {
    navigator.clipboard.writeText(summary.pnr);
    alert("PNR copied: " + summary.pnr);
  };

  // ✅ UPDATED PDF DOWNLOAD FUNCTION ONLY
  const downloadTicket = () => {
  const doc = new jsPDF();

  // HEADER
  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text("CURRENT BOOKING", 10, 10);
  doc.text("CURRENT BOOKING", 140, 10);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Electronic Reservation Slip (ERS)", 105, 18, { align: "center" });

  // FROM → TO BOX
  doc.rect(10, 22, 190, 40);

  doc.setFontSize(11);
  doc.text("From", 15, 30);
  doc.text("To", 150, 30);
  doc.text("Boarding At", 80, 30);

  doc.setFontSize(12);
  doc.text(summary.from, 15, 36);
  doc.text("→", 100, 36);
  doc.text(summary.to, 150, 36);

  doc.setFontSize(10);
  doc.text(`Date: ${summary.date}`, 15, 45);
  doc.text(`Class: ${summary.travelClass}`, 150, 45);

  // PNR + TRAIN BOX
  doc.rect(10, 65, 190, 20);

  doc.setFontSize(11);
  doc.text(`PNR: ${summary.pnr}`, 15, 75);
  doc.text(`Train: ${summary.trainName}`, 100, 75);

  // PASSENGER TABLE (ONLY ONCE ✅)
  doc.text("Passenger Details", 10, 95);

  doc.rect(10, 100, 190, 30);

  // HEADER
  doc.setFontSize(10);
  doc.text("Name", 15, 108);
  doc.text("Age", 60, 108);
  doc.text("Gender", 90, 108);
  doc.text("Seat", 120, 108);
  doc.text("Status", 160, 108);

  doc.line(10, 110, 200, 110);

  // DATA
  doc.text(summary.passengerName, 15, 118);
  doc.text(summary.passengerAge.toString(), 60, 118);
  doc.text("M", 90, 118); // change if needed
  doc.text(summary.seats.join(", "), 120, 118);
  doc.text("CONFIRMED", 160, 118);

  // PAYMENT
  doc.text("Payment Details", 10, 140);

  doc.rect(10, 145, 190, 20);

  doc.text(`Total Fare: ₹ ${summary.amount}`, 15, 155);

  // FOOTER
  doc.setFontSize(9);
  doc.text("Carry valid ID proof during travel.", 10, 175);
  doc.text("This is a computer generated ticket.", 10, 182);

  doc.save("Railway_Ticket.pdf");
};
  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

    <div ref={ticketRef} style={styles.card}>

     <h3 style={{ textAlign: "center", color: "#0a2a66" }}>
    RAILWAY E-TICKET
  </h3>
  <hr />
  
        <h2 style={styles.title}>🎟 Ticket Summary</h2>

        <p style={styles.success}>
          ✅ Payment Successful
        </p>

        <div style={styles.pnrBox}>
          🎫 <b>PNR:</b> {summary.pnr}
          <button style={styles.copyBtn} onClick={copyPNR}>
            📋 Copy
          </button>
        </div>

        <div style={styles.box}>

          <p>👤 <b>Name:</b> {summary.passengerName}</p>
          <p>🎂 <b>Age:</b> {summary.passengerAge}</p>

          <hr />

          <p>🚆 <b>Train:</b> {summary.trainName}</p>
          <p>📍 <b>From:</b> {summary.from}</p>
          <p>📍 <b>To:</b> {summary.to}</p>

          <hr />

          <p>📅 <b>Date:</b> {summary.date}</p>
          <p>💺 <b>Class:</b> {summary.travelClass}</p>
          <p>👥 <b>Passengers:</b> {summary.passengers}</p>
          <p>🎫 <b>Seats:</b> {summary.seats.join(", ")}</p>

          <hr />

          <p style={styles.amount}>💰 Total Paid: ₹ {summary.amount}</p>

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
    background: `
      linear-gradient(rgba(10,42,102,0.7), rgba(10,42,102,0.7)),
      url(${trainBg})
    `,
    backgroundSize: "cover",
    animation: "moveBg 12s infinite alternate",
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
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "18px",
    width: "560px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    animation: "fadeScale 0.6s ease"
  },

  title: {
    textAlign: "center",
    marginBottom: "5px"
  },

  success: {
    textAlign: "center",
    color: "green",
    fontWeight: "600",
    marginBottom: "15px"
  },

  // ✅ NEW STYLE
  pnrBox: {
    background: "#e8f0ff",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    color: "#0a2a66"
  },

  copyBtn: {
    background: "#0a2a66",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },

  box: {
    background: "#f4f7ff",
    padding: "18px",
    borderRadius: "12px",
    lineHeight: "1.8"
  },

  amount: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0a2a66"
  },

  downloadBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg,#0a2a66,#1e4db7)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "15px"
  }
};

export default TicketSummary;