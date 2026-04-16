import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Services() {
  const navigate = useNavigate();

  // ✅ Animation
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

  const services = [
    {
      icon: "🎫",
      title: "Ticket Booking",
      desc: "Book train tickets quickly with real-time availability and seat selection."
    },
    {
      icon: "📄",
      title: "PNR Status",
      desc: "Check live PNR status and booking confirmation details instantly."
    },
    {
      icon: "🚆",
      title: "Train Schedule",
      desc: "View complete train routes, timings, and station details."
    },
    {
      icon: "💳",
      title: "Secure Payments",
      desc: "Fast and secure online payments with multiple options."
    },
    {
      icon: "❌",
      title: "Ticket Cancellation",
      desc: "Cancel tickets easily and get instant refund updates."
    },
    {
      icon: "📊",
      title: "Seat Availability",
      desc: "Check seat availability across classes before booking."
    }
  ];

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.container}>
        <h1 style={styles.title}>🚆 Our Services</h1>

        <div style={styles.grid}>
          {services.map((service, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
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
    cursor: "pointer"
  },

  container: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
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
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
    animation: "fadeUp 0.6s ease",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
  },

  icon: {
    fontSize: "40px",
    marginBottom: "10px"
  }
};

// ✅ Hover effect (important)
styles.card[":hover"] = {
  transform: "translateY(-8px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
};

export default Services;