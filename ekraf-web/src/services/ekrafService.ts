import api, { buildParams, toFormData, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  KatalogProduk,
  KatalogFilters,
  Pelatihan,
  PelatihanFilters,
  EventFestival,
  EventFilters,
} from "../types";

// ============================================================
// PUBLIC — Katalog Produk
// ============================================================

export const katalogProdukService = {
  async list(
    filters: KatalogFilters = {}
  ): Promise<PaginatedResponse<KatalogProduk>> {
    const { data: resp } = await api.get("/katalog-produk", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<KatalogProduk>(resp);
  },

  async detail(id: number): Promise<KatalogProduk> {
    const { data } = await api.get<ApiResponse<KatalogProduk>>(
      `/katalog-produk/${id}`
    );
    return data.data;
  },
};

// ============================================================
// PUBLIC — Pelatihan
// ============================================================

export const pelatihanService = {
  async list(
    filters: PelatihanFilters = {}
  ): Promise<PaginatedResponse<Pelatihan>> {
    const { data: resp } = await api.get("/pelatihan", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pelatihan>(resp);
  },

  async detail(id: number): Promise<Pelatihan> {
    const { data } = await api.get<ApiResponse<Pelatihan>>(
      `/pelatihan/${id}`
    );
    return data.data;
  },
};

// ============================================================
// PUBLIC — Event & Festival
// ============================================================

export const eventFestivalService = {
  async list(
    filters: EventFilters = {}
  ): Promise<PaginatedResponse<EventFestival>> {
    const { data: resp } = await api.get("/event-festival", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<EventFestival>(resp);
  },

  async detail(id: number): Promise<EventFestival> {
    const { data } = await api.get<ApiResponse<EventFestival>>(
      `/event-festival/${id}`
    );
    return data.data;
  },
};

// ============================================================
// ADMIN — CRUD for Katalog, Pelatihan, Event
// ============================================================

export const adminEkrafService = {
  // ---- Admin Listing ----

  /**
   * List all katalog produk for admin (includes unverified).
   */
  async listKatalog(
    filters: KatalogFilters & { is_verified?: boolean } = {}
  ): Promise<PaginatedResponse<KatalogProduk>> {
    const { data: resp } = await api.get("/admin/katalog-produk", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<KatalogProduk>(resp);
  },

  /**
   * List all pelatihan for admin.
   */
  async listPelatihan(
    filters: PelatihanFilters = {}
  ): Promise<PaginatedResponse<Pelatihan>> {
    const { data: resp } = await api.get("/admin/pelatihan", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pelatihan>(resp);
  },

  /**
   * List all event/festival for admin.
   */
  async listEvent(
    filters: EventFilters = {}
  ): Promise<PaginatedResponse<EventFestival>> {
    const { data: resp } = await api.get("/admin/event-festival", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<EventFestival>(resp);
  },

  // ---- Katalog Produk ----
  async createKatalog(
    payload: Record<string, unknown>
  ): Promise<KatalogProduk> {
    const formData = toFormData(payload);
    const { data } = await api.post<ApiResponse<KatalogProduk>>(
      "/admin/katalog-produk",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async updateKatalog(
    id: number,
    payload: Record<string, unknown>
  ): Promise<KatalogProduk> {
    const formData = toFormData(payload);
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<KatalogProduk>>(
      `/admin/katalog-produk/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async destroyKatalog(id: number): Promise<void> {
    await api.delete(`/admin/katalog-produk/${id}`);
  },

  // ---- Pelatihan ----
  async createPelatihan(
    payload: Record<string, unknown>
  ): Promise<Pelatihan> {
    const formData = toFormData(payload);
    const { data } = await api.post<ApiResponse<Pelatihan>>(
      "/admin/pelatihan",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async updatePelatihan(
    id: number,
    payload: Record<string, unknown>
  ): Promise<Pelatihan> {
    const formData = toFormData(payload);
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Pelatihan>>(
      `/admin/pelatihan/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async destroyPelatihan(id: number): Promise<void> {
    await api.delete(`/admin/pelatihan/${id}`);
  },

  // ---- Event Festival ----
  async createEvent(
    payload: Record<string, unknown>
  ): Promise<EventFestival> {
    const formData = toFormData(payload);
    const { data } = await api.post<ApiResponse<EventFestival>>(
      "/admin/event-festival",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async updateEvent(
    id: number,
    payload: Record<string, unknown>
  ): Promise<EventFestival> {
    const formData = toFormData(payload);
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<EventFestival>>(
      `/admin/event-festival/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async destroyEvent(id: number): Promise<void> {
    await api.delete(`/admin/event-festival/${id}`);
  },
};
