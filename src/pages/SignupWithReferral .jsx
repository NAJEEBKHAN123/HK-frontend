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

  // Get current referral code (if any)
  const referralCode = getReferralCode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
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

      // Prepare payload with explicit referral handling
      const payload = {
        name,
        email,
        password,
        referralCode: isValidReferralCode(referralCode) ? referralCode : null
      };

      // Submit to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/client/signup`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store client data without referral info unless actually used
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('clientId', response.data.client.id);
      localStorage.setItem('client', JSON.stringify({
        ...response.data.client,
        referalCode: response.data.client.referalCode || null
      }));

      // Clear referral tracking
      clearReferralCode();

      // Navigate to pricing
      navigate('/pricingCards');

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper to validate referral codes
  const isValidReferralCode = (code) => {
    return code && /^HKP-[A-F0-9]{6}$/i.test(code);
  };

  return (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {referralCode ? 'Create account' : 'Create Account'}
      </h2>

     <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            minLength="8"
          />
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Confirm Password *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}
    </div>
  );
}