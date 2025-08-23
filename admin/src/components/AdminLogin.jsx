import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [status] = useState({
    email: "admin@gmail.com",
    password: "123456"
  });

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      formData.email === status.email &&
      formData.password === status.password
    ) {
      localStorage.setItem("admin", JSON.stringify({ email: formData.email }));
      navigate("/list_product");
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2 className="admin-login-show">Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <div className="admin-login-body">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="admin-login-submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
