import api, { buildParams } from "./api";
import type {
  ApiResponse,
  LoginPayload,
  LoginResponse,
  User,
} from "../types";

const AUTH_PREFIX = "/auth";

export const authService = {
  /**
   * Login with email & password → returns JWT token + user data.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/login`,
      payload
    );
    return data.data;
  },

  /**
   * Register a new masyarakat account.
   */
  async register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nik?: string;
    no_telp?: string;
  }): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/register`,
      payload
    );
    return data.data;
  },

  /**
   * Get authenticated user profile.
   */
  async me(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`${AUTH_PREFIX}/me`);
    return data.data;
  },

  /**
   * Logout (invalidate JWT).
   */
  async logout(): Promise<void> {
    await api.post(`${AUTH_PREFIX}/logout`);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  /**
   * Refresh token.
   */
  async refresh(): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/refresh`
    );
    return data.data;
  },

  /**
   * Change password (authenticated).
   */
  async changePassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await api.put(`${AUTH_PREFIX}/change-password`, payload);
  },

  /**
   * Update profile (authenticated).
   */
  async updateProfile(payload: {
    name?: string;
    nik?: string;
    no_telp?: string;
    alamat?: string;
  }): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(
      `${AUTH_PREFIX}/profile`,
      payload
    );
    return data.data;
  },

  // ---- Token helpers ----

  saveToken(token: string): void {
    localStorage.setItem("access_token", token);
  },

  getToken(): string | null {
    return localStorage.getItem("access_token");
  },

  saveUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser(): User | null {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};
