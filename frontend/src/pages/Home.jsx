import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import trainBg from "../assets/train-bg.jpg";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [darkText, setDarkText] = useState(false); // ✅ NEW STATE
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setLoggedUser(user.name);
    }
  }, []);

  // ✅ Background Animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes moveBg {
        0% { background-position: center; }
        100% { background-position: center 20px; }
      }
    `;
    document.head.appendChild(style);
  }, []);

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

  const filterStations = (input) => {
    const value = input.toLowerCase();

    return stations
      .filter(s => s.toLowerCase().includes(value))
      .slice(0, 5);
  };

  const filteredFrom = filterStations(fromInput);
  const filteredTo = filterStations(toInput);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedUser(null);
    navigate("/");
  };

  return (
    <div style={styles.page}>

      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div style={styles.logo}>
          🚆 Railway Reservation
        </div>

        <div>
          {loggedUser ? (
            <>
              <span style={styles.userText}>
                Welcome, {loggedUser}
              </span>

              <button
                style={styles.adminBtn}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span
                style={styles.moon}
                onClick={() => setDarkText(!darkText)}
              >
                🌙
              </span>

              <button
                style={styles.loginBtn}
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                style={styles.registerBtn}
                onClick={() => navigate("/register")}
              >
                Register
              </button>

              <button
                style={styles.adminBtn}
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            </>
          )}
        </div>
      </header>

      {menuOpen && (
        <div style={styles.menudropdown}>
          <MenuItem
            icon="🎫"
            text="Book Ticket"
            onClick={() => {
              const user = localStorage.getItem("user");

              if (user) {
                navigate("/booking");
              } else {
                alert("Please login to book tickets");
                navigate("/login");
              }
            }}
          />
          <MenuItem icon="📄" text="PNR Status" onClick={() => navigate("/pnr")} />
          <MenuItem
            icon="📜"
            text="Booking History"
            onClick={() => {
              const user = localStorage.getItem("user");

              if (user) {
                navigate("/history");
              } else {
                alert("Please login to view history");
                navigate("/login");
              }
            }}
          />
          <MenuItem icon="🚆" text="Train Schedule" onClick={() => navigate("/schedule")} />
        </div>
      )}

      {/* ================= HERO ================= */}
      <section
        style={{
          ...styles.hero,
          background: `linear-gradient(rgba(10,42,102,0.7), rgba(10,42,102,0.7)), url(${trainBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "moveBg 10s linear infinite alternate"
        }}
      >
        <h1 style={{ color: darkText ? "black" : "white" }}>
          Smart & Secure Railway Reservation System
        </h1>
       
        <p style={{ color: darkText ? "black" : "white" }}>
          Book tickets, track PNR and manage your journey seamlessly
        </p>
        <div style={styles.heroButtons}>
  <button
    style={styles.primaryBtn}
    onClick={() => {
  const user = localStorage.getItem("user");
  if (user) navigate("/booking");
  else {
    alert("Please login first");
    navigate("/login");
  }
}}
  >
    Book Ticket
  </button>

  <button
    style={styles.secondaryBtn}
    onClick={() => navigate("/pnr")}
  >
    Check PNR
  </button>
