import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [trains, setTrains] = useState([]);

  // ✅ FIX 1: moved inside component
  const [showPassengers, setShowPassengers] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

const fetchBookings = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);
  } catch (err) {
    console.log(err);
  }
};

  const [form, setForm] = useState({
    name: "",
    number: "",
    from: "",
    to: "",
    departure_time: "",
    arrival_time: "",
    duration: "",
    total_seats: "",
    sleeper_price: "",
ac3_price: "",
ac2_price: "",
ac1_price: "",
general_price: "",
chair_price: ""
  });
const handleDayChange = (e) => {
    const value = e.target.value;

    setSelectedDays(prev =>
      prev.includes(value)
        ? prev.filter(d => d !== value)
        : [...prev, value]
    );
  };
  const addTrain = async () => {
    if (!form.name || !form.number) return;
    const updatedForm = {
  ...form,
        days: selectedDays.join(","),
    total_seats: Number(form.total_seats) || 0, 
  sleeper_price: Number(form.sleeper_price) || 0,
  ac3_price: Number(form.ac3_price) || 0,
  ac2_price: Number(form.ac2_price) || 0,
  ac1_price: Number(form.ac1_price) || 0,
  general_price: Number(form.general_price) || 0,
  chair_price: Number(form.chair_price) || 0
};
     console.log("SENDING DATA:", updatedForm);


    try {
      const response = await fetch("http://localhost:5000/api/trains/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedForm)
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
          total_seats: "",
          sleeper_price: "",
  ac3_price: "",
  ac2_price: "",
  ac1_price: "",
  general_price: "",
  chair_price: ""
        });
        setSelectedDays([]);
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
        fetchTrains();
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
      setTrains(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  return (
    <div style={styles.page}>

      {/* ✅ Top Buttons */}
      <div style={styles.topBar}>
        <button
          style={styles.passengerBtn}
onClick={() => {
  setShowPassengers(!showPassengers);
  fetchBookings();
}}        >
          👥 Passenger Details
        </button>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/")}
        >
          🏠 Back to Home
        </button>
      </div>

      <h1 style={styles.pageTitle}>Admin Dashboard</h1>

      {/* ✅ Passenger Card */}
      {showPassengers && (
        <div style={styles.passengerCard}>
          <h2 style={styles.sectionTitle}>Passenger Details</h2>

          <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Name</th>
      <th style={styles.th}>Age</th>
      <th style={styles.th}>Train</th>
      <th style={styles.th}>From</th>
      <th style={styles.th}>To</th>
      <th style={styles.th}>Date</th>
      <th style={styles.th}>Class</th>
      <th style={styles.th}>Passengers</th>
      <th style={styles.th}>Seats</th>
      <th style={styles.th}>Amount</th>
    </tr>
  </thead>

  <tbody>
    {bookings.map((b) => (
      <tr key={b.id}>
        <td style={styles.td}>{b.passenger_name}</td>
<td style={styles.td}>{b.passenger_age}</td>
        <td style={styles.td}>{b.train_name}</td>
        <td style={styles.td}>{b.from_station}</td>
        <td style={styles.td}>{b.to_station}</td>
        <td style={styles.td}>{b.travel_date}</td>
        <td style={styles.td}>{b.class}</td>
        <td style={styles.td}>{b.passengers}</td>
        <td style={styles.td}>{b.seats}</td>
        <td style={styles.td}>₹ {b.amount}</td>
      </tr>
    ))}

    {bookings.length === 0 && (
      <tr>
        <td colSpan="8" style={styles.empty}>
          No bookings found
        </td>
      </tr>
    )}
  </tbody>
</table>
</div>
      )}
        

      <div style={styles.dashboardCard}>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add Train</h2>

          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="Train Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <input style={styles.input} placeholder="Train Number"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })} />

            <input style={styles.input} placeholder="From"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })} />

            <input style={styles.input} placeholder="To"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })} />

            <input style={styles.input} type="time"
              value={form.departure_time}
              onChange={(e) => setForm({ ...form, departure_time: e.target.value })} />

            <input style={styles.input} type="time"
              value={form.arrival_time}
              onChange={(e) => setForm({ ...form, arrival_time: e.target.value })} />

            <input style={styles.input} placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })} />

            <input style={styles.input} type="number" placeholder="Total Seats"
              value={form.total_seats}
              onChange={(e) => setForm({ ...form, total_seats: e.target.value })} />

           <input
  style={styles.input}
  type="number"
  placeholder="Sleeper Price"
  value={form.sleeper_price || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      sleeper_price: e.target.value
    }))
  }
/>

<input
  style={styles.input}
  type="number"
  placeholder="3-AC Price"
  value={form.ac3_price || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      ac3_price: e.target.value
    }))
  }
/>

<input
  style={styles.input}
  type="number"
  placeholder="2-AC Price"
  value={form.ac2_price || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      ac2_price: e.target.value
    }))
  }
/>

<input
  style={styles.input}
  type="number"
  placeholder="1-AC Price"
  value={form.ac1_price || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      ac1_price: e.target.value
    }))
  }
/>

<input
  style={styles.input}
  type="number"
  placeholder="General Price"
  value={form.general_price || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      general_price: e.target.value
    }))
  }
/>

<input
  style={styles.input}
  type="number"
  placeholder="Chair Car Price"
  value={form.chair_price || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      chair_price: e.target.value
    }))
  }
/>
<div style={{ gridColumn: "span 2" }}>
  <label style={{ color: "white" }}>Running Days</label>

  <div style={styles.daysContainer}>
    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => (
      <label key={day} style={styles.dayItem}>
        <input
          type="checkbox"
          value={day}
          onChange={handleDayChange}
        />
        {day}
      </label>
    ))}
  </div>
</div>
            <button style={styles.addBtn} onClick={addTrain}>
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
                  <th style={styles.th}>Price</th> 
                  <th style={styles.th}>Days</th>
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
                    SL: ₹{train.sleeper_price} <br />
                    3AC: ₹{train.ac3_price} <br />
                    2AC: ₹{train.ac2_price} <br />
                    1AC: ₹{train.ac1_price} <br />
                    GEN: ₹{train.general_price} <br />
                    CC: ₹{train.chair_price}
                  </td>
                  <td style={styles.td}>
  {train.days ? train.days.replaceAll(",", " ") : "N/A"}
</td>
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
                    <td colSpan="11" style={styles.empty}>
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

  // ✅ SAME STYLE AS BACK BUTTON
  passengerBtn: {
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "10px"
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

  passengerCard: {
    background: "rgba(255,255,255,0.08)",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.2)"
  },

  passengerBox: {
    background: "rgba(255,255,255,0.12)",
    padding: "15px",
    borderRadius: "12px",
    color: "white",
    lineHeight: "1.8"
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
    border: "1px solid rgba(255,255,255,0.15)"
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
    borderSpacing: "0 10px",
    color: "white"
  },

  th: {
    padding: "14px",
    background: "rgba(255,255,255,0.15)"
  },

  td: {
    padding: "14px",
    background: "rgba(255,255,255,0.08)"
  },

  deleteBtn: {
    background: "#ff4b2b",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "white"
  },
  dayBadge: {
  background: "#00c6ff",
  padding: "3px 8px",
  borderRadius: "6px",
  marginRight: "5px",
  fontSize: "12px"
},

  daysContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "5px"
  },
  dayItem: {
  background: "rgba(255,255,255,0.2)",
  padding: "5px 10px",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer"
},

  empty: {
    textAlign: "center",
    padding: "20px"
  }
};

export default AdminDashboard;