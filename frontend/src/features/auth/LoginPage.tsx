import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
      else navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--color-bg, #F8FAFC)' }}>
      <Card className={styles.card} variant="bordered" padding="lg">
        <div className={styles.header}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', color: 'var(--color-primary, #047857)', fontWeight: 700, fontSize: '14px' }}>
            ← Back to Home
          </Link>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Log in to access your AssetFlow ERP</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.demoSection}>
            <span className={styles.demoLabel}>Demo Quick-Fill:</span>
            <div className={styles.demoButtons}>
              <button type="button" className={styles.demoChip} onClick={() => quickFill('employee@demo.com')}>👤 Employee</button>
              <button type="button" className={styles.demoChip} onClick={() => quickFill('manager@demo.com')}>📦 Asset Manager</button>
              <button type="button" className={styles.demoChip} onClick={() => quickFill('head@demo.com')}>🏢 Dept Head</button>
              <button type="button" className={styles.demoChip} onClick={() => quickFill('admin@demo.com')}>👑 Admin</button>
            </div>
          </div>

          <Input label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              rightIcon={
                <button type="button" className={styles.togglePassBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? '👁️' : '🙈'}
                </button>
              }
            />
          </div>

          <Button type="submit" size="lg" fullWidth isLoading={isLoading}>Sign In</Button>
        </form>

        <div className={styles.footer}>
          Don't have an account? <Link to="/register" className={styles.link}>Register here</Link>
        </div>
      </Card>
    </div>
  );
}

