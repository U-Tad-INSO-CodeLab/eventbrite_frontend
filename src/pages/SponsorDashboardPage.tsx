import { Link, useNavigate } from 'react-router-dom';
import EventLinkLogo from '../components/EventLinkLogo';
import {
  clearMockSession,
  getHomePathForRole,
  getMockSession,
  MOCK_SESSION_KEY,
} from '../lib/mockAuth';
import './dashboard.css';

export default function SponsorDashboardPage() {
  const navigate = useNavigate();
  const session = getMockSession();

  if (!session) {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          <Link to="/login">Sign in</Link> to view the sponsor dashboard.
        </p>
      </div>
    );
  }

  if (session.role !== 'sponsor') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          Your account is a creator account.{' '}
          <Link to={getHomePathForRole('creator')}>Go to creator dashboard</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-brand">
          <EventLinkLogo variant="header" />
          <span className="dash-brand-name">EventLink</span>
          <span className="dash-pill">Sponsor</span>
        </div>
        <nav className="dash-nav">
          <span className="dash-user">{session.fullName}</span>
          <button
            type="button"
            className="dash-btn-ghost"
            onClick={() => {
              clearMockSession();
              localStorage.removeItem(MOCK_SESSION_KEY);
              navigate('/', { replace: true });
            }}
          >
            Log out
          </button>
        </nav>
      </header>
      <main className="dash-main">
        <h1>Sponsor dashboard</h1>
        <p>
          Mock view: Discover, proposals, and agreements will appear here (as in the
          prototype).
        </p>
      </main>
    </div>
  );
}
