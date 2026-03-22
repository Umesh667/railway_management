import { useNavigate } from "react-router-dom";

function Services() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <button
        style={styles.backBtn}
        onClick={() => navigate("/")}
      >
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h1>Our Services</h1>

        <ul style={styles.list}>
          <li>🎫 Online Ticket Booking</li>
          <li>📄 PNR Status Checking</li>
          <li>🚆 Train Schedule Information</li>
          <li>💳 Secure Online Payments</li>
          <li>❌ Ticket Cancellation</li>
        </ul>
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
  list: {
    marginTop: "20px",
    lineHeight: "2",
    fontSize: "18px"
  }
};

export default Services;