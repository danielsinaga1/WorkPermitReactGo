import api, { buildParams, toPaginatedResponse } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserRole,
  PaginationParams,
} from "../types";

export const adminUserService = {
  /**
   * List all users (admin only).
   */
  async list(
    filters: PaginationParams & { role?: UserRole; search?: string } = {}
  ): Promise<PaginatedResponse<User>> {
    const { data: resp } = await api.get("/admin/users", {
      params: buildParams(filters as Record<string, unknown>),
    });
    return toPaginatedResponse<User>(resp);
  },

  /**
   * Get single user detail.
   */
  async detail(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return data.data;
  },

  /**
   * Create a new user.
   */
  async create(payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    nik?: string;
    no_telp?: string;
    alamat?: string;
  }): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(
      "/admin/users",
      payload
    );
    return data.data;
  },

  /**
   * Update user.
   */
  async update(
    id: string,
    payload: Partial<{
      name: string;
      email: string;
      role: UserRole;
      is_active: boolean;
      nik: string;
      no_telp: string;
      alamat: string;
    }>
  ): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(
      `/admin/users/${id}`,
      payload
    );
    return data.data;
  },

  /**
   * Delete user.
   */
  async destroy(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};
