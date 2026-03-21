"use client";

import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  operatorAdminReport,
  useOperatorAgentReportData,
  useOperatorAgentReportSummary,
  useRoutes,
} from "@/components/Query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/authContext";
import { Bus } from "@/lib/model";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/report-utils";
import { Diversity1 } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function TicketIdCell({ id }: { id: string }) {
  const [showFull, setShowFull] = useState(false);
  const displayId = showFull ? id : id.slice(0, 8) + "..."; // truncate first 8 chars

  return (
    <TableCell
      className="p-4 font-semibold text-primary cursor-pointer hover:opacity-75 transition-opacity"
      onClick={() => setShowFull(!showFull)}
      title={id}
    >
      {displayId}
    </TableCell>
  );
}
const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-Ca", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const getDayLabel = (date: string) => {
  const inputDate = new Date(date);
  const today = new Date();

  // Normalize (remove time)
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) {
    return "Today";
  }

  return inputDate.toLocaleDateString("en-US", { weekday: "long" });
};

const DayCard = ({
  date,
  tickets_sold,
  revenue,
  onClick,
}: {
  date?: string;
  tickets_sold?: number;
  revenue?: number;
  onClick?: () => void;
}) => {
  const day = getDayLabel(date ?? new Date().toDateString());

  return (
    <div
      onClick={onClick}
      className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        {/* LEFT - Main Content */}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {day}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(date ?? new Date().toDateString())}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Tickets Sold
              </p>
              <p className="text-2xl font-bold text-foreground">
                {tickets_sold}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(revenue ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT - Action */}
        <div className="flex flex-col items-end justify-between ml-6">
          <button
            onClick={onClick}
            className="text-sm font-medium text-primary hover:underline transition-all group-hover:gap-1 flex items-center gap-0.5"
          >
            View Details
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OperatorAdminReport() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<operatorAdminReport | null>(
    null,
  );
  const { data: reportData, isLoading: isSummaryLoading } =
    useOperatorAgentReportSummary(user?.organization_id || "");
  const [date, setDate] = useState("today");
  const [busPlate, setBusPlate] = useState<string>("all");
  const [route, setRoute] = useState("all");
  const [agent, setAgent] = useState("all");
  const [operator_name, setOperatorName] = useState("");
  const ranges: Record<string, number> = {
    today: 0,
    weekly: 7,
    monthly: 30,
  };

  const daySetter = (back_in_days: number) => {
    const today = new Date();
    today.setDate(today.getDate() - back_in_days);
    today.setHours(0, 0, 0, 0);

    return today.toLocaleDateString("en-CA");
  };
  const startDate = useMemo(() => daySetter(7), [date]); // correct this
  const endDate = useMemo(() => daySetter(0), []);
  console.log(startDate, endDate);

  const { data, isLoading: report2IsLoading } = useOperatorAgentReportData(
    user?.organization_id || "",
    "2026-01-20",
    "2026-03-21",
  );
  console.log(data);

  const { data: routes, isLoading: routeIsLoading } = useRoutes();

  const statsData = [
    {
      label: "Today's Revenue",
      value: selectedDay?.revenue ?? 0,
    },
    {
      label: "Tickets Sold Today",
      value: selectedDay?.tickets_sold ?? 0,
    },
  ];

  const isLoading = !user?.organization_id || routeIsLoading;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header Section */}
        <div className="sticky top-0 z-20 bg-white border-b border-border">
          <div className="p-6">
            <div className="flex items-center gap-4">
              {selectedDay && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
              )}
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {reportData?.operator_name} Report
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive view of your operational metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Visible when day is selected */}
        {selectedDay && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsData.map((stat, idx) => (
                <Card
                  key={idx}
                  className="bg-gradient-to-br from-white to-muted/5 border border-border p-6 rounded-lg"
                >
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {typeof stat.value === "number" &&
                      stat.label.includes("Revenue")
                        ? formatCurrency(stat.value)
                        : stat.value}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="px-6 pb-6">
          {/* {selectedDay && (
            <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Filters
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Refine your report data
                  </p>
                </div>

                <Button variant="outline" size="sm">
                  Print
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Date Range
                  </Label>
                  <Select value={date} onValueChange={setDate}>
                    <SelectTrigger className="bg-muted/50 h-10 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"today"}>Today</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Route
                  </Label>
                  <Select value={route} onValueChange={setRoute}>
                    <SelectTrigger className="bg-muted/50 h-10 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Routes</SelectItem>
                      {routes ? (
                        routes?.items.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.route_from} - {route.route_to}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={"none"} disabled>
                          No Route Found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )} */}

          {/* Summary Cards or Detailed View */}
          {!selectedDay ? (
            <div className="mt-4 space-y-4">
              {isSummaryLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
                  <Spinner className="h-8 w-8" />
                  <p className="text-sm">Loading reports...</p>
                </div>
              ) : (Array.isArray(data) ? data : [data])?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <p className="text-base font-medium text-gray-500">
                    No report data available
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                (Array.isArray(data) ? data : [data])?.map((item, index) => (
                  <div
                    key={index}
                    className="transition-all duration-200 hover:scale-[1.01]"
                  >
                    <DayCard
                      date={item?.date}
                      tickets_sold={item?.tickets_sold}
                      revenue={item?.revenue}
                      onClick={() => setSelectedDay(item!)}
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tickets Summary Section */}
              <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Ticket Summary
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Overview of ticket sales and revenue
                    </p>
                  </div>

                  <div className="md:text-center text-right">
                    <div className="space-y-4 md:flex md:gap-6">
                      <div className="mx-2.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Tickets Sold: {selectedDay?.tickets_sold ?? 0}
                        </p>
                      </div>
                      <div className="mx-2.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Revenue: {formatCurrency(selectedDay?.revenue ?? 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Tickets Table */}
              <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <h3 className="text-base font-semibold text-foreground">
                    Ticket Details
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/10 hover:bg-muted/10">
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4">
                          Ticket No
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4">
                          Bus Plate
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4">
                          From
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4">
                          To
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4">
                          Passenger
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4">
                          Sold By
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-bold p-4 text-right">
                          Price
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {report2IsLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            <div className="flex justify-center items-center">
                              <Spinner className="h-6 w-6" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : selectedDay?.items && selectedDay.items.length > 0 ? (
                        selectedDay.items.map((ticket, idx) => (
                          <TableRow
                            key={ticket.ticket_id}
                            className={`border-b border-border transition-colors ${
                              idx % 2 === 0 ? "bg-muted/5" : "bg-white"
                            } hover:bg-muted/20`}
                          >
                            <TicketIdCell id={ticket.ticket_id} />

                            <TableCell className="p-4 font-medium text-foreground">
                              {ticket.bus_plate_number}
                            </TableCell>
                            <TableCell className="p-4 text-foreground">
                              {ticket.route_from}
                            </TableCell>
                            <TableCell className="p-4 text-foreground">
                              {ticket.route_to}
                            </TableCell>
                            <TableCell className="p-4 text-foreground">
                              <div>
                                <p className="font-medium">
                                  {ticket.passenger_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Seat {ticket.seat_no}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell className="p-4">
                              <span className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                                {ticket.sold_by}
                              </span>
                            </TableCell>

                            <TableCell className="p-4 font-bold text-foreground text-right">
                              {formatCurrency(ticket.price)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <p className="font-medium">No tickets found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
