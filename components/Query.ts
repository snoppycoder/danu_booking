import { useQuery } from "@tanstack/react-query";
import { operatorApi, sessionMgmt, superAdminApi } from "@/app/api/api";
import { Agent, Operator, Session, User } from "@/lib/model";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await superAdminApi.getUsers();
      return res.items as User[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const useOperator = () => {
  return useQuery({
    queryKey: ["operator"],
    queryFn: async () => {
      const res = await superAdminApi.getOperator();
      return res.items as Operator[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const useOperatorBuses = (operator_id: string) => {
  return useQuery({
    queryKey: ["buses", operator_id],
    queryFn: async () => {
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
export const useAgent = () => {
  return useQuery({
    queryKey: ["agent"],
    queryFn: async () => {
      const res = await superAdminApi.getAgents();

      return res.items as Agent[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
