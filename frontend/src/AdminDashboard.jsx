import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [trains, setTrains] = useState([]);

  const [form, setForm] = useState({
    name: "",
    number: "",
    from: "",
    to: "",
    departure_time: "",
    arrival_time: "",
    duration: "",
    total_seats: ""
  });

  const addTrain = async () => {
  if (!form.name || !form.number) return;

  try {
    const response = await fetch("http://localhost:5000/api/trains/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Train added successfully!");
      fetchTrains();

      setForm({
        name: "",
        number: "",
        from: "",
        to: "",
        departure_time: "",
        arrival_time: "",
        duration: "",
        total_seats: ""
      });

    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
    alert("Server error");
  }
};

  const deleteTrain = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/trains/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Train deleted successfully!");
      fetchTrains(); // 🔥 Refresh table
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
    alert("Server error");
  }
};

const fetchTrains = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/trains");

    if (!response.ok) {
      console.log("Fetch failed");
      return;
    }

    const data = await response.json();
    console.log("Fetched trains:", data); // 🔥 DEBUG
    setTrains(data);

  } catch (error) {
    console.log(error);
  }
};
 useEffect(() => {
  console.log("AdminDashboard Loaded");
  fetchTrains();
}, []);

  return (
    <div style={styles.page}>

      <div style={styles.topBar}>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/")}
        >
          🏠 Back to Home
        </button>
      </div>

      <h1 style={styles.pageTitle}>Admin Dashboard</h1>

      <div style={styles.dashboardCard}>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add Train</h2>

          <div style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Train Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              style={styles.input}
              placeholder="Train Number"
              value={form.number}
              onChange={(e) =>
                setForm({ ...form, number: e.target.value })
              }
            />

            <input
              style={styles.input}
              placeholder="From"
              value={form.from}
              onChange={(e) =>
                setForm({ ...form, from: e.target.value })
              }
            />

            <input
              style={styles.input}
              placeholder="To"
              value={form.to}
              onChange={(e) =>
                setForm({ ...form, to: e.target.value })
              }
            />

            <input
              style={styles.input}
              type="time"
              value={form.departure_time}
              onChange={(e) =>
                setForm({ ...form, departure_time: e.target.value })
              }
            />

            <input
              style={styles.input}
              type="time"
              value={form.arrival_time}
              onChange={(e) =>
                setForm({ ...form, arrival_time: e.target.value })
              }
            />

            <input
              style={styles.input}
              placeholder="Duration (e.g. 7h 30m)"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Total Seats"
              value={form.total_seats}
              onChange={(e) =>
                setForm({ ...form, total_seats: e.target.value })
              }
            />

            <button
              style={styles.addBtn}
              onClick={addTrain}
            >
              Add Train
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Train List</h2>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>From</th>
                  <th style={styles.th}>To</th>
                  <th style={styles.th}>Departure</th>
                  <th style={styles.th}>Arrival</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Seats</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train, index) => (
                  <tr key={train.id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{train.name}</td>
                    <td style={styles.td}>{train.from}</td>
                    <td style={styles.td}>{train.to}</td>
                    <td style={styles.td}>{train.departure_time}</td>
                    <td style={styles.td}>{train.arrival_time}</td>
                    <td style={styles.td}>{train.duration}</td>
                    <td style={styles.td}>{train.total_seats}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteTrain(train.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {trains.length === 0 && (
                  <tr>
                    <td colSpan="9" style={styles.empty}>
                      No trains added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px",
    background: `
      radial-gradient(circle at 20% 20%, #1f3b4d, transparent 40%),
      radial-gradient(circle at 80% 80%, #163040, transparent 40%),
      linear-gradient(135deg, #0f2027, #203a43, #2c5364)
    `,
    fontFamily: "Poppins, sans-serif"
  },

  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px"
  },

  backBtn: {
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  },

  pageTitle: {
    color: "white",
    fontSize: "38px",
    fontWeight: "700",
    marginBottom: "30px"
  },

  dashboardCard: {
    background: `
      linear-gradient(
        145deg,
        rgba(255,255,255,0.08),
        rgba(255,255,255,0.02)
      )
    `,
    backdropFilter: "blur(20px)",
    borderRadius: "30px",
    padding: "50px",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.05),
      0 15px 40px rgba(0,0,0,0.5),
      inset 0 0 30px rgba(255,255,255,0.05)
    `,
    transition: "all 0.4s ease"
  },

  section: { marginBottom: "40px" },
  sectionTitle: { color: "white", marginBottom: "20px" },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px"
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white"
  },

  addBtn: {
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600"
  },

  tableWrapper: { overflowX: "auto" },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    color: "white"
  },

  th: {
    textAlign: "center",
    padding: "14px",
    background: "rgba(255,255,255,0.15)",
    fontWeight: "600"
  },

  td: {
    textAlign: "center",
    padding: "14px",
    background: "rgba(255,255,255,0.08)"
  },

  deleteBtn: {
    background: "#ff4b2b",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer"
  },

  empty: {
    textAlign: "center",
    padding: "20px"
  }
};

export default AdminDashboard;