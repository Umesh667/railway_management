import { useState, useEffect } from "react";
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

  const [focus, setFocus] = useState({
    username: false,
    password: false
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from {opacity:0; transform:translateY(40px);}
        to {opacity:1; transform:translateY(0);}
      }
      @keyframes moveBg {
        0% { background-position: center; }
        100% { background-position: center 30px; }
      }
    `;
    document.head.appendChild(style);
  }, []);

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

  const validateAndSubmit = async () => {
    setHasSubmitted(true);
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok) {
          console.log("LOGIN DATA:", data);

          localStorage.setItem("user", JSON.stringify({
            id: data.user.id,
            name: data.user.username
          }));

          console.log("Saved user:", localStorage.getItem("user"));

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
        <h2>User Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {errors.login && <p style={{ color: "red" }}>{errors.login}</p>}

        <button onClick={validateAndSubmit}>Login</button>
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
  background: `linear-gradient(rgba(10,42,102,0.7), rgba(10,42,102,0.7)), url(${blueBg})`,
  backgroundSize: "cover",
  animation: "moveBg 12s infinite alternate"
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
    cursor: "pointer",
    transition: "0.3s"
  },

  card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "16px",
    width: "360px",
    textAlign: "center",
    animation: "fadeIn 0.8s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
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
    background: "linear-gradient(135deg,#0a2a66,#1e4db7)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  },

  error: {
    color: "red",
    fontSize: "12px"
  }
};

export default Login;