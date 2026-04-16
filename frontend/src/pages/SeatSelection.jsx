import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import trainBg from "../assets/train-bg.jpg";

const SEATS_PER_BOGIE = 60;
const TOTAL_BOGIES = 50;

function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ticketPrice = 0 } = location.state || {};
const selectedClass = (localStorage.getItem("class") || "").toUpperCase();
  const [bookedSeats, setBookedSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLimit, setSeatLimit] = useState(1);
  const [activeBogie, setActiveBogie] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookedSeatsByBogie")) || {};
    setBookedSeats(stored);

    const limit = Number(localStorage.getItem("seatLimit")) || 1;
    setSeatLimit(limit);
  }, []);

  const getBogieType = (b) => {
  if (b <= 2 || b >= 49) return "GENERAL";
  if (b >= 3 && b <= 12) return "SLEEPER";
  if (b >= 13 && b <= 20) return "3-AC";
  if (b >= 21 && b <= 28) return "2-AC";
  if (b >= 29 && b <= 34) return "1-AC";
};
const getBogieLabel = (b) => {
  if (b >= 3 && b <= 12) {
  return `S${b - 2}`;   // S1–S10
}

if (b >= 13 && b <= 20) {
  return `A${b - 12}`;  // A1–A8 (3-AC)
}

if (b >= 21 && b <= 28) {
  return `B${b - 20}`;  // B1–B8 (2-AC)
}

if (b >= 29 && b <= 34) {
  return `C${b - 28}`;  // C1–C6 (1-AC)
}
};
  const getBogieColor = (b) => {
    const type = getBogieType(b);
    if (type === "GENERAL") return "#b0bec5";
    if (type === "SLEEPER") return "#0a2a66";
    if (type === "3-AC") return "#1565c0";
    if (type === "2-AC") return "#2e7d32";
    if (type === "1-AC") return "#6a1b9a";
  };

  const toggleSeat = (bogie, seatNo) => {
    const seatKey = `B${bogie}-S${seatNo}`;

    if (bookedSeats[bogie]?.includes(seatKey)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatKey)) {
        return prev.filter(s => s !== seatKey);
      }

      if (prev.length >= seatLimit) {
        alert(`⚠️ You can select only ${seatLimit} seats`);
        return prev;
      }

      return [...prev, seatKey];
    });
  };

  const confirmSeats = () => {
    const updated = { ...bookedSeats };

    selectedSeats.forEach(seat => {
      const bogie = seat.split("-")[0].replace("B", "");
      if (!updated[bogie]) updated[bogie] = [];
      updated[bogie].push(seat);
    });

    localStorage.setItem("bookedSeatsByBogie", JSON.stringify(updated));
    localStorage.setItem("lastSeats", JSON.stringify(selectedSeats));

    const totalAmount = selectedSeats.length * ticketPrice;

    navigate("/payment", {
      state: {
        amount: totalAmount,
        seats: selectedSeats
      }
    });
  };

  const renderBogieButtons = () => {
  let buttons = [];

  for (let i = 1; i <= TOTAL_BOGIES; i++) {
    const type = getBogieType(i);

    if (type !== selectedClass) continue;

    buttons.push(
      <button
        key={i}
        style={{
          ...styles.bogieBtn,
          background: getBogieColor(i)
        }}
        onClick={() => setActiveBogie(i)}
      >
        {getBogieLabel(i)} <br />
        <small>{type}</small>
      </button>
    );
  }

  return buttons;
};

 const renderSeats = () => {
  if (!activeBogie) return null;

  const type = getBogieType(activeBogie);

  let layout = [];
 
  for (let i = 0; i < SEATS_PER_BOGIE; i += 8) {
    layout.push(
      <div key={i} style={styles.compartment}>
{/* -------- SLEEPER -------- */}
{type === "SLEEPER" && (
  <>
    <div style={styles.matrix}>
      {[0,1,2].map((row) => (
        <div key={row} style={styles.row}>
          {[0,1].map((col) => {
            const seatNo = i + row + col * 3 + 1;
            const seatKey = `B${activeBogie}-S${seatNo}`;
            const labels = ["LB","MB","UB"];
            return renderSeatBox(seatNo, seatKey, labels[row]);
          })}
        </div>
      ))}
    </div>

    <div style={styles.sideSeats}>
      {[6,7].map((offset, idx) => {
        const seatNo = i + offset + 1;
        const seatKey = `B${activeBogie}-S${seatNo}`;
        return renderSeatBox(seatNo, seatKey, idx === 0 ? "SL" : "SU");
      })}
    </div>
  </>
)}
        {/* -------- 3AC -------- */}
        {type === "3-AC" && (
          <>
            <div style={styles.matrix}>
              {[0,1,2].map((row) => (
                <div key={row} style={styles.row}>
                  {[0,1].map((col) => {
                    const seatNo = i + row + col * 3 + 1;
                    const seatKey = `B${activeBogie}-S${seatNo}`;
                    const labels = ["LB","MB","UB"];
                    return renderSeatBox(seatNo, seatKey, labels[row]);
                  })}
                </div>
              ))}
            </div>

            <div style={styles.sideSeats}>
              {[6,7].map((offset, idx) => {
                const seatNo = i + offset + 1;
                const seatKey = `B${activeBogie}-S${seatNo}`;
                return renderSeatBox(seatNo, seatKey, idx === 0 ? "SL" : "SU");
              })}
            </div>
          </>
        )}

        {/* -------- 2AC -------- */}
        {type === "2-AC" && (
          <>
            <div style={styles.matrix}>
              {[0,1].map((row) => (
                <div key={row} style={styles.row}>
                  {[0,1].map((col) => {
                    const seatNo = i + row + col * 2 + 1;
                    const seatKey = `B${activeBogie}-S${seatNo}`;
                    const labels = ["LB","UB"];
                    return renderSeatBox(seatNo, seatKey, labels[row]);
                  })}
                </div>
              ))}
            </div>

            <div style={styles.sideSeats}>
              {[4,5].map((offset, idx) => {
                const seatNo = i + offset + 1;
                const seatKey = `B${activeBogie}-S${seatNo}`;
                return renderSeatBox(seatNo, seatKey, idx === 0 ? "SL" : "SU");
              })}
            </div>
          </>
        )}

        {/* -------- 1AC -------- */}
       {type === "1-AC" && (
  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
    <div style={styles.matrix}>
      {[0,1].map((row) => {
        const seatNo = (i / 4) + row + 1;
        const seatKey = `B${activeBogie}-S${seatNo}`;
        const labels = ["LB","UB"];
        return (
          <div key={row} style={styles.row}>
            {renderSeatBox(seatNo, seatKey, labels[row])}
          </div>
        );
      })}
    </div>
  </div>
)}
      </div>
    );
  }

  return layout;
};
const renderSeatBox = (seatNo, seatKey, label) => {
  const isBooked = bookedSeats[activeBogie]?.includes(seatKey);
  const isSelected = selectedSeats.includes(seatKey);

  return (
    <div
      key={seatNo}
      onClick={() => toggleSeat(activeBogie, seatNo)}
      style={{
        ...styles.seatBox,
       background: isBooked
  ? "linear-gradient(135deg, #ff4d4d, #d32f2f)"   // 🔴 booked
  : isSelected
  ? "linear-gradient(135deg, #4caf50, #2e7d32)"   // 🟢 selected
  : "linear-gradient(135deg, #f5f5f5, #e0e0e0)",  // ⚪ available
color: isBooked || isSelected ? "white" : "#333",
      }}
    >
      <div>{seatNo}</div>
      <small>{label}</small>
    </div>
  );
};
  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate("/trainlist")}>
        ⬅ Back to Trains
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Select Coach & Seats</h2>

        <p style={styles.limitText}>
          You can select maximum {seatLimit} seat(s)
        </p>

        <div style={styles.bogieGrid}>
          {renderBogieButtons()}
        </div>

        {activeBogie && (
          <>
            <h3 style={styles.sectionTitle}>
              Seats in Coach {activeBogie} — {getBogieType(activeBogie)}
            </h3>

            <div style={styles.seatGrid}>
              {renderSeats()}
            </div>
          </>
        )}

        {selectedSeats.length > 0 && (
          <button style={styles.confirmBtn} onClick={confirmSeats}>
            Confirm {selectedSeats.length} Seat(s)
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "120vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    backgroundSize: "cover",
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
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    transition: "0.3s"
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    padding: "30px",
    borderRadius: "20px",
    width: "1050px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    marginTop: "30px",
    border: "1px solid rgba(255,255,255,0.2)",
    animation: "fadeIn 0.8s ease"
  },

  title: {
    marginBottom: "10px",
    color: "#fff",
    fontSize: "26px",
    fontWeight: "700"
  },

  limitText: {
    color: "#e0e0e0",
    fontWeight: "600",
    marginBottom: "15px"
  },

  bogieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "12px",
    marginBottom: "20px"
  },

  bogieBtn: {
    width: "100%",
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
  },

  sectionTitle: {
    color: "#fff",
    margin: "15px 0",
    fontWeight: "600"
  },

  seatGrid: {
    marginTop: "15px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 280px))",
    justifyContent: "center",
    gap: "25px"
  },

  compartment: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    transition: "0.3s",
    animation: "fadeIn 0.6s ease"
  },

  matrix: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  row: {
    display: "flex",
    gap: "12px"
  },

  sideSeats: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginLeft: "20px"
  },

  seatBox: {
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    border: "1px solid rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    cursor: "pointer"
  },

  noSeats: {
    color: "#ff6b6b",
    fontWeight: "600",
    marginTop: "10px"
  },

  confirmBtn: {
    marginTop: "20px",
    padding: "14px",
    width: "100%",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
  }
};

export default SeatSelection;
