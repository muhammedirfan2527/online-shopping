import React, { useState, useContext } from "react";
import './Login.css'
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login  } = useContext(StoreContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      currState === "Sign up" &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const url =
      currState === "Login"
        ? "https://online-shopping-lmg9.onrender.com/login"
        : "https://online-shopping-lmg9.onrender.com/signup";

    const payload =
      currState === "Login"
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

    try {
      await new Promise((res) => setTimeout(res, 1500));
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
  alert(data.message || "Success");

  // Save email only (lighter)
  localStorage.setItem("user", JSON.stringify({ email: data.user.email }));
  login ({ email: data.user.email });

  navigate("/");
} else {
   setLoading(false);
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-show">{currState}</h2>
        {error && <p className="error">{error}</p>}
<div className="login-body">

        {currState === "Sign up" && (
          <input
            type="text"
            name="username"
            placeholder="User name"
            value={formData.username}
            onChange={handleChange}
            required
            />
          )}

        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {currState === "Login" ? (
          <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          />
        ) : (
          <>
            <input
              type="password"
              name="password"
              placeholder="New password"

              minLength={6}
              value={formData.password}
              onChange={handleChange}
              required
              />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        )}

        </div>
        <button type="submit" className="login-submit" disabled={loading}>
          {currState === "Sign up" ? "Create account" : loading ? "Logging in..." : "Login"}
        </button>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
