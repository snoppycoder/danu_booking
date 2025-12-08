"use client";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const yearlyData = [
  { name: "", income: 28000, expense: 0 },
  { name: "", income: 32000, expense: 0 },
  { name: "", income: 35000, expense: 2000 },
];

const weeklyData = [
  { name: "", income: 1.2, expense: 0.5 },
  { name: "", income: 1.4, expense: 0.6 },
  { name: "", income: 1.6, expense: 0.7 },
  { name: "", income: 1.8, expense: 0.8 },
];

export default function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Yearly Chart */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold mb-4">Yearly Income & Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#a91f3a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Chart */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold mb-4">Weekly Income & Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
