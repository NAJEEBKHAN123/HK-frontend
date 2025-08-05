import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      }, {
        timeout: 10000
      });

      if (!response.data?.token) {
        throw new Error('Authentication failed - no token received');
      }

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminId', response.data.admin.id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      navigate('/admin/dashboard')
      
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please try again.';
      setError(errorMessage);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-cyan-100 mt-1">Secure access to dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
              <div className={`relative flex items-center border rounded-lg transition-all ${
                isFocused.email ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-gray-200'
              }`}>
                <div className="absolute left-3 text-gray-400">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused({...isFocused, email: true})}
                  onBlur={() => setIsFocused({...isFocused, email: false})}
                  className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none"
                  placeholder="admin@example.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <div className={`relative flex items-center border rounded-lg transition-all ${
                isFocused.password ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-gray-200'
              }`}>
                <div className="absolute left-3 text-gray-400">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({...isFocused, password: true})}
                  onBlur={() => setIsFocused({...isFocused, password: false})}
                  className="w-full pl-10 pr-12 py-3 bg-transparent focus:outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </motion.button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;