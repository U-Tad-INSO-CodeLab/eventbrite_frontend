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
          <Link to="/login">Inicia sesión</Link> para ver el panel sponsor.
        </p>
      </div>
    );
  }

  if (session.role !== 'sponsor') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          Tu cuenta es de creador.{' '}
          <Link to={getHomePathForRole('creator')}>Ir al panel creador</Link>
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
            Cerrar sesión
          </button>
        </nav>
      </header>
      <main className="dash-main">
        <h1>Panel sponsor</h1>
        <p>
          Vista mock: aquí irá Discover, propuestas y acuerdos (como en el
          prototipo).
        </p>
      </main>
    </div>
  );
}
