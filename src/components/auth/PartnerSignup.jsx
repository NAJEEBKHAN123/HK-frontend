import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function PartnerSignup() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    token: '',
    shortCode: '',
    email: '',
    name: '',
    password: ''
  });
  const [partnerData, setPartnerData] = useState(null); // Add state for partner data
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-verify when token/code exists in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const code = searchParams.get('code');

    if (token || code) {
      setForm(prev => ({
        ...prev,
        token: token || '',
        shortCode: code || ''
      }));
      verifyCredentials(token, code);
    }
  }, []);

  const verifyCredentials = async (token, shortCode) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/partner-auth/verify-invite`, {
        token,
        shortCode
      });

      if (res.data.valid) {
        setForm(prev => ({
          ...prev,
          email: res.data.email || '',
          token,
          shortCode
        }));
        setStep(2);
      } else {
        setMessage(res.data.error || 'Invalid credentials');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.password) {
      return setMessage('Name and password are required');
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/partner-auth/register`, form);
      setPartnerData(response.data.partner); // Store the partner data from response
      setStep(3); // Success step
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Partner Signup</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Invite Token"
                  value={form.token}
                  onChange={(e) => setForm({...form, token: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <p className="text-center text-gray-500">OR</p>
                <input
                  type="text"
                  placeholder="Short Code (P-1234)"
                  value={form.shortCode}
                  onChange={(e) => setForm({...form, shortCode: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={() => verifyCredentials(form.token, form.shortCode)}
                className="w-full p-2 bg-blue-600 text-white rounded"
              >
                Continue
              </button>
            </>
          )}
          {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Complete Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                className="w-full p-2 border rounded bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full p-2 border rounded"
                required
                minLength="8"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
            >
              {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
          </form>
          {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
      )}

      {step === 3 && partnerData && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Registration Complete!</h2>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-green-700 font-medium">Your partner account is now active</p>
            
            <div className="mt-4">
              <p className="font-medium">Your referral link:</p>
              <div className="p-2 bg-gray-100 rounded-md mt-2 break-all">
                {partnerData.referralLink || `${window.location.origin}/join?ref=${partnerData.referralCode}`}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(partnerData.referralLink || `${window.location.origin}/join?ref=${partnerData.referralCode}`);
                  alert('Copied to clipboard!');
                }}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Copy Link
              </button>
            </div>
            
            <a 
              href={partnerData.dashboardLink || '/partner/dashboard'} 
              className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}