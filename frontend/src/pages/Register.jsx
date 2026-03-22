import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerBg from "../assets/register-bg.png";

function Register() {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    first: "",
    last: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // Remove error when user starts typing
    setErrors(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

const validateAndSubmit = async () => {    setHasSubmitted(true);

    let newErrors = {};

    if (!form.first) newErrors.first = "First name is required";
    if (!form.last) newErrors.last = "Last name is required";
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
  const response = await fetch("http://localhost:5000/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await response.json();

  if (response.ok) {
    setSuccessMsg("✅ Registered Successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } else {
    alert(data.message);
  }

} catch (error) {
  console.log(error);
  alert("Registration failed");
}   // wait 1.5 seconds then go to home
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
      {successMsg && (
  <div style={styles.successBox}>
    {successMsg}
  </div>
)}


      <button 
        style={styles.backToHome}
        onClick={() => navigate("/")}
      >
        🏠 Back to Home
      </button>

      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>User Registration</h2>

        {/* PERSONAL DETAILS */}
        <div style={styles.section}>Personal Details</div>

        <div style={styles.field}>
          <label>First Name *</label>
          <input name="first" style={inputStyle("first")}
            value={form.first} onChange={handleChange} />
          {hasSubmitted && errors.first && <p style={styles.error}>{errors.first}</p>}
        </div>

        <div style={styles.field}>
          <label>Last Name *</label>
          <input name="last" style={inputStyle("last")}
            value={form.last} onChange={handleChange} />
          {hasSubmitted && errors.last && <p style={styles.error}>{errors.last}</p>}
        </div>

        <div style={styles.field}>
          <label>Age *</label>
          <input type="number" name="age" style={inputStyle("age")}
            value={form.age} onChange={handleChange} />
          {hasSubmitted && errors.age && <p style={styles.error}>{errors.age}</p>}
        </div>

        <div style={styles.field}>
          <label>Gender *</label>
          <div style={styles.genderBox}>
            <label><input type="radio" name="gender" value="Male" onChange={handleChange}/> Male</label>
            <label><input type="radio" name="gender" value="Female" onChange={handleChange}/> Female</label>
            <label><input type="radio" name="gender" value="Others" onChange={handleChange}/> Others</label>
          </div>
          {hasSubmitted && errors.gender && <p style={styles.error}>{errors.gender}</p>}
        </div>

        {/* CONTACT */}
        <div style={styles.section}>Contact</div>

        <div style={styles.field}>
          <label>Phone *</label>
          <input type="tel" name="phone" style={inputStyle("phone")}
            value={form.phone} onChange={handleChange} />
          {hasSubmitted && errors.phone && <p style={styles.error}>{errors.phone}</p>}
        </div>

        <div style={styles.field}>
          <label>Email (Optional)</label>
          <input type="email" name="email" style={styles.input}
            value={form.email} onChange={handleChange} />
        </div>

        {/* LOGIN */}
        <div style={styles.section}>Login Details</div>

        <div style={styles.field}>
          <label>Username *</label>
          <input name="username" style={inputStyle("username")}
            value={form.username} onChange={handleChange} />
          {hasSubmitted && errors.username && <p style={styles.error}>{errors.username}</p>}
        </div>

        <div style={styles.field}>
  <label>Password *</label>

  <div style={styles.passwordWrapper}>
    <input 
      type={showPassword ? "text" : "password"} 
      name="password" 
      style={inputStyle("password")}
      value={form.password} 
      onChange={handleChange} 
    />

    <span 
      style={styles.eyeIcon}
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🙈" : ""}
    </span>
  </div>

  {hasSubmitted && errors.password && <p style={styles.error}>{errors.password}</p>}
</div>


        <div style={styles.field}>
  <label>Confirm Password *</label>

  <div style={styles.passwordWrapper}>
    <input 
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      style={inputStyle("confirmPassword")}
      value={form.confirmPassword}
      onChange={handleChange}
    />

    <span 
      style={styles.eyeIcon}
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? "🙈" : ""}
    </span>
  </div>

  {hasSubmitted && errors.confirmPassword &&
    <p style={styles.error}>{errors.confirmPassword}</p>}
</div>


        {/* ADDRESS */}
        <div style={styles.section}>Address (Optional)</div>

        <div style={styles.field}>
          <label>City</label>
          <input name="city" style={styles.input}
            value={form.city} onChange={handleChange} />
        </div>

        <div style={styles.field}>
          <label>State</label>
          <input name="state" style={styles.input}
            value={form.state} onChange={handleChange} />
        </div>

        <div style={styles.field}>
          <label>Pincode</label>
          <input name="pincode" style={styles.input}
            value={form.pincode} onChange={handleChange} />
        </div>

        <button style={styles.submitBtn} onClick={validateAndSubmit}>
          Register
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
  position: "relative",
  backgroundImage: `url(${registerBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
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
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },

  card: {
  background: "white",
  padding: "20px",          // ⬅️ reduced
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  width: "450px",           // ⬅️ slightly smaller
  maxHeight: "85vh",        // ⬅️ NEW (important)
  overflowY: "auto",        // ⬅️ enables scrolling
  textAlign: "left"
},


  section: {
    marginTop: "15px",
    marginBottom: "8px",
    fontWeight: "700",
    color: "red"
  },

  field: {
    marginBottom: "9px"
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px"
  },

  genderBox: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "6px"
  },

  submitBtn: {
    width: "100%",
    padding: "10px",
    background: "#0a2a66",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px"
  },
  passwordWrapper: {
  position: "relative",
  width: "100%"
},

eyeIcon: {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "18px"
},
successBox: {
  position: "absolute",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#0a2a66",
  color: "white",
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: "600",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
},


};

export default Register;
