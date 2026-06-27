class ApiConstants {
  static const String _baseUrlDev = 'http://10.0.2.2:8000/api';
  static const String _baseUrlProd = 'https://api.arshe.yourdomain.com/api';

  static const String baseUrl =
      bool.fromEnvironment('dart.vm.product') ? _baseUrlProd : _baseUrlDev;

  // Auth
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String me = '/auth/me';
  static const String refresh = '/auth/refresh';
  static const String changePassword = '/auth/change-password';
  static const String updateProfile = '/auth/profile';

  // Dashboard
  static const String dashboardOverview = '/wp/dashboard/overview';
  static const String dashboardLeadingIndicators = '/wp/dashboard/leading-indicators';
  static const String dashboardTrends = '/wp/dashboard/trends';
  static const String dashboardActivityFeed = '/wp/dashboard/activity-feed';
  static const String dashboardRecentDocuments = '/wp/dashboard/recent-documents';

  // Work Permits
  static const String permits = '/wp/permits';
  static String permit(String id) => '/wp/permits/$id';
  static String permitSubmit(String id) => '/wp/permits/$id/submit';
  static String permitApproval(String id) => '/wp/permits/$id/approval';
  static String permitActivate(String id) => '/wp/permits/$id/activate';
  static String permitClose(String id) => '/wp/permits/$id/close';
  static String permitRevoke(String id) => '/wp/permits/$id/revoke';

  // Incidents
  static const String incidents = '/wp/incidents';
  static String incident(String id) => '/wp/incidents/$id';
  static String incidentRootCause(String id) => '/wp/incidents/$id/root-cause';
  static String incidentClose(String id) => '/wp/incidents/$id/close';

  // B-Sharp
  static const String bsharp = '/wp/bsharp';
  static const String bsharpSummary = '/wp/bsharp/summary';
  static String bsharpItem(String id) => '/wp/bsharp/$id';
  static String bsharpComplete(String id) => '/wp/bsharp/$id/complete';

  // KPI
  static const String kpiCompute = '/wp/kpi/compute';
  static const String kpiTrends = '/wp/kpi/trends';
  static const String kpiCompliance = '/wp/kpi/compliance';
  static const String kpiOverall = '/wp/kpi/overall';
  static const String kpiIncidentByClass = '/wp/kpi/incident-by-class';

  // Scorecard
  static const String scorecardPerspectives = '/wp/scorecard/perspectives';
  static const String scorecardCompute = '/wp/scorecard/compute';

  // LOTO
  static const String loto = '/wp/loto';
  static String lotoItem(String id) => '/wp/loto/$id';

  // Notifications
  static const String notifications = '/wp/notifications';
  static String notificationRead(String id) => '/wp/notifications/$id/read';

  // Resources (public)
  static const String permitTypes = '/wp/permit-types';
  static const String workAreas = '/wp/work-areas';

  // Observations
  static const String observations = '/wp/observations';
  static String observation(String id) => '/wp/observations/$id';

  // Toolbox
  static const String toolbox = '/wp/toolbox';

  // Corrective Actions
  static const String correctiveActions = '/wp/corrective-actions';

  // Personnel
  static const String personnel = '/wp/personnel';

  // Equipment
  static const String equipment = '/wp/equipment';

  // Audits
  static const String audits = '/wp/audits';
  static const String auditsSummary = '/wp/audits/summary';

  // Documents
  static const String documents = '/wp/documents';
  static const String documentCategories = '/wp/documents/categories';

  // Upload
  static const String uploadImage = '/upload/image';
  static const String uploadPdf = '/upload/pdf';
}
