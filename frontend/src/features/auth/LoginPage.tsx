import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      const role: 'admin' | 'asset_manager' | 'department_head' | 'employee' = email.includes('admin')
        ? 'admin'
        : email.includes('manager')
        ? 'asset_manager'
        : email.includes('head')
        ? 'department_head'
        : 'employee';

      const mockUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        role,
        status: 'active' as const,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock_jwt_' + Date.now();

      toast.success('Logged in successfully!');
      setAuth(mockUser, mockToken);

      if (redirectTo) navigate(redirectTo);
      else navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>AssetFlow – login</h1>
        </div>

        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>AF</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="login-email" className={styles.label}>Email</label>
            <div className={`${styles.inputWrap} ${errors.email ? styles.inputError : ''}`}>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="login-password" className={styles.label}>Password</label>
            <div className={`${styles.inputWrap} ${errors.password ? styles.inputError : ''}`}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePass}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot password</Link>
          </div>

          {/* New here? info */}
          <div className={styles.infoBox}>
            <p className={styles.infoTitle}>New here?</p>
            <p className={styles.infoText}>
              Sign up creates an employee account<br />
              admin roles assigned later
            </p>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            id="login-submit"
          >
            {isLoading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
