import api, { buildParams } from "./api";

const WP = "/wp";

// ============================================================
// TYPES
// ============================================================
export type BehaviorCategory = "safe" | "at_risk";
export type BSharpStatus = "open" | "follow_up" | "completed";

export interface BSharpObservation {
  id: number;
  observation_number: string;
  observed_at: string;
  work_area_id: number | null;
  work_area?: { id: number; name: string } | null;
  observer_id: number | null;
  observer_name: string;
  observed_subject_name: string | null;
  title: string;
  description: string;
  behavior_category: BehaviorCategory;
  behavior_tags: string[] | null;
  recommended_action: string | null;
  status: BSharpStatus;
  followup_pic_name: string | null;
  followup_pic_id: number | null;
  followup_plan: string | null;
  followup_target_date: string | null;
  followup_completed_at: string | null;
  photos: Array<{ url: string; caption?: string }> | null;
  created_at?: string;
  updated_at?: string;
}

export interface BSharpSummary {
  period: { start: string; end: string };
  total_observations: number;
  safe_behavior: number;
  at_risk_behavior: number;
  safe_percent: number;
  at_risk_percent: number;
  active_observers: number;
}

export type AuditType =
  | "internal"
  | "external"
  | "iso_45001"
  | "iso_14001"
  | "iso_9001"
  | "compliance"
  | "management"
  | "process";

export type AuditStatus =
  | "planned"
  | "scheduled"
  | "in_progress"
  | "reporting"
  | "closed"
  | "cancelled";

export type FindingSeverity =
  | "critical"
  | "major"
  | "minor"
  | "observation"
  | "opportunity";

export interface AuditFinding {
  id: number;
  audit_plan_id: number;
  finding_number: string;
  severity: FindingSeverity;
  clause_reference: string | null;
  title: string;
  description: string;
  evidence: string | null;
  responsible_pic_name: string | null;
  responsible_pic_id: number | null;
  target_close_date: string | null;
  status: "open" | "in_progress" | "closed" | "verified";
  corrective_action: string | null;
  closed_at: string | null;
  photos: unknown[] | null;
}

export interface AuditPlan {
  id: number;
  audit_number: string;
  title: string;
  audit_type: AuditType;
  scope: string | null;
  work_area_id: number | null;
  work_area?: { id: number; name: string } | null;
  planned_start: string;
  planned_end: string;
  lead_auditor_name: string;
  lead_auditor_id: number | null;
  auditee_list: string[] | null;
  checklist: unknown[] | null;
  status: AuditStatus;
  total_findings: number;
  total_critical: number;
  total_major: number;
  total_minor: number;
  compliance_score: number | null;
  summary: string | null;
  closed_at: string | null;
  findings_count?: number;
  findings?: AuditFinding[];
}

export interface AuditSummary {
  period: { start: string; end: string };
  total_audits: number;
  by_status: Array<{ status: string; total: number }>;
  total_findings: number;
  open_findings: number;
  overdue_findings: number;
  avg_compliance_score: number | null;
}

export interface DocumentItem {
  id: number;
  title: string;
  category: string;
  document_number: string | null;
  version: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  effective_date: string | null;
  expiry_date: string | null;
  uploaded_by_name: string;
  download_count: number;
  is_active: boolean;
  updated_at?: string;
}

export interface ComplianceMetric {
  value: number;
  unit: string;
  target: number;
  numerator: number;
  denominator: number;
  status: "baik" | "cukup" | "kurang";
}

export interface ComplianceMetricsResponse {
  period: { start: string; end: string };
  hazard_closure: ComplianceMetric;
  car_closure: ComplianceMetric;
  inspection_compliance: ComplianceMetric;
  training_compliance: ComplianceMetric;
}

export interface KpiOverallScore {
  period: { start: string; end: string };
  overall_score: number;
  overall_status: "baik" | "cukup" | "kurang";
  kpi_count: number;
  breakdown: Array<{ label: string; value: number; percent: number; color: string }>;
  kpis: Array<{
    code: string;
    value: number;
    target: number;
    unit: string;
    normalized: number;
    lower_is_better: boolean;
  }>;
}

export interface IncidentByClass {
  total: number;
  breakdown: Array<{ class: string; value: number; percent: number; color: string }>;
  period: { start: string; end: string };
}

export interface ActivityFeedItem {
  type: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  reference: string;
  happened_at: string;
  relative: string;
}

export interface ScorecardKpi {
  kpi_id: number;
  metric_code: string;
  metric_name: string;
  value: number | null;
  target: number | null;
  unit: string | null;
  score: number;
  weight: number;
}

export interface ScorecardPerspectiveResult {
  id: number;
  code: string;
  name: string;
  weight: number;
  score: number;
  status: "baik" | "cukup" | "kurang";
  kpis: ScorecardKpi[];
}

export interface ScorecardComputeResult {
  period: { start: string; end: string };
  overall: number;
  overall_status: "baik" | "cukup" | "kurang";
  perspectives: ScorecardPerspectiveResult[];
}

// ============================================================
// B-SHARP SERVICE
// ============================================================
export const bsharpService = {
  async list(params: Record<string, unknown> = {}) {
    const { data } = await api.get(`${WP}/bsharp`, { params: buildParams(params) });
    return data.data;
  },
  async summary(from?: string, to?: string): Promise<BSharpSummary> {
    const { data } = await api.get(`${WP}/bsharp/summary`, {
      params: buildParams({ from, to }),
    });
    return data.data;
  },
  async show(id: number): Promise<BSharpObservation> {
    const { data } = await api.get(`${WP}/bsharp/${id}`);
    return data.data;
  },
  async create(payload: Partial<BSharpObservation>) {
    const { data } = await api.post(`${WP}/bsharp`, payload);
    return data.data as BSharpObservation;
  },
  async update(id: number, payload: Partial<BSharpObservation>) {
    const { data } = await api.put(`${WP}/bsharp/${id}`, payload);
    return data.data as BSharpObservation;
  },
  async complete(id: number) {
    const { data } = await api.post(`${WP}/bsharp/${id}/complete`);
    return data.data as BSharpObservation;
  },
  async destroy(id: number) {
    await api.delete(`${WP}/bsharp/${id}`);
  },
};

// ============================================================
// AUDIT SERVICE
// ============================================================
export const auditService = {
  async list(params: Record<string, unknown> = {}) {
    const { data } = await api.get(`${WP}/audits`, { params: buildParams(params) });
    return data.data;
  },
  async summary(from?: string, to?: string): Promise<AuditSummary> {
    const { data } = await api.get(`${WP}/audits/summary`, {
      params: buildParams({ from, to }),
    });
    return data.data;
  },
  async show(id: number): Promise<AuditPlan> {
    const { data } = await api.get(`${WP}/audits/${id}`);
    return data.data;
  },
  async create(payload: Partial<AuditPlan>) {
    const { data } = await api.post(`${WP}/audits`, payload);
    return data.data as AuditPlan;
  },
  async update(id: number, payload: Partial<AuditPlan>) {
    const { data } = await api.put(`${WP}/audits/${id}`, payload);
    return data.data as AuditPlan;
  },
  async close(id: number, summary?: string) {
    const { data } = await api.post(`${WP}/audits/${id}/close`, { summary });
    return data.data as AuditPlan;
  },
  async destroy(id: number) {
    await api.delete(`${WP}/audits/${id}`);
  },
  // Findings
  async findings(auditId: number) {
    const { data } = await api.get(`${WP}/audits/${auditId}/findings`);
    return data.data as AuditFinding[];
  },
  async addFinding(auditId: number, payload: Partial<AuditFinding>) {
    const { data } = await api.post(`${WP}/audits/${auditId}/findings`, payload);
    return data.data as AuditFinding;
  },
  async updateFinding(findingId: number, payload: Partial<AuditFinding>) {
    const { data } = await api.put(`${WP}/audit-findings/${findingId}`, payload);
    return data.data as AuditFinding;
  },
};

// ============================================================
// DOCUMENT SERVICE
// ============================================================
export const documentService = {
  async list(params: Record<string, unknown> = {}) {
    const { data } = await api.get(`${WP}/documents`, { params: buildParams(params) });
    return data.data;
  },
  async categories(): Promise<Array<{ code: string; name: string }>> {
    const { data } = await api.get(`${WP}/documents/categories`);
    return data.data;
  },
  async show(id: number): Promise<DocumentItem> {
    const { data } = await api.get(`${WP}/documents/${id}`);
    return data.data;
  },
  async create(payload: Partial<DocumentItem>) {
    const { data } = await api.post(`${WP}/documents`, payload);
    return data.data as DocumentItem;
  },
  async update(id: number, payload: Partial<DocumentItem>) {
    const { data } = await api.put(`${WP}/documents/${id}`, payload);
    return data.data as DocumentItem;
  },
  async destroy(id: number) {
    await api.delete(`${WP}/documents/${id}`);
  },
  async download(id: number) {
    const { data } = await api.post(`${WP}/documents/${id}/download`);
    return data.data;
  },
};

// ============================================================
// KPI / COMPLIANCE / SCORECARD SERVICE
// ============================================================
export const kpiArsheService = {
  async compliance(periodStart?: string, periodEnd?: string, workAreaId?: number) {
    const { data } = await api.get(`${WP}/kpi/compliance`, {
      params: buildParams({ period_start: periodStart, period_end: periodEnd, work_area_id: workAreaId }),
    });
    return data.data as ComplianceMetricsResponse;
  },
  async overall(periodStart?: string, periodEnd?: string) {
    const { data } = await api.get(`${WP}/kpi/overall`, {
      params: buildParams({ period_start: periodStart, period_end: periodEnd }),
    });
    return data.data as KpiOverallScore;
  },
  async incidentByClass(periodStart?: string, periodEnd?: string) {
    const { data } = await api.get(`${WP}/kpi/incident-by-class`, {
      params: buildParams({ period_start: periodStart, period_end: periodEnd }),
    });
    return data.data as IncidentByClass;
  },
  async trends(months: number = 6) {
    const { data } = await api.get(`${WP}/kpi/trends`, { params: { months } });
    return data.data as Array<{
      month: string;
      label: string;
      manhours: number;
      lti_count: number;
      recordable_count: number;
      ltifr: number;
      trifr: number;
    }>;
  },
};

export const scorecardService = {
  async perspectives() {
    const { data } = await api.get(`${WP}/scorecard/perspectives`);
    return data.data;
  },
  async compute(periodStart?: string, periodEnd?: string) {
    const { data } = await api.get(`${WP}/scorecard/compute`, {
      params: buildParams({ period_start: periodStart, period_end: periodEnd }),
    });
    return data.data as ScorecardComputeResult;
  },
};

// ============================================================
// DASHBOARD WIDGETS (activity feed + recent docs)
// ============================================================
export const dashboardWidgetsService = {
  async activityFeed(limit: number = 10): Promise<ActivityFeedItem[]> {
    const { data } = await api.get(`${WP}/dashboard/activity-feed`, { params: { limit } });
    return data.data;
  },
  async recentDocuments(limit: number = 5): Promise<DocumentItem[]> {
    const { data } = await api.get(`${WP}/dashboard/recent-documents`, { params: { limit } });
    return data.data;
  },
};
