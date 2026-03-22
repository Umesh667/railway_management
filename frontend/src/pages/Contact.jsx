import { useNavigate } from "react-router-dom";

function Contact() {
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
        <h1>Contact Us</h1>

        <p>Email: support@railway.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: Railway Headquarters, India</p>
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
  }
};

export default Contact;