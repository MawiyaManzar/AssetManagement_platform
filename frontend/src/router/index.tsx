import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

/* ---- Lazy Loaded Pages ---- */
const LandingPage            = lazy(() => import('../features/landing/LandingPage'));
const LoginPage              = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage           = lazy(() => import('../features/auth/RegisterPage'));
const DashboardLayout        = lazy(() => import('../components/layout/DashboardLayout'));
const DashboardPage          = lazy(() => import('../features/dashboard/DashboardPage'));
const OrganizationSetupPage  = lazy(() => import('../features/organization/OrganizationSetupPage'));

/* ---- Fallback Spinner ---- */
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--color-bg, #F8F9FB)' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #DEE2E6', borderTopColor: '#714B67', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ---- Placeholder for routes not yet built ---- */
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem' }}>{title}</h1>
    <p style={{ color: '#6C757D', fontSize: '0.875rem' }}>This page is under construction.</p>
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
  /* =========== Dashboard (authenticated shell) =========== */
  {
    path: '/dashboard',
    element: <Suspense fallback={<PageLoader />}><DashboardLayout /></Suspense>,
    children: [
      {
        index: true,
        element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>,
      },
      {
        path: 'organization-setup',
        element: <Suspense fallback={<PageLoader />}><OrganizationSetupPage /></Suspense>,
      },
      {
        path: 'assets',
        element: <PlaceholderPage title="Assets" />,
      },
      {
        path: 'allocation',
        element: <PlaceholderPage title="Allocation & Transfer" />,
      },
      {
        path: 'booking',
        element: <PlaceholderPage title="Resource Booking" />,
      },
      {
        path: 'maintenance',
        element: <PlaceholderPage title="Maintenance" />,
      },
      {
        path: 'audit',
        element: <PlaceholderPage title="Audit" />,
      },
      {
        path: 'reports',
        element: <PlaceholderPage title="Reports" />,
      },
      {
        path: 'notifications',
        element: <PlaceholderPage title="Notifications" />,
      },
    ],
  },
  /* =========== 404 =========== */
  {
    path: '*',
    element: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, fontFamily: 'Inter, sans-serif', backgroundColor: '#F8F9FB' }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#714B67' }}>404</div>
        <div style={{ fontSize: 18, color: '#6C757D' }}>Page not found</div>
        <a href="/" style={{ color: '#714B67', fontWeight: 600 }}>← Back to Home</a>
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
