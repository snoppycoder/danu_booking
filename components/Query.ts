import { useQuery } from "@tanstack/react-query";
import { operatorApi, sessionMgmt, superAdminApi } from "@/app/api/api";
import { Agent, Operator, Session, User } from "@/lib/model";

export const useUsers = (page: number, per_page: number) => {
  return useQuery({
    queryKey: ["users", page, per_page],
    queryFn: async () => {
      const res = await superAdminApi.getUsers(page, per_page);
      return res.items as User[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const useOperator = (page: number, per_page: number) => {
  return useQuery({
    queryKey: ["operator", page, per_page],
    queryFn: async () => {
      const res = await superAdminApi.getOperator(page, per_page);
      return res.items as Operator[];
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
      return res.items;
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

      return res.items as Agent[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
