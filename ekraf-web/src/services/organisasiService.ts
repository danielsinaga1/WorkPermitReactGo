import api, { buildParams, toFormData, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  Organisasi,
  OrganisasiFilters,
  OrganisasiPayload,
  OrgPengurus,
  OrgKegiatan,
  OrgLaporan,
  PengurusPayload,
} from "../types";

// ============================================================
// PUBLIC — Organisasi / OKP
// ============================================================

export const organisasiService = {
  /**
   * List verified organisasi (public).
   */
  async list(
    filters: OrganisasiFilters = {}
  ): Promise<PaginatedResponse<Organisasi>> {
    const { data: resp } = await api.get("/organisasi", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Organisasi>(resp);
  },

  /**
   * Get single organisasi detail.
   */
  async detail(id: number): Promise<Organisasi> {
    const { data } = await api.get<ApiResponse<Organisasi>>(
      `/organisasi/${id}`
    );
    return data.data;
  },

  /**
   * Register new OKP (authenticated).
   */
  async register(payload: OrganisasiPayload): Promise<Organisasi> {
    const formData = toFormData(payload as unknown as Record<string, unknown>);
    const { data } = await api.post<ApiResponse<Organisasi>>(
      "/organisasi",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  /**
   * Update OKP (admin_okp only).
   */
  async update(
    id: number,
    payload: Partial<OrganisasiPayload>
  ): Promise<Organisasi> {
    const formData = toFormData(payload as unknown as Record<string, unknown>);
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Organisasi>>(
      `/organisasi/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  // ---- Pengurus ----

  async addPengurus(
    orgId: number,
    payload: PengurusPayload
  ): Promise<OrgPengurus> {
    const { data } = await api.post<ApiResponse<OrgPengurus>>(
      `/organisasi/${orgId}/pengurus`,
      payload
    );
    return data.data;
  },

  async updatePengurus(
    orgId: number,
    pengurusId: number,
    payload: Partial<PengurusPayload>
  ): Promise<OrgPengurus> {
    const { data } = await api.put<ApiResponse<OrgPengurus>>(
      `/organisasi/${orgId}/pengurus/${pengurusId}`,
      payload
    );
    return data.data;
  },

  async deletePengurus(orgId: number, pengurusId: number): Promise<void> {
    await api.delete(`/organisasi/${orgId}/pengurus/${pengurusId}`);
  },
};

// ============================================================
// KEGIATAN OKP
// ============================================================

export const kegiatanService = {
  /**
   * Public aggregated kegiatan list.
   */
  async listPublik(params: {
    jenis?: string;
    bulan?: number;
    tahun?: number;
  } = {}): Promise<OrgKegiatan[]> {
    const { data } = await api.get<ApiResponse<OrgKegiatan[]>>(
      "/kegiatan-publik",
      { params: buildParams(params as Record<string, unknown>) }
    );
    return data.data;
  },

  /**
   * Create kegiatan for an organisasi (admin_okp).
   */
  async create(
    orgId: number,
    payload: Partial<OrgKegiatan>
  ): Promise<OrgKegiatan> {
    const { data } = await api.post<ApiResponse<OrgKegiatan>>(
      `/organisasi/${orgId}/kegiatan`,
      payload
    );
    return data.data;
  },

  /**
   * Update kegiatan.
   */
  async update(
    orgId: number,
    kegiatanId: number,
    payload: Partial<OrgKegiatan>
  ): Promise<OrgKegiatan> {
    const { data } = await api.put<ApiResponse<OrgKegiatan>>(
      `/organisasi/${orgId}/kegiatan/${kegiatanId}`,
      payload
    );
    return data.data;
  },

  /**
   * Delete kegiatan.
   */
  async destroy(orgId: number, kegiatanId: number): Promise<void> {
    await api.delete(`/organisasi/${orgId}/kegiatan/${kegiatanId}`);
  },

  /**
   * Submit laporan for a kegiatan (upload PDF + photos).
   */
  async submitLaporan(
    orgId: number,
    kegiatanId: number,
    payload: { file_laporan: File; foto_kegiatan?: File[]; catatan?: string }
  ): Promise<OrgLaporan> {
    const formData = new FormData();
    formData.append("file_laporan", payload.file_laporan);
    if (payload.catatan) formData.append("catatan", payload.catatan);
    if (payload.foto_kegiatan) {
      payload.foto_kegiatan.forEach((file, i) => {
        formData.append(`foto_kegiatan[${i}]`, file);
      });
    }

    const { data } = await api.post<ApiResponse<OrgLaporan>>(
      `/organisasi/${orgId}/kegiatan/${kegiatanId}/laporan`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },
};

// ============================================================
// ADMIN — OKP Management
// ============================================================

export const adminOrganisasiService = {
  async listAll(): Promise<PaginatedResponse<Organisasi>> {
    const { data: resp } = await api.get("/admin/organisasi/all");
    return toPaginatedResponse<Organisasi>(resp);
  },

  async listPending(): Promise<Organisasi[]> {
    const { data } = await api.get<ApiResponse<Organisasi[]>>(
      "/admin/organisasi/pending"
    );
    return data.data;
  },

  async verifikasi(
    id: number,
    payload: {
      status: "terverifikasi" | "ditolak";
      catatan_verifikasi?: string;
    }
  ): Promise<Organisasi> {
    const { data } = await api.put<ApiResponse<Organisasi>>(
      `/admin/organisasi/${id}/verifikasi`,
      payload
    );
    return data.data;
  },

  async reviewLaporan(
    orgId: number,
    kegiatanId: number,
    laporanId: number,
    payload: {
      status: "diterima" | "revisi" | "ditolak";
      catatan_review?: string;
    }
  ): Promise<OrgLaporan> {
    const { data } = await api.put<ApiResponse<OrgLaporan>>(
      `/admin/organisasi/${orgId}/kegiatan/${kegiatanId}/laporan/${laporanId}/review`,
      payload
    );
    return data.data;
  },
};
