// "use server";

import {
  deleteAllCookies,
  getAccessToken,
  getCSRFToken,
  getRefreshToken,
  getSessionId,
  setAccessToken,
  setAuthCookies,
} from "@/lib/auth";
import { AddOperatorForm, AddUserForm } from "@/lib/model";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",

  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  responseType: "json",
  decompress: true,
  withCredentials: true,
});
const refreshApi = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}); // THIS IS TO AVOID INFINITE REFRESH LOOP
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      error.response?.data?.detail !== "Invalid credentials "
    ) {
      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();
      console.log(refreshToken, "token refreshed");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await refreshApi.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access_token}`,
        };
        console.log(data, "entered");

        await setAccessToken(data.access_token, data.access_expiry);

        return api(originalRequest); // retry original request
      } catch (refreshError) {
        window.location.href = "/login";
        console.log(refreshError, "here is the error");
        return Promise.reject(refreshError);
      }
    } else {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    const csrf_token = await getCSRFToken();
    console.log(csrf_token, "csrf token here");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (csrf_token) {
      console.log(csrf_token, "csrf token");
      config.headers["x-csrf-token"] = csrf_token;
    }
    console.log("[API Request]", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (
    identifier: string,
    password: string,
    remember: boolean
    // portal: string
  ) => {
    const response = await api.post("/auth/login", {
      identifier,
      password,
      remember,
      // portal,
    });
    console.log(response);
    return response.data;
  },
  logout: async () => {
    try {
      const session_id = await getSessionId();
      const refresh_token = await getRefreshToken();

      const response = await api.post("/user/me/sessions/logout", {
        refresh_token,
        session_id,
      });
      await deleteAllCookies();
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      window.location.href = "/login";
    }
  },
  whoAmI: async () => {
    const response = await api.get(`/user/me`);
    return response.data;
  },
  forgotPassword: async (identifier: string) => {
    let response = null;
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(identifier)) {
      response = await api.post("/auth/forgot-password", {
        email: identifier,
      });
    } else {
      response = await api.post("/auth/forgot-password", {
        phone: identifier,
      });
    }
    return response.data;
  },
};
export const sessionMgmt = {
  getAllSession: async () => {
    const response = await api.get(`/user/me/sessions`);
    return response.data;
  },
  revokeAllSession: async () => {
    const response = await api.post(`/user/me/sessions/revoke-all`);
    return response.data;
  },
  revokeOtherSession: async () => {
    const response = await api.post("/user/me/sessions/revoke-others");
    return response.data;
  },
};
export const superAdminApi = {
  /**
   *
   * This are the operator operation below
   */
  addOperator: async (body: AddOperatorForm) => {
    const response = await api.post("/admin/operators", body);
    return response.data;
  },
  getOperator: async () => {
    const response = await api.get("/admin/operators");
    return response.data;
  },
  viewOperatorDetail: async (id: string) => {
    const response = await api.get(`/admin/operators/${id}`);
    return response.data;
  },
  deleteOperator: async (id: string) => {
    const response = await api.delete(`/admin/operators/${id}`);
    return response.data;
  },
  /**
   * This is the user operation below
   */
  getUsers: async () => {
    try {
      const response = await api.get(`/admin/users`);
      return response.data;
    } catch (error) {
      console.log(error, "error from getUsers func");
    }
  },
  addUser: async (body: AddUserForm) => {
    const response = await api.post(`/admin/users`, body);
    return response.data;
  },
  assignOperatorToUser: async (operatorId: string, userId: string) => {
    const response = await api.post(
      `/admin/operators/${operatorId}/users/${userId}`
    );
    return response.data;
  },
  unassignOperatorToUser: async (operatorId: string, userId: string) => {
    const response = await api.delete(
      `/admin/operators/${operatorId}/users/${userId}`
    );
    return response.data;
  },

  assignRole: async (id: string, role_identifier: string) => {
    const response = await api.post(`/admin/users/${role_identifier}/users`, {
      users: [id],
    });
    return response.data;
  },
  disableUser: async (id: string, reason: string) => {
    const response = await api.post(`/admin/users/${id}/disable`, {
      disabled_reason: reason,
    });
    return response.data;
  },
  enableUser: async (id: string) => {
    const response = await api.post(`/admin/users/${id}/enable`);
    return response.data;
  },
};

export default api;
