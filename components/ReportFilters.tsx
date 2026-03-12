"use client";

import { useState } from "react";
import { ReportFilters } from "@/lib/reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";

interface ReportFiltersProps {
  onFilterChange: (filters: ReportFilters) => void;
  isLoading?: boolean;
}

export function ReportFiltersBar({
  onFilterChange,
  isLoading,
}: ReportFiltersProps) {
  const { user } = useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApplyFilters = () => {
    onFilterChange({
      operator_id: user?.organization_id || "",
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      page: 1,
      per_page: 10,
    });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    onFilterChange({
      operator_id: user?.organization_id ?? "",
      page: 1,
      per_page: 10,
    });
  };

  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operator ID
          </label>
          <Input
            placeholder="Enter operator ID"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            disabled={isLoading}
          />
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="flex-1"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isLoading}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
