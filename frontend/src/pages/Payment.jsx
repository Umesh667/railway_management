import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import trainBg from "../assets/train-bg.jpg";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
const user = JSON.parse(localStorage.getItem("user"));
  const { amount = 0, seats = [] } = location.state || {};

  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("UPI"); 

  // ✅ NET BANKING
  const [selectedBank, setSelectedBank] = useState("");

  // ✅ CARD
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // ✅ UPI
  const [upiId, setUpiId] = useState("");

  const isValidUPI = () => {
    return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId);
  };

  const isCardValid = () => {
    return (
      card.number.length === 16 &&
      card.name &&
      card.expiry &&
      card.cvv.length === 3
    );
  };

  const handlePaymentSuccess = async () => {
    if (!user || !user.id) {
  alert("Please login again");
  navigate("/login");
  return;
}
  setLoading(true);
     
  try {
    // 🔥 ADD THIS API CALL
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        train_name: localStorage.getItem("trainName"),
        from: localStorage.getItem("from"),
        to: localStorage.getItem("to"),
        date: localStorage.getItem("date"),
        class: localStorage.getItem("class"),
        passengers: localStorage.getItem("passengers"),
        seats: JSON.parse(localStorage.getItem("lastSeats")).join(","),
        passenger_name: localStorage.getItem("passengerName"),
        passenger_age: localStorage.getItem("passengerAge"),
        user_id: user.id 
      })
    });

    const data = await res.json();
    console.log("Booking saved:", data);

  } catch (err) {
    console.log(err);
  }

  setTimeout(() => {
    setLoading(false);
    setPaid(true);

    localStorage.setItem(
      "lastPayment",
      JSON.stringify({ amount, seats })
    );

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
  }, 2000);
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

        <h2 style={styles.title}>Secure Payment</h2>
        <p style={styles.secureText}>🔐 100% Secure Payment</p>

        {/* PAYMENT METHODS */}
        <div style={styles.paymentMethods}>
          <p style={styles.methodTitle}>Choose Payment Method</p>

          <div
            style={method === "UPI" ? styles.methodActive : styles.method}
            onClick={() => setMethod("UPI")}
          >
            📱 UPI
          </div>

          <div
            style={method === "CARD" ? styles.methodActive : styles.method}
            onClick={() => setMethod("CARD")}
          >
            💳 Debit / Credit Card
          </div>

          <div
            style={method === "NET" ? styles.methodActive : styles.method}
            onClick={() => setMethod("NET")}
          >
            🏦 Net Banking
          </div>
        </div>

        <div style={styles.amountBox}>
          <h3>Total Amount to Pay</h3>
          <h1 style={{ color: "#0a2a66" }}>₹ {amount}</h1>
        </div>

        {/* ---------------- UPI (UPDATED) ---------------- */}
        {method === "UPI" && !paid && !loading && (
          <div style={styles.form}>
            <input
              placeholder="Enter UPI ID (e.g. 9876543210@ybl)"
              style={styles.input}
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />

            {!isValidUPI() && upiId && (
              <p style={{ color: "red" }}>Enter valid UPI ID</p>
            )}

            <button
              style={styles.payBtn}
              disabled={!isValidUPI() || loading}
              onClick={handlePaymentSuccess}
            >
              Pay ₹ {amount}
            </button>
          </div>
        )}

        {/* ---------------- CARD ---------------- */}
        {method === "CARD" && !paid && !loading && (
          <div style={styles.form}>
            <input
              placeholder="Card Number"
              maxLength={16}
              style={styles.input}
              onChange={(e) =>
                setCard({ ...card, number: e.target.value })
              }
            />

            <input
              placeholder="Name on Card"
              style={styles.input}
              onChange={(e) =>
                setCard({ ...card, name: e.target.value })
              }
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                placeholder="MM/YY"
                style={styles.input}
                onChange={(e) =>
                  setCard({ ...card, expiry: e.target.value })
                }
              />
              <input
                placeholder="CVV"
                maxLength={3}
                style={styles.input}
                onChange={(e) =>
                  setCard({ ...card, cvv: e.target.value })
                }
              />
            </div>

            {!isCardValid() && (
              <p style={{ color: "red" }}>Enter valid card details</p>
            )}

            <button
              style={styles.successBtn}
              disabled={!isCardValid() || loading}
              onClick={handlePaymentSuccess}
            >
              Pay ₹ {amount}
            </button>
          </div>
        )}

        {/* ---------------- NET BANKING ---------------- */}
        {method === "NET" && !paid && !loading && (
          <div style={styles.form}>
            <select
              style={styles.input}
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <option value="">Select Bank</option>
              <option value="SBI">SBI</option>
              <option value="HDFC">HDFC</option>
              <option value="ICICI">ICICI</option>
            </select>

            {!selectedBank && (
              <p style={{ color: "red" }}>Please select a bank</p>
            )}

            <button
              style={styles.successBtn}
              disabled={!selectedBank || loading}
              onClick={handlePaymentSuccess}
            >
              Proceed to Pay
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {paid && (
          <div style={styles.successAnim}>
            ✔
            <p>Payment Successful! Redirecting...</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* ✅ CSS UNCHANGED */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    position: "relative",
    fontFamily: "Segoe UI, sans-serif"
  },

  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    padding: "35px",
    borderRadius: "20px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
  },

  title: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700"
  },

  secureText: {
    color: "#4caf50",
    fontSize: "13px",
    marginBottom: "15px"
  },

  paymentMethods: {
    marginBottom: "20px",
    textAlign: "left"
  },

  methodTitle: {
    color: "#ccc",
    fontSize: "13px",
    marginBottom: "8px"
  },

  method: {
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    color: "#ccc",
    marginBottom: "10px",
    cursor: "pointer"
  },

  methodActive: {
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    color: "white",
    marginBottom: "10px",
    fontWeight: "600"
  },

  amountBox: {
    background: "rgba(255,255,255,0.2)",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
    color: "#fff"
  },

  payBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer"
  },

  form: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none"
  },

  successBtn: {
    padding: "12px",
    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },

  loader: {
    marginTop: "20px",
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid #00c6ff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginInline: "auto"
  },

  successAnim: {
    fontSize: "40px",
    color: "#4caf50",
    marginTop: "20px"
  }
};

export default Payment;