import { authAPI, passengerApi } from "@/app/api/api";
import { toast } from "sonner";
import { SearchRouteResponse } from "./model";

export async function onLogout(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
): Promise<void> {
  event.preventDefault();
  const response = await authAPI.logout();
  console.log(response);
}
export const formatTime = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", // Jan, Feb, Mar...
    day: "2-digit", // 01, 02, ...
    year: "numeric",
  });
};
export async function handleSearch(form: {
  departure_date: string;
  route_from: string;
  route_to: string;
}): Promise<SearchRouteResponse | undefined> {
  if (!form.departure_date || !form.route_from || !form.route_to) {
    toast.error("Please enter all necessary inputs");
    return;
  }
  const res = (await passengerApi.searchRoute(form)) as SearchRouteResponse;
  return res;
}
