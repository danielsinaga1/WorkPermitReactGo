import api, { toPaginatedResponse } from "./api";
import type { ApiResponse, PaginatedResponse } from "../types";
import type {
  GasTestLog,
  CreateGasTestPayload,
  EmergencySosAlert,
  TriggerSosPayload,
  LessonLearned,
  CreateLessonPayload,
  ESignature,
  CreateSignaturePayload,
  JsaTemplate,
  JsaRecord,
  ContractorCompany,
  CreateContractorPayload,
  PermitPhoto,
  UploadPhotoPayload,
  GeofenceValidationResult,
  Notification,
  QrVerificationResult,
  WorkPermit,
} from "../types/workPermitTypes";

const WP = "/wp";

// ============================================================
// AUDIT TRAIL
// ============================================================
export const auditTrailService = {
  async list(params: Record<string, unknown> = {}): Promise<PaginatedResponse<Record<string, unknown>>> {
    const { data: resp } = await api.get(`${WP}/audit-trails`, { params });
    return toPaginatedResponse<Record<string, unknown>>(resp);
  },
};

// ============================================================
// GAS TESTING (#12)
// ============================================================
export const gasTestService = {
  async list(permitId: number): Promise<GasTestLog[]> {
    const { data } = await api.get<ApiResponse<GasTestLog[]>>(
      `${WP}/permits/${permitId}/gas-tests`
    );
    return data.data;
  },

  async create(permitId: number, payload: CreateGasTestPayload): Promise<GasTestLog> {
    const { data } = await api.post<ApiResponse<GasTestLog>>(
      `${WP}/permits/${permitId}/gas-tests`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// EMERGENCY SOS (#16)
// ============================================================
export const sosService = {
  async trigger(payload: TriggerSosPayload): Promise<EmergencySosAlert> {
    const { data } = await api.post<ApiResponse<EmergencySosAlert>>(`${WP}/sos`, payload);
    return data.data;
  },

  async list(params: { active_only?: boolean; per_page?: number; page?: number } = {}): Promise<PaginatedResponse<EmergencySosAlert>> {
    const { data: resp } = await api.get(`${WP}/sos`, { params });
    return toPaginatedResponse<EmergencySosAlert>(resp);
  },

  async acknowledge(id: number, acknowledgedBy?: string): Promise<EmergencySosAlert> {
    const { data } = await api.post<ApiResponse<EmergencySosAlert>>(
      `${WP}/sos/${id}/acknowledge`,
      { acknowledged_by: acknowledgedBy }
    );
    return data.data;
  },

  async resolve(id: number, resolvedBy?: string, notes?: string): Promise<EmergencySosAlert> {
    const { data } = await api.post<ApiResponse<EmergencySosAlert>>(
      `${WP}/sos/${id}/resolve`,
      { resolved_by: resolvedBy, notes }
    );
    return data.data;
  },
};

// ============================================================
// LESSONS LEARNED (#20)
// ============================================================
export const lessonService = {
  async list(permitType?: string): Promise<LessonLearned[]> {
    const { data } = await api.get<ApiResponse<LessonLearned[]>>(`${WP}/lessons`, {
      params: permitType ? { permit_type: permitType } : {},
    });
    return data.data;
  },

  async create(payload: CreateLessonPayload): Promise<LessonLearned> {
    const { data } = await api.post<ApiResponse<LessonLearned>>(`${WP}/lessons`, payload);
    return data.data;
  },

  async getMandatory(permitId: number): Promise<LessonLearned[]> {
    const { data } = await api.get<ApiResponse<LessonLearned[]>>(
      `${WP}/lessons/permits/${permitId}/mandatory`
    );
    return data.data;
  },

  async acknowledge(lessonId: number, personnelId: number, workPermitId?: number): Promise<void> {
    await api.post(`${WP}/lessons/${lessonId}/acknowledge`, {
      personnel_id: personnelId,
      work_permit_id: workPermitId,
    });
  },
};

// ============================================================
// E-SIGNATURE (#6)
// ============================================================
export const eSignatureService = {
  async sign(payload: CreateSignaturePayload): Promise<ESignature> {
    const { data } = await api.post<ApiResponse<ESignature>>(`${WP}/e-signature`, payload);
    return data.data;
  },
};

// ============================================================
// JSA (#1)
// ============================================================
export const jsaService = {
  async listTemplates(): Promise<JsaTemplate[]> {
    const { data } = await api.get<ApiResponse<JsaTemplate[]>>(`${WP}/jsa/templates`);
    return data.data;
  },

  async getOrCreate(permitId: number): Promise<JsaRecord> {
    const { data } = await api.get<ApiResponse<JsaRecord>>(`${WP}/jsa/permits/${permitId}`);
    return data.data;
  },

  async update(permitId: number, payload: Partial<JsaRecord>): Promise<JsaRecord> {
    const { data } = await api.put<ApiResponse<JsaRecord>>(
      `${WP}/jsa/permits/${permitId}`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// CONTRACTOR MANAGEMENT (#14)
// ============================================================
export const contractorService = {
  async list(params: { compliance_status?: string; per_page?: number; page?: number } = {}): Promise<PaginatedResponse<ContractorCompany>> {
    const { data: resp } = await api.get(`${WP}/contractors`, { params });
    return toPaginatedResponse<ContractorCompany>(resp);
  },

  async create(payload: CreateContractorPayload): Promise<ContractorCompany> {
    const { data } = await api.post<ApiResponse<ContractorCompany>>(
      `${WP}/contractors`,
      payload
    );
    return data.data;
  },

  async update(id: number, payload: Partial<CreateContractorPayload>): Promise<ContractorCompany> {
    const { data } = await api.put<ApiResponse<ContractorCompany>>(
      `${WP}/contractors/${id}`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// PERMIT PHOTOS (#9)
// ============================================================
export const permitPhotoService = {
  async list(permitId: number): Promise<PermitPhoto[]> {
    const { data } = await api.get<ApiResponse<PermitPhoto[]>>(
      `${WP}/permits/${permitId}/photos`
    );
    return data.data;
  },

  async upload(permitId: number, payload: UploadPhotoPayload): Promise<PermitPhoto> {
    const { data } = await api.post<ApiResponse<PermitPhoto>>(
      `${WP}/permits/${permitId}/photos`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// GEOFENCE VALIDATION (#3)
// ============================================================
export const geofenceService = {
  async validate(
    permitId: number,
    latitude: number,
    longitude: number
  ): Promise<GeofenceValidationResult> {
    const { data } = await api.post<ApiResponse<GeofenceValidationResult>>(
      `${WP}/permits/${permitId}/geofence`,
      { latitude, longitude }
    );
    return data.data;
  },
};

// ============================================================
// NOTIFICATIONS (#5)
// ============================================================
export const notificationService = {
  async list(params: {
    personnel_id?: number;
    user_id?: string;
    unread_only?: boolean;
    per_page?: number;
    page?: number;
  } = {}): Promise<PaginatedResponse<Notification>> {
    const { data: resp } = await api.get(`${WP}/notifications`, { params });
    return toPaginatedResponse<Notification>(resp);
  },

  async markRead(id: number): Promise<Notification> {
    const { data } = await api.post<ApiResponse<Notification>>(
      `${WP}/notifications/${id}/read`
    );
    return data.data;
  },
};

// ============================================================
// QR CODE VERIFICATION (#4)
// ============================================================
export const qrVerifyService = {
  async verify(permitNumber: string): Promise<QrVerificationResult> {
    const { data } = await api.post<ApiResponse<QrVerificationResult>>(
      `${WP}/qr-verify`,
      { permit_number: permitNumber }
    );
    return data.data;
  },
};

// ============================================================
// ENHANCED PERMIT WORKFLOW (V2 — with full validation)
// ============================================================
export const permitWorkflowV2 = {
  async submit(id: number): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(
      `${WP}/permits/${id}/submit-v2`
    );
    return data.data;
  },

  async activate(id: number, latitude?: number, longitude?: number): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(
      `${WP}/permits/${id}/activate-v2`,
      { latitude, longitude }
    );
    return data.data;
  },

  async close(id: number, closedBy?: string, remarks?: string): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(
      `${WP}/permits/${id}/close-v2`,
      { closed_by: closedBy, remarks }
    );
    return data.data;
  },
};
