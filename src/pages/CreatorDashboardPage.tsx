import { Link, useNavigate } from 'react-router-dom';
import CreatorSideMenu from '../components/CreatorSideMenu';
import {
  clearMockSession,
  getHomePathForRole,
  getMockSession,
  MOCK_SESSION_KEY,
} from '../lib/mockAuth';
import { getMockEventsByCreator } from '../lib/mockEvents';
import './dashboard.css';

export default function CreatorDashboardPage() {
  const navigate = useNavigate();
  const session = getMockSession();

  if (!session) {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          <Link to="/login">Inicia sesión</Link> para ver el panel creador.
        </p>
      </div>
    );
  }

  if (session.role !== 'creator') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          Tu cuenta es de sponsor.{' '}
          <Link to={getHomePathForRole('sponsor')}>Ir al panel sponsor</Link>
        </p>
      </div>
    );
  }
  const creatorEvents = getMockEventsByCreator(session.id);

  return (
    <div className="creator-shell">
      <CreatorSideMenu
        active="dashboard"
        onLogout={() => {
          clearMockSession();
          localStorage.removeItem(MOCK_SESSION_KEY);
          navigate('/', { replace: true });
        }}
      />
      <div className="creator-content">
        <main className="dash-main">
          <h1>Panel creador</h1>
          <p>
            Crea y gestiona tus eventos. Todo se guarda en mock usando
            localStorage.
          </p>
          <section className="dash-events">
            <h2>Quick overview</h2>
            <p className="dash-events-empty">
              Manage listings on{' '}
              <Link to="/creator/my-events" className="dash-link-muted">
                My Events
              </Link>
              . You have {creatorEvents.length} event
              {creatorEvents.length === 1 ? '' : 's'} in mock storage.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
