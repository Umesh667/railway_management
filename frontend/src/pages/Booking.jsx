import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import trainBg from "../assets/train-bg.jpg";

function Booking() {
  const navigate = useNavigate();

const today = new Date().toISOString().split("T")[0];
const [stations, setStations] = useState([]);
const [showFromDropdown, setShowFromDropdown] = useState(false);
const [showToDropdown, setShowToDropdown] = useState(false);
  const [form, setForm] = useState({
  from: localStorage.getItem("from") || "",
  to: localStorage.getItem("to") || "",
  date: localStorage.getItem("date") || "",
  travelClass: localStorage.getItem("class") || "SLEEPER",
  passengers: localStorage.getItem("passengers") || ""
});

  const [error, setError] = useState("");
  const [passengerDetails, setPassengerDetails] = useState([]);
  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/trains`)
    .then(res => res.json())
    .then(data => {
      const uniqueStations = new Set();

      data.forEach(train => {
        uniqueStations.add(train.from);
        uniqueStations.add(train.to);
      });

      setStations([...uniqueStations]);
    });
}, []);
useEffect(() => {
  const name = localStorage.getItem("passengerName");
  const age = localStorage.getItem("passengerAge");
const count = Number(localStorage.getItem("passengers")) || 0;
  if (name && age && count) {
    const details = [];
    for (let i = 0; i < count; i++) {
      details.push({
        name: i === 0 ? name : "",
        age: i === 0 ? age : ""
      });
    }
    setPassengerDetails(details);
  }
}, []);
// 🔥 ADD THIS BELOW useEffect (filter logic)
const filterStations = (input) => {
  const value = input.toLowerCase();

  return stations
    .filter(s => s.toLowerCase().includes(value))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(value);
      const bStarts = b.toLowerCase().startsWith(value);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    });
};

const filteredFrom = filterStations(form.from).slice(0, 5);
const filteredTo = filterStations(form.to).slice(0, 5);
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "passengers") {
    const count = Number(value);

    if (count < 1) {
      setError("⚠️ At least 1 passenger is required");
      setPassengerDetails([]);

      setForm((prev) => {
        const updated = { ...prev, passengers: value };
        localStorage.setItem("passengers", value);
        return updated;
      });

      return;
    }

    if (count > 6) {
      setError("⚠️ Maximum 6 passengers allowed per booking");
      setPassengerDetails([]);

      setForm((prev) => {
        const updated = { ...prev, passengers: value };
        localStorage.setItem("passengers", value);
        return updated;
      });

      return;
    }

    setError("");

    const details = [];
    for (let i = 0; i < count; i++) {
      details.push({ name: "", age: "" });
    }
    setPassengerDetails(details);
  }

  setForm((prev) => {
    const updated = { ...prev, [name]: value };

    localStorage.setItem(name, value); // 🔥 main fix

    return updated;
  });
};

  const handlePassengerChange = (index, field, value) => {
  const updated = [...passengerDetails];
  updated[index][field] = value;
  setPassengerDetails(updated);

  if (index === 0) {
    if (field === "name") localStorage.setItem("passengerName", value);
    if (field === "age") localStorage.setItem("passengerAge", value);
  }
};

  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.card}>

        <h2 style={styles.title}>Book Your Ticket</h2>
        <p style={styles.subtitle}>Plan your journey smartly</p>

        <div style={styles.grid2}>
         <div style={styles.field}>
  <label>From Station *</label>

  <div style={{ position: "relative" }}>
    <input 
      style={styles.input}
      name="from"
      placeholder="Enter From Station"
      value={form.from}
      onChange={(e) => {
        handleChange(e);
        setShowFromDropdown(true);
      }}
      onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
    />

    {showFromDropdown && filteredFrom.length > 0 && (
      <div style={styles.dropdown}>
        {filteredFrom.map((station, i) => (
          <div
            key={i}
            style={styles.dropdownItem}
            onMouseDown={() => {
  setForm((prev) => {
    const updated = { ...prev, from: station };
    localStorage.setItem("from", station);
    return updated;
  });

  setShowFromDropdown(false);
}}
          >
            {station}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<div style={styles.field}>
  <label>To Station *</label>

  <div style={{ position: "relative" }}>
    <input 
      style={styles.input}
      name="to"
      placeholder="Enter To Station"
      value={form.to}
      onChange={(e) => {
        handleChange(e);
        setShowToDropdown(true);
      }}
      onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
    />

    {showToDropdown && filteredTo.length > 0 && (
      <div style={styles.dropdown}>
        {filteredTo.map((station, i) => (
  <div
    key={i}
    style={styles.dropdownItem}
    onMouseDown={() => {
      setForm((prev) => {
        const updated = { ...prev, to: station };
        localStorage.setItem("to", station);
        return updated;
      });

      setShowToDropdown(false);
    }}
  >
    {station}
  </div>
))}
      </div>
    )}
  </div>
</div>
        </div>

        <div style={styles.grid2}>
          <div style={styles.field}>
            <label>Date of Journey *</label>
            <input 
              type="date"
              min={today}
              onKeyDown={(e) => e.preventDefault()}
              style={styles.input}
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Class *</label>
            <select 
              style={styles.input}
              name="travelClass"
              value={form.travelClass}
              onChange={handleChange}
            >
              <option>SLEEPER</option>
              <option>3-AC</option>
              <option>2-AC</option>
              <option>1-AC</option>
              <option>GENERAL</option>
              <option>CHAIR CAR</option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label>Number of Passengers (1–6) *</label>
          <input
            type="number"
            min="1"
            max="6"
            style={styles.input}
            name="passengers"
            placeholder="Enter number of passengers"
            value={form.passengers}
            onChange={handleChange}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {passengerDetails.length > 0 && (
          <div style={styles.passengerBox}>
            <h3>Passenger Details</h3>
            {passengerDetails.map((p, i) => (
              <div key={i} style={styles.row}>
                <input
                  style={styles.smallInput}
                  placeholder="Enter Name"
                  value={p.name || ""}
                  onChange={(e) =>
                    handlePassengerChange(i, "name", e.target.value)
                  }
                />

                <input
                  style={styles.smallInput}
                  type="number"
                  placeholder="Enter Age"
                  value={p.age || ""}
                  onChange={(e) =>
                    handlePassengerChange(i, "age", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}

        <button 
          style={styles.submitBtn}
          onClick={() => {
            

            // ✅ NEW VALIDATIONS
            if (!form.from || !form.to) {
              alert("Please enter From and To stations");
              return;
            }

            if (!form.date) {
              alert("Please select journey date");
              return;
            }

            if (
              !passengerDetails.length ||
              passengerDetails[0].name.trim() === "" ||
              passengerDetails[0].age.toString().trim() === ""
            ) {
              alert("Please enter valid passenger name and age");
              return;
            }

            localStorage.setItem("passengerName", passengerDetails[0].name);
            localStorage.setItem("passengerAge", Number(passengerDetails[0].age));
            localStorage.setItem("seatLimit", Number(form.passengers));
            localStorage.setItem("from", form.from);
            localStorage.setItem("to", form.to);
            localStorage.setItem("date", form.date);
            localStorage.setItem("class", form.travelClass);
            localStorage.setItem("passengers", Number(form.passengers));

            navigate("/trainlist");
          }}
        >
          🔍 Search Trains
        </button>

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
    background: `linear-gradient(rgba(10,42,102,0.7), rgba(10,42,102,0.7)), url(${trainBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Segoe UI, sans-serif"
  },
dropdown: {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "white",
  borderRadius: "8px",
  maxHeight: "150px",
  overflowY: "auto",
  zIndex: 10,
  color: "#000"
},

dropdownItem: {
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #eee"
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

  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(15px)",
    padding: "35px",
    borderRadius: "20px",
    width: "820px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.2)"
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#ffffff"
  },

  subtitle: {
    textAlign: "center",
    color: "#e0e0e0",
    marginBottom: "25px",
    fontSize: "14px"
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "15px"
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#ffffff",
    fontWeight: "500"
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    fontSize: "14px",
    outline: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    backdropFilter: "blur(5px)"
  },

  passengerBox: {
    marginTop: "20px",
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    color: "#fff"
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "12px"
  },

  smallInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.2)",
    color: "#fff"
  },

  submitBtn: {
    marginTop: "25px",
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  },

  error: {
    color: "#ff6b6b",
    fontSize: "14px",
    marginTop: "5px"
  }
};

export default Booking;