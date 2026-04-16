import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearMockSessionEverywhere } from '@/auth/lib/mockAuth';

export function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    clearMockSessionEverywhere();
    navigate('/', { replace: true });
  }, [navigate]);
}
