import { Link, Outlet, useLocation } from 'react-router-dom';
import CreatorSideMenu from '../components/CreatorSideMenu';
import './creatorShell.css';
import { getHomePathForRole, getMockSession } from '../../auth/lib/mockAuth';
import { useLogout } from '../../auth/hooks/useLogout';
import '../pages/dashboard.css';

export default function CreatorLayout() {
  const logout = useLogout();
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
  const isCreateRoute = path.endsWith('/create-event');

  return (
    <div className="creator-shell">
      <CreatorSideMenu onLogout={logout} />
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
