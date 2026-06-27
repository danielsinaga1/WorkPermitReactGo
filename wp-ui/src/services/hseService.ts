import api, { buildParams, toPaginatedResponse } from "./api";
import type { ApiResponse, PaginatedResponse } from "../types";
import type {
  ToolboxMeeting,
  SafetyObservation,
  CorrectiveAction,
  Incident,
  IncidentRootCause,
  HseFilters,
  RcaMethod,
} from "../types/workPermitTypes";

const WP = "/wp";

// ============================================================
// TOOLBOX MEETINGS
// ============================================================
export const toolboxMeetingService = {
  async list(filters: HseFilters = {}): Promise<PaginatedResponse<ToolboxMeeting>> {
    const { data: resp } = await api.get(`${WP}/toolbox`, {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<ToolboxMeeting>(resp);
  },

  async detail(id: number): Promise<ToolboxMeeting> {
    const { data } = await api.get<ApiResponse<ToolboxMeeting>>(`${WP}/toolbox/${id}`);
    return data.data;
  },

  async create(payload: Partial<ToolboxMeeting>): Promise<ToolboxMeeting> {
    const { data } = await api.post<ApiResponse<ToolboxMeeting>>(`${WP}/toolbox`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<ToolboxMeeting>): Promise<ToolboxMeeting> {
    const { data } = await api.put<ApiResponse<ToolboxMeeting>>(`${WP}/toolbox/${id}`, payload);
    return data.data;
  },

  async complete(id: number): Promise<ToolboxMeeting> {
    const { data } = await api.post<ApiResponse<ToolboxMeeting>>(`${WP}/toolbox/${id}/complete`);
    return data.data;
  },
};

// ============================================================
// SAFETY OBSERVATIONS
// ============================================================
export const safetyObservationService = {
  async list(filters: HseFilters = {}): Promise<PaginatedResponse<SafetyObservation>> {
    const { data: resp } = await api.get(`${WP}/observations`, {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<SafetyObservation>(resp);
  },

  async detail(id: number): Promise<SafetyObservation> {
    const { data } = await api.get<ApiResponse<SafetyObservation>>(`${WP}/observations/${id}`);
    return data.data;
  },

  async create(payload: Partial<SafetyObservation>): Promise<SafetyObservation> {
    const { data } = await api.post<ApiResponse<SafetyObservation>>(`${WP}/observations`, payload);
    return data.data;
  },

  async uploadPhoto(id: number, formData: FormData): Promise<SafetyObservation> {
    const { data } = await api.post<ApiResponse<SafetyObservation>>(
      `${WP}/observations/${id}/photos`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async assignCorrectiveAction(
    id: number,
    payload: Partial<CorrectiveAction>
  ): Promise<CorrectiveAction> {
    const { data } = await api.post<ApiResponse<CorrectiveAction>>(
      `${WP}/observations/${id}/corrective-action`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// CORRECTIVE ACTIONS
// ============================================================
export const correctiveActionService = {
  async list(filters: HseFilters = {}): Promise<PaginatedResponse<CorrectiveAction>> {
    const { data: resp } = await api.get(`${WP}/corrective-actions`, {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<CorrectiveAction>(resp);
  },

  async complete(
    id: number,
    payload: { completion_notes?: string; evidence_path?: string }
  ): Promise<CorrectiveAction> {
    const { data } = await api.post<ApiResponse<CorrectiveAction>>(
      `${WP}/corrective-actions/${id}/complete`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// INCIDENTS
// ============================================================
export const incidentService = {
  async list(filters: HseFilters = {}): Promise<PaginatedResponse<Incident>> {
    const { data: resp } = await api.get(`${WP}/incidents`, {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Incident>(resp);
  },

  async detail(id: number): Promise<Incident> {
    const { data } = await api.get<ApiResponse<Incident>>(`${WP}/incidents/${id}`);
    return data.data;
  },

  async create(payload: Partial<Incident>): Promise<Incident> {
    const { data } = await api.post<ApiResponse<Incident>>(`${WP}/incidents`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<Incident>): Promise<Incident> {
    const { data } = await api.put<ApiResponse<Incident>>(`${WP}/incidents/${id}`, payload);
    return data.data;
  },

  async addRootCause(
    id: number,
    payload: {
      rca_method: RcaMethod;
      analysis_data: Record<string, unknown>;
      direct_cause?: string;
      contributing_factors?: string;
      root_cause: string;
      systemic_issues?: string;
      analyzed_by: string;
    }
  ): Promise<IncidentRootCause> {
    const { data } = await api.post<ApiResponse<IncidentRootCause>>(
      `${WP}/incidents/${id}/root-cause`,
      payload
    );
    return data.data;
  },

  async close(
    id: number,
    payload: { investigation_summary?: string; lessons_learned?: string; closed_by?: string }
  ): Promise<Incident> {
    const { data } = await api.post<ApiResponse<Incident>>(`${WP}/incidents/${id}/close`, payload);
    return data.data;
  },
};
