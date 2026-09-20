import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Per AssetFlow Problem Statement: Signup creates Employee account only.
      // Admin promotes to Department Head or Asset Manager in Employee Directory.
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: 'employee' as const,
        status: 'active' as const,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      toast.success('Account created successfully!');
      setAuth(mockUser, 'mock_jwt_' + Date.now());

      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--color-bg, #F8FAFC)' }}>
      <Card className={styles.card} variant="bordered" padding="lg">
        <div className={styles.header}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', color: 'var(--color-primary, #047857)', fontWeight: 700, fontSize: '14px' }}>
            ← Back to Home
          </Link>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Join AssetFlow as an employee</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
          <Input label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <Button type="submit" size="lg" fullWidth isLoading={isLoading}>Create Employee Account</Button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </div>
      </Card>
    </div>
  );
}

