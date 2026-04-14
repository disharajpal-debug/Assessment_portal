import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { setAuth } from '../../../utils/auth';
import { ROLES } from '../../../constants/roles';
import { loginStyles } from './Login.style';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    if (!username.trim() || !password) return;

    setSubmitting(true);
    try {
      const response = await api.post('auth/login/', {
        username: username.trim(),
        password,
      });

      const data = response.data;
      setAuth(data);

      if (data.user.role === ROLES.CLIENT) navigate('/client');
      else if (data.user.role === ROLES.ASSESSOR) navigate('/assessor');
      else if (data.user.role === ROLES.ADMIN) navigate('/admin');
      else if (data.user.role === ROLES.SUPERUSER) navigate('/superuser');
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        'Login failed. Please check credentials or backend connectivity.';
      alert(message);
      console.error(
        'Login error:',
        error?.response?.data || error?.message || error,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={loginStyles.root}>
      <div className={loginStyles.backdrop} aria-hidden />

      <div className={loginStyles.inner}>
        <div className={loginStyles.brand}>
          <div className={loginStyles.logo}>A</div>
          <h1 className={loginStyles.title}>Assessment Portal</h1>
          <p className={loginStyles.subtitle}>
            Sign in to continue to your workspace
          </p>
        </div>

        <div className="auth-card">
          <h2 className={loginStyles.cardTitle}>Welcome back</h2>
          <p className={loginStyles.cardDesc}>Enter your credentials below.</p>

          <form className={loginStyles.form} onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-username" className="form-label">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                placeholder="e.g. jane.smith"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !username.trim() || !password}
              className="btn-primary"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className={loginStyles.footer}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className={loginStyles.link}>
              Create one
            </Link>
          </p>
        </div>

        <p className={loginStyles.legal}>
          Industry 4.0 readiness assessments — secure access only.
        </p>
      </div>
    </div>
  );
};

export default Login;
