import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleLogin = async () => {
  try {
    const response = await fetch("${import.meta.env.VITE_API_URL}/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("admin", "true");
      localStorage.setItem("adminUsername", data.admin.username);
      navigate("/admin/dashboard");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
    alert("Server error");
  }
};
  return (
    <div style={styles.page}>
      
      <button
        style={styles.backBtn}
        onClick={() => navigate("/")}
      >
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>
          Secure Railway Administration Portal
        </p>

       {/* Username */}
<div style={styles.formGroup}>
  <label style={styles.label}>
    <b>Enter Admin Username</b>
  </label>
  <input
    name="username"
    style={styles.input}
    type="text"
    value={form.username}
    onChange={(e) =>
      setForm({ ...form, username: e.target.value })
    }
  />
</div>

{/* Password */}
<div style={styles.formGroup}>
  <label style={styles.label}>
    <b>Enter Admin Password</b>
  </label>
  <input
    name="password"
    style={styles.input}
    type="password"
    value={form.password}
    onChange={(e) =>
      setForm({ ...form, password: e.target.value })
    }
  />
</div>
        <button
          style={styles.loginBtn}
          onClick={handleLogin}
        >
          Login
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
    background: "linear-gradient(135deg, #0a2a66, #004aad)",
    fontFamily: "Poppins, sans-serif",
    position: "relative"
  },

  backBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  },

  card: {
    width: "420px",
    background: "#2f528f",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    color: "white"
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "30px",
    fontWeight: "600"
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "14px",
    opacity: 0.8
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  label: {
    fontSize: "14px",
    fontWeight: "500"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "#6f88b3",
    color: "white"
  },

  loginBtn: {
  width: "40%",          // smaller than inputs
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(to right, #ffc107, #ff9800)",
  fontSize: "17px",
  fontWeight: "600",
  cursor: "pointer",
  margin: "20px auto 0 auto",   // ✅ THIS CENTERS IT
  display: "block"
}
};

export default AdminLogin;