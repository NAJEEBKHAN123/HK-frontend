import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

 function useReferralTracker() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode && isValidReferralCode(refCode)) {
      trackReferral(refCode);
    }
  }, [searchParams]);

  const isValidReferralCode = (code) => {
    // Validate HKP-XXXXXX format
    return /^HKP-[A-F0-9]{6}$/.test(code);
  };

  const trackReferral = async (code) => {
    try {
      // 1. Store in client-side storage
      sessionStorage.setItem('referralCode', code);
      Cookies.set('referralCode', code, { 
        expires: 7, // 7 days
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });

      // 2. Verify and track with server
      await axios.post(`${API_BASE_URL}/api/partner/track-referral`, {
        referralCode: code
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    } catch (error) {
      console.error('Referral tracking failed:', error);
      // Clear invalid referral code
      sessionStorage.removeItem('referralCode');
      Cookies.remove('referralCode');
    }
  };

  const getReferralCode = () => {
    // Check in order of priority:
    // 1. URL parameter
    // 2. Session storage
    // 3. Cookie
    return (
      searchParams.get('ref') ||
      sessionStorage.getItem('referralCode') ||
      Cookies.get('referralCode')
    );
  };

  const clearReferralCode = () => {
    sessionStorage.removeItem('referralCode');
    Cookies.remove('referralCode');
  };

  return { getReferralCode, clearReferralCode };
}

export default useReferralTracker