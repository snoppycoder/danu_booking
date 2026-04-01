"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/authContext";
import { useDanuAgentOperatorReport } from "./Query";
import { Spinner } from "./ui/spinner";
import { formatCurrency } from "@/lib/report-utils";

interface Operator {
  operator_name: string;
  operator_id: string;
  Total_Ticket_Sales: number;
  Gross_Revenue: number;
  Bus: Bus[];
}

interface Bus {
  bus_id: string;
  capacity: number;
  plate_no: string;
  side_no: string;
  Total_Ticket_Sales: number;
  Gross_Revenue: number;
  who_is_selling: SellerInfo[];
}

interface SellerInfo {
  seller_id: string;
  seller_name: string;
  seller_type: string;
  Total_Ticket_Sales: number;
  Gross_Revenue: number;
}

const StatCard = ({
  label,
  value,
  prefix = "",
}: {
  label: string;
  value: number | string;
  prefix?: string;
}) => (
  <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-slate-900">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </CardContent>
  </Card>
);

const BusCard = ({ bus }: { bus: Bus }) => (
  <Card className="bg-white border-slate-200">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base text-slate-900">
            {bus.plate_no}
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Side No: {bus.side_no} | Capacity: {bus.capacity}
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Tickets Sold
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {bus.Total_Ticket_Sales}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Gross Revenue
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(bus.Gross_Revenue ?? 0)}
          </p>
        </div>
      </div>

      {bus.who_is_selling && bus.who_is_selling.length > 0 && (
        <div>
          <p className="text-xs text-slate-600 font-semibold mb-2 uppercase tracking-wide">
            Sellers
          </p>
          <div className="space-y-2">
            {bus.who_is_selling.map((seller) => (
              <div
                key={seller.seller_id}
                className="bg-slate-50 rounded p-2 text-xs"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">
                    {seller.seller_name}
                  </span>
                  <span className="text-slate-500">({seller.seller_type})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{seller.Total_Ticket_Sales} tickets</span>
                  <span>{formatCurrency(seller.Gross_Revenue ?? 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const OperatorCard = ({ operator }: { operator: Operator }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <Card
        className="bg-white border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setExpanded(!expanded)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-slate-900">
                {operator.operator_name}
              </CardTitle>
              {/* <p className="text-sm text-slate-500 mt-1">
                ID: {operator.operator_id}
              </p> */}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {!expanded && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {operator.Total_Ticket_Sales}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Gross Revenue
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(operator.Gross_Revenue ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {expanded && (
        <div className="space-y-4 ml-0 md:ml-2">
          {/* Summary Stats when Expanded */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Ticket Sales"
              value={operator.Total_Ticket_Sales}
            />
            <StatCard
              label="Gross Revenue"
              value={formatCurrency(operator.Gross_Revenue ?? 0)}
            />
            <StatCard label="Active Buses" value={operator.Bus.length} />
          </div>

          {/* Buses List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Buses ({operator.Bus.length})
            </h3>
            <div className="space-y-3">
              {operator.Bus.map((bus) => (
                <BusCard key={bus.bus_id} bus={bus} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function OperatorReportDashboard({
  page = 1,
  perPage = 10,
  fromDate,
  toDate,
}: {
  page?: number;
  perPage?: number;
  fromDate?: string;
  toDate?: string;
}) {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useDanuAgentOperatorReport(
    user?.organization_id || "",
    page,
    perPage,
    fromDate,
    toDate,
  );

  if (!user?.organization_id) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">
              Error loading data:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Tickets Sold" value={data.tickets_sold ?? 0} />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(data.revenue ?? 0)}
        />
      </div> */}

      {/* Date Info */}
      {data.date && (
        <div className="text-sm text-slate-600">
          Report Date: {new Date(data.date).toLocaleDateString()}
        </div>
      )}

      {/* Operators List */}
      <div>
        {data.items.length > 0 && (
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Operators ({data.items.length})
          </h2>
        )}

        <div className="space-y-3">
          {data.items.length == 0 ? (
            <div className="text-center py-10 text-gray-500">
              No operators found for the selected date range.
            </div>
          ) : (
            data.items.map((operator) => (
              <OperatorCard key={operator.operator_id} operator={operator} />
            ))
          )}
        </div>
      </div>

      {/* Pagination Info */}
      {data.items.length > 0 && (
        <div className="text-sm text-slate-600 mt-6">
          Showing {data.items.length} of {data.total} operators
        </div>
      )}
    </div>
  );
}
