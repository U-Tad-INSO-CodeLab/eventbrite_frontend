import { useMemo, useState, type SubmitEventHandler } from 'react';
import PasswordInputWithToggle from '@/shared/components/PasswordInputWithToggle';
import type { MockUserRole } from '@/auth/lib/mockAuth';
import { mockRegister } from '@/auth/lib/mockAuth';
import { getPasswordChecks, isPasswordPolicyMet } from '@/auth/lib/passwordRules';

type Props = {
  onRegistered: () => void;
};

type RegisterErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirm?: string;
  acceptTerms?: string;
  form?: string;
};

export default function LandingRegisterForm({ onRegistered }: Props) {
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState<MockUserRole>('sponsor');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [regLoading, setRegLoading] = useState(false);

  const pwdChecks = useMemo(() => getPasswordChecks(regPassword), [regPassword]);
  const passwordOk = isPasswordPolicyMet(regPassword);

  const handleRegister: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const nextErrors: RegisterErrors = {};
    if (!fullName.trim()) nextErrors.fullName = 'Please enter your full name.';
    if (!regEmail.trim()) nextErrors.email = 'Please enter a valid email.';
    if (!isPasswordPolicyMet(regPassword)) {
      nextErrors.password = 'Password must meet all the requirements below.';
    }
    if (regPassword !== confirm) {
      nextErrors.confirm = 'Passwords do not match.';
    }
    if (!acceptTerms) {
      nextErrors.acceptTerms = 'You must accept the terms to continue.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setRegLoading(true);
    void (async () => {
      const result = await mockRegister(fullName, regEmail, regPassword, role);
      setRegLoading(false);

      if (!result.ok) {
        setErrors({ form: result.error });
        return;
      }

      onRegistered();
    })();
  };

  return (
    <>
      <h2 className="landing-auth-title">Create account</h2>
      <p className="landing-auth-subtitle">
        Choose whether you sponsor events or create your own.
      </p>

      {errors.form ? (
        <div className="auth-alert auth-alert-error" role="alert">
          {errors.form}
        </div>
      ) : null}

      <form className="auth-form" onSubmit={handleRegister} noValidate>
        <fieldset className="auth-fieldset">
          <legend className="auth-legend">Account type</legend>
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
                  Sponsorships, proposals, and agreements with organizers.
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
                <strong>Creator</strong>
                <span>Create and manage your events and find sponsors.</span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="auth-field">
          <label htmlFor="landing-reg-name">Full name</label>
          <input
            id="landing-reg-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Maria Garcia"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={regLoading}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'landing-reg-name-error' : undefined}
          />
          {errors.fullName ? (
            <p id="landing-reg-name-error" className="auth-field-error" role="alert">
              {errors.fullName}
            </p>
          ) : null}
        </div>
        <div className="auth-field">
          <label htmlFor="landing-reg-email">Email</label>
          <input
            id="landing-reg-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            disabled={regLoading}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'landing-reg-email-error' : undefined}
          />
          {errors.email ? (
            <p id="landing-reg-email-error" className="auth-field-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className="auth-field">
          <label htmlFor="landing-reg-password">Password</label>
          <p className="auth-password-policy-msg" id="landing-reg-password-hint">
            Must be at least 8 characters and include uppercase, lowercase, and at
            least one symbol (e.g. !@#$%).
          </p>
          <PasswordInputWithToggle
            id="landing-reg-password"
            name="password"
            autoComplete="new-password"
            placeholder="Your secure password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            disabled={regLoading}
            aria-describedby={`landing-reg-password-hint landing-reg-password-checks${errors.password ? ' landing-reg-password-error' : ''}`}
          />
          {errors.password ? (
            <p
              id="landing-reg-password-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.password}
            </p>
          ) : null}
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
              At least 8 characters
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
              One uppercase letter
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
              One lowercase letter
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
              One symbol (punctuation or special)
            </li>
          </ul>
        </div>
        <div className="auth-field">
          <label htmlFor="landing-reg-confirm">Confirm password</label>
          <PasswordInputWithToggle
            id="landing-reg-confirm"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={regLoading}
            aria-describedby={errors.confirm ? 'landing-reg-confirm-error' : undefined}
          />
          {errors.confirm ? (
            <p
              id="landing-reg-confirm-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.confirm}
            </p>
          ) : null}
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={regLoading}
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={
              errors.acceptTerms ? 'landing-reg-terms-error' : undefined
            }
          />
          I accept the terms and privacy policy (mock)
        </label>
        {errors.acceptTerms ? (
          <p id="landing-reg-terms-error" className="auth-field-error" role="alert">
            {errors.acceptTerms}
          </p>
        ) : null}

        <button
          type="submit"
          className="auth-submit"
          disabled={regLoading || !passwordOk}
          title={
            !passwordOk
              ? 'Complete password requirements to continue'
              : undefined
          }
        >
          {regLoading ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </>
  );
}
