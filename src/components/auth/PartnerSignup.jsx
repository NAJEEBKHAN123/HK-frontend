import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCopy, FiCheck, FiArrowRight } from 'react-icons/fi';

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL;

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
  const [partnerData, setPartnerData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    
    if (!form.name || !form.password) {
      return setMessage('Name and password are required');
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/partner-auth/register`, form);
      setPartnerData(response.data.partner);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(partnerData.referralLink || `${PUBLIC_URL}/join?ref=${partnerData.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Step 1: Token/Code Verification */}
        {step === 1 && (
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Partner Signup</h2>
              <p className="text-gray-600">Enter your invitation details to get started</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invite Token</label>
                  <input
                    type="text"
                    placeholder="Paste your invitation token"
                    value={form.token}
                    onChange={(e) => setForm({...form, token: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
                  <input
                    type="text"
                    placeholder="Enter your short code (P-1234)"
                    value={form.shortCode}
                    onChange={(e) => setForm({...form, shortCode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => verifyCredentials(form.token, form.shortCode)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Continue <FiArrowRight className="inline ml-1" />
                </motion.button>

                {message && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center">
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Registration</h2>
              <p className="text-gray-600">Fill in your details to create your partner account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength="8"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </motion.button>

              {message && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center">
                  {message}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && partnerData && (
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
              <p className="text-gray-600">Your partner account is now active</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Your Referral Link</h3>
              <div className="flex items-center">
                <div className="flex-grow p-3 bg-white rounded-lg border border-gray-200 overflow-x-auto">
                  <code className="text-sm text-gray-800">
                    {partnerData.referralLink || `${PUBLIC_URL}/join?ref=${partnerData.referralCode}`}
                  </code>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Copy to clipboard"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </motion.button>
              </div>
              {copied && <p className="mt-2 text-sm text-green-600">Copied to clipboard!</p>}
            </div>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={partnerData.dashboardLink || '/partner/dashboard'}
              className="inline-block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </motion.a>
          </div>
        )}
      </motion.div>
    </div>
  );
}