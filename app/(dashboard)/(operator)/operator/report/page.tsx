"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { OperatorDetailReport } from "@/components/OperatorDetailReport";
import { useOperatorReport } from "@/components/Query";
import { ReportFiltersBar } from "@/components/ReportFilters";
import { ReportSummaryCards } from "@/components/ReportSummary";
import { calculateReportSummary, getTopPerformers } from "@/lib/report-utils";
import { ReportFilters, OperatorReportResponse, Operator } from "@/lib/reports";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    operator_id: "",
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, error } = useOperatorReport(
    filters.operator_id,
    filters.page || 1,
    filters.per_page || 10,
    filters.from_date,
    filters.to_date,
  );

  const summary =
    data && filters.operator_id
      ? calculateReportSummary(data as OperatorReportResponse)
      : null;

  const topPerformers =
    data && filters.operator_id
      ? getTopPerformers(data as OperatorReportResponse)
      : null;

  const handleFilterChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Operator Reports
          </h1>
          <p className="text-gray-600">
            Track and analyze operator performance, bus metrics, and sales data
          </p>
        </div>

        <ReportFiltersBar
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border border-red-200">
            <p className="text-red-800">
              Error loading report:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : summary && data ? (
          <>
            <ReportSummaryCards summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {topPerformers && (
                <>
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Top 5 by Revenue
                    </h3>
                    <div className="space-y-3">
                      {topPerformers.topByRevenue.map((op, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center pb-3 border-b border-gray-200"
                        >
                          <span className="text-gray-700">{op.name}</span>
                          <span className="font-semibold text-gray-900">
                            ${op.revenue.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Top 5 by Tickets Sold
                    </h3>
                    <div className="space-y-3">
                      {topPerformers.topByTickets.map((op, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center pb-3 border-b border-gray-200"
                        >
                          <span className="text-gray-700">{op.name}</span>
                          <span className="font-semibold text-gray-900">
                            {op.tickets} tickets
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>

            <div className="mt-8">
              <Card className="p-6">
                {data.items.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Detailed Operator Information
                    </h3>
                    <div className="space-y-8">
                      {data.items.map((operator: Operator) => (
                        <OperatorDetailReport
                          key={operator.operator_id}
                          operator={operator}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-600 py-8">
                    No data available for the selected filters
                  </p>
                )}
              </Card>
            </div>

            {data.total > data.per_page && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.max(1, (prev.page || 1) - 1),
                    }))
                  }
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {filters.page} of{" "}
                  {Math.ceil(data.total / (data.per_page || 10))}
                </span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: (prev.page || 1) + 1,
                    }))
                  }
                  disabled={
                    (filters.page || 1) * (filters.per_page || 10) >= data.total
                  }
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600">
              Select an operator and apply filters to view reports
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
