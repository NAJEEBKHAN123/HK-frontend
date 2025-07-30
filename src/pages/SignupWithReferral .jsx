import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useReferralTracker from '../hook/useReferralTracker';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function ClientSignup() {
  const navigate = useNavigate();
  const { getReferralCode, clearReferralCode } = useReferralTracker();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const referralCode = getReferralCode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { name, email, password, confirmPassword } = formData;
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const payload = {
        name,
        email,
        password,
        referralCode: isValidReferralCode(referralCode) ? referralCode : null
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/client/signup`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('clientId', response.data.client.id);
      localStorage.setItem('client', JSON.stringify({
        ...response.data.client,
        referalCode: response.data.client.referalCode || null
      }));

      clearReferralCode();
      navigate('/pricingCards');

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const isValidReferralCode = (code) => {
    return code && /^HKP-[A-F0-9]{6}$/i.test(code);
  };

  return (
    <div className="min-h-screen pt-8 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating card with glass morphism effect */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
          {/* Decorative header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              {referralCode ? 'Join With Special Offer' : 'Create Your Account'}
            </h2>
           
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input fields with floating labels */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="peer w-full p-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-sm"
                >
                  Full Name *
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="peer w-full p-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-sm"
                >
                  Email *
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="peer w-full p-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                  minLength="8"
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-sm"
                >
                  Password *
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="peer w-full p-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="confirmPassword" 
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-sm"
                >
                  Confirm Password *
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Sign Up Now'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-lg flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round"  strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}