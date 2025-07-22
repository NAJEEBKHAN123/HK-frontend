import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const PartnerDashboard = () => {
//   const { partner } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/partners/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDashboardData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="partner-dashboard">
      <h1>Partner Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Referrals</h3>
          <p>{dashboardData.partner.totalClientsReferred}</p>
        </div>
        <div className="stat-card">
          <h3>Total Commission</h3>
          <p>${(dashboardData.partner.commissionEarned / 100).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Available Payout</h3>
          <p>${(dashboardData.partner.availableCommission / 100).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <p>{dashboardData.partner.conversionRate * 100}%</p>
        </div>
      </div>

      <div className="referral-section">
        <h2>Your Referral Link</h2>
        <div className="referral-link-container">
          <input
            type="text"
            value={dashboardData.partner.referralLink}
            readOnly
            className="referral-link-input"
          />
          <CopyToClipboard
            text={dashboardData.partner.referralLink}
            onCopy={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <button className="copy-button">
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </CopyToClipboard>
        </div>
        <p className="referral-code">Your Referral Code: {dashboardData.partner.referralCode}</p>
      </div>

      <div className="recent-referrals">
        <h2>Recent Referrals</h2>
        {dashboardData.clients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.clients.map(client => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No referrals yet</p>
        )}
      </div>

      {dashboardData.partner.availableCommission > 0 && (
        <div className="payout-section">
          <button 
            onClick={async () => {
              try {
                await axios.post(`${API_BASE_URL}/api/partners/request-payout`, {}, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                alert('Payout request submitted successfully!');
                window.location.reload();
              } catch (err) {
                alert(err.response?.data?.error || 'Payout request failed');
              }
            }}
            className="payout-button"
          >
            Request Payout (${(dashboardData.partner.availableCommission / 100).toFixed(2)})
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;