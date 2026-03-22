import { useState } from "react";
import { useNavigate } from "react-router-dom";
import blueBg from "../assets/blue-bg.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ focus tracking
  const [focus, setFocus] = useState({
    username: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    setErrors(prev => {
      const updated = { ...prev };
      delete updated[name];
      delete updated.login;
      return updated;
    });
  };

const validateAndSubmit = async () => {    setHasSubmitted(true);
    let newErrors = {};

    if (!form.username) newErrors.username = "Username is required";

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {

     try {
  const response = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("loggedUser", data.user.username);

    setSuccessMsg("✅ Logged in successfully!");
    setTimeout(() => navigate("/"), 1200);
  } else {
    setErrors({ login: data.message });
  }

} catch (error) {
  console.log(error);
  setErrors({ login: "Server error" });
}
    }
  };

  return (
    <div style={styles.page}>

      {successMsg && (
        <div style={styles.successBanner}>{successMsg}</div>
      )}

      <button style={styles.backToHome} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>User Login</h2>
        <p style={styles.subtitle}>Access your railway account</p>

        {/* USERNAME */}
        <div style={styles.field}>
          <label style={styles.label}>Enter username</label>

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>👤</span>

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocus({ ...focus, username: true })}
              onBlur={() => setFocus({ ...focus, username: false })}
              style={styles.input}
            />

            <span
              style={{
                ...styles.focusLine,
                transform:
                  focus.username || form.username
                    ? "scaleX(1)"
                    : "scaleX(0)"
              }}
            />
          </div>

          {hasSubmitted && errors.username && (
            <p style={styles.error}>{errors.username}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div style={styles.field}>
          <label style={styles.label}>Enter password</label>

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>🔑</span>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocus({ ...focus, password: true })}
              onBlur={() => setFocus({ ...focus, password: false })}
              style={styles.input}
            />

            <span
              style={{
                ...styles.focusLine,
                transform:
                  focus.password || form.password
                    ? "scaleX(1)"
                    : "scaleX(0)"
              }}
            />
          </div>

          {hasSubmitted && errors.password && (
            <p style={styles.error}>{errors.password}</p>
          )}
        </div>

        {errors.login && <p style={styles.error}>{errors.login}</p>}

        <button style={styles.submitBtn} onClick={validateAndSubmit}>
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
    backgroundImage: `url(${blueBg})`,
    backgroundSize: "cover"
  },

  successBanner: {
    position: "absolute",
    top: 0,
    width: "100%",
    textAlign: "center",
    background: "#0a2a66",
    color: "white",
    padding: "10px",
    fontWeight: "700"
  },

  backToHome: {
    position: "absolute",
    top: "15px",
    right: "15px",
    padding: "10px 18px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "360px",
    textAlign: "center"
  },

  title: { marginBottom: "6px" },

  subtitle: {
    color: "#555",
    fontSize: "13px",
    marginBottom: "18px"
  },

  field: {
    marginBottom: "22px",
    textAlign: "left"
  },

  label: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "6px",
    display: "block"
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },

  icon: {
    marginRight: "8px",
    fontSize: "16px"
  },

  input: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    borderBottom: "2px solid #ccc",
    outline: "none",
    fontSize: "14px"
  },

  focusLine: {
    position: "absolute",
    bottom: "0",
    left: "24px",
    height: "2px",
    width: "calc(100% - 24px)",
    background: "#0a2a66",
    transformOrigin: "left",
    transition: "0.3s ease",
    transform: "scaleX(0)"
  },

  submitBtn: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },

  error: {
    color: "red",
    fontSize: "12px"
  }
};

export default Login;