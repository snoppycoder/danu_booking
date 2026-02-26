"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { superAdminApi } from "@/app/api/api";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/common_functions";

interface LotteryFiltersProps {
  onFilterChange: (from: Date | undefined, to: Date | undefined) => void;
}

export function LotteryFilters({ onFilterChange }: LotteryFiltersProps) {
  const today = new Date();
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [toDate, setToDate] = useState<Date | undefined>(today);

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    onFilterChange(date, toDate);
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    onFilterChange(fromDate, date);
  };

  async function handleExport() {
    try {
      const res = await superAdminApi.exportLotteryNumbers(fromDate, toDate);
      downloadCSV(res);
      toast.success("Successfully exported lottery numbers");
    } catch (err) {
      console.log(err);
      toast.error("Error occurred while trying to export");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center">
      <span className="text-sm font-medium text-foreground">
        Filter by Date:
      </span>

      {/* From Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-48 justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fromDate ? format(fromDate, "MMM dd, yyyy") : "From Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={fromDate || undefined}
            onSelect={handleFromDateChange}
            disabled={(date) => (toDate ? date > toDate : false)}
          />
        </PopoverContent>
      </Popover>

      {/* To Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-48 justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {toDate ? format(toDate, "MMM dd, yyyy") : "To Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={toDate || undefined}
            onSelect={handleToDateChange}
            disabled={(date) => (fromDate ? date < fromDate : false)}
          />
        </PopoverContent>
      </Popover>

      {/* Export Button */}
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleExport}
      >
        Export
      </Button>

      {/* Optional Clear Button */}
      {/* {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )} */}
    </div>
  );
}
