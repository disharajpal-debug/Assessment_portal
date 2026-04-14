import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { SECTORS } from '../../../constants/sectors';
import { registerStyles } from './Register.style';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    company_name: '',
    sector: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e?.preventDefault?.();
    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.company_name.trim()
    ) {
      alert('Please fill in username, email, password, and company name.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('auth/register/', form);
      alert('User registered successfully');
      navigate('/');
    } catch (error) {
      console.error('Register error:', error?.response?.data || error?.message || error);
      
      let message = 'Registration failed.';
      const data = error?.response?.data;
      
      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.error) {
          message = data.error;
        } else {
          // Flatten field-level validation errors: {"username": ["required"], "password": ["too short"]}
          const fieldErrors = Object.entries(data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          if (fieldErrors) message = fieldErrors;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={registerStyles.root}>
      <div className={registerStyles.backdrop} aria-hidden />

      <div className={registerStyles.inner}>
        <div className={registerStyles.brand}>
          <div className={registerStyles.logo}>A</div>
          <h1 className={registerStyles.title}>Assessment Portal</h1>
          <p className={registerStyles.subtitle}>
            Create an account to start assessments
          </p>
        </div>

        <div className={registerStyles.card}>
          <h2 className={registerStyles.cardTitle}>Create your account</h2>
          <p className={registerStyles.cardDesc}>
            All fields marked with your selections help route the right
            questionnaire.
          </p>

          <form className={registerStyles.form} onSubmit={handleRegister}>
            <div className={registerStyles.grid}>
              <div className={registerStyles.span2}>
                <label htmlFor="reg-username" className="form-label">
                  Username
                </label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  className="form-input"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className={registerStyles.span2}>
                <label htmlFor="reg-email" className="form-label">
                  Email
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className={registerStyles.span2}>
                <label htmlFor="reg-company-name" className="form-label">
                  Company Name
                </label>
                <input
                  id="reg-company-name"
                  name="company_name"
                  type="text"
                  placeholder="Your company name"
                  className="form-input"
                  value={form.company_name}
                  onChange={handleChange}
                />
              </div>
              <div className={registerStyles.span2}>
                <label htmlFor="reg-password" className="form-label">
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="reg-sector" className="form-label">
                  Sector{' '}
                  <span className={registerStyles.optional}>(optional)</span>
                </label>
                <select
                  id="reg-sector"
                  name="sector"
                  className="form-select"
                  value={form.sector}
                  onChange={handleChange}
                >
                  <option value="">Select sector</option>
                  {SECTORS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={registerStyles.submit}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className={registerStyles.footer}>
            Already registered?{' '}
            <Link to="/" className={registerStyles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
