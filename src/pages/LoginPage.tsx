import { useEffect, useState, type SubmitEventHandler } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventLinkLogo from '../components/EventLinkLogo';
import PasswordInputWithToggle from '../components/PasswordInputWithToggle';
import {
  getHomePathForRole,
  getMockSession,
  MOCK_AUTH_HINT,
  MOCK_LOGIN_FLASH_KEY,
  mockLogin,
} from '../lib/mockAuth';
import './auth.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(
    () => sessionStorage.getItem(MOCK_LOGIN_FLASH_KEY) ?? ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem(MOCK_LOGIN_FLASH_KEY);
  }, []);

  useEffect(() => {
    const s = getMockSession();
    if (s) navigate(getHomePathForRole(s.role), { replace: true });
  }, [navigate]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError('');
    setBanner('');
    if (!email.trim() || !password) {
      setError('Introduce email y contraseña.');
      return;
    }
    setLoading(true);
    void (async () => {
      const result = await mockLogin(email, password, remember);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigate(getHomePathForRole(result.user.role), { replace: true });
    })();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <EventLinkLogo variant="auth" />
          <span className="auth-brand-name">EventLink</span>
        </div>

        <h1 className="auth-title auth-title-tight">Iniciar sesión</h1>

        {banner ? (
          <div className="auth-alert auth-alert-success" role="status">
            {banner}
          </div>
        ) : null}
        {error ? (
          <div className="auth-alert auth-alert-error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Contraseña</label>
            <PasswordInputWithToggle
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth-row-inline">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              Recordarme
            </label>
            <button
              type="button"
              className="auth-link"
              onClick={() =>
                alert(
                  'Recuperación de contraseña: se conectará al backend más adelante.'
                )
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">
            Crear cuenta
          </Link>
        </p>

        <p className="auth-hint">{MOCK_AUTH_HINT}</p>
      </div>
    </div>
  );
}
