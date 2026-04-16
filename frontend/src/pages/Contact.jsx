import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Contact() {
  const navigate = useNavigate();

  // ✅ Animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeUp {
        from {opacity:0; transform:translateY(30px);}
        to {opacity:1; transform:translateY(0);}
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.page}>
      <button
        style={styles.backBtn}
        onClick={() => navigate("/")}
      >
        🏠 Back to Home
      </button>

      <div style={styles.container}>
        <h1 style={styles.title}>📞 Contact Us</h1>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.icon}>📧</div>
            <h3>Email</h3>
            <p>yesireddyumesh@gmail.com</p>
          </div>

          <div style={styles.card}>
            <div style={styles.icon}>📞</div>
            <h3>Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div style={styles.card}>
            <div style={styles.icon}>📍</div>
            <h3>Address</h3>
            <p>Kurnool, Andhra Pradesh, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    padding: "40px",
    fontFamily: "Poppins, sans-serif"
  },

  backBtn: {
    marginBottom: "30px",
    padding: "10px 18px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s"
  },

  container: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    animation: "fadeUp 0.6s ease"
  },

  title: {
    textAlign: "center",
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
  },

  icon: {
    fontSize: "40px",
    marginBottom: "10px"
  }
};

// ✅ Hover effect (global)
const style = document.createElement("style");
style.innerHTML = `
  div:hover {
    transform: translateY(-6px);
  }
`;
document.head.appendChild(style);

export default Contact;