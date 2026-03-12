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
  baseURL: "/api/proxy",

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const publicPath = ["/login", "/signup", "/verify"];
    console.log(window.location.href);
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const code = data.code;
      const detail = data.detail;
      const path = window.location.href;

      if (!publicPath.includes(path)) {
        console.log(detail, "error detail from response interceptor");
        if (detail && detail?.includes("revoked")) {
          deleteAllCookies().then(() => {
            console.error("Session revoked — clearing cookies and redirecting");
            window.location.href = "/login";
          });
        }
        if (status === 401) {
          switch (detail) {
            case "CSRF_MISSING":
            case "CSRF_INVALID":
              // Retry once if not already retried
              if (!originalRequest._retry) {
                originalRequest._retry = true;
                return api(originalRequest);
              }
              // If retry fails, force re-login
              console.error(`${code}: Forcing re-login`);
              window.location.href = "/login";
              break;

            case "CSRF_EXPIRED":
              console.error("CSRF Token expired");
              window.location.href = "/login";
              break;

            case "REFRESH_REUSED":
              console.error("Refresh token reuse detected — security warning");
              // Optionally show an alert to the user
              alert(
                "Security alert: Your session was used from another location. Please log in again.",
              );
              window.location.href = "/login";
              break;

            case "REFRESH_EXPIRED":
              console.error("Refresh token expired");
              window.location.href = "/login";
              break;

            case "REFRESH_INVALID":
              console.error("Refresh token invalid");
              window.location.href = "/login";
              break;

            case "SESSION_INVALID":
              console.error("Session invalid — clearing UI state");
              // Clear session from UI/local storage
              localStorage.removeItem("session");
              sessionStorage.clear();
              window.location.href = "/login";
              break;

            case "USER_NOT_FOUND":
              console.error("User not found — clearing auth state");
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/login";
              break;

            default:
              console.error("Unhandled 401 error:", data);
              window.location.href = "/login";
              throw error;
          }
        } else if (status === 403) {
          console.log(error);
          throw error;
        }
      } else {
        console.error("Network or unknown error:", error.message);
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
        console.log("csrf token set in request interceptor:", csrfToken);
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
  signup: async (body: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string; // need attention
  }) => {
    try {
      const response = await api.post("/auth/register", body);
      console.log(response);

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

      return response.data;
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
      const response = await api.post(`/auth/refresh`, {});
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
    departure_date: string;
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get("/guest/search", {
      params: {
        route_from: body.route_from,
        route_to: body.route_to,
        departure_date: body.departure_date,
        page: body.page,
        per_page: body.per_page,
      },
    });
    console.log(response.data);
    return response.data;
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
    const response = await api.get(`/guest/${tripId}`);

    return response.data;
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
  getAllKYCdocuments: async (agent_id: string) => {
    const response = await api.get(`/agent/${agent_id}/kyc-documents`);
    return response.data;
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
export const operatorApi = {
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
      license_no: string;
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
  getAllTrips: async (
    operator_id: string,
    page?: number,
    per_page?: number,
  ) => {
    const response = await api.get(`/operator/${operator_id}/trips`, {
      params: { page, per_page },
    });
    return response.data;
  },
  getAllDrivers: async (operator_id: string) => {
    const response = await api.get(`/operator/${operator_id}/drivers`);
    return response.data;
  },
  getAllSeatTemplates: async (operator_id: string) => {
    try {
      console.log(operator_id, "operator id here");
      const response = await api.get(`/operator/${operator_id}/seat-templates`);
      console.log(response.data.items, "seat templates response");
      return response.data.items;
    } catch (error) {
      console.log(error, "error from get all seat templates");
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
