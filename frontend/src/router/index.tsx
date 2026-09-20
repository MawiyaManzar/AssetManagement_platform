import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* ---- Lazy Loaded Pages ---- */
const LandingPage  = lazy(() => import('../features/landing/LandingPage'));
const LoginPage    = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));

/* ---- Fallback Spinner ---- */
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--color-bg, #F8FAFC)' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#047857', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ---- Router Config ---- */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
  },
  {
    path: '/register',
    element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>,
  },
  {
    path: '/auth/login',
    element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
  },
  {
    path: '/auth/register',
    element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>,
  },
  /* =========== 404 =========== */
  {
    path: '*',
    element: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, fontFamily: 'Inter, sans-serif', backgroundColor: '#F8FAFC' }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#047857' }}>404</div>
        <div style={{ fontSize: 18, color: '#64748B' }}>Page not found</div>
        <a href="/" style={{ color: '#047857', fontWeight: 600 }}>← Back to Home</a>
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

