"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  MapPin,
  Calendar,
  DollarSign,
  // Bus,
  User,
  Plus,
  ArrowRight,
} from "lucide-react";
import { TripDialog } from "@/components/TripDialog";
import { TripDetailDialog } from "@/components/TripDetailDialog";
import { useDrivers, useOperatorBuses, useTrips } from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { Bus, Driver, Route, Trip } from "@/lib/model";

// Mock data - replace with your actual API call

// Mock data for buses and drivers

export interface Trip_ extends Trip {
  id: string;
  operator_id: string;
  bus_id: string;
  driver_id: string;
  route_from: string;
  route_to: string;
  departure_at: string;
}

export default function TripManagement() {
  const { user } = useAuth();

  const { data: buses_ } = useOperatorBuses(user?.id!);
  const { data: trips_ } = useTrips(user?.id!);
  const { data: driver_ } = useDrivers(user?.id!);
  const [trips, setTrips] = useState<Trip_[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    setBuses(buses_ ?? []);
    setTrips(trips_ ?? []);
    setDrivers(driver_ ?? []);

    console.log("Buses:", buses_);
    console.log("Trips:", trips_);
    console.log("Drivers:", driver_);
  }, [buses_, trips_]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOperator, setFilterOperator] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip_ | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);

  // Extract unique operators
  const operators = Array.from(new Set(trips?.map((trip) => trip.operator)));

  // Filter trips
  const filteredTrips = trips?.filter((trip) => {
    const matchesSearch =
      trip.route_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route_to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOperator =
      filterOperator === "all" ||
      trip.operator.operator_name === filterOperator;

    return matchesSearch && matchesOperator;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCreateTrip = (tripData: any) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      ...tripData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Add related data from selected IDs
      operator_name:
        buses.find((b) => b.id === tripData.bus_id)?.plate_no || "Unknown",
      bus_number: buses.find((b) => b.id === tripData.bus_id)?.id || "Unknown",
      driver_name:
        drivers.find((d) => d.id === tripData.driver_id)?.first_name ||
        "Unknown",
    };
    setTrips((prev) => [newTrip, ...prev]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTrip = (tripData: any) => {
    setTrips(
      trips?.map((trip) =>
        trip.id === selectedTrip?.id
          ? {
              ...trip,
              ...tripData,
              updated_at: new Date().toISOString(),
              operator_name:
                buses.find((b) => b.id === tripData.bus_id)?.operator_id ||
                trip.operator.operator_name,
            }
          : trip
      )
    );
    setIsEditDialogOpen(false);
    setSelectedTrip(null);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      setTrips(trips.filter((trip) => trip.id !== tripId));
      setIsDetailDialogOpen(false);
      setSelectedTrip(null);
    }
  };

  const handleViewDetails = (trip: Trip_) => {
    setSelectedTrip(trip);
    setIsDetailDialogOpen(true);
  };

  const handleEditTrip = (trip: Trip_) => {
    setSelectedTrip(trip);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Trip Management
            </h1>
            <p className="text-muted-foreground">
              Manage trips, routes, and schedules across operators
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Create Trip
          </Button>
        </div>

        {/* Filters */}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold text-foreground">
                {trips.length}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-primary">
                {
                  trips.filter(
                    (t) =>
                      new Date(t.departure_at).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Operators</p>
              <p className="text-2xl font-bold text-foreground">
                {operators.length}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Price</p>
              <p className="text-2xl font-bold text-foreground">
                {trips.length > 0
                  ? Math.round(
                      trips.reduce((sum, t) => sum + t.price, 0) / trips.length
                    )
                  : 0}{" "}
                ETB
              </p>
            </div>
          </Card>
        </div>
        <div className="flex p-4 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by route, bus, or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Trip List */}
        <div className="space-y-3">
          {filteredTrips.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground">
                  No trips found matching your filters
                </p>
              </div>
            </Card>
          ) : (
            filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                className="p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Trip Info */}
                  <div className="flex-1 space-y-3">
                    {/* Route */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <MapPin className="size-5 text-primary" />
                        {trip.route_from}
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground" />
                      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <MapPin className="size-5 text-primary" />
                        {trip.route_to}
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {trip.operator.operator_name}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4" />
                        <div>
                          <div className="font-medium text-foreground">
                            {formatDate(trip.departure_at)}
                          </div>
                          <div className="text-xs">
                            {formatTime(trip.departure_at)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="size-4" />
                        <div>
                          <div className="font-medium text-foreground">
                            {trip.price} ETB
                          </div>
                          <div className="text-xs">Price per seat</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        {/* <Bus className="size-4" /> */}
                        <div>
                          <div className="font-medium text-foreground">
                            {trip.bus_id}
                          </div>
                          <div className="text-xs">Bus Number</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="size-4" />
                        <div>
                          <div className="font-medium text-foreground">
                            {/* {trip.driver_name} */} Driver name
                          </div>
                          <div className="text-xs">Driver</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(trip)}
                      className="flex-1 lg:flex-none lg:w-full"
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTrip(trip)}>
                          Edit Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteTrip(trip.id)}
                        >
                          Delete Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TripDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTrip}
        buses={buses}
        drivers={drivers}
      />

      <TripDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateTrip}
        buses={buses}
        drivers={drivers}
        trip={selectedTrip}
      />

      {selectedTrip && (
        <TripDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          trip={selectedTrip}
          onEdit={() => {
            setIsDetailDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
          onDelete={() => handleDeleteTrip(selectedTrip.id)}
        />
      )}
    </div>
  );
}
