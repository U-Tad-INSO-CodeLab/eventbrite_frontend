import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import {
  getHomePathForRole,
  getMockSession,
  MOCK_LOGIN_FLASH_KEY,
} from '@/auth/lib/mockAuth';
import LandingLoginForm from '@/shared/components/LandingLoginForm';
import LandingRegisterForm from '@/shared/components/LandingRegisterForm';

export type LandingAuthMode = 'login' | 'register';

type Props = {
  mode: LandingAuthMode;
  onModeChange: (mode: LandingAuthMode) => void;
};

export default function LandingAuthPanel({ mode, onModeChange }: Props) {
  const navigate = useNavigate();
  const [banner, setBanner] = useState(
    () => sessionStorage.getItem(MOCK_LOGIN_FLASH_KEY) ?? ''
  );

  useEffect(() => {
    sessionStorage.removeItem(MOCK_LOGIN_FLASH_KEY);
  }, []);

  useEffect(() => {
    const s = getMockSession();
    if (s) navigate(getHomePathForRole(s.role), { replace: true });
  }, [navigate]);

  return (
    <Box className="landing-auth-panel">
      <Box className="landing-auth-tabs" role="tablist" aria-label="Account">
        <Button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={mode === 'login' ? 'is-active' : ''}
          onClick={() => onModeChange('login')}
          disableRipple
        >
          Log In
        </Button>
        <Button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          className={mode === 'register' ? 'is-active' : ''}
          onClick={() => onModeChange('register')}
          disableRipple
        >
          Register
        </Button>
      </Box>

      {mode === 'login' ? (
        <LandingLoginForm banner={banner} clearBanner={() => setBanner('')} />
      ) : (
        <LandingRegisterForm
          onRegistered={() => {
            setBanner(
              'Account created. You can now sign in with your email and password.'
            );
            onModeChange('login');
            navigate('/', { replace: true });
          }}
        />
      )}
    </Box>
  );
}
