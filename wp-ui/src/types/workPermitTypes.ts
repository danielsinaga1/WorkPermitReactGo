// ============================================================
// WORK PERMIT & HSE SYSTEM — TypeScript Types
// ============================================================

// ========================
// WORK AREAS
// ========================
export type ZoneType = 'general' | 'hazardous' | 'confined' | 'elevated';

export interface WorkArea {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  zone_type: ZoneType;
  latitude?: number | null;
  longitude?: number | null;
  radius_meters: number;
  plant_unit?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ========================
// PERSONNEL
// ========================
export interface Personnel {
  id: number;
  employee_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company: string;
  department?: string | null;
  position?: string | null;
  photo?: string | null;
  qr_code?: string | null;
  nfc_tag_id?: string | null;
  is_active: boolean;
  qualifications?: PersonnelQualification[];
  created_at: string;
  updated_at: string;
}

export type QualificationStatus = 'valid' | 'expired' | 'revoked';

export interface PersonnelQualification {
  id: number;
  personnel_id: number;
  qualification_type: string;
  certificate_number?: string | null;
  issuing_body?: string | null;
  issued_date: string;
  expiry_date: string;
  document_path?: string | null;
  status: QualificationStatus;
}

// ========================
// EQUIPMENT
// ========================
export type EquipmentCondition = 'good' | 'fair' | 'poor' | 'out_of_service';

export interface Equipment {
  id: number;
  equipment_id: string;
  name: string;
  type: string;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;
  owner_company?: string | null;
  qr_code?: string | null;
  nfc_tag_id?: string | null;
  last_inspection_date?: string | null;
  next_inspection_date?: string | null;
  condition: EquipmentCondition;
  is_active: boolean;
  certifications?: EquipmentCertification[];
  created_at: string;
  updated_at: string;
}

export interface EquipmentCertification {
  id: number;
  equipment_id: number;
  certification_type: string;
  certificate_number?: string | null;
  issuing_body?: string | null;
  issued_date: string;
  expiry_date: string;
  document_path?: string | null;
  status: QualificationStatus;
}

// ========================
// PERMIT TYPES
// ========================
export type PermitTypeCode =
  | 'PLANT'
  | 'NON_PLANT'
  | 'HOT_WORK'
  | 'CONFINED_SPACE'
  | 'EXCAVATION'
  | 'DIVING'
  | 'LIFTING'
  | 'WORK_AT_HEIGHT';

export interface WorkflowStageTemplate {
  name: string;
  type: 'approval' | 'verification' | 'review' | 'sign_off';
  role?: string;
  conditions?: Record<string, unknown>;
}

export interface PermitType {
  id: number;
  code: PermitTypeCode | string;
  name: string;
  description?: string | null;
  required_qualifications?: string[] | null;
  required_equipment_certs?: string[] | null;
  risk_checklist_template?: Record<string, unknown>[] | null;
  workflow_stages?: WorkflowStageTemplate[] | null;
  max_duration_hours: number;
  color_code: string;
  icon?: string | null;
  is_active: boolean;
}

// ========================
// WORK PERMITS
// ========================
export type PermitPriority = 'low' | 'medium' | 'high' | 'critical';

export type PermitStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'risk_assessment'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'suspended'
  | 'completed'
  | 'closed'
  | 'rejected'
  | 'cancelled'
  | 'expired';

export interface WorkPermit {
  id: number;
  permit_number: string;
  permit_type_id: number;
  work_area_id: number;
  requested_by: number;
  title: string;
  work_description: string;
  planned_start: string;
  planned_end: string;
  actual_start?: string | null;
  actual_end?: string | null;
  priority: PermitPriority;
  status: PermitStatus;
  current_approval_stage: number;
  safety_precautions?: string[] | null;
  ppe_requirements?: string[] | null;
  gas_test_results?: Record<string, unknown> | null;
  isolation_details?: Record<string, unknown> | null;
  special_conditions?: string | null;
  rejection_reason?: string | null;
  suspension_reason?: string | null;
  closure_remarks?: string | null;
  closed_by_name?: string | null;
  closed_at?: string | null;
  has_clash: boolean;

