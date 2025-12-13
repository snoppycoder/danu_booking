import { useQuery } from "@tanstack/react-query";
import { sessionMgmt, superAdminApi } from "@/app/api/api";
import { Operator, Session, User } from "@/lib/model";

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
