import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useReferralTracker() {
  const [searchParams] = useSearchParams();

  const isValidReferralCode = (code) => {
    return code && /^HKP-[A-F0-9]{6}$/i.test(code);
  };

  const getReferralCode = () => {
    // Check URL first (most authoritative)
    const urlCode = searchParams.get('ref');
    if (isValidReferralCode(urlCode)) {
      sessionStorage.setItem('currentReferral', urlCode);
      return urlCode;
    }

    // Check session storage
    const sessionCode = sessionStorage.getItem('currentReferral');
    if (isValidReferralCode(sessionCode)) {
      return sessionCode;
    }

    return null;
  };

  const clearReferralCode = () => {
    sessionStorage.removeItem('currentReferral');
  };

  return { getReferralCode, clearReferralCode };
}