  // Relations
  permit_type?: PermitType;
  work_area?: WorkArea;
  requester?: Personnel;
  approvals?: PermitApproval[];
  risk_assessments?: PermitRiskAssessment[];
  personnel?: Personnel[];
  equipment?: Equipment[];
  attachments?: PermitAttachment[];
  extensions?: PermitExtension[];
  clashes?: ClashDetection[];

  created_at: string;
  updated_at: string;
}

export interface CreatePermitPayload {
  permit_type_id: number;
  work_area_id: number;
  requested_by: number;
  title: string;
  work_description: string;
  planned_start: string;
  planned_end: string;
  priority?: PermitPriority;
  safety_precautions?: string[];
  ppe_requirements?: string[];
  special_conditions?: string;
}

// ========================
// PERMIT APPROVALS
// ========================
export type ApprovalDecision = 'pending' | 'approved' | 'rejected' | 'returned' | 'skipped';

export interface PermitApproval {
  id: number;
  work_permit_id: number;
  stage_order: number;
  stage_name: string;
  stage_type: 'approval' | 'verification' | 'review' | 'sign_off';
  approver_role?: string | null;
  approver_id?: number | null;
  approver_name?: string | null;
  decision: ApprovalDecision;
  remarks?: string | null;
  conditions?: Record<string, unknown> | null;
  signature_path?: string | null;
  decided_at?: string | null;
  deadline_at?: string | null;
  approver?: Personnel;
}

export interface ProcessApprovalPayload {
  decision: 'approved' | 'rejected' | 'returned';
  remarks?: string;
  approver_id: number;
}

// ========================
// RISK ASSESSMENT
// ========================
export type RiskLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface PermitRiskAssessment {
  id: number;
  work_permit_id: number;
  hazard_description: string;
  hazard_category: string;
  likelihood: number;
  severity: number;
  risk_score: number;
  risk_level: RiskLevel;
  control_measures: string;
  residual_risk?: string | null;
  assessed_by?: string | null;
  assessed_at?: string | null;
}

export interface CreateRiskAssessmentPayload {
  hazard_description: string;
  hazard_category: string;
  likelihood: number;
  severity: number;
  control_measures: string;
  residual_risk?: string;
  assessed_by?: string;
}

// ========================
// ATTACHMENTS & EXTENSIONS
// ========================
export interface PermitAttachment {
  id: number;
  work_permit_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number | null;
  category: string;
  uploaded_by?: string | null;
}

export interface PermitExtension {
  id: number;
  work_permit_id: number;
  original_end: string;
  extended_end: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_by?: string | null;
  approved_by?: string | null;
  decided_at?: string | null;
}

// ========================
// CLASH DETECTION
// ========================
export type ClashType = 'location' | 'time' | 'resource' | 'isolation';
export type ClashSeverity = 'warning' | 'critical';

export interface ClashDetection {
  id: number;
  permit_a_id: number;
  permit_b_id: number;
  clash_type: ClashType;
  description: string;
  severity: ClashSeverity;
  resolution_status: 'unresolved' | 'acknowledged' | 'resolved';
  resolution_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  permit_a?: WorkPermit;
  permit_b?: WorkPermit;
}

// ========================
// TOOLBOX MEETINGS
// ========================
export interface ToolboxMeeting {
  id: number;
  meeting_number: string;
  title: string;
  topic: string;
  work_area_id?: number | null;
  work_permit_id?: number | null;
  conducted_by: string;
  conductor_id?: number | null;
  meeting_date: string;
  duration_minutes: number;
  weather_condition?: string | null;
  briefing_template?: Record<string, unknown> | null;
  key_points?: string[] | null;
  hazards_discussed?: string[] | null;
  additional_notes?: string | null;
  pdf_report_path?: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  work_area?: WorkArea;
  work_permit?: WorkPermit;
  conductor?: Personnel;
  attendees?: ToolboxAttendee[];
  created_at: string;
}

export interface ToolboxAttendee {
  id: number;
  toolbox_meeting_id: number;
  personnel_id?: number | null;
  attendee_name: string;
  company?: string | null;
  position?: string | null;
  signature_path?: string | null;
  is_present: boolean;
  signed_at?: string | null;
}

// ========================
// SAFETY OBSERVATIONS
// ========================
export type ObservationType = 'observation' | 'inspection' | 'audit';
export type ObservationCategory =
  | 'unsafe_act'
  | 'unsafe_condition'
  | 'near_miss'
  | 'positive_observation'
  | 'environmental'
  | 'housekeeping'
  | 'ppe_compliance'
  | 'procedure_compliance';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ObservationStatus = 'open' | 'action_assigned' | 'in_progress' | 'closed' | 'verified';

export interface SafetyObservation {
  id: number;
  observation_number: string;
  type: ObservationType;
  category: ObservationCategory;
  work_area_id?: number | null;
  work_permit_id?: number | null;
  reported_by_name: string;
  reported_by_id?: number | null;
  observed_at: string;
  description: string;
  exact_location?: string | null;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  severity: SeverityLevel;
  status: ObservationStatus;
  requires_immediate_action: boolean;
  immediate_action_taken?: string | null;
  is_mobile_report: boolean;
  work_area?: WorkArea;
  reporter?: Personnel;
  photos?: ObservationPhoto[];
  corrective_actions?: CorrectiveAction[];
  created_at: string;
}

export interface ObservationPhoto {
  id: number;
  safety_observation_id: number;
  photo_path: string;
  thumbnail_path?: string | null;
  caption?: string | null;
  annotations?: PhotoAnnotation[] | null;
  photo_type: 'before' | 'during' | 'after';
  sort_order: number;
}

export interface PhotoAnnotation {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  color?: string;
}

// ========================
// CORRECTIVE ACTIONS
// ========================
export type CaStatus = 'open' | 'in_progress' | 'completed' | 'verified' | 'overdue' | 'cancelled';

export interface CorrectiveAction {
  id: number;
  action_number: string;
  actionable_type: string;
  actionable_id: number;
  description: string;
  priority: PermitPriority;
  assigned_to_name: string;
  assigned_to_id?: number | null;
  assigned_by_name?: string | null;
  due_date: string;
  completed_date?: string | null;
  status: CaStatus;
  completion_notes?: string | null;
  evidence_path?: string | null;
  verified_by_name?: string | null;
  verified_at?: string | null;
  assignee?: Personnel;
}

// ========================
// INCIDENTS
// ========================
export type IncidentType =
  | 'near_miss'
  | 'first_aid'
  | 'medical_treatment'
  | 'lost_time_injury'
  | 'restricted_work'
  | 'fatality'
  | 'property_damage'
  | 'environmental'
  | 'fire'
  | 'spill';

export type IncidentSeverity = 'minor' | 'moderate' | 'major' | 'catastrophic';

export type IncidentStatus =
  | 'reported'
  | 'under_investigation'
  | 'rca_in_progress'
  | 'actions_assigned'
  | 'actions_in_progress'
  | 'closed'
  | 'reopened';

export interface Incident {
  id: number;
  incident_number: string;
  type: IncidentType;
  severity: IncidentSeverity;
  work_area_id?: number | null;
  work_permit_id?: number | null;
  reported_by_name: string;
  reported_by_id?: number | null;
  incident_date: string;
  reported_date: string;
  exact_location?: string | null;
  description: string;
  immediate_actions_taken?: string | null;
  injured_person_name?: string | null;
  injured_person_company?: string | null;
  injury_type?: string | null;
  body_part_affected?: string | null;
  lost_days: number;
  environmental_impact?: Record<string, unknown> | null;
  property_damage_cost: number;
  status: IncidentStatus;
  investigation_lead?: string | null;
  investigation_summary?: string | null;
  lessons_learned?: string | null;
  pdf_report_path?: string | null;
  closed_at?: string | null;
  closed_by?: string | null;
  work_area?: WorkArea;
  reporter?: Personnel;
  witnesses?: IncidentWitness[];
  root_causes?: IncidentRootCause[];
  attachments?: IncidentAttachment[];
  corrective_actions?: CorrectiveAction[];
  created_at: string;
}

export interface IncidentWitness {
  id: number;
  incident_id: number;
  personnel_id?: number | null;
  witness_name: string;
  company?: string | null;
  statement?: string | null;
  statement_date?: string | null;
  signature_path?: string | null;
}

export type RcaMethod = '5_why' | 'fishbone' | 'fault_tree' | 'taproot' | 'bowtie';

export interface IncidentRootCause {
  id: number;
  incident_id: number;
  rca_method: RcaMethod;
  analysis_data: Record<string, unknown>;
  direct_cause?: string | null;
  contributing_factors?: string | null;
  root_cause: string;
  systemic_issues?: string | null;
  analyzed_by: string;
  analyzed_at: string;
  status: 'draft' | 'review' | 'approved';
}

export interface IncidentAttachment {
  id: number;
  incident_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number | null;
  category: string;
}

// ========================
// LOTO
// ========================
export type EnergyType = 'electrical' | 'pneumatic' | 'hydraulic' | 'gravity' | 'thermal' | 'chemical' | 'mechanical';

export interface LotoProcedure {
  id: number;
  procedure_number: string;
  title: string;
  description?: string | null;
  work_area_id?: number | null;
  work_permit_id?: number | null;
  machine_equipment: string;
  energy_sources: string[];
  isolation_steps: Record<string, unknown>[];
  restoration_steps?: Record<string, unknown>[] | null;
  prepared_by: string;
  reviewed_by?: string | null;
  approved_by?: string | null;
  status: 'draft' | 'active' | 'under_review' | 'archived';
  effective_date?: string | null;
  review_date?: string | null;
  document_path?: string | null;
  work_area?: WorkArea;
  work_permit?: WorkPermit;
  points?: LotoPoint[];
  locks?: LotoLock[];
  is_fully_locked?: boolean;
  created_at: string;
}

export interface LotoPoint {
  id: number;
  loto_procedure_id: number;
  sequence_order: number;
  point_name: string;
  energy_type: EnergyType;
  location_description: string;
  isolation_device: string;
  isolation_method: string;
  verification_method: string;
  qr_code?: string | null;
  nfc_tag_id?: string | null;
  photo_path?: string | null;
  requires_double_isolation: boolean;
  active_lock?: LotoLock | null;
  verifications?: LotoVerification[];
}

export type LockStatus = 'locked' | 'unlocked' | 'force_removed';

export interface LotoLock {
  id: number;
  loto_procedure_id: number;
  loto_point_id: number;
  work_permit_id?: number | null;
  lock_number: string;
  tag_number: string;
  locked_by_id: number;
  locked_by_name: string;
  locked_at: string;
  unlocked_at?: string | null;
  unlocked_by_name?: string | null;
  unlocked_by_id?: number | null;
  status: LockStatus;
  force_remove_reason?: string | null;
  force_remove_authorized_by?: string | null;
  locked_by?: Personnel;
}

export interface LotoVerification {
  id: number;
  loto_procedure_id: number;
  loto_point_id: number;
  verified_by_name: string;
  verified_by_id?: number | null;
  verified_at: string;
  verification_result: 'isolated' | 'not_isolated' | 'partial';
  remarks?: string | null;
  method_used: string;
  readings?: Record<string, unknown> | null;
  photo_evidence_path?: string | null;
}

// ========================
// DASHBOARD & ANALYTICS
// ========================
export interface DashboardOverview {
  permits: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    rejected: number;
    expired: number;
    by_type: { permit_type_id: number; total: number; permit_type?: PermitType }[];
    by_priority: { priority: PermitPriority; total: number }[];
  };
  incidents: {
    total: number;
    open: number;
    near_miss: number;
    lost_time: number;
    total_lost_days: number;
    by_type: { type: IncidentType; total: number }[];
    by_severity: { severity: IncidentSeverity; total: number }[];
  };
  observations: {
    total: number;
    open: number;
    critical: number;
    by_category: { category: ObservationCategory; total: number }[];
  };
  corrective_actions: {
    total: number;
    open: number;
    overdue: number;
    closed: number;
  };
  toolbox_meetings: {
    total: number;
    completed: number;
  };
  loto: {
    active_locks: number;
  };
  alerts: {
    expiring_personnel_certs: number;
    expiring_equipment_certs: number;
    expired_personnel_certs: number;
  };
}

