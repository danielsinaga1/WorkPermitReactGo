import api, { buildParams, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Promosi,
  RagamEkraf,
  Newsletter,
  Pustaka,
  TenagaKerjaData,
  ProdukHukum,
  PotensiEkonomi,
  PPID,
  ProfilPimpinan,
  ReformasiBirokrasi,
  RealisasiAnggaran,
} from "../types";

// ============================================================
// PROMOSI CRUD
// ============================================================
export const promosiService = {
  async list(
    filters: PaginationParams & { search?: string } = {}
  ): Promise<PaginatedResponse<Promosi>> {
    const { data: resp } = await api.get("/promosi", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Promosi>(resp);
  },

  async detail(id: number): Promise<Promosi> {
    const { data } = await api.get<ApiResponse<Promosi>>(`/promosi/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<Promosi> {
    const { data } = await api.post<ApiResponse<Promosi>>("/promosi", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<Promosi> {
    const { data } = await api.put<ApiResponse<Promosi>>(`/promosi/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/promosi/${id}`);
  },
};

// ============================================================
// RAGAM EKRAF CRUD
// ============================================================
export const ragamEkrafService = {
  async list(
    filters: PaginationParams & { search?: string; subsektor_id?: number } = {}
  ): Promise<PaginatedResponse<RagamEkraf>> {
    const { data: resp } = await api.get("/ragam-ekraf", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<RagamEkraf>(resp);
  },

  async detail(id: number): Promise<RagamEkraf> {
    const { data } = await api.get<ApiResponse<RagamEkraf>>(`/ragam-ekraf/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<RagamEkraf> {
    const { data } = await api.post<ApiResponse<RagamEkraf>>("/ragam-ekraf", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<RagamEkraf> {
    const { data } = await api.put<ApiResponse<RagamEkraf>>(`/ragam-ekraf/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/ragam-ekraf/${id}`);
  },
};

// ============================================================
// NEWSLETTER CRUD
// ============================================================
export const newsletterService = {
  async list(
    filters: PaginationParams & { search?: string } = {}
  ): Promise<PaginatedResponse<Newsletter>> {
    const { data: resp } = await api.get("/newsletter", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Newsletter>(resp);
  },

  async detail(id: number): Promise<Newsletter> {
    const { data } = await api.get<ApiResponse<Newsletter>>(`/newsletter/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<Newsletter> {
    const { data } = await api.post<ApiResponse<Newsletter>>("/newsletter", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<Newsletter> {
    const { data } = await api.put<ApiResponse<Newsletter>>(`/newsletter/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/newsletter/${id}`);
  },
};

// ============================================================
// PUSTAKA CRUD
// ============================================================
export const pustakaService = {
  async list(
    filters: PaginationParams & { search?: string; category?: string } = {}
  ): Promise<PaginatedResponse<Pustaka>> {
    const { data: resp } = await api.get("/pustaka", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pustaka>(resp);
  },

  async detail(id: number): Promise<Pustaka> {
    const { data } = await api.get<ApiResponse<Pustaka>>(`/pustaka/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<Pustaka> {
    const { data } = await api.post<ApiResponse<Pustaka>>("/pustaka", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<Pustaka> {
    const { data } = await api.put<ApiResponse<Pustaka>>(`/pustaka/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/pustaka/${id}`);
  },
};

// ============================================================
// TENAGA KERJA CRUD
// ============================================================
export const tenagaKerjaService = {
  async list(
    filters: PaginationParams & { search?: string } = {}
  ): Promise<PaginatedResponse<TenagaKerjaData>> {
    const { data: resp } = await api.get("/tenaga-kerja", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<TenagaKerjaData>(resp);
  },

  async detail(id: number): Promise<TenagaKerjaData> {
    const { data } = await api.get<ApiResponse<TenagaKerjaData>>(`/tenaga-kerja/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<TenagaKerjaData> {
    const { data } = await api.post<ApiResponse<TenagaKerjaData>>("/tenaga-kerja", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<TenagaKerjaData> {
    const { data } = await api.put<ApiResponse<TenagaKerjaData>>(`/tenaga-kerja/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/tenaga-kerja/${id}`);
  },
};

// ============================================================
// PRODUK HUKUM CRUD
// ============================================================
export const produkHukumService = {
  async list(
    filters: PaginationParams & { search?: string; category?: string } = {}
  ): Promise<PaginatedResponse<ProdukHukum>> {
    const { data: resp } = await api.get("/produk-hukum", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<ProdukHukum>(resp);
  },

  async detail(id: number): Promise<ProdukHukum> {
    const { data } = await api.get<ApiResponse<ProdukHukum>>(`/produk-hukum/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<ProdukHukum> {
    const { data } = await api.post<ApiResponse<ProdukHukum>>("/produk-hukum", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<ProdukHukum> {
    const { data } = await api.put<ApiResponse<ProdukHukum>>(`/produk-hukum/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/produk-hukum/${id}`);
  },
};

// ============================================================
// POTENSI EKONOMI / STATISTIK CRUD
// ============================================================
export const potensiEkonomiService = {
  async list(
    filters: PaginationParams & { search?: string; year?: number } = {}
  ): Promise<PaginatedResponse<PotensiEkonomi>> {
    const { data: resp } = await api.get("/statistik", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<PotensiEkonomi>(resp);
  },

  async detail(id: number): Promise<PotensiEkonomi> {
    const { data } = await api.get<ApiResponse<PotensiEkonomi>>(`/statistik/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<PotensiEkonomi> {
    const { data } = await api.post<ApiResponse<PotensiEkonomi>>("/statistik", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<PotensiEkonomi> {
    const { data } = await api.put<ApiResponse<PotensiEkonomi>>(`/statistik/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/statistik/${id}`);
  },
};

// ============================================================
// PPID CRUD
// ============================================================
export const ppidService = {
  async list(
    filters: PaginationParams & { search?: string; section?: string } = {}
  ): Promise<PaginatedResponse<PPID>> {
    const { data: resp } = await api.get("/ppid", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<PPID>(resp);
  },

  async detail(id: number): Promise<PPID> {
    const { data } = await api.get<ApiResponse<PPID>>(`/ppid/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<PPID> {
    const { data } = await api.post<ApiResponse<PPID>>("/ppid", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<PPID> {
    const { data } = await api.put<ApiResponse<PPID>>(`/ppid/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/ppid/${id}`);
  },
};

// ============================================================
// PROFIL PIMPINAN CRUD
// ============================================================
export const profilPimpinanService = {
  async list(
    filters: PaginationParams & { search?: string } = {}
  ): Promise<PaginatedResponse<ProfilPimpinan>> {
    const { data: resp } = await api.get("/profil/pimpinan", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<ProfilPimpinan>(resp);
  },

  async detail(id: number): Promise<ProfilPimpinan> {
    const { data } = await api.get<ApiResponse<ProfilPimpinan>>(`/profil/pimpinan/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<ProfilPimpinan> {
    const { data } = await api.post<ApiResponse<ProfilPimpinan>>("/profil/pimpinan", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<ProfilPimpinan> {
    const { data } = await api.put<ApiResponse<ProfilPimpinan>>(`/profil/pimpinan/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/profil/pimpinan/${id}`);
  },
};

// ============================================================
// REFORMASI BIROKRASI CRUD
// ============================================================
export const reformasiBirokrasiService = {
  async list(
    filters: PaginationParams & { search?: string } = {}
  ): Promise<PaginatedResponse<ReformasiBirokrasi>> {
    const { data: resp } = await api.get("/reformasi-birokrasi", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<ReformasiBirokrasi>(resp);
  },

  async detail(id: number): Promise<ReformasiBirokrasi> {
    const { data } = await api.get<ApiResponse<ReformasiBirokrasi>>(`/reformasi-birokrasi/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<ReformasiBirokrasi> {
    const { data } = await api.post<ApiResponse<ReformasiBirokrasi>>("/reformasi-birokrasi", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<ReformasiBirokrasi> {
    const { data } = await api.put<ApiResponse<ReformasiBirokrasi>>(`/reformasi-birokrasi/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/reformasi-birokrasi/${id}`);
  },
};

// ============================================================
// REALISASI ANGGARAN CRUD
// ============================================================
export const realisasiAnggaranService = {
  async list(
    filters: PaginationParams & { search?: string; tahun?: number } = {}
  ): Promise<PaginatedResponse<RealisasiAnggaran>> {
    const { data: resp } = await api.get("/realisasi-anggaran", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<RealisasiAnggaran>(resp);
  },

  async detail(id: number): Promise<RealisasiAnggaran> {
    const { data } = await api.get<ApiResponse<RealisasiAnggaran>>(`/realisasi-anggaran/${id}`);
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<RealisasiAnggaran> {
    const { data } = await api.post<ApiResponse<RealisasiAnggaran>>("/realisasi-anggaran", payload);
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<RealisasiAnggaran> {
    const { data } = await api.put<ApiResponse<RealisasiAnggaran>>(`/realisasi-anggaran/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/realisasi-anggaran/${id}`);
  },
};
