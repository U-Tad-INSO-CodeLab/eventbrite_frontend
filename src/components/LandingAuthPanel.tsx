import { useEffect, useMemo, useState, type SubmitEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInputWithToggle from './PasswordInputWithToggle';
import type { MockUserRole } from '../lib/mockAuth';
import {
  getHomePathForRole,
  getMockSession,
  MOCK_LOGIN_FLASH_KEY,
  mockLogin,
  mockRegister,
} from '../lib/mockAuth';
import { getPasswordChecks, isPasswordPolicyMet } from '../lib/passwordRules';

export type LandingAuthMode = 'login' | 'register';

type Props = {
  mode: LandingAuthMode;
  onModeChange: (mode: LandingAuthMode) => void;
};

export default function LandingAuthPanel({ mode, onModeChange }: Props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [banner, setBanner] = useState(
    () => sessionStorage.getItem(MOCK_LOGIN_FLASH_KEY) ?? ''
  );
  const [loginLoading, setLoginLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState<MockUserRole>('sponsor');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const pwdChecks = useMemo(
    () => getPasswordChecks(regPassword),
    [regPassword]
  );
  const passwordOk = isPasswordPolicyMet(regPassword);

  useEffect(() => {
    sessionStorage.removeItem(MOCK_LOGIN_FLASH_KEY);
  }, []);

  useEffect(() => {
    const s = getMockSession();
    if (s) navigate(getHomePathForRole(s.role), { replace: true });
  }, [navigate]);

  const handleLogin: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoginError('');
    setBanner('');
    if (!email.trim() || !password) {
      setLoginError('Introduce email y contraseña.');
      return;
    }
    setLoginLoading(true);
    void (async () => {
      const result = await mockLogin(email, password, remember);
      setLoginLoading(false);
      if (!result.ok) {
        setLoginError(result.error);
        return;
      }
      navigate(getHomePathForRole(result.user.role), { replace: true });
    })();
  };

  const handleRegister: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setRegError('');

    if (!fullName.trim()) {
      setRegError('Indica tu nombre completo.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Indica un email válido.');
      return;
    }
    if (!isPasswordPolicyMet(regPassword)) {
      setRegError(
        'La contraseña debe cumplir todos los requisitos indicados abajo.'
      );
      return;
    }
    if (regPassword !== confirm) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }
    if (!acceptTerms) {
      setRegError('Debes aceptar los términos para continuar.');
      return;
    }

    setRegLoading(true);
    void (async () => {
      const result = await mockRegister(fullName, regEmail, regPassword, role);
      setRegLoading(false);

      if (!result.ok) {
        setRegError(result.error);
        return;
      }

      setBanner(
        'Cuenta creada. Ya puedes iniciar sesión con tu email y contraseña.'
      );
      onModeChange('login');
      navigate('/', { replace: true });
    })();
  };

  return (
    <div className="landing-auth-panel">
      <div className="landing-auth-tabs" role="tablist" aria-label="Account">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={mode === 'login' ? 'is-active' : ''}
          onClick={() => onModeChange('login')}
        >
          Log In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          className={mode === 'register' ? 'is-active' : ''}
          onClick={() => onModeChange('register')}
        >
          Register
        </button>
      </div>

      {mode === 'login' ? (
        <>
          <h2 className="landing-auth-title">Welcome back</h2>
          <p className="landing-auth-subtitle">Sign in to your account</p>

          {banner ? (
            <div className="auth-alert auth-alert-success" role="status">
              {banner}
            </div>
          ) : null}
          {loginError ? (
            <div className="auth-alert auth-alert-error" role="alert">
              {loginError}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="auth-field">
              <label htmlFor="landing-login-email">Email</label>
              <input
                id="landing-login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="brand@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginLoading}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="landing-login-password">Password</label>
              <PasswordInputWithToggle
                id="landing-login-password"
                name="password"
                autoComplete="current-password"
                placeholder="demo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
              />
            </div>

            <div className="auth-row-inline">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loginLoading}
                />
                Recordarme
              </label>
              <button
                type="button"
                className="auth-link"
                onClick={() => alert('On development.')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loginLoading}
            >
              {loginLoading ? 'Entrando…' : 'Log In'}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="landing-auth-title">Create account</h2>
          <p className="landing-auth-subtitle">
            Elige si patrocinas eventos u organizas los tuyos.
          </p>

          {regError ? (
            <div className="auth-alert auth-alert-error" role="alert">
              {regError}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleRegister} noValidate>
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
                    disabled={regLoading}
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
                    disabled={regLoading}
                  />
                  <span className="auth-role-card">
                    <strong>Creador</strong>
                    <span>Crea y gestiona tus eventos y busca sponsors.</span>
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="auth-field">
              <label htmlFor="landing-reg-name">Nombre completo</label>
              <input
                id="landing-reg-name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="María García"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={regLoading}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="landing-reg-email">Email</label>
              <input
                id="landing-reg-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@empresa.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                disabled={regLoading}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="landing-reg-password">Contraseña</label>
              <p
                className="auth-password-policy-msg"
                id="landing-reg-password-hint"
              >
                Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas
                y al menos un símbolo (p. ej. !@#$%).
              </p>
              <PasswordInputWithToggle
                id="landing-reg-password"
                name="password"
                autoComplete="new-password"
                placeholder="Tu contraseña segura"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                disabled={regLoading}
                aria-describedby="landing-reg-password-hint landing-reg-password-checks"
              />
              <ul
                className="auth-password-checks"
                id="landing-reg-password-checks"
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
                    {pwdChecks.minLength ? '\u2713' : '\u25CB'}
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
                    {pwdChecks.hasUpper ? '\u2713' : '\u25CB'}
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
                    {pwdChecks.hasLower ? '\u2713' : '\u25CB'}
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
                    {pwdChecks.hasSymbol ? '\u2713' : '\u25CB'}
                  </span>
                  Un símbolo (puntuación o especial)
                </li>
              </ul>
            </div>
            <div className="auth-field">
              <label htmlFor="landing-reg-confirm">Confirmar contraseña</label>
              <PasswordInputWithToggle
                id="landing-reg-confirm"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={regLoading}
              />
            </div>

            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={regLoading}
              />
              Acepto los términos y la política de privacidad (mock)
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={regLoading || !passwordOk}
              title={
                !passwordOk
                  ? 'Completa los requisitos de contraseña para continuar'
                  : undefined
              }
            >
              {regLoading ? 'Creando cuenta…' : 'Register'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
