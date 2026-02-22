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
import {
  useCreateTrip,
  useDrivers,
  useOperatorBuses,
  useTrips,
} from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { Bus, CreateTripPayload, Driver, Route, Trip } from "@/lib/model";
import { operatorApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";
import AccountNotActiveBanner from "@/components/AccountBanner";

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

  const { data: buses_ } = useOperatorBuses(user?.organization_id!);
  const {
    data: trips_,
    isLoading,
    isError,
    error,
  } = useTrips(user?.organization_id!);
  const { data: driver_ } = useDrivers(user?.organization_id!);
  const [trips, setTrips] = useState<Trip_[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    setBuses(buses_ ?? []);
    setTrips(trips_ ?? []);
    setDrivers(driver_ ?? []);

    console.log("Buses:", buses_);
    console.log("Trips:", trips_);
    console.log("Drivers:", driver_);
  }, [buses_, trips_, driver_]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip_ | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const { mutate, isPending, isSuccess } = useCreateTrip();

  const filteredTrips = trips?.filter((trip) => {
    const matchesSearch =
      trip.route_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route_to.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
  const isPageLoading = isLoading || !user?.organization_id;
  const showAccountBanner =
    isError &&
    error &&
    typeof error === "object" &&
    "response" in error &&
    (
      error as {
        response: {
          status: number;
        };
      }
    ).response?.status === 403;

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
  //  departure_at: string;
  //     operator_id: string;
  //     route_from: string;
  //     route_to: string;
  //     price: number;
  //     bus_id: string;
  //     driver_id: string;
  // }
  const handleCreateTrip = (tripData: CreateTripPayload) => {
    const newTrip: Trip_ = {
      id: `trip-${Date.now()}`,
      operator_id: user?.organization_id || "",
      bus_id: tripData.bus_id,
      available_seats:
        buses.find((b) => b.id === tripData.bus_id)?.capacity || 0,
      driver_id: tripData.driver_id,
      route_from: tripData.route_from,
      route_to: tripData.route_to,
      departure_at: tripData.departure_at,
      price: tripData.price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      trip_id: "",
      operator: {
        operator_id: user?.organization_id || "",
        operator_name: "",
      },
    };

    setTrips((prev) => [...prev, newTrip]);

    mutate({
      operator_id: user?.organization_id || "",
      bus_id: tripData.bus_id,
      driver_id: tripData.driver_id,
      route_from: tripData.route_from,
      route_to: tripData.route_to,
      departure_at: tripData.departure_at,
      price: tripData.price,
    });

    setIsCreateDialogOpen(false);
  };

  const handleUpdateTrip = (tripData: {
    route_from: string;
    route_to: string;
    departure_at: string;
    price: number;
    bus_id: string;
    driver_id: string;
  }) => {
    setTrips(
      trips?.map((trip) =>
        trip.id === selectedTrip?.id
          ? {
              ...trip,
              ...tripData,
              updated_at: new Date().toISOString(),
              operator_name:
                buses.find((b) => b.id === tripData.bus_id)?.operator_id || "",
            }
          : trip,
      ),
    );
    setIsEditDialogOpen(false);
    setSelectedTrip(null);
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await operatorApi.deleteTrip(user?.organization_id || "", tripId);
      setTrips(trips.filter((trip) => trip.id !== tripId));
      setIsDetailDialogOpen(false);
      setSelectedTrip(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || "Failed to delete trip");
      }

      console.error("Error deleting trip:", error);
      return;
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
      <Toaster position="top-right" richColors />

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
            disabled={isLoading || isError}
          >
            <Plus className="size-4" />
            Create Trip
          </Button>
        </div>

        {/* Filters */}

        {/* Stats */}
        <div className="grid justify-center gap-4 md:grid-cols-3">
          <Card className="px-4 py-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold text-foreground">
                {trips.length}
              </p>
            </div>
          </Card>
          <Card className="px-4 py-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-primary">
                {
                  trips.filter(
                    (t) =>
                      new Date(t.departure_at).toDateString() ===
                      new Date().toDateString(),
                  ).length
                }
              </p>
            </div>
          </Card>
          {/* <Card className="px-4 py-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Operators</p>
              <p className="text-2xl font-bold text-foreground">
                {operators.length}
              </p>
            </div>
          </Card> */}
          <Card className="px-4 py-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Price</p>
              <p className="text-2xl font-bold text-foreground">
                {trips.length > 0
                  ? Math.round(
                      trips.reduce((sum, t) => sum + t.price, 0) / trips.length,
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

        {isPageLoading && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading trips...</p>
            </div>
          </Card>
        )}
        {!isPageLoading && filteredTrips && filteredTrips.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-muted-foreground">No trips found</p>
            </div>
          </Card>
        )}
        {/* Trip List */}
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className="group p-5 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* LEFT: Trip Content */}
                <div className="flex-1 space-y-5">
                  {/* Route (Hero Section) */}
                  <div className="flex items-center justify-center gap-4 rounded-lg bg-muted/40 py-3">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <MapPin className="size-5 text-primary" />
                      {trip.route_from}
                    </div>

                    <ArrowRight className="size-5 text-muted-foreground" />

                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <MapPin className="size-5 text-primary" />
                      {trip.route_to}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid  gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Departure */}
                    <div className="flex items-center gap-3 rounded-md border p-3">
                      <Calendar className="size-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {formatDate(trip.departure_at)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(trip.departure_at)}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 rounded-md border p-3">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {trip.price} ETB
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Price per seat
                        </div>
                      </div>
                    </div>

                    {/* Driver */}
                    <div className="flex items-center gap-3 rounded-md border p-3">
                      <User className="size-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Driver name</div>
                        <div className="text-xs text-muted-foreground">
                          Driver
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex gap-2 lg:flex-col lg:items-end">
                  <Button
                    size="sm"
                    onClick={() => handleViewDetails(trip)}
                    className="w-full lg:w-36"
                  >
                    View Details
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-60 transition-opacity group-hover:opacity-100"
                      >
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
          ))}
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
        trip={selectedTrip!}
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
