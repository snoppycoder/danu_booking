import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  agentApi,
  DanuAgentApi,
  kycApi,
  notificationAPI,
  operatorApi,
  passengerApi,
  profileApi,
  publicApi,
  sessionMgmt,
  superAdminApi,
} from "@/app/api/api";
import {
  Agent,
  CreateTripPayload,
  Driver,
  getLotteryListDTO,
  History,
  KYCDocument,
  KYCUpload,
  Operator,
  OperatorAgent,
  Refund,
  RefundDetail,
  RouteDTO,
  SearchRouteResponse,
  Seat,
  Session,
  TicketResponse,
  Trip,
  User,
} from "@/lib/model";

import { $ZodNumberInternals } from "zod/v4/core";
import { Notification } from "@/lib/dixiedb";

export type ScheduleDTO = {
  id: string;

  operator: {
    id: string;
    name: string;
  };

  route: {
    id: string;
    route_from: string;
    route_to: string;
  };

  bus: {
    id: string;
    plate_no: string;
  };

  driver: {
    id: string;
    name: string;
  };

  departure_time: string;
  price: number;

  freq: string;
  interval: number;

  byweekday: string;
  bymonthday: string;
  bymonth: string;

  until: string;
  count: number;
  wkst: number;

  start_date: string;
  end_date: string;

  created_at: string;
  updated_at: string;
};
export interface Trips_s {
  id: string;
  trip_id: string;
  operator_id: string;
  bus_id: string;
  driver_id: string;
  available_seats: number;
  route_from: string;
  route_to: string;
  departure_at: string;
  price: number;
  created_at: string;
  updated_at: string;
  operator: {
    operator_id: string;
    operator_name: string;
  };
  driver?: {
    id: string;
    name: string;
  };
}
export interface operatorAdminReport {
  date: string;
  tickets_sold: number;
  revenue: number;
  commission_amount?: number;
  transaction_id?: string;
  items: {
    ticket_id: string;
    bus_plate_number: string;
    route_from: string;
    route_to: string;
    passenger_name: string;
    seat_no: string;
    //commission_amount?: number;
    price: number;
    sold_by: string;
    agent_type: string;
  }[];
  total: number;
  page: number;
  per_page: number;
}
export interface searchResult {
  id: string;
  association?: string;
  trip_date: string;
  arrival_time: string;
  operator: {
    id: string;
    name: string;
  };
  bus: {
    plate_no: string;
    id: string;
  };
  driver: {
    id: string;
    name: string;
  };
  departure_time: string;
  price: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export const useUsers = (page?: number, per_page?: number, noCache = false) => {
  return useQuery({
    queryKey: ["users", page, per_page],
    queryFn: async () => {
      if (page && per_page) {
        const res = await superAdminApi.getUsers(page, per_page);
        return { items: res.items as User[], total: res.total, page: res.page };
      } else {
        const res = await superAdminApi.getUsers();
        return { items: res.items as User[], total: res.total, page: res.page };
      }
    },
    staleTime: noCache ? 0 : 1000 * 60 * 5,
    gcTime: noCache ? 0 : 1000 * 60 * 10,

    refetchOnMount: noCache ? true : false,
    refetchOnWindowFocus: noCache ? true : false,
  });
};
export const useMyNotifications = (from_date?: string) => {
  return useQuery({
    queryKey: ["my-notifications", from_date],
    queryFn: async () => {
      const res = await notificationAPI.getMyNotifications(from_date);
      return {
        items: res.items as Notification[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const usePassengerHistory = (page: number, per_page: number) => {
  return useQuery({
    queryKey: ["history", per_page, page],
    queryFn: async () => {
      const res = await passengerApi.getBookingHistory(page, per_page);
      return {
        items: res.items as History[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSuperAdminStat = () => {
  return useQuery({
    queryKey: ["superadmin-stat"],
    queryFn: async () => {
      const res = await superAdminApi.getStats();
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useTicketNumber = (ticket_number: string) => {
  return useQuery({
    queryKey: ["search-ticket-number", ticket_number],
    queryFn: async () => {
      try {
        const res = await publicApi.searchByTVN(ticket_number);

        // if API returns null/undefined
        if (!res) {
          throw new Error("Ticket not found");
        }

        return res as TicketResponse;
      } catch (error: any) {
        // if backend sends 404
        if (error?.response?.status === 404) {
          throw new Error("Ticket not found");
        }

        throw error;
      }
    },
    enabled: ticket_number.trim() !== "",
    staleTime: 15 * 60 * 1000,
    retry: false,
  });
};
export const useDanuAgentOperatorReport = (
  agent_id: string,
  page?: number,
  per_page?: number,
  from_date?: string,
  to_date?: string,
) => {
  return useQuery({
    queryKey: [
      "danu-agent-report",
      agent_id,

      page,
      per_page,
      from_date,
      to_date,
    ],
    queryFn: async () => {
      const res = await DanuAgentApi.getReportForAllOperator(
        agent_id,
        from_date,
        to_date,
        page,
        per_page,
      );
      console.log(res, "data from report");

      return {
        items: res.items as {
          operator_name: string;
          operator_id: string;
          Total_Ticket_Sales: number;
          Gross_Revenue: number;
          Bus: {
            bus_id: string;
            capacity: number;
            plate_no: string;
            side_no: string;
            Total_Ticket_Sales: number;
            Gross_Revenue: number;
            who_is_selling: {
              seller_id: string;
              seller_name: string;
              seller_type: string;
              Total_Ticket_Sales: number;
              Gross_Revenue: number;
            }[];
          }[];
        }[],
        total: res.total,
        date: res.date,
        tickets_sold: res.tickets_sold,
        revenue: res.revenue,
        page: res.page,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useDanuAgentReportData = (
  operator_id: string,
  from_date: string,
  to_date: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: [
      "danu-agent-report",
      operator_id,
      from_date,
      to_date,
      page,
      per_page,
    ],
    queryFn: async () => {
      const res = await DanuAgentApi.getReportData(
        operator_id,
        from_date,
        to_date,
        page,
        per_page,
      );
      console.log(res, "data from report");

      return {
        items: res.items as {
          ticket_id: string;
          bus_plate_number: string;
          commission_amount?: number;
          route_from: string;
          route_to: string;
          passenger_name: string;
          seat_no: string;
          price: 0;
          sold_by: string;
          agent_type: string;
        }[],
        total: res.total,
        date: res.date,
        tickets_sold: res.tickets_sold,
        revenue: res.revenue,
        page: res.page,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useOperatorAgentReportSummary = (operator_id: string) => {
  return useQuery({
    queryKey: ["operator-agent-report", operator_id],
    queryFn: async () => {
      const res = await agentApi.getReportSummary(operator_id);
      return res;
    },
    enabled: !!operator_id,
    staleTime: 5 * 60 * 1000,
  });
};
export const useOperatorAgentReportData = (
  operator_id: string,

  from_date?: string,
  to_date?: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: [
      "operator-agent-report",
      operator_id,
      from_date,
      to_date,
      page,
      per_page,
    ],
    queryFn: async () => {
      const res = await agentApi.getReportData(
        operator_id,
        from_date,
        to_date,
        page,
        per_page,
      );
      console.log(res, "from query");
      return res as operatorAdminReport[];
    },
  });
};
export const useSearchRoute = (
  route_from: string,
  route_to: string,
  trip_date: string,
  page?: number,
  per_page?: number,
  org_id?: string,
  association?: string,
) => {
  return useQuery({
    queryKey: [
      "search_route",
      route_from,
      route_to,
      association,
      trip_date,
      org_id,
      page,
      per_page,
    ],
    queryFn: async () => {
      const res = await passengerApi.searchRoute({
        route_from,
        route_to,
        trip_date,
        page,
        per_page,
        association,
      });
      const now = new Date();

      let items = !org_id
        ? res.items
        : res.items.filter((t: searchResult) => {
            const departure = new Date(`${t.trip_date}T${t.departure_time}Z`);

            return t.operator.id == org_id && departure > now;
          });

      return { items, total: res.total, page: res.page };
    },
  });
};

export const useSeatTemplate = (trip_id: string) => {
  return useQuery({
    queryKey: ["template", trip_id],
    queryFn: async () => {
      const res = await passengerApi.getSeatLayout(trip_id);
      return res.seats as Seat[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!trip_id,
  });
};

export const useOperator = (page: number, per_page: number) => {
  return useQuery({
    queryKey: ["operator", page, per_page],
    queryFn: async () => {
      const res = await superAdminApi.getOperator(page, per_page);
      return {
        items: res.items as Operator[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useOperatorStatCard = (operator_id: string) => {
  return useQuery({
    queryKey: ["operator_stat_card", operator_id],
    queryFn: async () => {
      const res = await operatorApi.getReportStatCard(operator_id);
      return res as {
        operator_id: string;
        operator_name: string;
        date: string;
        today_revenue: number;
        tickets_sold_today: number;
        total_tickets_by_agents: number;
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
  });
};

export const useTrips = (
  operator_id: string,
  page: number = 1,
  per_page: number = 10,
) => {
  return useQuery<{
    items: ScheduleDTO[];
    total: number;
    page: number;
  }>({
    queryKey: ["trips", operator_id, page, per_page],
    queryFn: async () => {
      if (!operator_id) {
        return { items: [], total: 0, page: 1 };
      }

      const res = await operatorApi.getAllTrips(operator_id, page, per_page);

      return {
        items: res.items as ScheduleDTO[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!operator_id,
  });
};
export const useRoutes = (page?: number, per_page?: number) => {
  return useQuery({
    queryKey: ["routes", page, per_page],
    queryFn: async () => {
      const res = await superAdminApi.listRoutes();
      console.log(res);
      return {
        items: res.items as RouteDTO[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDrivers = (operator_id?: string) => {
  return useQuery({
    queryKey: ["drivers", operator_id],
    queryFn: async () => {
      if (!operator_id) return [];
      const res = await operatorApi.getAllDrivers(operator_id);
      return (res.items as Driver[]) ?? [];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
  });
};
export const useOperatorBuses = (operator_id?: string) => {
  return useQuery({
    queryKey: ["buses", operator_id],
    queryFn: async () => {
      if (!operator_id) return [];

      const res = await operatorApi.getAllBuses(operator_id);

      return res.items;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await sessionMgmt.getAllSession();
      console.log(res, "active");
      return res as Session[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const useAgent = (page: number, per_page: number) => {
  return useQuery({
    queryKey: ["agent", page, per_page],
    queryFn: async () => {
      const res = await superAdminApi.getAgents(page, per_page);

      return { items: res.items as Agent[], total: res.total, page: res.page };
    },
    staleTime: 1000 * 60 * 5,
  });
};
//** These are KYC hooks */
export const useKYCdocuments = (operator_id: string) => {
  return useQuery({
    queryKey: ["kyc-documents", operator_id],
    queryFn: async () => {
      console.log("Fetching KYC documents for operator_id:", operator_id);
      if (!operator_id) return [];
      const res = await operatorApi.getKYCdocuments(operator_id);

      return res.items as KYCDocument[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
  });
};
/// mutations are below ///
export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTripPayload) => {
      const { operator_id, ...rest } = payload;
      return operatorApi.createTrip(payload.operator_id!, rest);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
};

type CreateDriverPayload = {
  operator_id: string;
  body: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone: string;
    password: string;
  };
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation<Driver, Error, CreateDriverPayload>({
    mutationFn: async ({ operator_id, body }) => {
      try {
        return operatorApi.createDriver(body, operator_id);
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["drivers"],
      });
    },
  });
};

export const useLotteryList = (
  page?: number,
  per_page?: number,
  from_date?: Date,
  to_date?: Date,
) => {
  return useQuery({
    queryKey: ["lottery", page, per_page],
    queryFn: async () => {
      const res = await superAdminApi.getLotteryList(
        page,
        per_page,
        from_date,
        to_date,
      );

      return {
        items: res.items as getLotteryListDTO[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const OperatorUseUploadKyc = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, KYCUpload & { operator_id: string }>({
    mutationFn: async ({ operator_id, ...body }) => {
      if (body.file === null) {
        throw new Error("File is required for KYC upload.");
      }
      return kycApi.operatorUploadKyc(body, operator_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kyc-documents"],
      });
    },
  });
};
export const useCreateOperatorAgent = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    {
      operator_id: string;
      body: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        commission_rate: number;
        commission_type: "percentage" | "fixed";
        is_active: boolean;
      };
    }
  >({
    mutationFn: async ({ operator_id, body }) => {
      return operatorApi.createOperatorAgent(operator_id, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["operator_agent"],
      });
    },
  });
};

export const useOperatorAgent = (
  operator_id: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: ["operator_agent", operator_id, page, per_page],
    queryFn: async () => {
      if (!operator_id) return { items: [], total: 0, page: 1 };
      const res = await operatorApi.getOperatorAgents(
        page,
        per_page,
        operator_id,
      );
      return {
        items: res.items as OperatorAgent[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
  });
};

export const useOperatorReport = (
  operator_id: string,
  page: number,
  per_page: number,
  from_date?: string,
  to_date?: string,
) => {
  return useQuery({
    queryKey: [
      "operator_report",
      operator_id,
      page,
      per_page,
      from_date,
      to_date,
    ],
    queryFn: async () => {
      const res = await operatorApi.getReport(
        operator_id,
        page,
        per_page,
        from_date,
        to_date,
      );
      return res;
    },
    enabled: !!operator_id,
    staleTime: 1000 * 60 * 5,
  });
};
export const useOperatorReport2 = (
  operator_id: string,
  start_date: string,
  end_date: string,
  ticket_sold_by_id?: string,
  bus_plate?: string,
  route_id?: string,
  agent_id?: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: [
      "operator_report",
      operator_id,
      ticket_sold_by_id,
      start_date,
      end_date,
      bus_plate,
      route_id,
      agent_id,
      page,
      per_page,
    ],
    queryFn: async () => {
      const res = await operatorApi.getReportData(
        operator_id,
        start_date,
        end_date,
        ticket_sold_by_id,
        bus_plate,
        route_id,
        agent_id,
        page,
        per_page,
      );

      return {
        items: res.items as {
          ticket_id: string;
          bus_plate_number: string;
          commission_amount?: number;
          route_from: string;
          route_to: string;
          passenger_name: string;
          seat_no: string;
          price: number;
          sold_by: string;
          agent_type: string;
        }[],
        tickets_sold: res.tickets_sold,
        commission_owed: res.commission_owed,
        revenue: res.revenue,
        total: res.total,
        page: res.page,
      };
    },
    enabled: !!operator_id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOperatorTransactions = (
  operator_id: string,
  paid_by_id?: string,
  from_date?: string,
  to_date?: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: ["danu_agent_refund_list", paid_by_id, from_date, to_date],
    queryFn: async () => {
      const res = await operatorApi.getTransactionData(
        operator_id,
        paid_by_id,
        from_date,
        to_date,
        page,
        per_page,
      );

      return res.items as {
        id: string;
        agent_id: string;
        paid_by: {
          id?: string;
          name?: string;
        };
        paid_amount: number;
        paid_date: string;
        transaction_id: string;
        created_at: string;
        updated_at: string;
      }[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
  });
};

export const useOperatorAgentDetail = (
  operator_id: string,
  agent_id: string,
) => {
  return useQuery({
    queryKey: ["operator_agent_detail", operator_id, agent_id],
    queryFn: async () => {
      if (!operator_id || !agent_id) return null;
      const res = await operatorApi.getOperatorAgentDetail(
        operator_id,
        agent_id,
      );
      return res as OperatorAgent;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id && !!agent_id,
  });
};

export const useDanuAgentRefundList = (
  agent_id: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: ["danu_agent_refund_list", agent_id, page, per_page],
    queryFn: async () => {
      const res = await DanuAgentApi.getRefundList(agent_id, page, per_page);
      return res.items as Refund[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!agent_id,
  });
};
export const useAvatar = () => {
  return useQuery({
    queryKey: ["avatar"],
    queryFn: async () => {
      const res = profileApi.getMyAvatar();
      return res;
    },
  });
};
export const useSuperadminOperatorGraphReport = (
  operator_id?: string,
  page?: number,
  per_page?: number,
  from_date?: string,
  to_date?: string,
) => {
  return useQuery({
    queryKey: [
      "superadmin-graph-report-operator",
      operator_id,
      page,
      per_page,
      from_date,
      to_date,
    ],
    queryFn: async () => {
      const res = await superAdminApi.getAdminReportOnOperators(
        from_date,
        to_date,
        operator_id,
        page,
        per_page,
      );
      return res as {
        items: {
          operator_name: string;
          operator_id: string;
          Total_Ticket_Sales: number;
          Gross_Revenue: number;
          Bus: {
            bus_id: string;
            capacity: number;
            plate_no: string;
            side_no: string;
            Total_Ticket_Sales: number;
            Gross_Revenue: number;
            who_is_selling: {
              seller_id: string;
              seller_name: string;
              seller_type: string;
              Total_Ticket_Sales: number;
              Gross_Revenue: number;
            }[];
          }[];
        }[];
        total: number;
        per_page: number;
        page: number;
      };
    },
  });
};
export const useSuperadminGraphReport = (
  entity: "bookings" | "operators" | "passengers",
  interval: "day" | "week" | "month",
  metric: "count" | "revenue" | "active" | "new",
  from_date?: string,
  to_date?: string,
) => {
  return useQuery({
    queryKey: [
      "superadmin-graph-report",
      entity,
      interval,
      metric,
      from_date,
      to_date,
    ],
    queryFn: async () => {
      const res = await superAdminApi.getEntityTimeSeriesGraphData(
        entity,
        interval,
        metric,
        from_date,
        to_date,
      );
      return res as {
        entity: string;
        interval: string;
        metric: string;
        data: {
          period: string;
          value: number;
        }[];
      };
    },
  });
};
export const useBookingHistoryPublic = (
  user_id: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: ["public_user_history", user_id, page, per_page],
    queryFn: async () => {
      const res = await passengerApi.getBookingHistoryPublic(
        user_id,
        page,
        per_page,
      );
      console.log(res);

      return {
        items: res.items as {
          booking_id: string;
          booking_ref: string;
          booked_at: string; // ISO date string
          booking_status: string;

          trip_id: string;
          tickets: {
            email: string | null;
            gender: "Male" | "Female";

            ticket_id: string;
            status: string;
            passenger_name: string;
            seat_no: string;

            phone: string;

            price_paid: number;
            price_in_words: string;
            qr_code_url: string | null;
            lottery_number: string | null;
          }[];
          ticket_ids: string[];
          route_from: string;
          route_to: string;

          departure_at: string; // ISO date string

          operator_id: string;
          operator_name: string;

          total_amount: number;
          passenger_count: number;
        }[],
        total: res.total,
        page: res.page,
        per_page: res.per_page,
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!user_id,
  });
};
export const useOperatorAgentRefundList = (
  organzation_id: string,
  page?: number,
  per_page?: number,
) => {
  return useQuery({
    queryKey: ["danu_agent_refund_list", organzation_id, page, per_page],
    queryFn: async () => {
      const res = await agentApi.getRefundList(organzation_id, page, per_page);
      return res.items as Refund[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!organzation_id,
  });
};
export const useOperatorRefundList = (
  operator_id: string,
  page?: number,
  per_page?: number,
  from_date?: string,
  to_date?: string,
) => {
  return useQuery({
    queryKey: [
      "operator_refund_list",
      operator_id,
      page,
      per_page,
      from_date,
      to_date,
    ],
    queryFn: async () => {
      const res = await operatorApi.getRefundList(
        operator_id,
        page,
        per_page,
        from_date,
        to_date,
      );
      return res.items as Refund[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id,
  });
};
export const useRefundDetail = (operator_id: string, refund_id: string) => {
  return useQuery({
    queryKey: ["refund_detail", operator_id, refund_id],
    queryFn: async () => {
      const res = await operatorApi.getRefundDetail(operator_id, refund_id);
      return res as RefundDetail;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!operator_id && !!refund_id,
  });
};
export const AgentUseUploadKyc = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, KYCUpload & { agent_id: string }>({
    mutationFn: async ({ agent_id, ...body }) => {
      if (body.file === null) {
        throw new Error("File is required for KYC upload.");
      }
      return kycApi.agentUploadKyc(body, agent_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kyc-documents"],
      });
    },
  });
};
export const useOperatorsKYCdocuments = () => {
  return useQuery({
    queryKey: ["admin-kyc-documents"],
    queryFn: async () => {
      const res = await superAdminApi.getAllOperatorKYCdocuments();
      console.log("Fetched KYC documents for all operators:", res);
      return res.items as KYCDocument[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const useAgentsKYCdocuments = () => {
  return useQuery({
    queryKey: ["admin-kyc-documents"],
    queryFn: async () => {
      const res = await superAdminApi.getAllAgentKYCdocuments();
      console.log("Fetched KYC documents for all agents:", res);
      return res.items as KYCDocument[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
