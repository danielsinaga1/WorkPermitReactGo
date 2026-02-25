import api, { buildParams, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  Berita,
  Pengumuman,
  Banner,
  PaginationParams,
} from "../types";

// ============================================================
// BERITA CRUD
// ============================================================
export const beritaService = {
  async list(
    filters: PaginationParams & { search?: string; start_date?: string; end_date?: string } = {}
  ): Promise<PaginatedResponse<Berita>> {
    const { data: resp } = await api.get("/berita", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Berita>(resp);
  },

  async detail(id: number): Promise<Berita> {
    const { data } = await api.get<ApiResponse<Berita>>(`/berita/${id}`);
    return data.data;
  },

  async create(payload: {
    title: string;
    content: string;
    date: string;
    thumbnail: string;
    images?: string[];
    descriptions?: string[];
    is_published?: boolean;
  }): Promise<Berita> {
    const { data } = await api.post<ApiResponse<Berita>>("/berita", payload);
    return data.data;
  },

  async update(
    id: number,
    payload: Partial<{
      title: string;
      content: string;
      date: string;
      thumbnail: string;
      images: string[];
      descriptions: string[];
      is_published: boolean;
    }>
  ): Promise<Berita> {
    const { data } = await api.put<ApiResponse<Berita>>(`/berita/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/berita/${id}`);
  },
};

// ============================================================
// PENGUMUMAN CRUD
// ============================================================
export const pengumumanService = {
  async list(
    filters: PaginationParams & { search?: string; start_date?: string; end_date?: string } = {}
  ): Promise<PaginatedResponse<Pengumuman>> {
    const { data: resp } = await api.get("/pengumuman", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pengumuman>(resp);
  },

  async detail(id: number): Promise<Pengumuman> {
    const { data } = await api.get<ApiResponse<Pengumuman>>(`/pengumuman/${id}`);
    return data.data;
  },

  async create(payload: {
    title: string;
    content: string;
    date: string;
    thumbnail: string;
    is_published?: boolean;
  }): Promise<Pengumuman> {
    const { data } = await api.post<ApiResponse<Pengumuman>>("/pengumuman", payload);
    return data.data;
  },

  async update(
    id: number,
    payload: Partial<{
      title: string;
      content: string;
      date: string;
      thumbnail: string;
      is_published: boolean;
    }>
  ): Promise<Pengumuman> {
    const { data } = await api.put<ApiResponse<Pengumuman>>(`/pengumuman/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/pengumuman/${id}`);
  },
};

// ============================================================
// BANNER CRUD
// ============================================================
export const bannerService = {
  async list(params?: { all?: string }): Promise<Banner[]> {
    const { data } = await api.get<ApiResponse<Banner[]>>("/banner", {
      params: params || { all: "true" },
    });
    return data.data;
  },

  async detail(id: number): Promise<Banner> {
    const { data } = await api.get<ApiResponse<Banner>>(`/banner/${id}`);
    return data.data;
  },

  async create(payload: {
    title: string;
    description?: string;
    image_url: string;
    link_url?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<Banner> {
    const { data } = await api.post<ApiResponse<Banner>>("/banner", payload);
    return data.data;
  },

  async update(
    id: number,
    payload: Partial<{
      title: string;
      description: string;
      image_url: string;
      link_url: string;
      order: number;
      is_active: boolean;
    }>
  ): Promise<Banner> {
    const { data } = await api.put<ApiResponse<Banner>>(`/banner/${id}`, payload);
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/banner/${id}`);
  },
};
