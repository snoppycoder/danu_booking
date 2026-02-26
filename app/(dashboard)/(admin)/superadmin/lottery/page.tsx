"use client";

import { useState, useMemo, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { LotteryCard } from "@/components/LotteryCard";
import { LotteryDetailModal } from "@/components/LotteryDetailModal";
import { LotteryFilters } from "@/components/LotteryFilters";
import { LotteryPagination } from "@/components/LotteryPagination";
import { getLotteryListDTO } from "@/lib/model";
import { useLotteryList } from "@/components/Query";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for demonstration

const ITEMS_PER_PAGE = 6;

export default function LotteryPage() {
  const [selectedLottery, setSelectedLottery] =
    useState<getLotteryListDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const per_page = 15;
  const today = new Date();
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [toDate, setToDate] = useState<Date | undefined>(today);
  const { data, isLoading, refetch } = useLotteryList(
    currentPage,
    per_page,
    fromDate,
    toDate,
  );
  useEffect(() => {
    refetch();
  }, [fromDate, toDate, currentPage]);

  console.log(data, "logging");
  // Filter data based on date range
  const filteredData = useMemo(() => {
    return data?.items.filter((item) => {
      const itemDate = parseISO(item.created_at);
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });
  }, [fromDate, data, toDate]);

  // Calculate pagination
  const totalItems = filteredData?.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData =
    filteredData?.slice(startIndex, startIndex + ITEMS_PER_PAGE) ?? [];

  const handleFilterChange = (from: Date | undefined, to: Date | undefined) => {
    setFromDate(from);
    setToDate(to);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lottery Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage and view all lottery bookings
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <LotteryFilters onFilterChange={handleFilterChange} />
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedData?.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
          results
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
              <div key={idx} className="p-4 border rounded-md bg-card">
                <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-full mb-1" /> {/* Subtitle */}
                <Skeleton className="h-4 w-5/6 mb-1" /> {/* Detail */}
                <Skeleton className="h-20 w-full mt-2" /> {/* Button */}
              </div>
            ))}
          </div>
        ) : paginatedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedData.map((lottery) => (
                <LotteryCard
                  key={lottery.ticket_id}
                  lottery={lottery}
                  onClick={() => setSelectedLottery(lottery)}
                />
              ))}
            </div>

            {/* Pagination */}
            <LotteryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No lottery bookings found for the selected date range.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLottery && (
        <LotteryDetailModal
          lottery={selectedLottery}
          onClose={() => setSelectedLottery(null)}
        />
      )}
    </div>
  );
}
