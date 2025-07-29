const PartnerStats = ({ partner }) => {
  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${partner.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Personal Info */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Your Information</h3>
          <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <p><span className="font-medium">Name:</span> {partner.name}</p>
            <p><span className="font-medium">Email:</span> {partner.email}</p>
            <p><span className="font-medium">Status:</span> <span className="capitalize">{partner.status}</span></p>
          </div>
        </div>

        {/* Referral Info */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Referral Information</h3>
          <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <p><span className="font-medium">Your Code:</span> {partner.referralCode}</p>
            <p><span className="font-medium">Total Clicks:</span> {partner.referralClicks}</p>
            <p><span className="font-medium">Conversion Rate:</span> {partner.conversionRate}%</p>
            <p><span className="font-medium">Orders Referred:</span> {partner.ordersReferred || 0}</p>
            <p><span className="font-medium">Client Referred:</span> {partner.totalClientsReferred || 0}</p>
          </div>
        </div>

        {/* Commission Info */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Commissions</h3>
          <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <p><span className="font-medium">Rate:</span> {partner.commissionRate || 10}% </p>
            <p><span className="font-medium">Earned:</span> €{(partner.commissionEarned / 100).toFixed(2)}</p>
            <p><span className="font-medium">Paid:</span> €{(partner.commissionPaid / 100).toFixed(2)}</p>
            <hr className="my-1 sm:my-2" />
            <p><span className="font-medium">Available:</span> €{(partner.availableCommission / 100).toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
          <div className="space-y-2 sm:space-y-3">
            <button 
              onClick={copyReferralLink}
              className="w-full bg-cyan-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-cyan-700 transition text-sm sm:text-base"
            >
              Copy Referral Link
            </button>
            {partner.availableCommission > 0 && (
              <button className="w-full bg-green-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-green-700 transition text-sm sm:text-base">
                Request Payout (€{(partner.availableCommission / 100).toFixed(2)})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerStats;