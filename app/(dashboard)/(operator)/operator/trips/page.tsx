"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  User,
  Plus,
  ArrowRight,
} from "lucide-react";

import { TripDetailDialog } from "@/components/TripDetailDialog";
import {
  useCreateTrip,
  useDrivers,
  useOperatorBuses,
  useTrips,
} from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { Bus, CreateTripPayload, Driver, RouteDTO, Trip } from "@/lib/model";
import { operatorApi, superAdminApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";
import AccountNotActiveBanner from "@/components/AccountBanner";
import { ScheduleDialog } from "@/components/TripDialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RouteDetailDialog } from "@/components/ScheduleDetail";

export type ScheduleDTO = {
  id: string;

  operator: {
    id: string;
    name: string;
  };

  route: {
    id: string;
    route_from: string;
    route_to: string;
  };

  bus: {
    id: string;
    plate_no: string;
  };

  driver: {
    id: string;
    name: string;
  };

  departure_time: string;
  price: number;

  freq: string;
  interval: number;

  byweekday: string;
  bymonthday: string;
  bymonth: string;

  until: string;
  count: number;
  wkst: number;

  start_date: string;
  end_date: string;

  created_at: string;
  updated_at: string;
};

export default function TripManagement() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const per_page = 10;
  const { data: buses_ } = useOperatorBuses(user?.organization_id!);
  const {
    data: trips_,
    isLoading,
    isError,
    refetch,
    error,
  } = useTrips(user?.organization_id!, currentPage, per_page);
  console.log(trips_);

  const { data: driver_ } = useDrivers(user?.organization_id!);

  const [trips, setTrips] = useState<ScheduleDTO[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectFrom, setSelectFrom] = useState("");
  const [selectTo, setSelectTo] = useState("");
  const [routes, setRoutes] = useState<RouteDTO[]>([]);

  const { mutate, isPending, isSuccess } = useCreateTrip();

  useEffect(() => {
    const fetch = async () => {
      const res = await superAdminApi.listRoutes();
      setRoutes(res.items);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (buses_) setBuses(buses_);
    if (trips_?.items) setTrips(trips_.items);
    if (driver_) setDrivers(driver_);
  }, [buses_, trips_, driver_]);
  console.log(trips);

  const filteredTrips = trips.filter(
    (trip) =>
      !searchQuery ||
      trip.route.route_from == searchQuery ||
      trip.route.route_to == searchQuery ||
      trip.driver.name == searchQuery ||
      trip.bus.plate_no == searchQuery,
  );

  console.log(filteredTrips, "filtered trips");

  const isPageLoading = isLoading || !user?.organization_id;
  const showAccountBanner =
    isError &&
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response: { status: number } }).response?.status === 403;

  const formatDate = (dateString: string): string => {
    const data = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
    return data;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // const handleCreateTrip = (tripData: CreateTripPayload) => {
  //   mutate({
  //     operator_id: user?.organization_id || "",
  //     bus_id: tripData.bus_id,
  //     driver_id: tripData.driver_id,
  //     route_from: tripData.route_from,
  //     route_to: tripData.route_to,
  //     departure_at: tripData.departure_at,
  //     price: tripData.price,
  //   });
  //   setIsCreateDialogOpen(false);
  // };

  // const handleUpdateTrip = (tripData: {
  //   route_from: string;
  //   route_to: string;
  //   departure_at: string;
  //   price: number;
  //   bus_id: string;
  //   driver_id: string;
  // }) => {
  //   setIsEditDialogOpen(false);
  //   setSelectedTrip(null);
  // };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await operatorApi.deleteTrip(user?.organization_id || "", tripId);
      refetch();
      setIsDetailDialogOpen(false);
      setSelectedTrip(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || "Failed to delete trip");
      }
      console.error("Error deleting trip:", error);
    }
  };

  const handleViewDetails = (trip: ScheduleDTO) => {
    setSelectFrom(trip.route.route_from);
    setSelectTo(trip.route.route_to);
    setIsDetailDialogOpen(true);
  };

  // const handleEditTrip = (trip: Trip) => {
  //   setSelectedTrip(trip);
  //   setIsEditDialogOpen(true);
  // };

  const todayTripsCount = trips.filter((trip) => {
    const tripDate = new Date(trip.departure_time).toDateString();
    const today = new Date().toDateString();
    return tripDate === today;
  }).length;

  const avgPrice =
    trips.length > 0
      ? Math.round(
          trips.reduce((sum, trip) => sum + trip.price, 0) / trips.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <div className="mb-1 border-b border-gray-300 p-4 pt-4">
        <SidebarTrigger />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Stats */}
        <div className="grid justify-center gap-4 p-4 grid-cols-2 md:grid-cols-3">
          <Card className="px-4 py-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold text-foreground">
                {trips.length}
              </p>
            </div>
          </Card>
          <Card className="px-4 py-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-primary">
                {todayTripsCount}
              </p>
            </div>
          </Card>
          <Card className="px-4 py-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Price</p>
              <p className="text-2xl font-bold text-foreground">
                {avgPrice} ETB
              </p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
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

        {/* Loading State */}
        {isPageLoading && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading trips...</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!isPageLoading && filteredTrips.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-muted-foreground">No trips found</p>
            </div>
          </Card>
        )}

        {/* Trip List */}
        <div className="space-y-3 p-6">
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className="group transition-all hover:shadow-lg p-5"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* LEFT: Trip Content */}
                <div className="flex-1 space-y-5">
                  {/* Route (Hero Section) */}
                  <div className="flex items-center justify-center gap-4 rounded-lg bg-muted/40 py-3">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <MapPin className="size-5 text-primary" />
                      {trip.route.route_from}
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground" />
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <MapPin className="size-5 text-primary" />
                      {trip.route.route_to}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Departure */}
                    <div className="flex items-center gap-3 rounded-md border p-3">
                      <Calendar className="size-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {formatDate(trip.start_date)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(trip.end_date)}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 rounded-md border p-3">
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
                    <div className="flex w-full items-center gap-3 rounded-md border p-3 sm:w-full">
                      <User className="size-4 text-muted-foreground" />
                      <div className="w-full">
                        <div className="text-sm font-medium">Driver</div>
                        <div className="text-xs text-muted-foreground">
                          {trip.driver?.name || "No driver assigned"}
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
                      <DropdownMenuItem>Edit Trip</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        // onClick={() => handleDeleteTrip(trip.id!)}
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
      {(trips_?.items.length ?? 0) > 0 && (
        <div className="flex mt-8 p-8 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * Number(per_page) + 1} to{" "}
            {(currentPage - 1) * Number(per_page) +
              (filteredTrips?.length ?? 0)}{" "}
            of {trips_?.total} entries
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => p - 1);
              }}
            >
              Previous
            </Button>
            <Button className="bg-primary text-primary-foreground">
              {currentPage}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentPage((p) => p + 1);
              }}
              disabled={(trips_?.total ?? 0) <= currentPage * Number(per_page)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {/* <TripDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTrip}
        buses={buses}
        drivers={drivers}
      /> */}

      <ScheduleDialog
        open={isCreateDialogOpen}
        setOpen={setIsCreateDialogOpen}
        // onSubmit={handleUpdateTrip}
        buses={buses}
        drivers={drivers}
        routes={routes}
      />

      {/* {selectedTrip && (
        <TripDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          trip={selectedTrip}
          onEdit={() => {
            setIsDetailDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
          onDelete={() => handleDeleteTrip(selectedTrip.id!)}
        />
      )} */}
      <RouteDetailDialog
        open={isDetailDialogOpen}
        setOpen={setIsDetailDialogOpen}
        route_to={selectTo}
        route_from={selectFrom}
      />
    </div>
  );
}
