import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function PartnerSignup() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(searchParams.get('token') ? 2 : 1);
  const [form, setForm] = useState({
    token: searchParams.get('token') || '',
    shortCode: '',
    email: '',
    name: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/partner-auth/verify-invite`, {
        token: form.token,
        shortCode: form.shortCode
      });
      if (res.data.valid) {
        setForm(prev => ({ ...prev, email: res.data.email || '' }));
        setStep(2);
      } else {
        setMessage('Invalid or expired credentials');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/partner-auth/register`, form);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 lg:mt-24 bg-white rounded-lg shadow-md">
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Partner Signup</h2>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Invite Token"
                value={form.token}
                onChange={(e) => setForm({...form, token: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <p className="text-center text-gray-500">OR</p>
            
            <div>
              <input
                type="text"
                placeholder="Short Code (e.g. P-1234)"
                value={form.shortCode}
                onChange={(e) => setForm({...form, shortCode: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
            
            {message && <p className="text-sm text-red-600 text-center">{message}</p>}
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Complete Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Your business email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            
            {message && <p className="text-sm text-red-600 text-center">{message}</p>}
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Application Submitted</h2>
          <div className="bg-green-50 p-4 rounded-md border border-green-100">
            <p className="text-green-700">Your partner account is pending approval.</p>
            <p className="text-green-700 mt-1">You'll receive your referral link via email once approved.</p>
          </div>
        </div>
      )}
    </div>
  );
}