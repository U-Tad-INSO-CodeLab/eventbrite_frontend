import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearMockSessionEverywhere, getMockSession } from '@/auth/lib/mockAuth';
import { removeEmptyDealThreadsForSponsor } from '@/chat/lib/mockDealThreads';

export function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    const s = getMockSession();
    if (s?.role === 'sponsor') {
      removeEmptyDealThreadsForSponsor(s.id);
    }
    clearMockSessionEverywhere();
    navigate('/', { replace: true });
  }, [navigate]);
}
