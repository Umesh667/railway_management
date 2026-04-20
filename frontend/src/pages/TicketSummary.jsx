import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import trainBg from "../assets/train-bg.jpg";
import jsPDF from "jspdf"; // ✅ ADDED
import html2canvas from "html2canvas";

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
  const downloadTicket = async () => {
  const element = ticketRef.current;

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 190;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("Railway_Ticket.pdf");
};
  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

    <div ref={ticketRef} style={styles.card}>

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