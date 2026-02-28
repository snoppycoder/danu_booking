import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  kycApi,
  operatorApi,
  passengerApi,
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
  SearchRouteResponse,
  Session,
  Trip,
  User,
} from "@/lib/model";
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
  });
};

export const useSuperAdminStat = () => {
  return useQuery({
    queryKey: ["superadmin-stat"],
    queryFn: async () => {
      const res = await superAdminApi.getStats();
      return res;
    },
  });
};
export const useSearchRoute = (
  route_from: string,
  route_to: string,
  departure_date: string,
) => {
  return useQuery({
    queryKey: ["search_route", route_from, route_to, departure_date],
    queryFn: async () => {
      const res = await passengerApi.searchRoute({
        route_from,
        route_to,
        departure_date,
      });
      return res.items as {
        trip_id: string;
        operator: {
          operator_id: string;
          operator_name: string;
        };
        departure_at: string;
        price: number;
        available_seats: number;
        created_at: string;
        updated_at: string;
      }[];
    },
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
export const useTrips = (
  operator_id: string,
  page: number = 1,
  per_page: number = 10,
) => {
  return useQuery<{
    items: Trip[];
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
        items: res.items as Trips_s[],
        total: res.total,
        page: res.page,
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!operator_id,
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
    license_no: string;
  };
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation<Driver, Error, CreateDriverPayload>({
    mutationFn: async ({ operator_id, body }) => {
      return operatorApi.createDriver(body, operator_id);
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
  page: number,
  per_page: number,
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
export const useRefundList = (
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