</div>
      </section>

      <div style={styles.searchBox}>

        {/* FROM */}
        <div style={{ position: "relative" }}>
          <input
            style={styles.input}
            placeholder="From Station"
            value={fromInput}
            onChange={(e) => {
              setFromInput(e.target.value);
              setShowFromDropdown(true);
              setShowToDropdown(false);
            }}
            onFocus={() => setShowFromDropdown(true)}
            onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
          />

          {showFromDropdown && filteredFrom.length > 0 && (
            <div style={styles.dropdown}>
              {filteredFrom.map((station, i) => (
                <div
                  key={i}
                  style={styles.dropdownItem}
                  onMouseDown={() => {
                    setFromInput(station);
                    setShowFromDropdown(false);
                  }}
                >
                  {station}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TO */}
        <div style={{ position: "relative" }}>
          <input
            style={styles.input}
            placeholder="To Station"
            value={toInput}
            onChange={(e) => {
              setToInput(e.target.value);
              setShowToDropdown(true);
              setShowFromDropdown(false);
            }}
            onFocus={() => setShowToDropdown(true)}
            onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
          />

          {/* ✅ FIXED */}
          {showToDropdown && filteredTo.length > 0 && (
            <div style={styles.dropdown}>
              {filteredTo.map((station, i) => (
                <div
                  key={i}
                  style={styles.dropdownItem}
                  onMouseDown={() => {
                    setToInput(station);
                    setShowToDropdown(false);
                  }}
                >
                  {station}
                </div>
              ))}
            </div>
          )}
        </div>

        <input style={styles.input} type="date" />

        <select style={styles.select}>
          <option>All Classes</option>
          <option>Sleeper</option>
          <option>3-AC</option>
          <option>2-AC</option>
          <option>1-AC</option>
          <option>General</option>
        </select>

        <button
          style={styles.primaryBtn}
          onClick={() => {
            localStorage.setItem("from", fromInput);
            localStorage.setItem("to", toInput);
            navigate("/trainlist");
          }}
        >
          Search Trains
        </button>
      </div>

      <footer style={styles.footer}>
        © 2026 Railway Reservation System. All Rights Reserved.
      </footer>
    </div>
  );
}

function MenuItem({ icon, text, onClick }) {
  return (
    <div style={styles.menuItem} onClick={onClick}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Poppins, Arial, sans-serif",
    background: "#f4f6fb"
  },

  header: {
    height: "65px",
    background: "#0a2a66",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  hamburger: {
    fontSize: "26px",
    cursor: "pointer"
  },
heroButtons: {
  marginTop: "30px",   // increased spacing
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  zIndex: 10           // 🔥 important (brings above search box)
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
    zIndex: 999,
    color: "#000"
  },

  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "600",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)"
  },

  moon: {
    marginRight: "10px",
    fontSize: "18px",
    cursor: "pointer"
  },

  userText: {
    marginRight: "10px",
    fontWeight: "600"
  },

  menudropdown: {
    background: "white",
    width: "240px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    position: "absolute",
    top: "65px",
    left: "0",
    zIndex: 999
  },

  menuItem: {
    padding: "14px 20px",
    display: "flex",
    gap: "12px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontWeight: "500"
  },

  hero: {
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px"
  },

  searchBox: {
  background: "white",
  width: "85%",
  margin: "-20px auto 40px",   // 🔥 changed from -50px
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  justifyContent: "center"
},

  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "180px"
  },

  select: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "180px",
    color: "black",
    background: "white"
  },

  footer: {
    background: "#0a2a66",
    color: "white",
    padding: "16px",
    textAlign: "center"
  },

  primaryBtn: {
  background: "#ffcc00",     // 🔥 changed color
  color: "#0a2a66",
  padding: "12px 22px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
},

secondaryBtn: {
  background: "white",       // 🔥 changed from transparent
  color: "#0a2a66",
  border: "none",
  padding: "12px 22px",
  borderRadius: "6px",
  marginLeft: "10px",
  cursor: "pointer",
  fontWeight: "600"
},

  loginBtn: {
    padding: "6px 14px",
    border: "1px solid white",
    background: "transparent",
    color: "orange",
    marginRight: "10px",
    cursor: "pointer"
  },

  registerBtn: {
    padding: "6px 14px",
    background: "white",
    color: "#0a2a66",
    border: "none",
    marginRight: "10px",
    cursor: "pointer"
  },

  adminBtn: {
    padding: "6px 14px",
    background: "#ffcc00",
    color: "#0a2a66",
    border: "none",
    cursor: "pointer"
  }
};

export default Home;