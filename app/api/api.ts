// "use server";

import {
  getAccessToken,
  getRefreshToken,
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
    "x-csrf-token": "hUDnfKGgyUBjxuq2KLroxT4J-Ian9UFR12YwGwhnWDA",
  },

  responseType: "json",
  decompress: true,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // descern between every 401 errors

    if (error.response.status === 401 && !originalRequest._retry) {
      if (error.response.data.detail == "Invalid credentials ") return;

      const refreshToken = await getRefreshToken();

      originalRequest._retry = true;
      console.log("Token expired! " + error);
      const { data } = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      console.log(data, "from /auth/refresh");

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.access_token}`,
      };
      // setAuthCookies(data);
      await setAccessToken(data.access_token, data.access_expiry);

      // Cookies.set("access_token", data.access_token);
      // originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[API Request]", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("[API Response]", response.status, response.config.url);
    return response;
  },
  (error) => {
    const isAuthError = error.response?.status === 401;
    const isBrowser = typeof window !== "undefined";
    const pathname = isBrowser ? window.location.pathname : "";

    const isSafeToRedirect =
      pathname !== "/login" &&
      !pathname.startsWith("/.well-known") &&
      !pathname.match(/\.(js|json|css|map|ico|png|jpg|jpeg)$/);

    console.error("[API Error]", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (isAuthError && isBrowser && isSafeToRedirect) {
      console.warn("[API] Unauthorized - redirecting to login");
      // window.location.href = `/login?callbackUrl=${encodeURIComponent(
      //   pathname
      // )}`;
    }

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
  logout: async (session_id: string) => {
    const response = await api.post("/auth/logout", { session_id });
    return response.data;
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
    const response = await api.get(`/admin/users`);
    return response.data;
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
