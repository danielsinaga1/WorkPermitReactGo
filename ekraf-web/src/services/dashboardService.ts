import api from "./api";
import type {
  ApiResponse,
  DashboardPublik,
  DashboardEksekutif,
  DashboardRetribusi,
  DashboardOKP,
  DashboardWisata,
} from "../types";

export const dashboardService = {
  /**
   * Public dashboard stats — no auth required.
   */
  async publik(): Promise<DashboardPublik> {
    const { data } = await api.get<ApiResponse<DashboardPublik>>(
      "/dashboard-publik"
    );
    return data.data;
  },

  /**
   * Executive dashboard — admin only.
   */
  async eksekutif(params: {
    bulan?: number;
    tahun?: number;
  } = {}): Promise<DashboardEksekutif> {
    const { data } = await api.get<ApiResponse<DashboardEksekutif>>(
      "/admin/dashboard/eksekutif",
      { params }
    );
    return data.data;
  },

  /**
   * Retribusi sub-dashboard — admin only.
   */
  async retribusi(params: { tahun?: number } = {}): Promise<DashboardRetribusi> {
    const { data } = await api.get<ApiResponse<DashboardRetribusi>>(
      "/admin/dashboard/retribusi",
      { params }
    );
    return data.data;
  },

  /**
   * OKP sub-dashboard — admin only.
   */
  async okp(): Promise<DashboardOKP> {
    const { data } = await api.get<ApiResponse<DashboardOKP>>(
      "/admin/dashboard/okp"
    );
    return data.data;
  },

  /**
   * Wisata sub-dashboard — admin only.
   */
  async wisata(params: { tahun?: number } = {}): Promise<DashboardWisata> {
    const { data } = await api.get<ApiResponse<DashboardWisata>>(
      "/admin/dashboard/wisata",
      { params }
    );
    return data.data;
  },
};
