import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import CreatorSideMenu from '@/creators/components/CreatorSideMenu';
import '@/creators/layouts/CreatorLayout.css';
import { getHomePathForRole, getMockSession } from '@/auth/lib/mockAuth';
import { useLogout } from '@/auth/hooks/useLogout';
import '@/shared/styles/dashboard.css';

export default function CreatorLayout() {
  const logout = useLogout();
  const { pathname } = useLocation();
  const session = getMockSession();

  if (!session) {
    return <Navigate to="/login" replace />;
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
