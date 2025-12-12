import { useQuery } from "@tanstack/react-query";
import { superAdminApi } from "@/app/api/api";
import { Operator, User } from "@/lib/model";

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
