import { authAPI, passengerApi } from "@/app/api/api";
import { toast } from "sonner";
import { SearchRouteResponse } from "./model";

export async function onLogout(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
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
  try {
    if (!form.departure_date || !form.route_from || !form.route_to) {
      toast.error("Please enter all necessary inputs");
      return;
    }

    const res = (await passengerApi.searchRoute(form)) as SearchRouteResponse;
    return res;
  } catch (error) {
    console.error("Error searching routes:", error);
    toast.error(
      "An error occurred while searching for routes. Please try again.",
    );
  }
}
export type CSVRow = Record<string, string | number | boolean | null>;

export const exportToCSV = <T extends CSVRow>(data: T[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]) as (keyof T)[];

  const csvRows = [
    headers.join(","),

    ...data.map((row) =>
      headers
        .map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ];

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

export function normalizeEthiopianPhone(phone: string): string {
  if (!phone) return phone;

  // remove spaces and dashes (optional but useful)
  let cleaned = phone.replace(/[\s-]/g, "");

  if (cleaned.startsWith("+251")) {
    return "0" + cleaned.slice(4);
  }

  if (cleaned.startsWith("251")) {
    return "0" + cleaned.slice(3);
  }

  return cleaned;
}
