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
            <h2>Mis eventos</h2>
            {creatorEvents.length === 0 ? (
              <p className="dash-events-empty">
                Todavía no has publicado eventos. Ve a Create Event desde el
                menú lateral.
              </p>
            ) : (
              <ul className="dash-events-list">
                {creatorEvents.map((event) => (
                  <li key={event.id} className="dash-event-card">
                    <strong>{event.title}</strong>
                    <span>
                      {event.location || 'Ubicación pendiente'} ·{' '}
                      {event.date || 'Fecha pendiente'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
