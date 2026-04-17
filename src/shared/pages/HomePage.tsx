import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    <div className="landing-page">
      <header className="landing-top-header">
        <div className="landing-top-header-inner">
          <div className="landing-header-brand">
            <span className="landing-logo-text">EventLink</span>
          </div>
          <p className="landing-header-tagline">Sponsor &amp; Creator Marketplace</p>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-main-inner">
          <div className="landing-columns">
            <div className="landing-hero">
              <h1 className="landing-headline">
                Connect brands with the{' '}
                <span className="landing-headline-accent">perfect events</span>
              </h1>
              <p className="landing-lead">
                Discover sponsorship opportunities, negotiate deals, and manage
                partnerships — all in one platform.
              </p>

              <ul className="landing-features">
                <li>
                  <span
                    className="landing-feature-icon material-symbols-outlined"
                    aria-hidden="true"
                  >
                    calendar_month
                  </span>
                  <div>
                    <strong>Discover Events</strong>
                    <span>Browse curated opportunities</span>
                  </div>
                </li>
                <li>
                  <span
                    className="landing-feature-icon material-symbols-outlined"
                    aria-hidden="true"
                  >
                    handshake
                  </span>
                  <div>
                    <strong>Close Deals</strong>
                    <span>Align with organizers faster</span>
                  </div>
                </li>
                <li>
                  <span
                    className="landing-feature-icon material-symbols-outlined"
                    aria-hidden="true"
                  >
                    bolt
                  </span>
                  <div>
                    <strong>Manage Easily</strong>
                    <span>One workspace for your pipeline</span>
                  </div>
                </li>
              </ul>

              <p className="landing-demo">
                <span className="landing-demo-dot" aria-hidden="true" />
                <span>
                  <strong>Demo mode</strong> — {MOCK_AUTH_HINT}
                </span>
              </p>
            </div>

            <div className="landing-auth-shell auth-page landing-auth-embed">
              <div className="auth-card landing-auth-card">
                <LandingAuthPanel mode={authMode} onModeChange={setAuthMode} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
