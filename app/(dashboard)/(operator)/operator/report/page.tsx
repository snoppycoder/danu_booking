"use client";

import { useState } from "react";

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
  useOperatorBuses,
  useOperatorReport2,
  useOperatorStatCard,
  useRoutes,
} from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { Bus } from "@/lib/model";

export default function OperatorDashboard() {
  const [date, setDate] = useState("today");
  const [busPlate, setBusPlate] = useState("all");
  const [route, setRoute] = useState("all");
  const [agent, setAgent] = useState("all");

  const [fromDate, setFromDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  });

  const daySetter = (back_in_days: number) => {
    const day = new Date();
    day.setDate(day.getDate() - back_in_days);
    return day;
  };
  const { user } = useAuth();
  const { data: statCard } = useOperatorStatCard(user?.organization_id || "");
  const { data } = useOperatorReport2(user?.organization_id || "");
  const { data: bus } = useOperatorBuses(user?.organization_id || "");

  const { data: routes } = useRoutes();

  const statsData = [
    {
      label: "Today Revenue",
      value: statCard?.today_revenue
        ? statCard.today_revenue.toLocaleString()
        : "0",
    },
    {
      label: "Tickets Sold Today",
      value: statCard?.tickets_sold_today?.toLocaleString() || "0",
    },
    {
      label: "Tickets by Agents",
      value: statCard?.total_tickets_by_agents?.toLocaleString() || "0",
    },
    // { label: "Website/App Sales", value: "89" },
  ];

  const ticketsData = [
    {
      no: "T001",
      plate: "HAB-001",
      from: "Addis Ababa",
      to: "Dire Dawa",
      passenger: "Addis Ababa",
      seat: "12",
      sale: "Agent Selem",
      price: "3650 ETB",
    },
    {
      no: "T002",
      plate: "HAB-001",
      from: "Addis Ababa",
      to: "Dire Dawa",
      passenger: "Alem",
      seat: "13",
      sale: "Website",
      price: "3650 ETB",
    },
    {
      no: "T003",
      plate: "HAB-002",
      from: "Addis Ababa",
      to: "Dire Dawa",
      passenger: "Bekane",
      seat: "14",
      sale: "Agent Selem",
      price: "3650 ETB",
    },
    {
      no: "T004",
      plate: "HAB-002",
      from: "Addis Ababa",
      to: "Dire Dawa",
      passenger: "Marta",
      seat: "15",
      sale: "App",
      price: "3650 ETB",
    },
    {
      no: "T005",
      plate: "HAB-003",
      from: "Addis Ababa",
      to: "Dire Dawa",
      passenger: "David",
      seat: "16",
      sale: "Website",
      price: "3650 ETB",
    },
    {
      no: "T006",
      plate: "HAB-003",
      from: "Addis Ababa",
      to: "Dire Dawa",
      passenger: "Sara",
      seat: "17",
      sale: "Agent Selem",
      price: "3650 ETB",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {statCard?.operator_name || "Operator"} Report
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
                    <SelectItem
                      value="today"
                      onClick={() => {
                        let date = daySetter(1);
                        setToDate(date.toISOString().split("T")[0]);
                      }}
                    >
                      Today
                    </SelectItem>

                    <SelectItem
                      onClick={() => {
                        let date = daySetter(7);
                        setToDate(date.toISOString().split("T")[0]);
                      }}
                      value="weekly"
                    >
                      Weekly
                    </SelectItem>
                    <SelectItem
                      onClick={() => {
                        let date = daySetter(30);
                        setToDate(date.toISOString().split("T")[0]);
                      }}
                      value="monthly"
                    >
                      Monthly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Bus Plate
                </Label>
                <Select value={busPlate} onValueChange={setBusPlate}>
                  <SelectTrigger className="bg-background h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bus</SelectItem>
                    {bus ? (
                      bus.map((bus: Bus) => (
                        <SelectItem value={bus.plate_no}>
                          {bus.plate_no}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No Buses
                      </SelectItem>
                    )}
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
                        <SelectItem value={route.id}>
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

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Agent
                </Label>
                <Select value={agent} onValueChange={setAgent}>
                  <SelectTrigger className="bg-background h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="agents">Agent</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="app">App</SelectItem>
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
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      Ticket No
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      Bus Plate
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      From
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      To
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      Passenger
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      Sold By
                    </TableHead>

                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold text-right">
                      Price
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.items && data.items.length > 0 ? (
                    data.items.map((ticket) => (
                      <TableRow
                        key={ticket.ticket_id}
                        className="h-12 border-b border-border odd:bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="font-semibold text-primary">
                          {ticket.ticket_id}
                        </TableCell>

                        <TableCell>{ticket.bus_plate_number}</TableCell>
                        <TableCell>{ticket.route_from}</TableCell>
                        <TableCell>{ticket.route_to}</TableCell>
                        <TableCell>{ticket.passenger_name}</TableCell>

                        <TableCell className="text-right">
                          {ticket.seat_no}
                        </TableCell>

                        <TableCell>
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
                            {ticket.sold_by}
                          </span>
                        </TableCell>

                        <TableCell className="text-right font-semibold">
                          {ticket.price}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No tickets found
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
