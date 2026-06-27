import api, { toPaginatedResponse } from "./api";
import type { ApiResponse, PaginatedResponse } from "../types";
import type {
  PpeChecklist,
  CreatePpeChecklistPayload,
  PermitTransfer,
  RequestTransferPayload,
  ProcessTransferPayload,
  RevokePermitPayload,
  ClosureChecklist,
  CreateClosureChecklistPayload,
  FormFieldConfig,
  CreateFieldConfigPayload,
  WorkPermit,
} from "../types/workPermitTypes";

const WP = "/wp";

// ============================================================
// PPE CHECKLISTS
// ============================================================
export const ppeChecklistService = {
  async list(permitId: number): Promise<PpeChecklist[]> {
    const { data } = await api.get<ApiResponse<PpeChecklist[]>>(
      `${WP}/permits/${permitId}/ppe-checklists`
    );
    return data.data;
  },

  async create(permitId: number, payload: CreatePpeChecklistPayload): Promise<PpeChecklist> {
    const { data } = await api.post<ApiResponse<PpeChecklist>>(
      `${WP}/permits/${permitId}/ppe-checklists`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// PERMIT TRANSFER
// ============================================================
export const permitTransferService = {
  async list(permitId: number): Promise<PermitTransfer[]> {
    const { data } = await api.get<ApiResponse<PermitTransfer[]>>(
      `${WP}/permits/${permitId}/transfers`
    );
    return data.data;
  },

  async request(permitId: number, payload: RequestTransferPayload): Promise<PermitTransfer> {
    const { data } = await api.post<ApiResponse<PermitTransfer>>(
      `${WP}/permits/${permitId}/transfer`,
      payload
    );
    return data.data;
  },

  async process(transferId: number, payload: ProcessTransferPayload): Promise<PermitTransfer> {
    const { data } = await api.post<ApiResponse<PermitTransfer>>(
      `${WP}/transfers/${transferId}/process`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// PERMIT REVOKE
// ============================================================
export const permitRevokeService = {
  async revoke(permitId: number, payload: RevokePermitPayload): Promise<WorkPermit> {
    const { data } = await api.post<ApiResponse<WorkPermit>>(
      `${WP}/permits/${permitId}/revoke`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// CLOSURE CHECKLIST
// ============================================================
export const closureChecklistService = {
  async get(permitId: number): Promise<ClosureChecklist | null> {
    const { data } = await api.get<ApiResponse<ClosureChecklist | null>>(
      `${WP}/permits/${permitId}/closure-checklist`
    );
    return data.data;
  },

  async create(permitId: number, payload: CreateClosureChecklistPayload): Promise<ClosureChecklist> {
    const { data } = await api.post<ApiResponse<ClosureChecklist>>(
      `${WP}/permits/${permitId}/closure-checklist`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// FORM FIELD CONFIGURATION (No-Code Builder)
// ============================================================
export const formFieldConfigService = {
  async list(params: { permit_type_id?: number; section?: string } = {}): Promise<FormFieldConfig[]> {
    const { data } = await api.get<ApiResponse<FormFieldConfig[]>>(`${WP}/field-configs`, { params });
    return data.data;
  },

  async create(payload: CreateFieldConfigPayload): Promise<FormFieldConfig> {
    const { data } = await api.post<ApiResponse<FormFieldConfig>>(`${WP}/field-configs`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<CreateFieldConfigPayload>): Promise<FormFieldConfig> {
    const { data } = await api.put<ApiResponse<FormFieldConfig>>(`${WP}/field-configs/${id}`, payload);
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${WP}/field-configs/${id}`);
  },
};
