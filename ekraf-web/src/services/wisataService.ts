import api, { buildParams, toFormData, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  DestinasiWisata,
  DestinasiFilters,
  TiketWisata,
  TiketPayload,
  PaginationParams,
} from "../types";

// ============================================================
// PUBLIC — Destinasi Wisata
// ============================================================

export const destinasiWisataService = {
  /**
   * List destinasi wisata with optional filters.
   */
  async list(
    filters: DestinasiFilters = {}
  ): Promise<PaginatedResponse<DestinasiWisata>> {
    const { data: resp } = await api.get("/destinasi-wisata", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<DestinasiWisata>(resp);
  },

  /**
   * Get single destinasi detail.
   */
  async detail(id: number): Promise<DestinasiWisata> {
    const { data } = await api.get<ApiResponse<DestinasiWisata>>(
      `/destinasi-wisata/${id}`
    );
    return data.data;
  },
};

// ============================================================
// AUTH — Tiket Wisata
// ============================================================

export const tiketWisataService = {
  /**
   * Buy a ticket.
   */
  async buy(payload: TiketPayload): Promise<TiketWisata> {
    const { data } = await api.post<ApiResponse<TiketWisata>>(
      "/tiket-wisata",
      payload
    );
    return data.data;
  },

  /**
   * Get ticket purchase history.
   */
  async riwayat(
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<TiketWisata>> {
    const { data: resp } = await api.get("/tiket-wisata/riwayat", {
      params: buildParams(params as Record<string, unknown>),
    });
    return toPaginatedResponse<TiketWisata>(resp);
  },

  /**
   * Get single ticket detail.
   */
  async detail(id: number): Promise<TiketWisata> {
    const { data } = await api.get<ApiResponse<TiketWisata>>(
      `/tiket-wisata/${id}`
    );
    return data.data;
  },
};

// ============================================================
// ADMIN — Destinasi Wisata CRUD
// ============================================================

export const adminDestinasiService = {
  /**
   * List all destinasi for admin (includes inactive).
   */
  async list(
    filters: DestinasiFilters & { is_active?: boolean } = {}
  ): Promise<PaginatedResponse<DestinasiWisata>> {
    const { data: resp } = await api.get("/admin/destinasi-wisata", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<DestinasiWisata>(resp);
  },

  async create(
    payload: Record<string, unknown>
  ): Promise<DestinasiWisata> {
    const formData = toFormData(payload);
    const { data } = await api.post<ApiResponse<DestinasiWisata>>(
      "/admin/destinasi-wisata",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async update(
    id: number,
    payload: Record<string, unknown>
  ): Promise<DestinasiWisata> {
    const formData = toFormData(payload);
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<DestinasiWisata>>(
      `/admin/destinasi-wisata/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/destinasi-wisata/${id}`);
  },

  async validateTiket(
    tiketId: number
  ): Promise<TiketWisata> {
    const { data } = await api.post<ApiResponse<TiketWisata>>(
      `/admin/tiket-wisata/${tiketId}/validate`
    );
    return data.data;
  },

  /**
   * List all tiket wisata for admin.
   */
  async listTiket(
    filters: PaginationParams & { status?: string; destinasi_id?: number } = {}
  ): Promise<PaginatedResponse<TiketWisata>> {
    const { data: resp } = await api.get("/admin/tiket-wisata", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<TiketWisata>(resp);
  },
};
