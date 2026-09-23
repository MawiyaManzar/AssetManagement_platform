import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* ---- Lazy Loaded Pages ---- */
const LandingPage            = lazy(() => import('../features/landing/LandingPage'));
const LoginPage              = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage           = lazy(() => import('../features/auth/RegisterPage'));
const DashboardLayout        = lazy(() => import('../components/layout/DashboardLayout'));
const DashboardPage          = lazy(() => import('../features/dashboard/DashboardPage'));
const OrganizationSetupPage  = lazy(() => import('../features/organization/OrganizationSetupPage'));
const AssetsPage             = lazy(() => import('../features/assets/AssetsPage'));
const AllocationPage         = lazy(() => import('../features/allocation/AllocationPage'));
const ResourceBookingPage    = lazy(() => import('../features/booking/ResourceBookingPage'));
const MaintenancePage        = lazy(() => import('../features/maintenance/MaintenancePage'));
const AuditPage              = lazy(() => import('../features/audit/AuditPage'));
const ReportsPage            = lazy(() => import('../features/reports/ReportsPage'));
const NotificationsPage      = lazy(() => import('../features/notifications/NotificationsPage'));

/* ---- Fallback Spinner ---- */
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--color-bg, #F8F9FB)' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #DEE2E6', borderTopColor: '#714B67', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
        element: <Suspense fallback={<PageLoader />}><AssetsPage /></Suspense>,
      },
      {
        path: 'allocation',
        element: <Suspense fallback={<PageLoader />}><AllocationPage /></Suspense>,
      },
      {
        path: 'booking',
        element: <Suspense fallback={<PageLoader />}><ResourceBookingPage /></Suspense>,
      },
      {
        path: 'maintenance',
        element: <Suspense fallback={<PageLoader />}><MaintenancePage /></Suspense>,
      },
      {
        path: 'audit',
        element: <Suspense fallback={<PageLoader />}><AuditPage /></Suspense>,
      },
      {
        path: 'reports',
        element: <Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>,
      },
      {
        path: 'notifications',
        element: <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>,
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
