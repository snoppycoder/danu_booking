import { authAPI, passengerApi } from "@/app/api/api";
import { toast } from "sonner";
import { SearchRouteResponse } from "./model";
import { v4 as uuidv4 } from "uuid";
export const normalizeDate = (d?: Date | null) => {
  if (!d) return d;
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export function formatAmharicTime(timeStr: string): string {
  const [hourStr, minuteStr] = timeStr.split(":");

  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;

  // Convert to Ethiopian hour (1–12 system)
  let hour12 = (hour + 6) % 12 || 12;

  let period: string;

  if (hour >= 0 && hour < 6) {
    period = "ሌሊት"; // Night
  } else if (hour < 12) {
    period = "ጠዋት"; // Morning
  } else if (hour < 18) {
    period = "ከሰዓት"; // Afternoon
  } else {
    period = "ማታ"; // Evening
  }

  return `${hour12}:${minute} ${period}`;
}

export function getClientToken(token?: string) {
  if (token) {
    localStorage.setItem("x-client-token", token);
    return;
  }

  return localStorage.getItem("x-client-token");
}
export const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
export function downloadCSV(
  csvString: string,
  fileName = `lottery_bookings.csv_${new Date()}`,
) {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
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
  trip_date: string;
}): Promise<SearchRouteResponse | undefined> {
  try {
    if (
      !form.departure_date ||
      !form.route_from ||
      !form.route_to ||
      !form.trip_date
    ) {
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
