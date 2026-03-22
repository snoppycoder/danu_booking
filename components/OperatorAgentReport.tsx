"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  data: any[];
};

export default function OperatorSalesLineChart({ data }: Props) {
  console.log(data);
  const chartData = data.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-CA", {
      day: "2-digit",
      month: "short",
    }),
    tickets: day.tickets_sold,
    revenue: day.revenue,
  }));

  return (
    <div className="w-full shadow-xl mb-6 md:h-[400px] h-[280px] bg-card rounded-2xl p-4 hover:shadow-2xl transition-all ease-in-out">
      <h2 className="text-lg text-center font-semibold mb-4">Sales Overview</h2>

      <ResponsiveContainer className={"gap-2"} width="100%" height="100%">
        <LineChart className="p-2" data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          {/* LEFT → Tickets */}
          <YAxis yAxisId="left" />

          {/* RIGHT → Revenue */}
          <YAxis yAxisId="right" orientation="right" />

          <Tooltip />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="tickets"
            name="Tickets Sold"
            stroke="#2dd4bf"
            strokeWidth={3}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#4ade80"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
