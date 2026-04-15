import { Link, useNavigate } from 'react-router-dom';
import EventLinkLogo from '../components/EventLinkLogo';
import {
  clearMockSession,
  getHomePathForRole,
  getMockSession,
  MOCK_SESSION_KEY,
} from '../lib/mockAuth';
import './dashboard.css';

export default function CreatorDashboardPage() {
  const navigate = useNavigate();
  const session = getMockSession();

  if (!session) {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          <Link to="/login">Sign in</Link> to view the creator dashboard.
        </p>
      </div>
    );
  }

  if (session.role !== 'creator') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          Your account is a sponsor account.{' '}
          <Link to={getHomePathForRole('sponsor')}>Go to sponsor dashboard</Link>
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
          <span className="dash-pill dash-pill-creator">Creator</span>
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
        <h1>Creator dashboard</h1>
        <p>
          Mock view: event management, publishing, and metrics will appear here
          (as shown in the prototype).
        </p>
      </main>
    </div>
  );
}
