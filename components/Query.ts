import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { operatorApi, sessionMgmt, superAdminApi } from "@/app/api/api";
import {
  Agent,
  CreateTripPayload,
  Driver,
  KYCDocument,
  Operator,
  Session,
  User,
} from "@/lib/model";
import { totalmem } from "os";

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
export const useTrips = (operator_id: string) => {
  return useQuery({
    queryKey: ["trips", operator_id],
    queryFn: async () => {
      if (!operator_id) return [];
      const res = await operatorApi.getAllTrips(operator_id, 10);
      return res.items;
    },
    staleTime: 1000 * 60 * 5,
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
