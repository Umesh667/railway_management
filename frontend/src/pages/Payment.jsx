import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import trainBg from "../assets/train-bg.jpg";
import qrImage from "../assets/qr.png";  // <-- you can add your own QR image here

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { amount = 0, seats = [] } = location.state || {};

  const [showQR, setShowQR] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setShowQR(true);
  };

  const handlePaymentSuccess = () => {
    setPaid(true);

    // Save payment info (optional)
    localStorage.setItem(
      "lastPayment",
      JSON.stringify({ amount, seats })
    );

    // After success go to ticket summary page
   setTimeout(() => {
    navigate("/ticketsummary", {
      state: {
        from: localStorage.getItem("from"),
        to: localStorage.getItem("to"),
        date: localStorage.getItem("date"),
        travelClass: localStorage.getItem("class"),
        passengers: localStorage.getItem("passengers"),
        seats: JSON.parse(localStorage.getItem("lastSeats")),
        trainName: localStorage.getItem("trainName"),
        amount: amount
      }
    });
  }, 1500);
};

  return (
    <div style={styles.page}>

     <button
  style={styles.backBtn}
  onClick={() =>
    navigate(`/seatselection/${localStorage.getItem("trainId")}`)
  }
>
        ⬅ Back to Seats
      </button>

      <div style={styles.card}>

        <h2 style={styles.title}>Payment Page</h2>

        <div style={styles.amountBox}>
          <h3>Total Amount to Pay</h3>
          <h1 style={{ color: "#0a2a66" }}>₹ {amount}</h1>
        </div>

        {!showQR && !paid && (
          <button style={styles.payBtn} onClick={handlePay}>
            Pay Now
          </button>
        )}

        {showQR && !paid && (
          <div style={styles.qrSection}>
            <h3>Scan QR to Pay</h3>
            <img
              src={qrImage}
              alt="QR Code"
              style={styles.qr}
            />

            <button
              style={styles.successBtn}
              onClick={handlePaymentSuccess}
            >
              Payment Successful ✔
            </button>
          </div>
        )}

        {paid && (
          <p style={styles.successMsg}>
            ✅ Payment Successful! Redirecting...
          </p>
        )}

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
    width: "500px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    marginBottom: "15px"
  },

  amountBox: {
    background: "#f0f4ff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px"
  },

  payBtn: {
    width: "100%",
    padding: "12px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },

  qrSection: {
    marginTop: "20px"
  },

  qr: {
    width: "200px",
    marginBottom: "15px"
  },

  successBtn: {
    width: "100%",
    padding: "10px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  successMsg: {
    color: "green",
    fontWeight: "700",
    marginTop: "15px"
  }
};

export default Payment;
