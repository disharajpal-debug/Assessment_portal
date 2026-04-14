import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Auth/Login';

import ClientDashboard from '../pages/ClientDashboard';
import AssessorDashboard from '../pages/AssessorDashboard';
import EditAssessment from '../pages/AssessorDashboard/components/EditAssessment';
import AssessorReportView from '../pages/AssessorDashboard/components/AssessorReportView';
import CreateAssessment from '../pages/AssessorDashboard/CreateAssessment';
import AdminDashboard from '../pages/Dashboard/AdminDashboard/AdminDashboard.component';
import StartAssessment from '../pages/Assessment/StartAssessment';
import Report from '../pages/Assessment/Report';
import Register from '../pages/Auth/Register';
import GlobalReport from '../pages/Reports/GlobalReport';
import SuperUserDashboard from '../pages/SuperUserDashboard';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../constants/roles';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessor"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSESSOR]}>
              <AssessorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessor-dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSESSOR]}>
              <AssessorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessor/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSESSOR]}>
              <EditAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessor/report/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSESSOR]}>
              <AssessorReportView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessor/create"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSESSOR]}>
              <CreateAssessment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superuser"
          element={<Navigate to="/superuser-dashboard" replace />}
        />

        <Route
          path="/superuser-dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
              <SuperUserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/assessment"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.CLIENT,
                ROLES.ASSESSOR,
                ROLES.ADMIN,
                ROLES.SUPERUSER,
              ]}
            >
              <StartAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.CLIENT,
                ROLES.ASSESSOR,
                ROLES.ADMIN,
                ROLES.SUPERUSER,
              ]}
            >
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/global-report"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ASSESSOR, ROLES.ADMIN, ROLES.SUPERUSER]}
            >
              <GlobalReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
