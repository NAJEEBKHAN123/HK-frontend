import { useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function GenerateInvite() {
  const [email, setEmail] = useState('');
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Verify admin token exists
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Authentication token not found');
      }

      // Debugging: Log the request details
      console.log('Making request to:', `${API_BASE_URL}/api/partner-admin/credentials`);
      console.log('Request payload:', { email });
      console.log('Authorization token:', adminToken);

      const res = await axios.post(
        `${API_BASE_URL}/api/partner-admin/credentials`, 
        { email },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Debugging: Log the successful response
      console.log('Response received:', res.data);

      setInvite({
        token: res.data.token,
        shortCode: res.data.shortCode,
        expiresAt: res.data.expiresAt,
        inviteLink: `${window.location.origin}/partner-signup?token=${res.data.token}&code=${res.data.shortCode}`
      });
    } catch (err) {
      // Enhanced error handling
      let errorMessage = 'Failed to generate credentials';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with:', err.response.status);
        console.error('Response data:', err.response.data);
        
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server';
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (

      <div className="max-w-2xl mx-auto p-6 lg:mt-24 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Partner Credentials</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="email"
            placeholder="Partner's email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Credentials'}
        </button>
        
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {invite && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Share these credentials securely:</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Token:</label>
            <div className="flex">
              <code className="flex-grow px-3 py-2 bg-gray-100 rounded-l-md overflow-x-auto">{invite.token}</code>
              <button 
                onClick={() => copyToClipboard(invite.token)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-md transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Code:</label>
            <div className="flex">
              <code className="flex-grow px-3 py-2 bg-gray-100 rounded-l-md">{invite.shortCode}</code>
              <button 
                onClick={() => copyToClipboard(invite.shortCode)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-md transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires:</label>
            <span className="text-gray-900">{new Date(invite.expiresAt).toLocaleString()}</span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Signup Link:</label>
            <div className="flex">
              <input
                type="text"
                value={invite.inviteLink}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.target.select()}
              />
              <button 
                onClick={() => copyToClipboard(invite.inviteLink)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-1">• Send this to your partner via secure channel</p>
            <p>• They can register using either the token or short code</p>
          </div>
        </div>
      )}
    </div>
    
  );
}