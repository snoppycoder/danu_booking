"use client";

import {
  getOperatorMetrics,
  formatCurrency,
  formatNumber,
} from "@/lib/report-utils";
import { Card } from "@/components/ui/card";
import { Operator } from "@/lib/reports";

interface OperatorDetailReportProps {
  operator: Operator;
}

export function OperatorDetailReport({ operator }: OperatorDetailReportProps) {
  const metrics = getOperatorMetrics(operator);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {metrics.operatorName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(metrics.totalTickets)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(metrics.totalRevenue)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Active Buses</p>
            <p className="text-xl font-bold text-gray-900">
              {metrics.busCount}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Avg Revenue/Bus</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(metrics.averageRevenuePerBus)}
            </p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bus Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Plate No
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Side No
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tickets Sold
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Sellers
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.busMetrics.map((bus, idx) => (
                <tr
                  key={bus.busId}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {bus.plateNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {bus.sideNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {bus.capacity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(bus.ticketsSold)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(bus.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {bus.sellerCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
