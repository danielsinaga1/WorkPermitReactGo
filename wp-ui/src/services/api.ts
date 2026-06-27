import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// ============================================================
// REQUEST INTERCEPTOR — Attach JWT token
// ============================================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR — Handle 401 & token refresh
// ============================================================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're on the login page, don't try to refresh
      if (originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const newToken = data.data?.access_token || data.access_token;
        localStorage.setItem("access_token", newToken);

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ============================================================
// HELPERS
// ============================================================

/**
 * Map backend paginated response `{ data: T[], meta: { current_page, last_page, ... } }`
 * to the frontend PaginatedResponse<T> shape.
 *
 * The backend `paginatedResponse()` trait returns items in `data` and pagination
 * metadata in `meta`, wrapped by `ApiResponse`. After Axios unwrapping
 * (`{ data: resp } = await api.get(...)`) we get `resp = { success, data, meta }`.
 */
export function toPaginatedResponse<T>(resp: Record<string, unknown>): {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
} {
  const meta = (resp.meta ?? {}) as Record<string, unknown>;
  return {
    data: (resp.data ?? []) as T[],
    current_page: (meta.current_page ?? 1) as number,
    last_page: (meta.last_page ?? 1) as number,
    per_page: (meta.per_page ?? 10) as number,
    total: (meta.total ?? 0) as number,
    from: (meta.from ?? null) as number | null,
    to: (meta.to ?? null) as number | null,
  };
}

/**
 * Build query string from filter params, omitting undefined/null values.
 */
export function buildParams(
  params: Record<string, unknown>
): Record<string, string> {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = String(value);
    }
  }
  return cleaned;
}

/**
 * Create a FormData object from a plain object, handling File fields.
 */
export function toFormData(
  obj: Record<string, unknown>,
  formData = new FormData(),
  parentKey = ""
): FormData {
  for (const [key, value] of Object.entries(obj)) {
    const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === undefined || value === null) continue;

    if (value instanceof File) {
      formData.append(fieldKey, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((file, i) => {
        formData.append(`${fieldKey}[${i}]`, file);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item instanceof File) {
          formData.append(`${fieldKey}[${i}]`, item);
        } else if (typeof item === "object") {
          toFormData(item as Record<string, unknown>, formData, `${fieldKey}[${i}]`);
        } else {
          formData.append(`${fieldKey}[${i}]`, String(item));
        }
      });
    } else if (typeof value === "object" && !(value instanceof Date)) {
      toFormData(value as Record<string, unknown>, formData, fieldKey);
    } else {
      formData.append(fieldKey, String(value));
    }
  }
  return formData;
}
