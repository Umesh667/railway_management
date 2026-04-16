import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TrainSchedule() {
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/trains`)
      .then(res => res.json())
      .then(data => {
        setTrains(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.page}>
      <button 
  style={styles.backBtn} 
  onClick={() => navigate("/")}
>
  🏠 Home
</button>
      <h2 style={styles.title}>🚆 Train Schedule</h2>

      {loading ? (
        <p style={styles.loading}>Loading trains...</p>
      ) : trains.length === 0 ? (
        <p style={styles.empty}>No trains available</p>
      ) : (
        trains.map((train) => (
          <div key={train.id} style={styles.card}>

            {/* 🔹 TRAIN NAME */}
            <div style={styles.header}>
              <h3 style={styles.trainName}>
                {train.name} 
                <span style={styles.trainNumber}>
                  ({train.number})
                </span>
              </h3>
            </div>

            {/* 🔹 ROUTE */}
            <div style={styles.route}>
              <span>{train.from}</span>
              <span style={styles.arrow}>➝</span>
              <span>{train.to}</span>
            </div>

            {/* 🔹 TIMINGS */}
            <div style={styles.timeRow}>
              <div>
                <p style={styles.label}>Departure</p>
                <p style={styles.value}>{train.departure_time}</p>
              </div>

              <div>
                <p style={styles.label}>Arrival</p>
                <p style={styles.value}>{train.arrival_time}</p>
              </div>

              <div>
                <p style={styles.label}>Duration</p>
                <p style={styles.value}>{train.duration}</p>
              </div>
            </div>

            {/* 🔹 PRICE GRID */}
            <div style={styles.priceGrid}>
              <div>SL ₹{train.sleeper_price}</div>
              <div>3AC ₹{train.ac3_price}</div>
              <div>2AC ₹{train.ac2_price}</div>
              <div>1AC ₹{train.ac1_price}</div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    minHeight: "100vh",
    fontFamily: "Segoe UI",
      position: "relative"
  },

  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "25px"
  },

  loading: {
    color: "white",
    textAlign: "center"
  },

  backBtn: {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "rgba(255,255,255,0.15)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.3)",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  backdropFilter: "blur(8px)",
  transition: "0.3s"
},

  empty: {
    color: "#ddd",
    textAlign: "center"
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
    color: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },

  header: {
    marginBottom: "10px"
  },

  trainName: {
    fontSize: "20px",
    fontWeight: "600"
  },

  trainNumber: {
    fontSize: "14px",
    marginLeft: "8px",
    color: "#ccc"
  },

  route: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    margin: "10px 0",
    fontWeight: "500"
  },

  arrow: {
    color: "#00c6ff",
    fontSize: "20px"
  },

  timeRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    textAlign: "center"
  },

  label: {
    fontSize: "12px",
    color: "#aaa"
  },

  value: {
    fontSize: "16px",
    fontWeight: "600"
  },

  priceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    marginTop: "15px",
    gap: "10px",
    textAlign: "center",
    background: "rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "10px"
  }
};

export default TrainSchedule;