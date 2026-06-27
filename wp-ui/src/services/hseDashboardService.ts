import api, { buildParams } from "./api";
import type { ApiResponse } from "../types";
import type {
  DashboardOverview,
  LeadingIndicatorsResponse,
  TrendDataPoint,
  ReportExport,
} from "../types/workPermitTypes";

const WP = "/wp";

// ============================================================
// HSE DASHBOARD & ANALYTICS
// ============================================================
export const hseDashboardService = {
  /**
   * Full dashboard overview — aggregated stats across all modules.
   */
  async overview(params: Record<string, unknown> = {}): Promise<DashboardOverview> {
    const { data } = await api.get<ApiResponse<DashboardOverview>>(`${WP}/dashboard/overview`, {
      params: buildParams(params),
    });
    return data.data;
  },

  /**
   * Safety Leading Indicators with risk prediction & recommendations.
   */
  async leadingIndicators(params: Record<string, unknown> = {}): Promise<LeadingIndicatorsResponse> {
    const { data } = await api.get<ApiResponse<LeadingIndicatorsResponse>>(
      `${WP}/dashboard/leading-indicators`,
      { params: buildParams(params) }
    );
    return data.data;
  },

  /**
   * Trend analytics — monthly data points for charting.
   */
  async trends(params: { months?: number } = {}): Promise<TrendDataPoint[]> {
    const { data } = await api.get<ApiResponse<TrendDataPoint[]>>(`${WP}/dashboard/trends`, {
      params: buildParams(params as Record<string, unknown>),
    });
    return data.data;
  },

  /**
   * Request a report export (PDF / Excel / CSV). Returns queued job.
   */
  async exportReport(payload: {
    report_type: string;
    format: "pdf" | "excel" | "csv";
    parameters?: Record<string, unknown>;
  }): Promise<ReportExport> {
    const { data } = await api.post<ApiResponse<ReportExport>>(`${WP}/dashboard/export`, payload);
    return data.data;
  },

  /**
   * Check status of a previously-queued export job.
   */
  async exportStatus(id: number): Promise<ReportExport> {
    const { data } = await api.get<ApiResponse<ReportExport>>(`${WP}/dashboard/export/${id}`);
    return data.data;
  },
};
