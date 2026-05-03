"use client";

import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BusIcon, TicketIcon, BanknoteIcon, Sparkles } from "lucide-react";
import {
  useOperator,
  useSuperadminOperatorGraphReport,
} from "@/components/Query";

export default function OperatorReportPage() {
  // State for filtering
  const [selectedOperator, setSelectedOperator] = useState<string>("all");
  const [perPage, setPerPage] = useState<number>(10);

  // Fetch first 100 operators for the filter dropdown
  const { data: operatorsData, isLoading: isLoadingOperators } = useOperator(
    1,
    100,
  );

  // Convert "all" string back to undefined for the API call
  const queryOperatorId =
    selectedOperator === "all" ? undefined : selectedOperator;

  // Fetch report data based on selected operator
  const { data: reportData, isLoading: isLoadingReport } =
    useSuperadminOperatorGraphReport(
      queryOperatorId,
      1, // default page
      perPage, // default per_page
    );

  return (
    <div className="min-h-screen bg-linear-to-b  dark:from-slate-950 dark:to-slate-900 py-10 px-6 font-sans">
      <div className="container mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              {/* <Sparkles className="w-4 h-4" /> */}
              <span>Analytics Overview</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-500">
              Operator Revenue
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A detailed breakdown of ticket sales and revenue streams across
              your entire fleet.
            </p>
          </div>

          {/* Filters - Glassy Container */}
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <div className="w-full sm:w-64">
              <Select
                value={selectedOperator}
                onValueChange={setSelectedOperator}
                disabled={isLoadingOperators}
              >
                <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0">
                  <SelectValue placeholder="Filter by Operator" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  <SelectItem value="all" className="rounded-lg cursor-pointer">
                    All Operators
                  </SelectItem>
                  {operatorsData?.items?.map((operator) => (
                    <SelectItem
                      key={operator.id}
                      value={operator.id}
                      className="rounded-lg cursor-pointer"
                    >
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-800 my-2"></div>

            <div className="w-full sm:w-40">
              <Select
                value={perPage.toString()}
                onValueChange={(value) => setPerPage(Number(value))}
              >
                <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0">
                  <SelectValue placeholder="Display" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  <SelectItem value="10" className="rounded-lg cursor-pointer">
                    10 per page
                  </SelectItem>
                  <SelectItem value="25" className="rounded-lg cursor-pointer">
                    25 per page
                  </SelectItem>
                  <SelectItem value="50" className="rounded-lg cursor-pointer">
                    50 per page
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          {isLoadingReport ? (
            // Loading Skeletons - Softer animation
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <Skeleton className="h-8 w-64 rounded-lg bg-slate-200/50" />
                  <Skeleton className="h-4 w-48 mt-3 rounded-md bg-slate-200/50" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full rounded-xl bg-slate-200/50" />
                </CardContent>
              </Card>
            ))
          ) : reportData?.items?.length === 0 ? (
            // Empty State - Minimalist illustration vibe
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6 shadow-inner">
                <BusIcon className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No data available
              </h3>
              <p className="text-muted-foreground max-w-sm">
                We couldn't find any report data matching your current filter
                criteria.
              </p>
            </div>
          ) : (
            // Render Operator Cards
            reportData?.items?.map((operator) => (
              <Card
                key={operator.operator_id}
                className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 rounded-2xl"
              >
                <CardHeader className="bg-gradient-to-r from-slate-50/80 to-transparent dark:from-slate-950/50 border-b border-slate-100 dark:border-slate-800 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {operator.operator_name}
                      </CardTitle>
                      <CardDescription className="font-medium text-slate-500">
                        ID: {operator.operator_id}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-none dark:bg-blue-900/30 dark:text-blue-300 transition-colors"
                      >
                        <TicketIcon className="w-4 h-4" />
                        {operator.Total_Ticket_Sales.toLocaleString()} Sales
                      </Badge>
                      <Badge
                        variant="default"
                        className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none shadow-none dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors"
                      >
                        <BanknoteIcon className="w-4 h-4" />
                        ETB {operator.Gross_Revenue.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {operator.Bus.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                          <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                            <TableHead className="font-semibold px-6 py-4">
                              Bus Details
                            </TableHead>
                            <TableHead className="font-semibold px-6 py-4">
                              Capacity
                            </TableHead>
                            <TableHead className="text-right font-semibold px-6 py-4">
                              Sales
                            </TableHead>
                            <TableHead className="text-right font-semibold px-6 py-4">
                              Revenue
                            </TableHead>
                            <TableHead className="font-semibold px-6 py-4">
                              Sellers Breakdown
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {operator.Bus.map((bus) => (
                            <TableRow
                              key={bus.bus_id}
                              className="border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 group"
                            >
                              <TableCell className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {bus.plate_no}
                                  </span>
                                  <span className="text-xs font-medium text-slate-400">
                                    Side No: {bus.side_no}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                                  {bus.capacity} seats
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-bold text-slate-700 dark:text-slate-300 px-6 py-4">
                                {bus.Total_Ticket_Sales}
                              </TableCell>
                              <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 px-6 py-4">
                                ETB {bus.Gross_Revenue.toLocaleString()}
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                {/* Nested Sellers Map */}
                                {bus.who_is_selling?.length > 0 ? (
                                  <div className="flex flex-col gap-2">
                                    {bus.who_is_selling.map((seller) => (
                                      <div
                                        key={seller.seller_id}
                                        className="text-xs flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors"
                                      >
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                          {seller.seller_name}{" "}
                                          <span className="text-slate-400 font-normal">
                                            ({seller.seller_type})
                                          </span>
                                        </span>
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                          {seller.Total_Ticket_Sales} tix{" "}
                                          <span className="mx-1 text-slate-300 dark:text-slate-600">
                                            |
                                          </span>
                                          <span className="text-emerald-600/80 dark:text-emerald-400/80">
                                            ETB{" "}
                                            {seller.Gross_Revenue.toLocaleString()}
                                          </span>
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-sm italic text-slate-400 bg-slate-50 dark:bg-slate-800/30 px-3 py-1.5 rounded-md">
                                    No sellers recorded
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 bg-slate-50/30 dark:bg-slate-900/20">
                      No active buses recorded for this operator.
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
