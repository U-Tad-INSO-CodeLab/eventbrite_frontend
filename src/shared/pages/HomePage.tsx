import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import LandingAuthPanel, {
  type LandingAuthMode,
} from '@/shared/components/LandingAuthPanel';
import { MOCK_AUTH_HINT, getHomePathForRole, getMockSession } from '@/auth/lib/mockAuth';
import '@/shared/pages/HomePage.css';
import '@/auth/styles/auth.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getMockSession();

  const authMode: LandingAuthMode =
    searchParams.get('tab') === 'register' ? 'register' : 'login';

  const setAuthMode = (mode: LandingAuthMode) => {
    if (mode === 'login') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: 'register' }, { replace: true });
    }
  };

  useEffect(() => {
    const s = getMockSession();
    if (s) navigate(getHomePathForRole(s.role), { replace: true });
  }, [navigate]);

  if (session) {
    return null;
  }

  return (
    <Box className="landing-page">
      <Box component="header" className="landing-top-header">
        <Box className="landing-top-header-inner">
          <Box className="landing-header-brand">
            <Typography component="span" className="landing-logo-text">
              EventLink
            </Typography>
          </Box>
          <Typography component="p" className="landing-header-tagline">
            Sponsor &amp; Creator Marketplace
          </Typography>
        </Box>
      </Box>

      <Box component="main" className="landing-main">
        <Box className="landing-main-inner">
          <Box className="landing-columns">
            <Box className="landing-hero">
              <Typography component="h1" className="landing-headline">
                Connect brands with the{' '}
                <Box component="span" className="landing-headline-accent">
                  perfect events
                </Box>
              </Typography>
              <Typography component="p" className="landing-lead">
                Discover sponsorship opportunities, negotiate deals, and manage
                partnerships — all in one platform.
              </Typography>

              <Box component="ul" className="landing-features">
                <Box component="li">
                  <CalendarMonthOutlinedIcon className="landing-feature-icon" aria-hidden />
                  <Box>
                    <Box component="strong">Discover Events</Box>
                    <Box component="span">Browse curated opportunities</Box>
                  </Box>
                </Box>
                <Box component="li">
                  <HandshakeOutlinedIcon className="landing-feature-icon" aria-hidden />
                  <Box>
                    <Box component="strong">Close Deals</Box>
                    <Box component="span">Align with organizers faster</Box>
                  </Box>
                </Box>
                <Box component="li">
                  <BoltOutlinedIcon className="landing-feature-icon" aria-hidden />
                  <Box>
                    <Box component="strong">Manage Easily</Box>
                    <Box component="span">One workspace for your pipeline</Box>
                  </Box>
                </Box>
              </Box>

              <Typography component="p" className="landing-demo">
                <Box component="span" className="landing-demo-dot" aria-hidden="true" />
                <Box component="span">
                  <Box component="strong">Demo mode</Box> — {MOCK_AUTH_HINT}
                </Box>
              </Typography>
            </Box>

            <Box className="landing-auth-shell auth-page landing-auth-embed">
              <Box className="auth-card landing-auth-card">
                <LandingAuthPanel mode={authMode} onModeChange={setAuthMode} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
