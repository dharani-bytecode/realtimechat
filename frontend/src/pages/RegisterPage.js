import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) return toast.error("Fill all fields");

    try {
      // Register user
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });

      // Auto-login after registration
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      sessionStorage.setItem("username", res.data.user.username); // ✅ Store username
      toast.success("Registered & logged in!");
      navigate("/chat"); // ✅ Go to chat directly
    } catch (e) {
      toast.error(e.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
      <div className="card p-5 shadow-lg">
        <h3 className="text-center mb-4">Sign Up</h3>
        <input
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-success w-100 mb-2" onClick={handleRegister}>
          Register
        </button>
        <Link to="/">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
