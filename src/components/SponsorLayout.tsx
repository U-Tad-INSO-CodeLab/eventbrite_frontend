import { Link, Outlet, useNavigate } from 'react-router-dom';
import SponsorSideMenu from './SponsorSideMenu';
import './sponsorShell.css';
import {
  clearMockSession,
  getHomePathForRole,
  getMockSession,
  MOCK_SESSION_KEY,
} from '../lib/mockAuth';
import '../pages/dashboard.css';

export default function SponsorLayout() {
  const navigate = useNavigate();
  const session = getMockSession();

  if (!session) {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          <Link to="/login">Sign in</Link> to open the sponsor area.
        </p>
      </div>
    );
  }

  if (session.role !== 'sponsor') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          This account is a creator.{' '}
          <Link to={getHomePathForRole('creator')}>Go to creator dashboard</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="sponsor-shell">
      <SponsorSideMenu
        onLogout={() => {
          clearMockSession();
          localStorage.removeItem(MOCK_SESSION_KEY);
          navigate('/', { replace: true });
        }}
      />
      <div className="sponsor-content">
        <Outlet />
      </div>
    </div>
  );
}
