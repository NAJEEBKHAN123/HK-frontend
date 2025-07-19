import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Install via: npm install axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });

      // Save token and user data in localStorage
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminInfo", JSON.stringify(res.data.admin));

      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-600">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-3 rounded hover:bg-cyan-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
