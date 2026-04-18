import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HistoryFinal() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.id) {
      console.log("User not found");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/user/${user.id}`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.log(err));
  }, []);

  // 🔥 CANCEL TICKET FUNCTION
  const handleCancel = async (pnr) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/cancel/${pnr}`, {
        method: "PUT"
      });

      const data = await res.json();

      alert("Ticket cancelled successfully");

      // 🔄 Refresh bookings
      setBookings(prev =>
        prev.map(b =>
          b.pnr === pnr ? { ...b, status: "CANCELLED" } : b
        )
      );

    } catch (err) {
      console.log(err);
      alert("Error cancelling ticket");
    }
  };

  return (
    <div style={styles.page}>

      {/* 🔙 BACK BUTTON */}
      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Home
      </button>

      {!user ? (
        <h2 style={{ color: "white" }}>Please login to view history</h2>
      ) : (
        <div style={styles.card}>

          <h1 style={styles.title}>My Booking History</h1>

          {bookings.length === 0 ? (
            <p style={styles.noData}>No bookings found</p>
          ) : (
            bookings.map((b, i) => (
              <div key={i} style={styles.ticket}>

                <div style={styles.left}>
                  <h3>🚆 {b.train_name}</h3>
                  <p>📍 {b.from_station} → {b.to_station}</p>
                  <p>📅 {b.travel_date}</p>
                </div>

                <div style={styles.right}>
                  <p><b>PNR:</b> {b.pnr}</p>

                  <p style={{
                    color: b.status === "CANCELLED" ? "red" : "#00e676",
                    fontWeight: "bold"
                  }}>
                    {b.status}
                  </p>

                  {/* ❌ CANCEL BUTTON */}
                  {b.status !== "CANCELLED" && (
                    <button
                      style={styles.cancelBtn}
                      onClick={() => handleCancel(b.pnr)}
                    >
                      Cancel Ticket
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "Segoe UI, sans-serif"
  },

  backBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    cursor: "pointer",
    backdropFilter: "blur(6px)"
  },

  card: {
    width: "800px",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },

  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "20px"
  },

  noData: {
    textAlign: "center",
    color: "#ccc"
  },

  ticket: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    transition: "0.3s",
    animation: "fadeIn 0.5s ease"
  },

  left: {
    color: "white"
  },

  right: {
    textAlign: "right",
    color: "white"
  },

  cancelBtn: {
    marginTop: "8px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
    color: "white",
    cursor: "pointer"
  }
};

export default HistoryFinal;