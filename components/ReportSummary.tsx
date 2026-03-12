"use client";

import { ReportSummary } from "@/lib/reports";
import { formatCurrency, formatNumber } from "@/lib/report-utils";
import { Card } from "@/components/ui/card";

interface ReportSummaryProps {
  summary: ReportSummary;
  isLoading?: boolean;
}

export function ReportSummaryCards({ summary, isLoading }: ReportSummaryProps) {
  const metrics = [
    {
      label: "Total Operators",
      value: formatNumber(summary.totalOperators),
    },
    {
      label: "Total Buses",
      value: formatNumber(summary.totalBuses),
    },
    {
      label: "Total Sellers",
      value: formatNumber(summary.totalSellers),
    },
    {
      label: "Tickets Sold",
      value: formatNumber(summary.totalTicketsSold),
    },
    {
      label: "Gross Revenue",
      value: formatCurrency(summary.totalGrossRevenue),
    },
    {
      label: "Avg Revenue/Bus",
      value: formatCurrency(summary.averageRevenuePerBus),
    },
    {
      label: "Avg Tickets/Bus",
      value: formatNumber(summary.averageTicketsPerBus),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {metric.label}
          </p>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
