"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useDanuAgentReportData,
  useOperatorAgentReportData,
  useOperatorBuses,
  useOperatorReport2,
  useOperatorStatCard,
  useRoutes,
} from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { Bus } from "@/lib/model";
import { Spinner } from "@/components/ui/spinner";
function TicketIdCell({ id }: { id: string }) {
  const [showFull, setShowFull] = useState(false);
  const displayId = showFull ? id : id.slice(0, 8) + "..."; // truncate first 8 chars

  return (
    <TableCell
      className="p-4 font-semibold text-primary cursor-pointer"
      onClick={() => setShowFull(!showFull)}
      title={id}
    >
      {displayId}
    </TableCell>
  );
}

export default function OperatorDashboard() {
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
  const startDate = useMemo(() => daySetter(ranges[date] ?? 0), [date]);
  const endDate = useMemo(() => daySetter(0), []);
  const { user } = useAuth();

  const { data, isLoading: report2IsLoading } = useDanuAgentReportData(
    user?.organization_id || "",
    startDate,
    endDate,
  );

  const { data: routes, isLoading: routeIsLoading } = useRoutes();

  const statsData = [
    {
      label: "Today's Revenue",
      value: data?.revenue,
    },
    {
      label: "Tickets Sold Today",
      value: data?.tickets_sold,
    },
  ];
  //   useEffect(() => {
  //     if (data?.operator_name?.trim().length) {
  //       // If statCard has operator_name, use it
  //       setOperatorName(statCard.operator_name);
  //       localStorage.setItem("operator_name", statCard.operator_name);
  //     } else {
  //       // Otherwise, fallback to localStorage if available
  //       const savedName = localStorage.getItem("operator_name");
  //       if (savedName?.trim().length) {
  //         setOperatorName(savedName);
  //       } else {
  //         setOperatorName("Operator"); // default
  //       }
  //     }
  //   }, [statCard]);
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
        {/* Header */}
        <div className="bg-white border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {operator_name} Report
              </h1>
              {/* <p className="text-sm text-muted-foreground">
                Total Tickets: 10 | Total Revenue: 54,800 ETB
              </p> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsData.map((stat, idx) => (
              <Card key={idx} className="bg-white border border-border p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <Card className="bg-white border border-border p-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>

              <Button variant="outline" size="sm">
                Print
              </Button>
            </div>

            <div className="grid grid-cols-2  lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Date
                </Label>
                <Select value={date} onValueChange={setDate}>
                  <SelectTrigger className="bg-background h-10">
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
                <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Route
                </Label>
                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger className="bg-background h-10">
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

          {/* Tickets Summary */}
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Tickets Sold
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Complete list of tickets
              </p>
            </div>
            <div className="text-right">
              <Table className="p-2">
                <TableRow>
                  <TableHead className="p-2">Tickets Sold</TableHead>
                  <TableHead className="p-2 ">Revenue</TableHead>
                </TableRow>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-2">
                      {data?.tickets_sold ?? 0}
                    </TableCell>
                    <TableCell className="p-2">{data?.revenue ?? 0}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/30">
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold p-4">
                      Ticket No
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold p-4">
                      Bus Plate
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold p-4">
                      From
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold p-4">
                      To
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold p-4">
                      Passenger
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold p-4">
                      Sold By
                    </TableHead>

                    <TableHead className="text-xs uppercase  tracking-wide text-muted-foreground font-semibold ">
                      Price
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {report2IsLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        <div className="flex justify-center">
                          <Spinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : data?.items && data.items.length > 0 ? (
                    data.items.map((ticket) => (
                      <TableRow
                        key={ticket.ticket_id}
                        className="h-18 border-b border-border odd:bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <TicketIdCell id={ticket.ticket_id} />

                        <TableCell className="p-4">
                          {ticket.bus_plate_number}
                        </TableCell>
                        <TableCell className="p-4">
                          {ticket.route_from}
                        </TableCell>
                        <TableCell className="p-4">{ticket.route_to}</TableCell>
                        <TableCell className="p-4">
                          {ticket.passenger_name} ({ticket.seat_no})
                        </TableCell>

                        <TableCell className="p-4">
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
                            {ticket.sold_by}
                          </span>
                        </TableCell>

                        <TableCell className="p-4 font-semibold">
                          {ticket.price}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // 🟡 Empty state
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No tickets found. Please adjust the filters above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
