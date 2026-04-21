import { useMemo, useState, type SubmitEventHandler } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputBase,
  Typography,
} from '@mui/material';
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
      <Typography component="h2" className="landing-auth-title">
        Create account
      </Typography>
      <Typography component="p" className="landing-auth-subtitle">
        Choose whether you sponsor events or create your own.
      </Typography>

      {errors.form ? (
        <Alert className="auth-alert auth-alert-error" severity="error" role="alert">
          {errors.form}
        </Alert>
      ) : null}

      <Box component="form" className="auth-form" onSubmit={handleRegister} noValidate>
        <Box component="fieldset" className="auth-fieldset">
          <Typography component="legend" className="auth-legend">
            Account type
          </Typography>
          <Box className="auth-role-grid">
            <Box component="label" className="auth-role-option">
              <input
                type="radio"
                name="role"
                value="sponsor"
                checked={role === 'sponsor'}
                onChange={() => setRole('sponsor')}
                disabled={regLoading}
              />
              <Box component="span" className="auth-role-card">
                <Box component="strong">Sponsor</Box>
                <Box component="span">
                  Sponsorships, proposals, and agreements with organizers.
                </Box>
              </Box>
            </Box>
            <Box component="label" className="auth-role-option">
              <input
                type="radio"
                name="role"
                value="creator"
                checked={role === 'creator'}
                onChange={() => setRole('creator')}
                disabled={regLoading}
              />
              <Box component="span" className="auth-role-card">
                <Box component="strong">Creator</Box>
                <Box component="span">Create and manage your events and find sponsors.</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="auth-field">
          <Typography component="label" htmlFor="landing-reg-name">
            Full name
          </Typography>
          <InputBase
            className="auth-mui-field-root"
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
            fullWidth
          />
          {errors.fullName ? (
            <Typography
              component="p"
              id="landing-reg-name-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.fullName}
            </Typography>
          ) : null}
        </Box>
        <Box className="auth-field">
          <Typography component="label" htmlFor="landing-reg-email">
            Email
          </Typography>
          <InputBase
            className="auth-mui-field-root"
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
            fullWidth
          />
          {errors.email ? (
            <Typography
              component="p"
              id="landing-reg-email-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.email}
            </Typography>
          ) : null}
        </Box>
        <Box className="auth-field">
          <Typography component="label" htmlFor="landing-reg-password">
            Password
          </Typography>
          <Typography component="p" className="auth-password-policy-msg" id="landing-reg-password-hint">
            Must be at least 8 characters and include uppercase, lowercase, and at
            least one symbol (e.g. !@#$%).
          </Typography>
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
            <Typography
              component="p"
              id="landing-reg-password-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.password}
            </Typography>
          ) : null}
          <Box
            component="ul"
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
          </Box>
        </Box>
        <Box className="auth-field">
          <Typography component="label" htmlFor="landing-reg-confirm">
            Confirm password
          </Typography>
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
            <Typography
              component="p"
              id="landing-reg-confirm-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.confirm}
            </Typography>
          ) : null}
        </Box>

        <FormControlLabel
          className="auth-checkbox"
          control={
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={regLoading}
              aria-invalid={Boolean(errors.acceptTerms)}
              aria-describedby={errors.acceptTerms ? 'landing-reg-terms-error' : undefined}
            />
          }
          label="I accept the terms and privacy policy (mock)"
        />
        {errors.acceptTerms ? (
          <Typography component="p" id="landing-reg-terms-error" className="auth-field-error" role="alert">
            {errors.acceptTerms}
          </Typography>
        ) : null}

        <Button
          type="submit"
          className="auth-submit"
          variant="contained"
          disableElevation
          disabled={regLoading || !passwordOk}
          title={
            !passwordOk
              ? 'Complete password requirements to continue'
              : undefined
          }
        >
          {regLoading ? 'Creating account…' : 'Register'}
        </Button>
      </Box>
    </>
  );
}
