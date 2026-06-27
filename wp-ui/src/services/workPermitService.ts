import api, { buildParams, toPaginatedResponse } from "./api";
import type { ApiResponse, PaginatedResponse } from "../types";
import type {
  WorkPermit,
  CreatePermitPayload,
  PermitFilters,
  PermitApproval,
  ProcessApprovalPayload,
  PermitRiskAssessment,
  CreateRiskAssessmentPayload,
  ClashDetection,
  WorkArea,
  Personnel,
  PersonnelQualification,
  Equipment,
  EquipmentCertification,
  PermitType,
} from "../types/workPermitTypes";

const WP = "/wp";

// ============================================================
// WORK PERMITS
// ============================================================
export const workPermitService = {
  async list(filters: PermitFilters = {}): Promise<PaginatedResponse<WorkPermit>> {
    const { data: resp } = await api.get(`${WP}/permits`, {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<WorkPermit>(resp);
  },

  async detail(id: number): Promise<WorkPermit> {
    const { data } = await api.get<ApiResponse<WorkPermit>>(`${WP}/permits/${id}`);
    return data.data;
  },

  async create(payload: CreatePermitPayload): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(`${WP}/permits`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<CreatePermitPayload>): Promise<WorkPermit> {
    const { data } = await api.put<ApiResponse<WorkPermit>>(`${WP}/permits/${id}`, payload);
    return data.data;
  },

  async submit(id: number): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(`${WP}/permits/${id}/submit`);
    return data.data;
  },

  async processApproval(id: number, payload: ProcessApprovalPayload): Promise<{ permit: WorkPermit; approval: PermitApproval }> {
    const { data } = await api.post<ApiResponse<{ permit: WorkPermit; approval: PermitApproval }>>(`${WP}/permits/${id}/approval`, payload);
    return data.data;
  },

  async activate(id: number): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(`${WP}/permits/${id}/activate`);
    return data.data;
  },

  async close(id: number, payload: { closure_remarks?: string; closed_by_name?: string }): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(`${WP}/permits/${id}/close`, payload);
    return data.data;
  },

  async addRiskAssessment(id: number, payload: CreateRiskAssessmentPayload): Promise<PermitRiskAssessment> {
    const { data } = await api.post<ApiResponse<PermitRiskAssessment>>(`${WP}/permits/${id}/risk-assessment`, payload);
    return data.data;
  },

  async checkClash(id: number): Promise<ClashDetection[]> {
    const { data } = await api.get<ApiResponse<ClashDetection[]>>(`${WP}/permits/${id}/check-clash`);
    return data.data;
  },
};

// ============================================================
// WORK AREAS
// ============================================================
export const workAreaService = {
  async list(params: Record<string, unknown> = {}): Promise<PaginatedResponse<WorkArea>> {
    const { data: resp } = await api.get(`${WP}/work-areas`, {
      params: buildParams(params),
    });
    return toPaginatedResponse<WorkArea>(resp);
  },

  async detail(id: number): Promise<WorkArea> {
    const { data } = await api.get<ApiResponse<WorkArea>>(`${WP}/work-areas/${id}`);
    return data.data;
  },

  async create(payload: Partial<WorkArea>): Promise<WorkArea> {
    const { data } = await api.post<ApiResponse<WorkArea>>(`${WP}/work-areas`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<WorkArea>): Promise<WorkArea> {
    const { data } = await api.put<ApiResponse<WorkArea>>(`${WP}/work-areas/${id}`, payload);
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${WP}/work-areas/${id}`);
  },
};

// ============================================================
// PERSONNEL
// ============================================================
export const personnelService = {
  async list(params: Record<string, unknown> = {}): Promise<PaginatedResponse<Personnel>> {
    const { data: resp } = await api.get(`${WP}/personnel`, {
      params: buildParams(params),
    });
    return toPaginatedResponse<Personnel>(resp);
  },

  async detail(id: number): Promise<Personnel> {
    const { data } = await api.get<ApiResponse<Personnel>>(`${WP}/personnel/${id}`);
    return data.data;
  },

  async create(payload: Partial<Personnel>): Promise<Personnel> {
    const { data } = await api.post<ApiResponse<Personnel>>(`${WP}/personnel`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<Personnel>): Promise<Personnel> {
    const { data } = await api.put<ApiResponse<Personnel>>(`${WP}/personnel/${id}`, payload);
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${WP}/personnel/${id}`);
  },

  async addQualification(personnelId: number, payload: Partial<PersonnelQualification>): Promise<PersonnelQualification> {
    const { data } = await api.post<ApiResponse<PersonnelQualification>>(
      `${WP}/personnel/${personnelId}/qualifications`,
      payload
    );
    return data.data;
  },

  async scanQr(code: string): Promise<Personnel> {
    const { data } = await api.post<ApiResponse<Personnel>>(`${WP}/personnel/scan-qr`, { code });
    return data.data;
  },

  async scanNfc(tagId: string): Promise<Personnel> {
    const { data } = await api.post<ApiResponse<Personnel>>(`${WP}/personnel/scan-nfc`, { tag_id: tagId });
    return data.data;
  },
};

// ============================================================
// EQUIPMENT
// ============================================================
export const equipmentService = {
  async list(params: Record<string, unknown> = {}): Promise<PaginatedResponse<Equipment>> {
    const { data: resp } = await api.get(`${WP}/equipment`, {
      params: buildParams(params),
    });
    return toPaginatedResponse<Equipment>(resp);
  },

  async detail(id: number): Promise<Equipment> {
    const { data } = await api.get<ApiResponse<Equipment>>(`${WP}/equipment/${id}`);
    return data.data;
  },

  async create(payload: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.post<ApiResponse<Equipment>>(`${WP}/equipment`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.put<ApiResponse<Equipment>>(`${WP}/equipment/${id}`, payload);
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${WP}/equipment/${id}`);
  },

  async addCertification(equipmentId: number, payload: Partial<EquipmentCertification>): Promise<EquipmentCertification> {
    const { data } = await api.post<ApiResponse<EquipmentCertification>>(
      `${WP}/equipment/${equipmentId}/certifications`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// PERMIT TYPES
// ============================================================
export const permitTypeService = {
  /** Public — no auth required */
  async list(): Promise<PermitType[]> {
    const { data } = await api.get<ApiResponse<PermitType[]>>(`${WP}/permit-types`);
    return data.data;
  },

  async detail(id: number): Promise<PermitType> {
    const { data } = await api.get<ApiResponse<PermitType>>(`${WP}/permit-types/${id}`);
    return data.data;
  },

  async create(payload: Partial<PermitType>): Promise<PermitType> {
    const { data } = await api.post<ApiResponse<PermitType>>(`${WP}/permit-types`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<PermitType>): Promise<PermitType> {
    const { data } = await api.put<ApiResponse<PermitType>>(`${WP}/permit-types/${id}`, payload);
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${WP}/permit-types/${id}`);
  },
};
