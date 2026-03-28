import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventLinkLogo from '../components/EventLinkLogo';
import { getHomePathForRole, getMockSession } from '../lib/mockAuth';
import './home.css';

export default function HomePage() {
  const navigate = useNavigate();
  const session = getMockSession();

  useEffect(() => {
    const s = getMockSession();
    if (s) navigate(getHomePathForRole(s.role), { replace: true });
  }, [navigate]);

  if (session) {
    return null;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <EventLinkLogo variant="header" />
          <span className="home-brand-name">EventLink</span>
        </div>
        <nav className="home-nav">
          <Link to="/login" className="home-link">
            Iniciar sesión
          </Link>
          <Link to="/register" className="home-btn-primary">
            Registrarse
          </Link>
        </nav>
      </header>
      <main className="home-main">
        <h1>Frontend en desarrollo</h1>
        <p>
          Rutas: <code>/login</code>, <code>/register</code>,{' '}
          <code>/sponsor</code> y <code>/creator</code>. Con sesión iniciada, la
          raíz <code>/</code> te lleva directamente a tu panel.
        </p>
      </main>
    </div>
  );
}
