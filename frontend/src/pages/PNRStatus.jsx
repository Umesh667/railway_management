import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PNRStatus() {
  const navigate = useNavigate();
  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState(null);

  const checkPNR = async () => {
  if (pnr.length !== 10) {
    alert("PNR must be 10 digits");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/pnr/${pnr}`);
    const data = await res.json();

    setResult({
      train: data.train_name,
      from: data.from_station,
      to: data.to_station,
      date: data.travel_date,
      status: "Confirmed"
    });

  } catch (error) {
    alert("PNR not found");
    console.log(error);
  }
};

  return (
    <div style={styles.page}>
      <button
        style={styles.backBtn}
        onClick={() => navigate("/")}
      >
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h1>Check PNR Status</h1>

        <input
          style={styles.input}
          placeholder="Enter 10-digit PNR Number"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
        />

        <button style={styles.checkBtn} onClick={checkPNR}>
          Check Status
        </button>

        {result && (
          <div style={styles.result}>
            <p><strong>Train:</strong> {result.train}</p>
            <p><strong>From:</strong> {result.from}</p>
            <p><strong>To:</strong> {result.to}</p>
            <p><strong>Date:</strong> {result.date}</p>
            <p><strong>Status:</strong> {result.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    padding: "50px",
    fontFamily: "Poppins, sans-serif"
  },
  backBtn: {
    marginBottom: "30px",
    padding: "10px 18px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  checkBtn: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  result: {
    marginTop: "30px",
    background: "#f4f6fb",
    padding: "20px",
    borderRadius: "12px"
  }
};

export default PNRStatus;