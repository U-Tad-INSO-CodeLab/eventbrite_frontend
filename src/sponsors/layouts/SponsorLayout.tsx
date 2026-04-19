import { Link, Navigate, Outlet } from 'react-router-dom';
import SponsorSideMenu from '@/sponsors/components/SponsorSideMenu';
import '@/sponsors/layouts/SponsorLayout.css';
import { getHomePathForRole, getMockSession } from '@/auth/lib/mockAuth';
import { useLogout } from '@/auth/hooks/useLogout';
import '@/shared/styles/dashboard.css';

export default function SponsorLayout() {
  const logout = useLogout();
  const session = getMockSession();

  if (!session) {
    return <Navigate to="/login" replace />;
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
      <SponsorSideMenu onLogout={logout} />
      <div className="sponsor-content">
        <Outlet />
      </div>
    </div>
  );
}
