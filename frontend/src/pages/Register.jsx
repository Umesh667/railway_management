import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import registerBg from "../assets/register-bg.png";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ Animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from {opacity:0; transform:translateY(40px);}
        to {opacity:1; transform:translateY(0);}
      }

      @keyframes moveBg {
        0% {background-position:center;}
        100% {background-position:center 30px;}
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
      return updated;
    });
  };

  const validateAndSubmit = async () => {
    setHasSubmitted(true);
    let newErrors = {};

    if (!form.first_name) newErrors.first_name = "First name is required";
    if (!form.last_name) newErrors.last_name = "Last name is required";
    if (!form.age) newErrors.age = "Age is required";
    if (!form.gender) newErrors.gender = "Please select gender";

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!form.username) newErrors.username = "Username is required";

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
const { confirmPassword, ...payload } = form;

const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

        const data = await response.json();

        if (response.ok) {
          setSuccessMsg("✅ Registered Successfully!");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Registration failed");
      }
    }
  };

  const inputStyle = (field) => ({
    ...styles.input,
    border:
      hasSubmitted && errors[field] && !form[field]
        ? "1px solid red"
        : "1px solid #ccc"
  });

  return (
    <div style={styles.page}>

      {successMsg && <div style={styles.successBox}>{successMsg}</div>}

      <button style={styles.backToHome} onClick={() => navigate("/")}>
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>🚆 User Registration</h2>

        {/* PERSONAL */}
        <div style={styles.section}>👤 Personal Details</div>

        <div style={styles.field}>
          <label>First Name *</label>
          <input name="first_name" style={inputStyle("first_name")}
            value={form.first_name} onChange={handleChange} />
          {errors.first_name && <p style={styles.error}>{errors.first_name}</p>}
        </div>

        <div style={styles.field}>
          <label>Last Name *</label>
          <input name="last_name" style={inputStyle("last_name")}
            value={form.last_name} onChange={handleChange} />
        </div>

        <div style={styles.field}>
          <label>Age *</label>
          <input type="number" name="age" style={inputStyle("age")}
            value={form.age} onChange={handleChange} />
        </div>

        <div style={styles.field}>
          <label>Gender *</label>
          <div style={styles.genderBox}>
            <label>♂ Male <input type="radio" name="gender" value="Male" onChange={handleChange}/></label>
            <label>♀ Female <input type="radio" name="gender" value="Female" onChange={handleChange}/></label>
            <label>⚧ Others <input type="radio" name="gender" value="Others" onChange={handleChange}/></label>
          </div>
        </div>

        {/* CONTACT */}
        <div style={styles.section}>📞 Contact</div>

        <div style={styles.field}>
          <label>Phone *</label>
          <input type="tel" name="phone" style={inputStyle("phone")}
            value={form.phone} onChange={handleChange} />
        </div>

        <div style={styles.field}>
          <label>Email</label>
          <input type="email" name="email" style={styles.input}
            value={form.email} onChange={handleChange} />
        </div>

        {/* LOGIN */}
        <div style={styles.section}>🔐 Login Details</div>

        <div style={styles.field}>
          <label>Username *</label>
          <input name="username" style={inputStyle("username")}
            value={form.username} onChange={handleChange} />
        </div>

        <div style={styles.field}>
          <label>Password *</label>
          <div style={styles.passwordWrapper}>
            <input type={showPassword ? "text" : "password"}
              name="password" style={inputStyle("password")}
              value={form.password} onChange={handleChange} />
            <span style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}>
              👁️
            </span>
          </div>
        </div>

        <div style={styles.field}>
          <label>Confirm Password *</label>
          <div style={styles.passwordWrapper}>
            <input type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword" style={inputStyle("confirmPassword")}
              value={form.confirmPassword} onChange={handleChange} />
            <span style={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              👁️
            </span>
          </div>
        </div>

        {/* ADDRESS */}
        <div style={styles.section}>📍 Address</div>

        <input name="city" placeholder="City" style={styles.input} onChange={handleChange}/>
        <input name="state" placeholder="State" style={styles.input} onChange={handleChange}/>
        <input name="pincode" placeholder="Pincode" style={styles.input} onChange={handleChange}/>

        <button style={styles.submitBtn} onClick={validateAndSubmit}>
          🚀 Register
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
    background: `
      linear-gradient(rgba(10,42,102,0.7), rgba(10,42,102,0.7)),
      url(${registerBg})
    `,
    backgroundSize: "cover",
    animation: "moveBg 12s infinite alternate"
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    padding: "25px",
    borderRadius: "16px",
    width: "420px",
    maxHeight: "85vh",
    overflowY: "auto",
    animation: "fadeIn 0.8s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },

  title: { textAlign: "center", marginBottom: "10px" },

  section: {
    marginTop: "15px",
    fontWeight: "700",
    color: "#0a2a66"
  },

  field: { marginBottom: "10px" },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "5px"
  },

  genderBox: {
    display: "flex",
    justifyContent: "space-between"
  },

  passwordWrapper: {
    position: "relative"
  },

  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  },

  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg,#0a2a66,#1e4db7)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    marginTop: "10px",
    cursor: "pointer"
  },

  backToHome: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer"
  },

  error: { color: "red", fontSize: "12px" },

  successBox: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#0a2a66",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px"
  }
};

export default Register;