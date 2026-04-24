import { useState, type SubmitEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getHomePathForRole, mockLogin } from '@/auth/lib/mockAuth';

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
      <Typography component="h2" className="landing-auth-title">
        Welcome back
      </Typography>
      <Typography component="p" className="landing-auth-subtitle">
        Sign in to your account
      </Typography>

      {banner ? (
        <Alert className="auth-alert auth-alert-success" severity="success" role="status">
          {banner}
        </Alert>
      ) : null}
      {errors.form ? (
        <Alert className="auth-alert auth-alert-error" severity="error" role="alert">
          {errors.form}
        </Alert>
      ) : null}

      <Box component="form" className="auth-form" onSubmit={handleLogin} noValidate>
        <Box className="auth-field">
          <Typography component="label" htmlFor="landing-login-email">
            Email
          </Typography>
          <InputBase
            className="auth-mui-field-root"
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
            fullWidth
          />
          {errors.email ? (
            <Typography
              component="p"
              id="landing-login-email-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.email}
            </Typography>
          ) : null}
        </Box>
        <Box className="auth-field">
          <Typography component="label" htmlFor="landing-login-password">
            Password
          </Typography>
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
            <Typography
              component="p"
              id="landing-login-password-error"
              className="auth-field-error"
              role="alert"
            >
              {errors.password}
            </Typography>
          ) : null}
        </Box>

        <Box className="auth-row-inline">
          <FormControlLabel
            className="auth-checkbox"
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loginLoading}
              />
            }
            label="Remember me"
          />
          <Button
            type="button"
            className="auth-link"
            variant="text"
            disableElevation
            onClick={() => alert('On development.')}
          >
            Forgot your password?
          </Button>
        </Box>

        <Button
          type="submit"
          className="auth-submit"
          disabled={loginLoading}
          variant="contained"
          disableElevation
        >
          {loginLoading ? 'Signing in…' : 'Log In'}
        </Button>
      </Box>
    </>
  );
}
