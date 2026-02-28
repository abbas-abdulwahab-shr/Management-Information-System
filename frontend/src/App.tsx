import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UserPage = lazy(() => import('./pages/user/UsersPage'));
const DepartmentPage = lazy(() => import('./pages/department/DepartmentPage'));
const DepartmentDetailPage = lazy(() => import('./pages/department/DepartmentDetailPage'));
const ProgramPage = lazy(() => import('./pages/program/ProgramPage'));
const ProgramCreatePage = lazy(() => import('./pages/program/ProgramCreatePage'));
const ProgramDetailPage = lazy(() => import('./pages/program/ProgramDetailPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const ErpPage = lazy(() => import('./pages/erp/ErpPage'));
const AuditLogPage = lazy(() => import('./pages/audit/AuditLogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Layout = lazy(() => import('./components/Layout'));
const PublicLayout = lazy(() => import('./components/PublicLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/departments" element={<DepartmentPage />} />
            <Route path="/department/:id" element={<DepartmentDetailPage />} />
            <Route path="/programs" element={<ProgramPage />} />
            <Route path="/programs/create" element={<ProgramCreatePage />} />
            <Route path="/programs/:id" element={<ProgramDetailPage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/erp" element={<ErpPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
          </Route>
        </Route>
        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
