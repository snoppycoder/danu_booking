// "use server";

import { UpdateAgentDto } from "@/components/UpdateAgentForm";
import {
  deleteAllCookies,
  getAccessToken,
  getCSRFToken,
  getRefreshToken,
  getSessionId,
} from "@/lib/auth";
import { getClientToken } from "@/lib/common_functions";
import {
  AddOperatorForm,
  AddUserForm,
  Agent,
  Bus,
  Passenger,
} from "@/lib/model";
import axios from "axios";

const api = axios.create({
  // baseURL: "/api/proxy",
  baseURL: `https://danu.biisho.et/api/v1`,

  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    // "Content-Type": "application/json",
    Accept: "application/json",
  },

  responseType: "json",
  decompress: true,
  withCredentials: true,
});
const refreshApi = axios.create({
  // baseURL: "/api/proxy",
  baseURL: `https://danu.biisho.et/api/v1`,

  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    // "Content-Type": "application/json",
    Accept: "application/json",
  },

  responseType: "json",
  decompress: true,
  withCredentials: true,
});

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

  return match ? match[2] : null;
};

const api_webhook = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  baseURL: "https://chapa-webhook-bisho.onrender.com",
  // baseURL: "http://localhost:8000",
});
// --- Refresh Token Concurrency Management ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const publicPath = ["/login", "/signup", "/verify"];

    if (error.response) {
      const status = error.response.status ?? "";
      const data = error.response.data ?? "";
      const code = data.code ?? "";
      const detail = data.detail ?? "";

      if (!publicPath.includes(window.location.pathname)) {
        console.log(detail, "error detail from response interceptor");

        if (
          detail &&
          typeof detail === "string" &&
          detail?.includes("revoked")
        ) {
          await deleteAllCookies();
          console.error("Session revoked — clearing cookies and redirecting");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        if (status === 401) {
          console.log("........................\n");
          console.log(detail);
          console.log("........................\n");
          switch (detail) {
            case "Not authenticated":
              window.location.href = "/login";
              break;

            case "ACCESS_TOKEN_EXPIRED":
              if (!originalRequest._retry) {
                if (isRefreshing) {
                  // If already refreshing, put this request in a queue
                  return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                  })
                    .then((token) => {
                      originalRequest.headers.Authorization = `Bearer ${token}`;
                      return api(originalRequest);
                    })
                    .catch((err) => {
                      return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                  console.log("\n\nTRYING TO REFRESH\n\n");
                  // Call your refresh endpoint
                  const refreshResponse = await authAPI.refresh();
                  console.log("REFRESH RESPONSE", refreshResponse);
                  processQueue(null, refreshResponse?.token);

                  // Retry the original failed request
                  return api(originalRequest);
                } catch (refreshError) {
                  console.log("Error occured while trying to refresh");
                  processQueue(refreshError, null);
                  await deleteAllCookies();
                  window.location.href = "/login";
                  return Promise.reject(refreshError);
                } finally {
                  // Reset the lock
                  isRefreshing = false;
                }
              }
              break;

            // ---------------------------------------------------------
            // Keep your existing cases below
            // ---------------------------------------------------------
            case "CSRF_MISSING":
            case "CSRF_INVALID":
              if (!originalRequest._retry) {
                originalRequest._retry = true;
                return api(originalRequest);
              }
              console.error(`${code}: Forcing re-login`);
              window.location.href = "/login";
              break;

            case "CSRF_EXPIRED":
            case "REFRESH_REUSED":
            case "REFRESH_EXPIRED":
            case "REFRESH_INVALID":
            case "SESSION_INVALID":
            case "USER_NOT_FOUND":
              console.error(
                `${detail} detected — clearing state and redirecting`,
              );
              localStorage.clear();
              sessionStorage.clear();
              await deleteAllCookies(); // Good idea to clear cookies on these fatal errors too
              window.location.href = "/login";
              break;

            default:
              console.log("default 401 handler");
              // window.location.href = "/login";
              break;
          }
        } else if (status === 403) {
          console.log("403 Forbidden Error", error);
          throw error;
        }
      }
    }
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const csrf = getCookie("csrf_token");
    if (!csrf) {
      getCSRFToken().then((csrfToken) => {
        if (csrfToken) {
          config.headers["x-csrf-token"] = csrfToken;
        }
      });
    }

    if (csrf) {
      config.headers["X-CSRF-Token"] = csrf;
    }

    console.log("[API Request]", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);
export const publicApi = {
  verifyTicketToken: async (token: string) => {
    const response = await api.get(`/guest/tickets/verify/${token}`);
    return response.data as {
      success: boolean;
      message: string;
      data?: any;
    };
  },
};

export const tempAPI = {
  payment: async (body: {
    amount: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;

    hold_id: string;
  }) => {
    const response = await api_webhook.post("/payment", body);
    console.log(response.data);
    return response.data;
  },
};
export const kycApi = {
  operatorUploadKyc: async (
    body: {
      document_name: string;
      document_type: string;
      file: File;
    },
    operator_id: string,
  ) => {
    try {
      const formData = new FormData();

      formData.append("document_name", body.document_name);
      formData.append("document_type", body.document_type);
      formData.append("file", body.file!);

      console.log("Uploading KYC document with data:", {
        document_name: body.document_name,
        document_type: body.document_type,
        file: body.file.name,
        operator_id,
      });
      const response = await api.post(
        `/operator/${operator_id}/kyc-documents`,
        formData,
      );

      return response.data;
    } catch (error) {
      console.error("KYC upload failed:", error);
      throw error;
    }
  },
  agentUploadKyc: async (
    body: {
      document_name: string;
      document_type: string;
      file: File;
    },
    agent_id: string,
  ) => {
    try {
      const formData = new FormData();

      formData.append("document_name", body.document_name);
      formData.append("document_type", body.document_type);
      formData.append("file", body.file!);

      console.log("Uploading KYC document with data:", {
        document_name: body.document_name,
        document_type: body.document_type,
        file: body.file.name,
        agent_id,
      });
      const response = await api.post(
        `/agent/${agent_id}/kyc-documents`,
        formData,
      );

      return response.data;
    } catch (error) {
      console.error("KYC upload failed:", error);
      throw error;
    }
  },
};

export const authAPI = {
  resetPassword: async (
    flow: "email" | "phone",
    new_password: string,
    token?: string,
    phone?: string,
    code?: string,
  ) => {
    let payload = null;
    if (flow == "email") {
      payload = {
        token,
        new_password,
      };
    } else {
      payload = { phone, code, new_password };
    }
    const res = await api.post("/auth/reset-password", payload);
    return res.data;
  },
  signup: async (body: {
    first_name: string;
    last_name: string;
    email?: string | null;
    phone: string;
    password: string; // need attention
  }) => {
    try {
      const payload = { ...body };
      if (!payload.email || payload.email.trim().length === 0) {
        delete payload.email;
      }
      const response = await api.post("/auth/register", payload);

      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  login: async (
    identifier: string,
    password: string,
    remember: boolean,
    // portal: string
  ) => {
    try {
      const response = await api.post("/auth/login", {
        identifier,
        password,
        remember,
        // portal,
      });

      return response?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  verifyPhone: async (phone: string, code: string) => {
    try {
      const response = await api.post(`/auth/verify-phone`, {
        phone,
        code,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  resendEmailVerification: async (email: string) => {
    try {
      const response = await api.post(`/auth/resend-email-verification`, {
        email,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  refresh: async () => {
    try {
      const response = await refreshApi.post(`/auth/refresh`, {});
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const session_id = await getSessionId();
      const refresh_token = await getRefreshToken();
      const csrf_token = await getCSRFToken();
      console.log(
        "Logging out with session_id:",
        session_id,
        "and refresh_token:",
        refresh_token,
        "and csrf_token:",
        csrf_token,
      );
      await api.post(
        "/user/me/sessions/logout",
        {
          refresh_token,
          session_id,
        },
        {
          headers: {
            "x-csrf-token": csrf_token,
          },
        },
      );
      await deleteAllCookies();
    } catch (error) {
      await deleteAllCookies();
      console.log(error);
    } finally {
      window.location.replace("/login");
    }
  },
  whoAmI: async () => {
    const response = await api.get(`/user/me`);
    return response.data;
  },
  forgotPassword: async (identifier: string) => {
    try {
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
export const sessionMgmt = {
  getAllSession: async () => {
    const response = await api.get(`/user/me/sessions`);
    return response.data;
  },
  revokeAllSession: async () => {
    const csrf_token = await getCSRFToken();
    console.log(csrf_token);
    const response = await api.post(`/user/me/sessions/revoke-all`, {
      // headers: {
      //   "x-csrf-token": csrf_token,
      // },
    });
    return response.data;
  },
  revokeOtherSession: async () => {
    const csrf_token = await getCSRFToken();
    console.log(csrf_token);
    const response = await api.post("/user/me/sessions/revoke-others", {
      headers: {
        "x-csrf-token": csrf_token,
      },
    });
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
  getOperator: async (page?: number, per_page?: number) => {
    const response = await api.get("/admin/operators", {
      params: {
        page,
        per_page,
      },
    });
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

  activateOperator: async (id: string) => {
    try {
      const response = await api.post(`/admin/operators/${id}/activate`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /***
   * Dashboard
   */
  getStats: async () => {
    const response = await api.get(`/admin/dashboard/dashboard`);
    return response.data as {
      total_trips: number;
      trips_today: number;
      total_bookings: number;
      bookings_today: number;
      total_amount: number;
      amount_today: number;
      total_passengers: number;
      passengers_today: number;
      total_operators: number;
      operators_today: number;
    };
  },

  /**
   *
   *  Lottery
   */
  /**
   * Superadmin lotter handles
   */
  getLotteryList: async (
    page?: number,
    page_number?: number,
    from_date?: Date,
    to_date?: Date,
  ) => {
    try {
      const response = await api.get(`/admin/lottery/numbers`, {
        params: {
          page,
          page_number,
          from_date,
          to_date,
        },
      });

      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  exportLotteryNumbers: async (from_date?: Date, to_date?: Date) => {
    const response = await api.get(`/admin/lottery/numbers/export`, {
      params: {
        from_date,
        to_date,
      },
    });
    console.log("response", response.data);
    return response.data;
  },

  drawLottery: async (from_date?: string, to_date?: string) => {
    const response = await api.get(`/admin/lottery/random-ticket`, {
      params: {
        from_date,
        to_date,
      },
    });
    return response.data as {
      lottery_number: string;
      ticket_id: string;
      ticket: {
        ticket_id: string;
        status: string;
        created_at: string;
      };
      passenger: {
        name: string;
        email: string;
        phone: string;
      };
      trip: {
        trip_id: string;
        route_from: string;
        route_to: string;
        departure_date: string;
        departure_time: string;
      };
      operator: {
        operator_id: string;
        operator_name: string;
      };
      booking: {
        booking_id: string;
        booking_reference: string;
        booking_date: string;
        booked_by: string | null;
      };
    };
  },

  /**
   * This is the user operation below
   */
  getUsers: async (page?: number, per_page?: number) => {
    try {
      const response = await api.get(`/admin/users`, {
        params: {
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error, "error from getUsers func");
    }
  },
  getUser: async (id: string) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.log(error, "error from getUser func");
    }
  },
  addUser: async (body: AddUserForm) => {
    try {
      const response = await api.post(`/admin/users`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  assignOperatorToUser: async (operatorId: string, userId: string) => {
    const response = await api.post(
      `/admin/operators/${operatorId}/users/${userId}`,
    );
    // console.log(response);
    return response.data;
  },
  unassignOperatorToUser: async (operatorId: string, userId: string) => {
    const response = await api.delete(
      `/admin/operators/${operatorId}/users/${userId}`,
    );
    return response.data;
  },
  getAllOperatorUsers: async (operatorId: string) => {
    const response = await api.get(`/admin/operators/${operatorId}/users`);
    return response.data;
  },

  assignRole: async (id: string, role_identifier: string) => {
    const response = await api.post(`/admin/users/${role_identifier}/users`, {
      users: [id],
    });
    return response.data;
  },
  unAssignRole: async (id: string, role_identifier: string) => {
    const response = await api.delete(
      `/admin/users/${role_identifier}/users/${id}`,
    );
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
  addRoute: async (body: {
    route_from: string;
    route_to: string;
    distance_km: number;
    estimated_duration_minutes: number;
  }) => {
    try {
      const response = await api.post(`/admin/routes/`, body);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  listRoutes: async (page?: number, per_page?: number) => {
    try {
      const response = await api.get("/admin/routes", {
        params: {
          page,
          per_page,
        },
      });
      console.log(response.data, "here");
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getRouteDetail: async (route_id: string) => {
    try {
      const response = await api.get(`/admin/routes/${route_id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateRoute: async (
    route_id: string,
    body: {
      route_from?: string;
      route_to?: string;
      distance_km?: number;
      estimated_duration_minutes?: number;
    },
  ) => {
    try {
      const response = await api.patch(`/admin/routes/${route_id}`, body);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  /**
   * This is the Agent operation below
   */
  getAgents: async (page?: number, per_page?: number) => {
    const response = await api.get("/admin/agents", {
      params: {
        page,
        per_page,
      },
    });

    return response.data;
  },
  addAgent: async (body: Agent) => {
    const response = await api.post("/admin/agents", body);
    return response.data;
  },
  deleteAgent: async (id: string) => {
    const response = await api.delete(`/admin/agents/${id}`);
    console.log(response.data);
    return response.data;
  },
  updateAgent: async (id: string, body: Agent) => {
    const response = await api.put(`/admin/agents/${id}`, body);
    return response.data;
  },
  assignUserToAgent: async (agent_id: string, user_id: string) => {
    const response = await api.post(
      `/admin/agents/${agent_id}/users/${user_id}`,
    );
    return response.data;
  },
  unassignUserToAgent: async (agent_id: string, user_id: string) => {
    const response = await api.delete(
      `/admin/agents/${agent_id}/users/${user_id}`,
    );
    return response.data;
  },
  /**
   * This operations is for agent users
   */
  getAllAgentUsers: async (agent_id: string) => {
    const response = await api.get(`/admin/agents/${agent_id}/users`);
    return response.data;
  },

  /**
   * This operations is for super admin KYC documents
   */
  getAllOperatorKYCdocuments: async (page?: number, per_page?: number) => {
    try {
      const response = await api.get("/admin/operators/kyc-documents", {
        params: {
          page,
          per_page,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error, "error from getAllOperatorKYCdocuments func");
      throw error;
    }
  },
  verifyKYCdocument: async (
    operator_id: string,
    document_id: string,
    status: string,
  ) => {
    const response = await api.put(
      `/admin/operators/kyc-documents/${operator_id}/${document_id}/verify`,
      { status },
    );
    return response.data;
  },
  bulkVerifyKYCdocuments: async (
    operator_id: string,
    document_ids: string[],
    status: string,
  ) => {
    const response = await api.post(
      `/admin/operators/kyc-documents/${operator_id}/bulk-verify`,
      { document_ids, status },
    );
    return response.data;
  },
  getDetailKYCdocument: async (document_id: string) => {
    const response = await api.get(
      `/admin/operators/kyc-documents/${document_id}`,
    );
    return response.data;
  },
  deleteKYCdocument: async (operator_id: string, document_id: string) => {
    try {
      const response = await api.delete(
        `/operator/${operator_id}/kyc-documents/${document_id}`,
      );
      console.log(response.data, "delete kyc document response");
      return response.data;
    } catch (error) {
      console.log(error, "error from deleteKYCdocument func");
      throw error;
    }
  },

  getAllAgentKYCdocuments: async (page?: number, per_page?: number) => {
    try {
      const response = await api.get("/admin/agents/kyc-documents", {
        params: {
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error, "error from getAllAgentKYCdocuments func");
      throw error;
    }
  },
  verifyAgentKYCdocument: async (
    agent_id: string,
    document_id: string,
    status: string,
  ) => {
    const response = await api.put(
      `/admin/agents/kyc-documents/${agent_id}/${document_id}/verify`,
      { status },
    );
    return response.data;
  },
  bulkVerifyAgentKYCdocuments: async (
    agent_id: string,
    document_ids: string[],
    status: string,
  ) => {
    const response = await api.post(
      `/admin/agents/kyc-documents/${agent_id}/bulk-verify`,
      { document_ids, status },
    );
    return response.data;
  },
};
export const DanuAgentApi = {
  getReportForAllOperator: async (
    agent_id: string,
    from_date?: string,
    to_date?: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const response = await api.get(`/agent/${agent_id}/reports/revenue`, {
        params: {
          page,
          per_page,
          from_date,
          to_date,
        },
      });
      console.log(agent_id, "report for all operator from api");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getRefundList: async (agent_id: string, page?: number, per_page?: number) => {
    try {
      const response = await api.get(`/agent/${agent_id}/reports/refunds`, {
        params: {
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getReportData: async (
    operator_id: string,
    from_date: string,
    to_date: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const response = await api.get(`/agent/${operator_id}/reports/tickets`, {
        params: {
          from_date,
          to_date,
        },
      });
      console.log(response.data[0], "report data from api");

      return response.data[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  handleBooking: async (
    agent_id: string,

    body: {
      trip_id: string;
      seat_codes: string[];
      passenger_details: Passenger[];
      payment_method: "cash" | "wallet";

      payment_reference: string;
      external_ref: string;
    },
  ) => {
    try {
      const response = await api.post(`/agent/${agent_id}/bookings`, body);
      return response.data;
    } catch (error) {
      console.log(error, "error from agent handle booking");
      throw error;
    }
  },
};

export const passengerApi = {
  getBookingHistory: async (page?: number, per_page?: number) => {
    try {
      const response = await api.get(`/user/bookings`, {
        params: {
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getBookingHistoryPublic: async (
    user_id: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const response = await api.get(`/user/trip-bookings`, {
        params: {
          user_id,
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  cancelBooking: async (booking_id: string) => {
    try {
      const response = await api.delete(`/user/bookings/${booking_id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  confirmBooking: async (
    hold_id: string,
    payment_reference: string,
    payment_method: string,
  ) => {
    try {
      const response = await api.post(`/user/holds/${hold_id}/confirm`, {
        payment_reference,
        payment_method,
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  searchRoute: async (body: {
    route_from: string;
    route_to: string;
    trip_date: string;
    page?: number;
    per_page?: number;
  }) => {
    try {
      const response = await api.get("/guest/routes/search", {
        params: {
          from_city: body.route_from,
          to_city: body.route_to,
          trip_date: body.trip_date,
          page: body.page,
          per_page: body.per_page,
        },
      });

      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getSeatLayout: async (trip_id: string) => {
    const response = await api.get(`/guest/routes/${trip_id}/seats`);

    return response.data as {
      seats: {
        id: string;
        seat_code: string;
        status: "available" | "booked" | "held";
        row: number;
        col: number;
        fare: number;
      }[];
    };
  },
  guestHoldBooking: async (
    tripId: string,
    body: {
      seat_codes: string[];
      passenger_details: Passenger[];
      client_ref: string;
    },
  ) => {
    try {
      // const uuid = crypto.randomUUID();
      // console.log({ ...body, client_ref: `client_${uuid}` }, "body here");
      const response = await api.post(`/guest/holds/${tripId}`, {
        ...body,
        passenger_details: body.passenger_details.map((passenger) => ({
          ...passenger,
          name: passenger.phone.trim(),
        })),
        // client_ref: uuid,
      });

      getClientToken(response.data.client_ref_token);
      return response.data;
    } catch (error) {
      console.log(error, "error from hold seat");
      throw error;
    }
  },
  guestConfirmBooking: async (
    hold_id: string,
    payment_reference: string,
    payment_method: string,
  ) => {
    try {
      const response = await api.post(
        `/guest/holds/${hold_id}/confirm`,
        {
          payment_reference,
          payment_method,
        },
        {
          headers: {
            "X-Client-Token": getClientToken(),
          },
        },
      );
      console.log(response.data, "guest confirm here it is");

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  autoComplete: async (
    query: string,
    type: "origin" | "destination" | "all" = "all",
  ) => {
    if (query.length < 2) return [];
    const response = await api.get("/guest/routes/autocomplete", {
      params: {
        q: query,
        type: type,
        limit: 5,
      },
    });
    return response.data.routes;
  },
  getPopularRoutes: async () => {
    const response = await api.get("/guest/routes/popular", {
      params: { limit: 3 },
    });
    return response.data.routes;
  },
  getTripDetails: async (tripId: string) => {
    const response = await api.get(`/guest/route/${tripId}`);

    return response.data as {
      id: string;
      trip_date: string;
      departure_time: string;

      route: {
        id: string;
        from_city: string;
        to_city: string;
      };

      operator: {
        id: string;
        name: string;
      };

      bus: {
        id: string;
        plate_no: string;
      };

      driver: {
        id: string;
        name: string;
      };

      price: number;
      is_available: boolean;
    };
  },
  holdSeat: async (
    tripId: string,
    body: {
      seat_codes: string[];
      passenger_details: Passenger[];
      client_ref: string;
    },
  ) => {
    try {
      // const uuid = crypto.randomUUID();
      // console.log({ ...body, client_ref: `client_${uuid}` }, "body here");
      const response = await api.post(`/user/holds/${tripId}`, {
        ...body,
        passenger_details: body.passenger_details.map((passenger) => ({
          ...passenger,
          name: passenger.phone.trim(),
        })),
        // client_ref: uuid,
      });

      return response.data;
    } catch (error) {
      console.log(error, "error from hold seat");
      throw error;
    }
  },
};
export const agentApi = {
  cancelBooking: async (operator_id: string, booking_id: string) => {
    try {
      const res = await api.delete(
        `/operator-agents/${operator_id}/bookings/${booking_id}`,
      );
      console.log(res.data, "data");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  handleTransactionId: async (
    operator_id: string,
    body: {
      transaction_id: string;
      paid_date?: Date;
      paid_amount: number;
    },
  ) => {
    const response = await api.post(
      `/operator-agents/${operator_id}/reports/payments`,
      body,
    );
    return response.data;
  },
  getAllKYCdocuments: async (agent_id: string) => {
    const response = await api.get(`/agent/${agent_id}/kyc-documents`);
    return response.data;
  },
  getReportSummary: async (operator_id: string) => {
    const response = await api.get(`/operator-agents/${operator_id}/reports`);
    return response.data as {
      operator_id: string;
      operator_name: string;
      seller_id: string;
      seller_name: string;
      date: string;
      today_revenue: number;
      tickets_sold_today: number;
    };
  },
  getReportData: async (
    operator_id: string,
    from_date?: string,
    to_date?: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const response = await api.get(
        `/operator-agents/${operator_id}/reports/tickets`,
        {
          params: {
            from_date,
            to_date,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getRefundList: async (
    organzation_id: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const response = await api.get(
        `/operator-agents/${organzation_id}/reports/refunds`,
        {
          params: {
            page,
            per_page,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  handleBooking: async (
    operator_id: string,

    body: {
      trip_id: string;
      seat_codes: string[];
      passenger_details: Passenger[];
      payment_method: "cash" | "wallet";

      payment_reference: string;
      external_ref: string;
    },
  ) => {
    try {
      const response = await api.post(
        `/operator-agents/${operator_id}/bookings`,
        body,
      );
      return response.data;
    } catch (error) {
      console.log(error, "error from agent handle booking");
      throw error;
    }
  },
};

export const operatorApi = {
  getTransactionData: async (
    operator_id: string,
    paid_by_id?: string,
    from_date?: string,
    to_date?: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const res = await api.get(`/operator/${operator_id}/agent-payments`, {
        params: {
          paid_by_id,
          from_date,
          to_date,
          page,
          per_page,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getReportData: async (
    operator_id: string,
    start_date?: string,
    end_date?: string,
    ticket_sold_by_id?: string,
    bus_plate?: string,
    route_id?: string,
    agent_id?: string,
    page?: number,
    per_page?: number,
  ) => {
    try {
      const res = await api.get(`/operator/${operator_id}/reports/tickets`, {
        params: {
          start_date,
          end_date,
          agent_id,
          ticket_sold_by_id,
          bus_plate,
          route_id,
          page,
          per_page,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getReportStatCard: async (operator_id: string) => {
    try {
      const response = await api.get(
        `/operator/${operator_id}/reports/summary`,
      );

      return response.data as {
        operator_id: string;
        operator_name: string;
        date: string;
        today_revenue: number;
        tickets_sold_today: number;
        total_tickets_by_agents: number;
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createSchedule: async (
    operator_id: string,
    body?: {
      route_id: string;
      bus_id: string;
      driver_id: string;
      departure_time: string;
      price: number;
      freq: string;
      interval?: number;
      byweekday?: string;
      bymonthday?: string;
      bymonth?: string;
      until?: string;
      count?: number;
      wkst?: number;
      start_date?: string;
      end_date?: string;
    },
  ) => {
    try {
      await api.post(`/operator/${operator_id}/schedules`, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getTripDetail: async (operator_id: string, schedule_id: string) => {
    try {
      const res = await api.get(
        `/operator/${operator_id}/schedules/${schedule_id}`,
      );
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateOperatorSchedule: async (
    operator_id: string,
    schedule_id: string,
    data: {
      id?: string;

      operator?: {
        id: string;
        name: string;
      };

      route?: {
        id: string;
        route_from: string;
        route_to: string;
      };

      bus?: {
        id: string;
        plate_no: string;
      };

      driver?: {
        id: string;
        name: string;
      };

      departure_time?: string;
      price?: number;

      // Recurrence
      freq?: string;
      interval?: number;
      byweekday?: string;
      bymonthday?: string;
      bymonth?: string;
      until?: string;
      count?: number;
      wkst?: number;

      // Dates
      start_date?: string;
      end_date?: string;

      created_at?: string;
      updated_at?: string;
    },
  ) => {
    try {
      const res = await api.patch(
        `/operator/${operator_id}/schedules/${schedule_id}`,
        data,
      );
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getDetailSchedule: async (
    operator_id: string,
    route_from: string,
    route_to: string,
  ) => {
    const res = await api.get(`/operator/${operator_id}/routes`, {
      params: {
        route_to,
        route_from,
      },
    });
    return res.data as {
      id: string;
      route_from: string;
      route_to: string;
      distance_km: number;
      estimated_duration_minutes: number;
    };
  },
  createBus: async (
    body: {
      plate_no: string;
      capacity: number;
      side_no: string;
      seat_template_id: string;
    },
    operator_id: string,
  ) => {
    try {
      const response = await api.post(`/operator/${operator_id}/buses`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getReport: async (
    operator_id: string,
    page: number,
    per_page: number,
    from_date?: string,
    to_date?: string,
  ) => {
    try {
      const response = await api.get(
        `/operator/${operator_id}/reports/revenue`,
        {
          params: {
            page,
            per_page,
            from_date,
            to_date,
          },
        },
      );
      console.log(response.data, "data");
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getRefundList: async (
    operator_id: string,
    page?: number,
    per_page?: number,
    from_date?: string,
    to_date?: string,
  ) => {
    try {
      const response = await api.get(`/operator/${operator_id}/refunds`, {
        params: {
          page,
          per_page,
          from_date,
          to_date,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error, "error from getRefundList func");
      throw error;
    }
  },
  updateAgentInfo: async (
    operator_id: string,
    agent_id: string,
    body: UpdateAgentDto,
  ) => {
    try {
      const response = await api.patch(
        `/operator/${operator_id}/agents/${agent_id}`,
        body,
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getRefundDetail: async (operator_id: string, refund_id: string) => {
    try {
      const response = await api.get(
        `/operator/${operator_id}/refunds/${refund_id}`,
      );
      return response.data;
    } catch (error) {
      console.log(error, "error from getRefundDetail func");
      throw error;
    }
  },
  processRefund: async (
    operator_id: string,
    refund_id: string,
    {
      status,
      processed_amount,
      method,
      notes,
    }: {
      status: string;
      processed_amount?: number;
      method?: string;
      notes?: string;
    },
  ) => {
    try {
      const response = await api.patch(
        `/operator/${operator_id}/refunds/${refund_id}`,
        {
          status,
          processed_amount,
          method,
          notes,
        },
      );
      return response.data;
    } catch (error) {
      console.log(error, "error from approveRefund func");
      throw error;
    }
  },
  getOperatorAgents: async (
    page?: number,
    per_page?: number,
    operator_id?: string,
  ) => {
    const response = await api.get(`/operator/${operator_id}/agents`, {
      params: {
        page,
        per_page,
      },
    });
    return response.data;
  },
  getOperatorAgentDetail: async (operator_id: string, agent_id: string) => {
    const response = await api.get(
      `/operator/${operator_id}/agents/${agent_id}`,
    );
    return response.data;
  },

  createOperatorAgent: async (
    operator_id: string,
    body: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
      is_active: boolean;
    },
  ) => {
    try {
      const response = await api.post(`/operator/${operator_id}/agents`, body);
      console.log(body, "data to send to create operator agent");
      return response.data;
    } catch (error) {
      console.log(error, "error from createOperatorAgent func");
      throw error;
    }
  },

  deleteOperatorAgent: async (operator_id: string, agent_id: string) => {
    const response = await api.delete(
      `/operator/${operator_id}/agents/${agent_id}`,
    );
    return response.data;
  },

  updateBusStatus: async (
    operator_id: string,
    bus: Bus,
    status: "active" | "inactive",
  ) => {
    const response = await api.patch(
      `/operator/${operator_id}/buses/${bus.id}`,
      {
        plate_no: bus.plate_no,
        side_no: bus.side_no,
        capacity: bus.capacity,
        seat_template_id: bus.seat_template,

        bus_status: status,
      },
    );
    return response;
  },

  createDriver: async (
    body: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
    },
    operator_id: string,
  ) => {
    try {
      const response = await api.post(`/operator/${operator_id}/drivers`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllBuses: async (operator_id: string) => {
    try {
      const response = await api.get(`/operator/${operator_id}/buses`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteBus: async (operator_id: string, bus_id: string) => {
    const response = await api.delete(
      `/operator/${operator_id}/buses/${bus_id}`,
    );
    return response.data;
  },

  createTrip: async (
    operator_id: string,
    body: {
      bus_id: string;
      driver_id: string;
      route_from: string;
      route_to: string;
      departure_at: string;
      price: number;
    },
  ) => {
    const response = await api.post(`/operator/${operator_id}/trips`, body);
    return response.data;
  },

  deleteDriver: async (operator_id: string, driver_id: string) => {
    const response = await api.delete(
      `/operator/${operator_id}/drivers/${driver_id}`,
    );
    return response.data;
  },
  deleteTrip: async (operator_id: string, trip_id: string) => {
    const response = await api.delete(
      `/operator/${operator_id}/trips/${trip_id}`,
    );
    return response.data;
  },

  getAllSchedules: async () => {},
  getAllTrips: async (
    operator_id: string,
    page?: number,
    per_page?: number,
  ) => {
    const response = await api.get(`/operator/${operator_id}/schedules`, {
      params: { page, per_page },
    });
    return response.data;
  },
  getAllDrivers: async (operator_id: string) => {
    const response = await api.get(`/operator/${operator_id}/drivers`);
    return response.data;
  },
  getAllSeatTemplates: async (operator_id: string) => {
    console.log(operator_id);
    try {
      const response = await api.get(`/operator/${operator_id}/seat-templates`);
      console.log(response.data.items, "seat templates response");
      return response.data.items;
    } catch (error) {
      console.log(error, "error from get all seat templates");
      throw error;
    }
  },
  /**This is the KYC apis */

  getKYCdocuments: async (operator_id: string) => {
    const response = await api.get(`/operator/${operator_id}/kyc-documents`);

    return response.data;
  },
  delteKYCdocument: async (operator_id: string, document_id: string) => {
    const response = await api.delete(
      `/operator/${operator_id}/kyc-documents/${document_id}`,
    );
    return response.data;
  },
};

export const profileApi = {
  getMyAvatar: async () => {
    const response = await api.get("/user/me/avatar");
    return response.data;
  },
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/user/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  editProfileInfo: async (body: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    dob?: string;
    gender?: string;
    bio?: string;
    address?: {
      country?: string;
      region?: string;
      city?: string;
      sub_city?: string;
      woreda?: string;
      kebele?: string;
      house_number?: string;
    };
  }) => {
    const res = await api.patch(`/user/me`, body);
    return res.data;
  },
  deleteAccount: async (password: string, anonymize = false) => {
    const response = await api.delete("/user/me", {
      data: { password, anonymize },
    });
    return response.data;
  },
  changePassword: async (old_password: string, new_password: string) => {
    const response = await api.put("/user/me/change-password", {
      old_password,
      new_password,
    });
    return response.data;
  },
};

export default api;
