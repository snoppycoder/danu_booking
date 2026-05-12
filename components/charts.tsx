"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuperadminGraphReport } from "./Query";
import { formatCurrency } from "@/lib/report-utils";
// Ensure the path below matches where your hook is actually located

export default function Charts() {
  // Fetching Monthly Revenue for Bookings
  const { data: revenueData, isLoading: isRevenueLoading } =
    useSuperadminGraphReport("bookings", "month", "revenue");

  // Fetching Weekly New Passengers
  const { data: passengersData, isLoading: isPassengersLoading } =
    useSuperadminGraphReport("passengers", "week", "new");
  console.log(passengersData, revenueData);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Bookings Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue (Bookings)</CardTitle>
        </CardHeader>
        <CardContent>
          {isRevenueLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData?.data || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-muted"
                />
                <XAxis
                  dataKey="period"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${formatCurrency(value)}`}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Revenue"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Weekly New Passengers Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly New Passengers</CardTitle>
        </CardHeader>
        <CardContent>
          {isPassengersLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={passengersData?.data || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-muted"
                />
                <XAxis
                  dataKey="period"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar
                  dataKey="value"
                  name="New Passengers"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
