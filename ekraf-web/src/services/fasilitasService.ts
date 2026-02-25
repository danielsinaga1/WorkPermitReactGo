import api, { buildParams, toFormData, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  Fasilitas,
  FasilitasFilters,
  KetersediaanResponse,
  Booking,
  BookingPayload,
  BookingFilters,
} from "../types";

// ============================================================
// PUBLIC — Fasilitas
// ============================================================

export const fasilitasService = {
  /**
   * List fasilitas with optional filters (jenis, search, pagination).
   */
  async list(
    filters: FasilitasFilters = {}
  ): Promise<PaginatedResponse<Fasilitas>> {
    const { data: resp } = await api.get("/fasilitas", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Fasilitas>(resp);
  },

  /**
   * Get single fasilitas detail (includes tarifs & pengelola).
   */
  async detail(id: number): Promise<Fasilitas> {
    const { data } = await api.get<ApiResponse<Fasilitas>>(
      `/fasilitas/${id}`
    );
    return data.data;
  },

  /**
   * Check slot availability for a fasilitas in a date range.
   */
  async ketersediaan(
    id: number,
    tanggalMulai: string,
    tanggalSelesai: string
  ): Promise<KetersediaanResponse> {
    const { data } = await api.get<ApiResponse<KetersediaanResponse>>(
      `/fasilitas/${id}/ketersediaan`,
      { params: { tanggal_mulai: tanggalMulai, tanggal_selesai: tanggalSelesai } }
    );
    return data.data;
  },
};

// ============================================================
// AUTH — Booking
// ============================================================

export const bookingService = {
  /**
   * Create a new booking.
   */
  async create(payload: BookingPayload): Promise<Booking> {
    const { data } = await api.post<ApiResponse<Booking>>("/booking", payload);
    return data.data;
  },

  /**
   * Get booking history for authenticated user.
   */
  async riwayat(
    filters: BookingFilters = {}
  ): Promise<PaginatedResponse<Booking>> {
    const { data: resp } = await api.get("/booking/riwayat", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Booking>(resp);
  },

  /**
   * Get single booking detail.
   */
  async detail(id: number): Promise<Booking> {
    const { data } = await api.get<ApiResponse<Booking>>(`/booking/${id}`);
    return data.data;
  },

  /**
   * Upload payment proof (bukti bayar).
   */
  async uploadBukti(
    id: number,
    file: File,
    paymentMethod: string
  ): Promise<Booking> {
    const formData = new FormData();
    formData.append("bukti_bayar", file);
    formData.append("payment_method", paymentMethod);

    const { data } = await api.post<ApiResponse<Booking>>(
      `/booking/${id}/upload-bukti`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  /**
   * Cancel a booking.
   */
  async batal(id: number): Promise<void> {
    await api.delete(`/booking/${id}/batal`);
  },
};

// ============================================================
// ADMIN — Fasilitas CRUD
// ============================================================

export const adminFasilitasService = {
  /**
   * List all fasilitas for admin (includes inactive).
   */
  async list(
    filters: FasilitasFilters & { is_active?: boolean } = {}
  ): Promise<PaginatedResponse<Fasilitas>> {
    const { data: resp } = await api.get("/admin/fasilitas", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Fasilitas>(resp);
  },

  /**
   * Get admin fasilitas detail (includes all relations).
   */
  async detail(id: number): Promise<Fasilitas> {
    const { data } = await api.get<ApiResponse<Fasilitas>>(
      `/admin/fasilitas/${id}`
    );
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<Fasilitas> {
    const formData = toFormData(payload);
    const { data } = await api.post<ApiResponse<Fasilitas>>(
      "/admin/fasilitas",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async update(id: number, payload: Record<string, unknown>): Promise<Fasilitas> {
    const formData = toFormData(payload);
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Fasilitas>>(
      `/admin/fasilitas/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async destroy(id: number): Promise<void> {
    await api.delete(`/admin/fasilitas/${id}`);
  },

  async createSlot(
    fasilitasId: number,
    payload: {
      tanggal_mulai: string;
      tanggal_selesai: string;
      jam_mulai: string;
      jam_selesai: string;
      durasi_menit: number;
    }
  ): Promise<unknown> {
    const { data } = await api.post(
      `/admin/fasilitas/${fasilitasId}/slot`,
      payload
    );
    return data.data;
  },

  async createBlackout(
    fasilitasId: number,
    payload: { tanggal_mulai: string; tanggal_selesai: string; alasan?: string }
  ): Promise<unknown> {
    const { data } = await api.post(
      `/admin/fasilitas/${fasilitasId}/blackout`,
      payload
    );
    return data.data;
  },
};

// ============================================================
// ADMIN — Booking Management
// ============================================================

export const adminBookingService = {
  /**
   * List all bookings across all fasilitas (admin).
   */
  async listAll(
    filters: BookingFilters & { fasilitas_id?: number; search?: string } = {}
  ): Promise<PaginatedResponse<Booking>> {
    const { data: resp } = await api.get("/admin/booking", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<Booking>(resp);
  },

  async listByFasilitas(
    fasilitasId: number,
    filters: BookingFilters = {}
  ): Promise<PaginatedResponse<Booking>> {
    const { data: resp } = await api.get(
      `/admin/fasilitas/${fasilitasId}/bookings`,
      { params: buildParams(filters as Record<string, unknown>) },
    );
    return toPaginatedResponse<Booking>(resp);
  },

  async kalender(
    fasilitasId: number,
    tanggalMulai: string,
    tanggalSelesai: string
  ): Promise<Booking[]> {
    const { data } = await api.get<ApiResponse<Booking[]>>(
      `/admin/fasilitas/${fasilitasId}/kalender`,
      { params: { tanggal_mulai: tanggalMulai, tanggal_selesai: tanggalSelesai } }
    );
    return data.data;
  },

  async verifikasi(
    bookingId: number,
    payload: { status: "terverifikasi" | "ditolak"; catatan?: string }
  ): Promise<Booking> {
    const { data } = await api.put<ApiResponse<Booking>>(
      `/admin/booking/${bookingId}/verifikasi`,
      payload
    );
    return data.data;
  },

  async laporanRetribusi(params: {
    bulan?: number;
    tahun?: number;
  }): Promise<unknown> {
    const { data } = await api.get("/admin/retribusi/laporan", {
      params: buildParams(params as Record<string, unknown>),
    });
    return data.data;
  },
};
