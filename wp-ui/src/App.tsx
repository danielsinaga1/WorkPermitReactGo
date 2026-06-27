import { Routes, Route, Navigate } from 'react-router-dom';
import { ScrollTop } from './components/scrolltop/ScrollTop';

// Auth & Dashboard imports
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';

// Work Permit pages
import WpHseDashboard from './pages/Dashboard/workPermit/WpHseDashboard';
import PermitList from './pages/Dashboard/workPermit/PermitList';
import PermitDetail from './pages/Dashboard/workPermit/PermitDetail';
import PermitForm from './pages/Dashboard/workPermit/PermitForm';
import PersonnelList from './pages/Dashboard/workPermit/PersonnelList';
import EquipmentListPage from './pages/Dashboard/workPermit/EquipmentList';

// HSE pages
import IncidentList from './pages/Dashboard/hse/IncidentList';
import ObservationList from './pages/Dashboard/hse/ObservationList';
import ToolboxMeetingList from './pages/Dashboard/hse/ToolboxMeetingList';
import CorrectiveActionList from './pages/Dashboard/hse/CorrectiveActionList';
import EmergencySosList from './pages/Dashboard/hse/EmergencySosList';
import LessonLearnedList from './pages/Dashboard/hse/LessonLearnedList';
import JsaTemplateList from './pages/Dashboard/hse/JsaTemplateList';

// Contractor pages
import ContractorList from './pages/Dashboard/workPermit/ContractorList';

// LOTO pages
import LotoProcedureList from './pages/Dashboard/loto/LotoProcedureList';

// Master Data pages
import WorkAreaList from './pages/Dashboard/master/WorkAreaList';
import PermitTypeList from './pages/Dashboard/master/PermitTypeList';

// Admin pages
import AuditTrailList from './pages/Dashboard/admin/AuditTrailList';
import FormFieldBuilder from './pages/Dashboard/admin/FormFieldBuilder';

// Gap Feature pages
import PpeChecklistPage from './pages/Dashboard/workPermit/PpeChecklistPage';
import PermitTransferPage from './pages/Dashboard/workPermit/PermitTransferPage';

// ArSHE gap closure pages
import BSharpList from './pages/Dashboard/hse/BSharpList';
import AuditList from './pages/Dashboard/hse/AuditList';
import DocumentList from './pages/Dashboard/hse/DocumentList';
import HazardObservationList from './pages/Dashboard/hse/HazardObservationList';
import KpiScorecardPage from './pages/Dashboard/KpiScorecardPage';

function AppContent() {
  return (
    <>
      <ScrollTop />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          {/* WP & HSE Analytics */}
          <Route path="wp-hse" element={<WpHseDashboard />} />

          {/* Permit to Work */}
          <Route path="work-permits" element={<PermitList />} />
          <Route path="work-permits/create" element={<PermitForm />} />
          <Route path="work-permits/:id" element={<PermitDetail />} />
          <Route path="work-permits/:id/edit" element={<PermitForm />} />

          {/* HSE Operational */}
          <Route path="hse/incidents" element={<IncidentList />} />
          <Route path="hse/observations" element={<ObservationList />} />
          <Route path="hse/toolbox-meetings" element={<ToolboxMeetingList />} />
          <Route path="hse/corrective-actions" element={<CorrectiveActionList />} />
          <Route path="hse/emergency-sos" element={<EmergencySosList />} />
          <Route path="hse/lessons-learned" element={<LessonLearnedList />} />
          <Route path="hse/jsa-templates" element={<JsaTemplateList />} />

          {/* LOTO & Asset Management */}
          <Route path="loto" element={<LotoProcedureList />} />

          {/* Master Data */}
          <Route path="personnel" element={<PersonnelList />} />
          <Route path="equipment" element={<EquipmentListPage />} />
          <Route path="contractors" element={<ContractorList />} />
          <Route path="master/work-areas" element={<WorkAreaList />} />
          <Route path="master/permit-types" element={<PermitTypeList />} />

          {/* Administration */}
          <Route path="admin/audit-trail" element={<AuditTrailList />} />
          <Route path="admin/form-builder" element={<FormFieldBuilder />} />

          {/* Gap Features - PPE & Transfer */}
          <Route path="work-permits/:permitId/ppe" element={<PpeChecklistPage />} />
          <Route path="work-permits/:permitId/transfers" element={<PermitTransferPage />} />

          {/* ArSHE Gap Closure */}
          <Route path="kpi-scorecard" element={<KpiScorecardPage />} />
          <Route path="hse/bsharp" element={<BSharpList />} />
          <Route path="hse/hazard-observations" element={<HazardObservationList />} />
          <Route path="hse/audits" element={<AuditList />} />
          <Route path="documents" element={<DocumentList />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
