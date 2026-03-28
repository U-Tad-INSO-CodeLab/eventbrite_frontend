import { useEffect, useMemo, useState, type SubmitEventHandler } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventLinkLogo from '../components/EventLinkLogo';
import PasswordInputWithToggle from '../components/PasswordInputWithToggle';
import { getPasswordChecks, isPasswordPolicyMet } from '../lib/passwordRules';
import type { MockUserRole } from '../lib/mockAuth';
import {
  getHomePathForRole,
  getMockSession,
  MOCK_LOGIN_FLASH_KEY,
  mockRegister,
} from '../lib/mockAuth';
import './auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState<MockUserRole>('sponsor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pwdChecks = useMemo(() => getPasswordChecks(password), [password]);
  const passwordOk = isPasswordPolicyMet(password);

  useEffect(() => {
    const s = getMockSession();
    if (s) navigate(getHomePathForRole(s.role), { replace: true });
  }, [navigate]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Indica tu nombre completo.');
      return;
    }
    if (!email.trim()) {
      setError('Indica un email válido.');
      return;
    }
    if (!isPasswordPolicyMet(password)) {
      setError(
        'La contraseña debe cumplir todos los requisitos indicados abajo.'
      );
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos para continuar.');
      return;
    }

    setLoading(true);
    void (async () => {
      const result = await mockRegister(fullName, email, password, role);
      setLoading(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      sessionStorage.setItem(
        MOCK_LOGIN_FLASH_KEY,
        'Cuenta creada. Ya puedes iniciar sesión con tu email y contraseña.'
      );
      navigate('/login');
    })();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <EventLinkLogo variant="auth" />
          <span className="auth-brand-name">EventLink</span>
        </div>

        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">
          Elige si patrocinas eventos u organizas los tuyos.
        </p>

        {error ? (
          <div className="auth-alert auth-alert-error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="auth-fieldset">
            <legend className="auth-legend">Tipo de cuenta</legend>
            <div className="auth-role-grid">
              <label className="auth-role-option">
                <input
                  type="radio"
                  name="role"
                  value="sponsor"
                  checked={role === 'sponsor'}
                  onChange={() => setRole('sponsor')}
                  disabled={loading}
                />
                <span className="auth-role-card">
                  <strong>Sponsor</strong>
                  <span>
                    Patrocinio, propuestas y acuerdos con organizadores.
                  </span>
                </span>
              </label>
              <label className="auth-role-option">
                <input
                  type="radio"
                  name="role"
                  value="creator"
                  checked={role === 'creator'}
                  onChange={() => setRole('creator')}
                  disabled={loading}
                />
                <span className="auth-role-card">
                  <strong>Creador</strong>
                  <span>Crea y gestiona tus eventos y busca sponsors.</span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="auth-field">
            <label htmlFor="register-name">Nombre completo</label>
            <input
              id="register-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="María García"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-password">Contraseña</label>
            <p className="auth-password-policy-msg" id="register-password-hint">
              Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y
              al menos un símbolo (p. ej. !@#$%).
            </p>
            <PasswordInputWithToggle
              id="register-password"
              name="password"
              autoComplete="new-password"
              placeholder="Tu contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-describedby="register-password-hint register-password-checks"
            />
            <ul
              className="auth-password-checks"
              id="register-password-checks"
              aria-live="polite"
            >
              <li
                className={
                  pwdChecks.minLength
                    ? 'auth-password-check auth-password-check--ok'
                    : 'auth-password-check'
                }
              >
                <span className="auth-password-check-icon" aria-hidden="true">
                  {pwdChecks.minLength ? '✓' : '○'}
                </span>
                Al menos 8 caracteres
              </li>
              <li
                className={
                  pwdChecks.hasUpper
                    ? 'auth-password-check auth-password-check--ok'
                    : 'auth-password-check'
                }
              >
                <span className="auth-password-check-icon" aria-hidden="true">
                  {pwdChecks.hasUpper ? '✓' : '○'}
                </span>
                Una letra mayúscula
              </li>
              <li
                className={
                  pwdChecks.hasLower
                    ? 'auth-password-check auth-password-check--ok'
                    : 'auth-password-check'
                }
              >
                <span className="auth-password-check-icon" aria-hidden="true">
                  {pwdChecks.hasLower ? '✓' : '○'}
                </span>
                Una letra minúscula
              </li>
              <li
                className={
                  pwdChecks.hasSymbol
                    ? 'auth-password-check auth-password-check--ok'
                    : 'auth-password-check'
                }
              >
                <span className="auth-password-check-icon" aria-hidden="true">
                  {pwdChecks.hasSymbol ? '✓' : '○'}
                </span>
                Un símbolo (puntuación o especial)
              </li>
            </ul>
          </div>
          <div className="auth-field">
            <label htmlFor="register-confirm">Confirmar contraseña</label>
            <PasswordInputWithToggle
              id="register-confirm"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
            />
          </div>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={loading}
            />
            Acepto los términos y la política de privacidad (mock)
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || !passwordOk}
            title={
              !passwordOk
                ? 'Completa los requisitos de contraseña para continuar'
                : undefined
            }
          >
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
