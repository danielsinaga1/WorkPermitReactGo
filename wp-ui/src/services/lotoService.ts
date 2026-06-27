import api, { buildParams, toPaginatedResponse } from "./api";
import type { ApiResponse, PaginatedResponse } from "../types";
import type {
  LotoProcedure,
  LotoLock,
  LotoVerification,
  LotoPoint,
  HseFilters,
} from "../types/workPermitTypes";

const WP = "/wp";

// ============================================================
// LOTO PROCEDURES
// ============================================================
export const lotoService = {
  async list(filters: HseFilters = {}): Promise<PaginatedResponse<LotoProcedure>> {
    const { data: resp } = await api.get(`${WP}/loto/procedures`, {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<LotoProcedure>(resp);
  },

  async detail(id: number): Promise<LotoProcedure> {
    const { data } = await api.get<ApiResponse<LotoProcedure>>(`${WP}/loto/procedures/${id}`);
    return data.data;
  },

  async create(payload: Partial<LotoProcedure>): Promise<LotoProcedure> {
    const { data } = await api.post<ApiResponse<LotoProcedure>>(`${WP}/loto/procedures`, payload);
    return data.data;
  },

  async update(id: number, payload: Partial<LotoProcedure>): Promise<LotoProcedure> {
    const { data } = await api.put<ApiResponse<LotoProcedure>>(`${WP}/loto/procedures/${id}`, payload);
    return data.data;
  },

  async lock(
    procedureId: number,
    payload: {
      loto_point_id: number;
      lock_number: string;
      tag_number: string;
      locked_by_id: number;
      locked_by_name: string;
      work_permit_id?: number;
    }
  ): Promise<LotoLock> {
    const { data } = await api.post<ApiResponse<LotoLock>>(
      `${WP}/loto/procedures/${procedureId}/lock`,
      payload
    );
    return data.data;
  },

  async unlock(
    procedureId: number,
    payload: {
      loto_point_id: number;
      unlocked_by_id: number;
      unlocked_by_name: string;
      force_remove?: boolean;
      force_remove_reason?: string;
      force_remove_authorized_by?: string;
    }
  ): Promise<LotoLock> {
    const { data } = await api.post<ApiResponse<LotoLock>>(
      `${WP}/loto/procedures/${procedureId}/unlock`,
      payload
    );
    return data.data;
  },

  async verify(
    procedureId: number,
    payload: {
      loto_point_id: number;
      verified_by_id: number;
      verified_by_name: string;
      verification_result: "isolated" | "not_isolated" | "partial";
      method_used: string;
      remarks?: string;
      readings?: Record<string, unknown>;
    }
  ): Promise<LotoVerification> {
    const { data } = await api.post<ApiResponse<LotoVerification>>(
      `${WP}/loto/procedures/${procedureId}/verify`,
      payload
    );
    return data.data;
  },

  async scanQr(code: string): Promise<LotoPoint> {
    const { data } = await api.post<ApiResponse<LotoPoint>>(`${WP}/loto/scan-qr`, { code });
    return data.data;
  },

  async scanNfc(tagId: string): Promise<LotoPoint> {
    const { data } = await api.post<ApiResponse<LotoPoint>>(`${WP}/loto/scan-nfc`, { tag_id: tagId });
    return data.data;
  },
};
