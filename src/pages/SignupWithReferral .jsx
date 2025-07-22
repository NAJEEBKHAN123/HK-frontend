import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function ClientSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [partnerInfo, setPartnerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const codeFromUrl = searchParams.get('ref');
    if (codeFromUrl && isValidReferralCode(codeFromUrl)) {
      setReferralCode(codeFromUrl);
      sessionStorage.setItem('referralCode', codeFromUrl);
      verifyReferralCode(codeFromUrl);
    } else {
      const storedCode = sessionStorage.getItem('referralCode');
      if (storedCode && isValidReferralCode(storedCode)) {
        setReferralCode(storedCode);
        verifyReferralCode(storedCode);
      }
    }
  }, [searchParams]);

  const isValidReferralCode = (code) => /^HKP-[A-F0-9]{6}$/i.test(code);

  const verifyReferralCode = async (code) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/partner-auth/verify-referral`, {
        params: { code },
        withCredentials: true
      });
      if (response.data.valid) {
        setPartnerInfo(response.data.partner);
      }
    } catch (err) {
      console.error('Error verifying referral:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("All fields are required");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // Use latest referral code if verified
      const finalReferral = referralCode || sessionStorage.getItem('referralCode');
      if (finalReferral && partnerInfo) {
        payload.referralCode = finalReferral;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/client/signup`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('clientId', response.data.client.id);
        navigate(response.data.redirectUrl || '/pricingCards');
      } else {
        throw new Error(response.data.error || 'Signup failed');
      }

    } catch (err) {
      console.error('Signup error:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });

      const errorMessage = err.response?.data?.error || err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {partnerInfo ? `Join through ${partnerInfo.name}'s network` : 'Create Your Account'}
      </h2>

      {partnerInfo && (
        <div className="bg-blue-50 p-3 rounded-md mb-4 text-center">
          <p className="text-blue-700 font-medium">
            You're getting special access through our partner network
          </p>
        </div>
      )}

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

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-center">
          {error}
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
