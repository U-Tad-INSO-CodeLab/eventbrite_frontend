import { useState, type SubmitEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInputWithToggle from './PasswordInputWithToggle';
import { getHomePathForRole, mockLogin } from '../lib/mockAuth';

type Props = {
  banner: string;
  clearBanner: () => void;
};

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LandingLoginForm({ banner, clearBanner }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    clearBanner();

    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = 'Please enter your email.';
    if (!password) nextErrors.password = 'Please enter your password.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoginLoading(true);
    void (async () => {
      const result = await mockLogin(email, password, remember);
      setLoginLoading(false);
      if (!result.ok) {
        setErrors({ form: result.error });
        return;
      }
      navigate(getHomePathForRole(result.user.role), { replace: true });
    })();
  };

  return (
    <>
      <h2 className="landing-auth-title">Welcome back</h2>
      <p className="landing-auth-subtitle">Sign in to your account</p>

      {banner ? (
        <div className="auth-alert auth-alert-success" role="status">
          {banner}
        </div>
      ) : null}
      {errors.form ? (
        <div className="auth-alert auth-alert-error" role="alert">
          {errors.form}
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
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'landing-login-email-error' : undefined}
          />
          {errors.email ? (
            <p id="landing-login-email-error" className="auth-field-error" role="alert">
              {errors.email}
            </p>
          ) : null}
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
            aria-describedby={
              errors.password ? 'landing-login-password-error' : undefined
            }
          />
          {errors.password ? (
            <p
              id="landing-login-password-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="auth-row-inline">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loginLoading}
            />
            Remember me
          </label>
          <button
            type="button"
            className="auth-link"
            onClick={() => alert('On development.')}
          >
            Forgot your password?
          </button>
        </div>

        <button type="submit" className="auth-submit" disabled={loginLoading}>
          {loginLoading ? 'Signing in…' : 'Log In'}
        </button>
      </form>
    </>
  );
}
