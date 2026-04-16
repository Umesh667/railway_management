import { useNavigate } from "react-router-dom";
import trainBg from "../assets/train-bg.jpg";
import { useState, useEffect } from "react";

function TrainList() {
  const navigate = useNavigate();

  const [trains, setTrains] = useState([]);
const date = localStorage.getItem("date");

const getDayFromDate = (date) => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const d = new Date(date);
  return days[d.getDay()];
};

const selectedDay = getDayFromDate(date);
  // ✅ GET AGE FROM LOCAL STORAGE
  const age = Number(localStorage.getItem("passengerAge"));

  useEffect(() => {
    const fetchTrains = async () => {
      const from = localStorage.getItem("from");
      const to = localStorage.getItem("to");

      try {
        const response = await fetch("http://localhost:5000/api/trains");
        const data = await response.json();

        const filtered = data.filter((train) => {
  const matchRoute =
    train.from.toLowerCase().trim() === from.toLowerCase().trim() &&
    train.to.toLowerCase().trim() === to.toLowerCase().trim();

  const matchDay =
    !train.days || train.days.split(",").includes(selectedDay);

  return matchRoute && matchDay;
});

        setTrains(filtered);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrains();
  }, []);

  return (
    <div style={styles.page}>
      <button style={styles.bookingBtn} onClick={() => navigate("/booking")}>
        🔙 Back to Booking
      </button>

      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Available Trains</h2>
        <h2 style={styles.title}>Available Trains</h2>

{/* ✅ ADD HERE */}
{trains.length === 0 && (
  <p style={{ color: "white", textAlign: "center", marginTop: "10px" }}>
    ❌ No trains available for selected date
  </p>
)}
        <p style={styles.subtitle}>
          Select a train to continue seat booking
        </p>

        {trains.map((train) => {

          // ✅ NEW: CLASS BASED PRICING
const selectedClass = localStorage.getItem("class")?.toUpperCase();
let basePrice = 0;

if (selectedClass === "SLEEPER") basePrice = Number(train.sleeper_price) || 0;
else if (selectedClass === "3-AC") basePrice = Number(train.ac3_price) || 0;
else if (selectedClass === "2-AC") basePrice = Number(train.ac2_price) || 0;
else if (selectedClass === "1-AC") basePrice = Number(train.ac1_price) || 0;
else if (selectedClass === "GENERAL") basePrice = Number(train.general_price) || 0;
else if (selectedClass === "CHAIR CAR") basePrice = Number(train.chair_price) || 0;
          // ✅ APPLY DISCOUNT
          const finalPrice =
            age >= 60 ? Math.floor(basePrice * 0.6) : basePrice;
console.log("CLASS:", selectedClass);
console.log("TRAIN DATA:", train);
console.log("PRICE:", basePrice);
          return (
            <div key={train.id} style={styles.trainRow}>

              {/* LEFT */}
              <div style={styles.left}>
                <h3>🚆 {train.name}</h3>

                <div style={styles.badges}>
                  <span style={styles.badgeGreen}>Recommended</span>
                  <span style={styles.badgeBlue}>Fastest</span>
                </div>

                <p>⏱ Duration: {train.duration} hrs</p>
              </div>

              {/* MIDDLE */}
              <div style={styles.middle}>
                <p>🟢 Departure: {train.departure_time}</p>
                <p>🔴 Arrival: {train.arrival_time}</p>
                <p>💺 Class: {localStorage.getItem("class")}</p>

                <p style={styles.rating}>⭐ 4.5 (120 reviews)</p>
                <p style={styles.available}>🟢 Seats Available</p>
              </div>

              {/* RIGHT */}
              <div style={styles.right}>

                {/* ✅ SHOW FINAL PRICE */}
                <h2 style={styles.price}>₹ {finalPrice}</h2>

                {/* ✅ SHOW DISCOUNT MESSAGE */}
                {age >= 60 && (
                  <p style={{ color: "#00e676", fontSize: "12px" }}>
                    🎉 Senior Discount Applied
                  </p>
                )}

                <button
                  style={styles.selectBtn}
                  onClick={() => {
                    localStorage.setItem("trainId", train.id);
                    localStorage.setItem("trainName", train.name);

                    navigate(`/seatselection/${train.id}`, {
                      state: {
                        ticketPrice: finalPrice,
                        totalSeats: train.total_seats
                      }
                    });
                  }}
                >
                  Select Seat
                </button>
              </div>

            </div>
          );
        })}
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
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    position: "relative",
    fontFamily: "Segoe UI, sans-serif"
  },

  backBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer"
  },

  bookingBtn: {
    position: "absolute",
    top: "20px",
    right: "170px",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer"
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    padding: "30px",
    borderRadius: "20px",
    width: "900px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.2)",
    animation: "fadeIn 0.8s ease"
  },

  title: {
    textAlign: "center",
    color: "#fff",
    fontSize: "26px",
    fontWeight: "700"
  },

  subtitle: {
    textAlign: "center",
    color: "#ccc",
    marginBottom: "25px"
  },

  trainRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "15px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
  },

  left: {
    width: "40%",
    color: "#fff"
  },

  middle: {
    width: "35%",
    color: "#ddd"
  },

  right: {
    width: "25%",
    textAlign: "right"
  },

  badges: {
    display: "flex",
    gap: "8px",
    marginBottom: "6px"
  },

  badgeGreen: {
    background: "#4caf50",
    color: "white",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "12px"
  },

  badgeBlue: {
    background: "#2196f3",
    color: "white",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "12px"
  },

  rating: {
    color: "#ffd700",
    fontSize: "13px"
  },

  available: {
    color: "#4caf50",
    fontSize: "13px",
    fontWeight: "600"
  },

  price: {
    color: "#00e676",
    fontWeight: "700"
  },

  selectBtn: {
    marginTop: "8px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default TrainList;