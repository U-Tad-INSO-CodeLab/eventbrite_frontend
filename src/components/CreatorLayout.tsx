import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import CreatorSideMenu, { type CreatorNavActive } from './CreatorSideMenu';
import './creatorShell.css';
import {
  clearMockSession,
  getHomePathForRole,
  getMockSession,
  MOCK_SESSION_KEY,
} from '../lib/mockAuth';
import '../pages/dashboard.css';

export default function CreatorLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const session = getMockSession();

  if (!session) {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          <Link to="/login">Sign in</Link> to open the creator area.
        </p>
      </div>
    );
  }

  if (session.role !== 'creator') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          This account is a sponsor.{' '}
          <Link to={getHomePathForRole('sponsor')}>Go to sponsor dashboard</Link>
        </p>
      </div>
    );
  }

  const path = pathname.replace(/\/$/, '') || '/';
  let active: CreatorNavActive = 'dashboard';
  if (path.endsWith('/create-event')) active = 'create-event';
  else if (path.endsWith('/my-events')) active = 'my-events';

  const isCreateRoute = path.endsWith('/create-event');

  return (
    <div className="creator-shell">
      <CreatorSideMenu
        active={active}
        onLogout={() => {
          clearMockSession();
          localStorage.removeItem(MOCK_SESSION_KEY);
          navigate('/', { replace: true });
        }}
      />
      <div
        className={
          isCreateRoute ? 'creator-content creator-content--create' : 'creator-content'
        }
      >
        <Outlet />
      </div>
    </div>
  );
}
