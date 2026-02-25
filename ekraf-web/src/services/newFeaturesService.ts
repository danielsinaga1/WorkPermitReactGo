import api, { buildParams, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  YouthOpportunity,
  YouthFilters,
  Atlet,
  Pelatih,
  SimporaFilters,
  Turnamen,
  PesertaTurnamen,
  TurnamenFilters,
  PelakuEkraf,
  PelakuEkrafFilters,
  Haki,
  HakiFilters,
  Pengaduan,
  PengaduanPayload,
  PengaduanFilters,
} from "../types";

// ============================================================
// YOUTH OPPORTUNITY SERVICE (PUBLIC)
// ============================================================
export const youthOpportunityService = {
  async list(
    filters: YouthFilters = {}
  ): Promise<PaginatedResponse<YouthOpportunity>> {
    const { data: resp } = await api.get("/youth-opportunity", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<YouthOpportunity>(resp);
  },

  async detail(id: number): Promise<YouthOpportunity> {
    const { data } = await api.get<ApiResponse<YouthOpportunity>>(
      `/youth-opportunity/${id}`
    );
    return data.data;
  },
};

// ============================================================
// SIMPORA SERVICE (PUBLIC)
// ============================================================
export const atletService = {
  async list(filters: SimporaFilters = {}): Promise<PaginatedResponse<Atlet>> {
    const { data: resp } = await api.get("/atlet", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Atlet>(resp);
  },

  async detail(id: number): Promise<Atlet> {
    const { data } = await api.get<ApiResponse<Atlet>>(`/atlet/${id}`);
    return data.data;
  },
};

export const pelatihService = {
  async list(
    filters: SimporaFilters = {}
  ): Promise<PaginatedResponse<Pelatih>> {
    const { data: resp } = await api.get("/pelatih", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pelatih>(resp);
  },

  async detail(id: number): Promise<Pelatih> {
    const { data } = await api.get<ApiResponse<Pelatih>>(`/pelatih/${id}`);
    return data.data;
  },
};

// ============================================================
// TURNAMEN SERVICE (PUBLIC)
// ============================================================
export const turnamenService = {
  async list(
    filters: TurnamenFilters = {}
  ): Promise<PaginatedResponse<Turnamen>> {
    const { data: resp } = await api.get("/turnamen", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Turnamen>(resp);
  },

  async detail(id: number): Promise<Turnamen> {
    const { data } = await api.get<ApiResponse<Turnamen>>(`/turnamen/${id}`);
    return data.data;
  },

  async daftar(
    turnamenId: number,
    payload: {
      nama_peserta: string;
      nama_tim?: string;
      no_telp?: string;
      email?: string;
    }
  ): Promise<PesertaTurnamen> {
    const { data } = await api.post<ApiResponse<PesertaTurnamen>>(
      `/turnamen/${turnamenId}/daftar`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// PENGADUAN SERVICE (PUBLIC)
// ============================================================
export const pengaduanService = {
  async submit(payload: PengaduanPayload): Promise<Pengaduan> {
    const { data } = await api.post<ApiResponse<Pengaduan>>(
      "/pengaduan",
      payload
    );
    return data.data;
  },

  async track(kode: string): Promise<Pengaduan> {
    const { data } = await api.get<ApiResponse<Pengaduan>>(
      `/pengaduan/track/${kode}`
    );
    return data.data;
  },
};

// ============================================================
// ADMIN SERVICES
// ============================================================

export const adminYouthService = {
  async list(
    filters: YouthFilters = {}
  ): Promise<PaginatedResponse<YouthOpportunity>> {
    const { data: resp } = await api.get("/admin/youth-opportunity", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<YouthOpportunity>(resp);
  },

  async create(
    payload: Partial<YouthOpportunity>
  ): Promise<YouthOpportunity> {
    const { data } = await api.post<ApiResponse<YouthOpportunity>>(
      "/admin/youth-opportunity",
      payload
    );
    return data.data;
  },

  async update(
    id: number,
    payload: Partial<YouthOpportunity>
  ): Promise<YouthOpportunity> {
    const { data } = await api.put<ApiResponse<YouthOpportunity>>(
      `/admin/youth-opportunity/${id}`,
      payload
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/youth-opportunity/${id}`);
  },
};

export const adminAtletService = {
  async list(filters: SimporaFilters = {}): Promise<PaginatedResponse<Atlet>> {
    const { data: resp } = await api.get("/admin/atlet", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Atlet>(resp);
  },

  async create(payload: Partial<Atlet>): Promise<Atlet> {
    const { data } = await api.post<ApiResponse<Atlet>>(
      "/admin/atlet",
      payload
    );
    return data.data;
  },

  async update(id: number, payload: Partial<Atlet>): Promise<Atlet> {
    const { data } = await api.put<ApiResponse<Atlet>>(
      `/admin/atlet/${id}`,
      payload
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/atlet/${id}`);
  },
};

export const adminPelatihService = {
  async list(
    filters: SimporaFilters = {}
  ): Promise<PaginatedResponse<Pelatih>> {
    const { data: resp } = await api.get("/admin/pelatih", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pelatih>(resp);
  },

  async create(payload: Partial<Pelatih>): Promise<Pelatih> {
    const { data } = await api.post<ApiResponse<Pelatih>>(
      "/admin/pelatih",
      payload
    );
    return data.data;
  },

  async update(id: number, payload: Partial<Pelatih>): Promise<Pelatih> {
    const { data } = await api.put<ApiResponse<Pelatih>>(
      `/admin/pelatih/${id}`,
      payload
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/pelatih/${id}`);
  },
};

export const adminTurnamenService = {
  async list(
    filters: TurnamenFilters = {}
  ): Promise<PaginatedResponse<Turnamen>> {
    const { data: resp } = await api.get("/admin/turnamen", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Turnamen>(resp);
  },

  async create(payload: Partial<Turnamen>): Promise<Turnamen> {
    const { data } = await api.post<ApiResponse<Turnamen>>(
      "/admin/turnamen",
      payload
    );
    return data.data;
  },

  async update(id: number, payload: Partial<Turnamen>): Promise<Turnamen> {
    const { data } = await api.put<ApiResponse<Turnamen>>(
      `/admin/turnamen/${id}`,
      payload
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/turnamen/${id}`);
  },

  async peserta(turnamenId: number): Promise<PesertaTurnamen[]> {
    const { data } = await api.get<ApiResponse<PesertaTurnamen[]>>(
      `/admin/turnamen/${turnamenId}/peserta`
    );
    return data.data;
  },
};

export const adminPelakuEkrafService = {
  async list(
    filters: PelakuEkrafFilters = {}
  ): Promise<PaginatedResponse<PelakuEkraf>> {
    const { data: resp } = await api.get("/admin/pelaku-ekraf", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<PelakuEkraf>(resp);
  },

  async create(payload: Partial<PelakuEkraf>): Promise<PelakuEkraf> {
    const { data } = await api.post<ApiResponse<PelakuEkraf>>(
      "/admin/pelaku-ekraf",
      payload
    );
    return data.data;
  },

  async update(
    id: number,
    payload: Partial<PelakuEkraf>
  ): Promise<PelakuEkraf> {
    const { data } = await api.put<ApiResponse<PelakuEkraf>>(
      `/admin/pelaku-ekraf/${id}`,
      payload
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/pelaku-ekraf/${id}`);
  },

  async verifikasi(
    id: number,
    payload: { status: string; catatan_verifikasi?: string }
  ): Promise<PelakuEkraf> {
    const { data } = await api.put<ApiResponse<PelakuEkraf>>(
      `/admin/pelaku-ekraf/${id}/verifikasi`,
      payload
    );
    return data.data;
  },
};

export const adminHakiService = {
  async list(filters: HakiFilters = {}): Promise<PaginatedResponse<Haki>> {
    const { data: resp } = await api.get("/admin/haki", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Haki>(resp);
  },

  async create(payload: Partial<Haki>): Promise<Haki> {
    const { data } = await api.post<ApiResponse<Haki>>(
      "/admin/haki",
      payload
    );
    return data.data;
  },

  async update(id: number, payload: Partial<Haki>): Promise<Haki> {
    const { data } = await api.put<ApiResponse<Haki>>(
      `/admin/haki/${id}`,
      payload
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/haki/${id}`);
  },
};

export const adminPengaduanService = {
  async list(
    filters: PengaduanFilters = {}
  ): Promise<PaginatedResponse<Pengaduan>> {
    const { data: resp } = await api.get("/admin/pengaduan", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Pengaduan>(resp);
  },

  async tanggapi(
    id: number,
    payload: { status: string; tanggapan?: string }
  ): Promise<Pengaduan> {
    const { data } = await api.put<ApiResponse<Pengaduan>>(
      `/admin/pengaduan/${id}/tanggapi`,
      payload
    );
    return data.data;
  },
};