export interface SafetyIndicator {
  code: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

export interface LeadingIndicatorsResponse {
  indicators: SafetyIndicator[];
  risk_score: number;
  risk_level: RiskLevel;
  recommendations: string[];
}

export interface TrendDataPoint {
  period: string;
  permits: number;
  incidents: number;
  near_misses: number;
  observations: number;
  tbm_sessions: number;
  ca_closed: number;
  lost_days: number;
}

export interface ReportExport {
  id: number;
  report_type: string;
  format: 'pdf' | 'excel' | 'csv';
  parameters?: Record<string, unknown> | null;
  file_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  requested_by?: string | null;
  error_message?: string | null;
  completed_at?: string | null;
}

// ========================
// FILTER / QUERY PARAMS
// ========================
export interface PermitFilters {
  status?: PermitStatus;
  priority?: PermitPriority;
  permit_type?: number;
  work_area?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface HseFilters {
  type?: string;
  category?: string;
  severity?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  work_area?: number;
  per_page?: number;
  page?: number;
}

// ============================================================
// EXTENDED WP-HSE FEATURES — TypeScript Types
// ============================================================

// ========================
// #12 — GAS TESTING LOG
// ========================
export interface GasTestLog {
  id: number;
  work_permit_id: number;
  tested_by_id?: number | null;
  tested_by_name: string;
  tested_at: string;
  o2_level: number;
  lel_level: number;
  h2s_level: number;
  co_level: number;
  equipment_serial?: string | null;
  is_safe: boolean;
  remarks?: string | null;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  created_at?: string;
  updated_at?: string;
  tester?: Personnel;
}

export interface CreateGasTestPayload {
  tested_by_name: string;
  o2_level: number;
  lel_level: number;
  h2s_level: number;
  co_level: number;
  remarks?: string;
}

// Gas test safety thresholds (mirrors backend constants)
export const GAS_SAFE_LIMITS = {
  O2_MIN: 19.5,
  O2_MAX: 23.5,
  LEL_MAX: 10,
  H2S_MAX: 10,
  CO_MAX: 25,
} as const;

// ========================
// #16 — EMERGENCY SOS ALERT
// ========================
export type SosAlertStatus = 'triggered' | 'acknowledged' | 'responding' | 'resolved' | 'false_alarm';

export interface EmergencySosAlert {
  id: number;
  work_permit_id?: number | null;
  triggered_by_id?: number | null;
  triggered_by_name: string;
  triggered_at: string;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  alert_type?: string | null;
  description?: string | null;
  status: SosAlertStatus;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolution_notes?: string | null;
  response_time_minutes?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface TriggerSosPayload {
  triggered_by_name: string;
  triggered_by_id?: number;
  work_permit_id?: number;
  gps_latitude?: number;
  gps_longitude?: number;
  alert_type?: string;
  description?: string;
}

// ========================
// #20 — LESSONS LEARNED
// ========================
export interface LessonLearned {
  id: number;
  incident_id?: number | null;
  title: string;
  summary: string;
  root_cause_summary?: string | null;
  preventive_measures: string;
  applicable_permit_types: string[];
  applicable_work_areas?: string[] | null;
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  is_mandatory_reading: boolean;
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at?: string;
  // Added by backend when checking per-permit
  is_acknowledged?: boolean;
}

export interface LessonAcknowledgement {
  id: number;
  lesson_id: number;
  personnel_id: number;
  work_permit_id?: number | null;
  acknowledged_at: string;
}

export interface CreateLessonPayload {
  title: string;
  summary: string;
  preventive_measures: string;
  incident_id?: number;
  root_cause_summary?: string;
  applicable_permit_types?: string[];
  severity_level?: string;
  is_mandatory_reading?: boolean;
}

// ========================
// #6 — E-SIGNATURE
// ========================
export interface ESignature {
  id: number;
  signable_type: string;
  signable_id: number;
  signer_id?: number | null;
  signer_name: string;
  signer_role?: string | null;
  signature_image_path: string;
  signature_hash: string;
  signed_at: string;
  ip_address?: string | null;
  device_info?: string | null;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSignaturePayload {
  signable_type: string;
  signable_id: number;
  signature_image: string; // base64 PNG
  signer_name: string;
  signer_id?: number;
  signer_role?: string;
}

// ========================
// #1 — JSA (JOB SAFETY ANALYSIS)
// ========================
export interface JsaStep {
  step: string;
  hazard: string;
  control: string;
}

export interface JsaTemplate {
  id: number;
  name: string;
  applicable_permit_type?: string | null;
  applicable_zone_type?: string | null;
  steps: JsaStep[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JsaRecord {
  id: number;
  work_permit_id: number;
  jsa_template_id?: number | null;
  steps: JsaStep[];
  prepared_by?: string | null;
  reviewed_by?: string | null;
  status: 'draft' | 'reviewed' | 'approved';
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
  template?: JsaTemplate;
}

// ========================
// #14 — CONTRACTOR MANAGEMENT
// ========================
export type ComplianceStatus = 'compliant' | 'warning' | 'non_compliant' | 'blacklisted';

export interface ContractorCompany {
  id: number;
  name: string;
  registration_number: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  hse_certificate_expiry?: string | null;
  hse_certificate_path?: string | null;
  safety_score?: number;
  total_violations?: number;
  total_incidents?: number;
  compliance_status: ComplianceStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContractorPayload {
  name: string;
  registration_number: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  hse_certificate_expiry?: string;
}

// ========================
// #9 — PERMIT PHOTOS
// ========================
export type PhotoType = 'before' | 'during' | 'after';

export interface PermitPhoto {
  id: number;
  work_permit_id: number;
  photo_path: string;
  thumbnail_path?: string | null;
  photo_type: PhotoType;
  caption?: string | null;
  uploaded_by_name?: string | null;
  uploaded_by_id?: number | null;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface UploadPhotoPayload {
  photo_path: string;
  photo_type: PhotoType;
  caption?: string;
}

// ========================
// #3 — GEOFENCE
// ========================
export interface GeofenceValidationResult {
  within_zone: boolean;
  distance_meters: number;
  allowed_radius: number;
  work_area: string;
}

export interface GeofenceLog {
  id: number;
  work_permit_id: number;
  personnel_id?: number | null;
  personnel_name?: string | null;
  latitude: number;
  longitude: number;
  distance_from_center: number;
  is_within_geofence: boolean;
  event_type: 'check_in' | 'check_out' | 'violation' | 'periodic';
  created_at: string;
  updated_at?: string;
}

// ========================
// #5 — NOTIFICATIONS
// ========================
export type NotificationType =
  | 'permit_submitted'
  | 'permit_approved'
  | 'permit_rejected'
  | 'permit_expiring'
  | 'gas_test_unsafe'
  | 'sos_alert'
  | 'lesson_mandatory'
  | 'geofence_violation'
  | 'general';

export interface Notification {
  id: number;
  user_id?: number | null;
  personnel_id?: number | null;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  channel?: string;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// ========================
// #4 — QR CODE VERIFICATION
// ========================
export interface QrVerificationResult {
  permit: WorkPermit;
  is_valid: boolean;
  is_expired: boolean;
  verified_at: string;
}

// ============================================================
// GAP FEATURES — PPE, TRANSFER, REVOKE, CLOSURE, AUDIT, ETC.
// ============================================================

// ========================
// PPE CHECKLIST
// ========================
export interface PpeChecklistItem {
  id: number;
  ppe_checklist_id: number;
  ppe_item: string;
  is_required: boolean;
  is_available: boolean;
  is_condition_ok: boolean;
  remarks?: string | null;
}

export interface PpeChecklist {
  id: number;
  work_permit_id: number;
  checked_by: number;
  checked_at: string;
  overall_compliance: boolean;
  remarks?: string | null;
  items?: PpeChecklistItem[];
  checker?: Personnel;
  created_at: string;
  updated_at?: string;
}

export interface CreatePpeChecklistPayload {
  checked_by: number;
  remarks?: string;
  items: {
    ppe_item: string;
    is_required: boolean;
    is_available: boolean;
    is_condition_ok: boolean;
    remarks?: string;
  }[];
}

// ========================
// PERMIT TRANSFER
// ========================
export type TransferStatus = 'pending' | 'approved' | 'rejected';

export interface PermitTransfer {
  id: number;
  work_permit_id: number;
  from_personnel_id: number;
  to_personnel_id: number;
  reason: string;
  transfer_notes?: string | null;
  status: TransferStatus;
  approved_by?: number | null;
  approved_at?: string | null;
  rejected_reason?: string | null;
  from_personnel?: Personnel;
  to_personnel?: Personnel;
  approver?: Personnel;
  created_at: string;
  updated_at?: string;
}

export interface RequestTransferPayload {
  from_personnel_id: number;
  to_personnel_id: number;
  reason: string;
  transfer_notes?: string;
}

export interface ProcessTransferPayload {
  decision: 'approved' | 'rejected';
  approved_by: number;
  rejected_reason?: string;
}

// ========================
// PERMIT REVOKE
// ========================
export interface RevokePermitPayload {
  revoke_reason: string;
  revoked_by: number;
}

// ========================
// CLOSURE CHECKLIST
// ========================
export interface ClosureChecklistItem {
  id: number;
  closure_checklist_id: number;
  item_description: string;
  is_checked: boolean;
  checked_by_name?: string | null;
  remarks?: string | null;
}

export interface ClosureChecklist {
  id: number;
  work_permit_id: number;
  completed_by: number;
  all_items_checked: boolean;
  remarks?: string | null;
  items?: ClosureChecklistItem[];
  completer?: Personnel;
  created_at: string;
  updated_at?: string;
}

export interface CreateClosureChecklistPayload {
  completed_by: number;
  remarks?: string;
  items: {
    item_description: string;
    is_checked: boolean;
    checked_by_name?: string;
    remarks?: string;
  }[];
}

// ========================
// FORM FIELD CONFIGURATION (No-Code Builder)
// ========================
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'file' | 'signature';

export interface FormFieldConfig {
  id: number;
  permit_type_id: number;
  section: string;
  field_name: string;
  field_label: string;
  field_type: FieldType;
  is_mandatory: boolean;
  is_active: boolean;
  sort_order: number;
  options?: string[] | null;
  default_value?: string | null;
  validation_rules?: Record<string, unknown> | null;
  instruction?: string | null;
  tooltip?: string | null;
  permit_type?: PermitType;
  created_at: string;
  updated_at?: string;
}

export interface CreateFieldConfigPayload {
  permit_type_id: number;
  section: string;
  field_name: string;
  field_label: string;
  field_type: FieldType;
  is_mandatory?: boolean;
  is_active?: boolean;
  sort_order?: number;
  options?: string[];
  default_value?: string;
  validation_rules?: Record<string, unknown>;
  instruction?: string;
  tooltip?: string;
}

// ========================
// EMAIL NOTIFICATION LOG
// ========================
export interface EmailNotification {
  id: number;
  recipient_email: string;
  recipient_name?: string | null;
  subject: string;
  body: string;
  template: string;
  template_data?: Record<string, unknown> | null;
  status: 'queued' | 'sent' | 'failed';
  sent_at?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at?: string;
}
