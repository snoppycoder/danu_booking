"use client";

import {
  MapPin,
  Calendar,
  Download,
  MoreVertical,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime, handleSearch } from "@/lib/common_functions";
import { useSearchParams } from "next/navigation";
import {
  Item,
  PopularRoute,
  SearchRouteResponse,
  Trip,
  TripData,
} from "@/lib/model";
import { agentApi, passengerApi } from "@/app/api/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TripDetailsModal } from "@/components/TripDetailModal";
import SeatBookingDialog from "@/components/SeatBookingDialog";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "sonner";
import { useAuth } from "@/lib/authContext";

export default function AgentBooking() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    route_from: searchParams.get("from") || "",
    route_to: searchParams.get("to") || "",
    departure_date: searchParams.get("date") || new Date().toString(),
  });
  const route_from = searchParams.get("from") || "";
  const route_to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const { user } = useAuth();
  const [data, setData] = useState<Item[]>([]);
  const [useInfoToggle, setUseInfoToggle] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripId, setTripId] = useState<string>("");

  function isTrip(item: Item): item is Trip {
    return "trip_id" in item;
  }

  const handleViewDetails = async (trip: Trip) => {
    const response = await passengerApi.getTripDetails(trip.trip_id);
    console.log(response, "trip details");
    setSelectedTrip(response);
    setIsModalOpen(true);
  };

  useEffect(() => {
    handleSearch(form).then((res) => {
      const data_ = res?.items || [];
      setData(data_);
    }); // for it fetch the data on load
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    const res = (await handleSearch(form)) ?? {
      departure_date: form.departure_date,
      route_from: form.route_from,
      items: [],
    };
    const data_ = res.items;
    console.log(data_, "items");
    setData(data_);
  }
  const handleSelectFromCity = (city: string) => {
    setForm({ ...form, route_from: city });
    setShowDropdownFrom(false);
    setSuggestionsFrom([]);
  };
  const handleSelectToCity = (city: string) => {
    setForm({ ...form, route_to: city });
    setShowDropdownTo(false);
    setSuggestionsTo([]);
  };

  async function handleAutoCompleteFrom(value: string) {
    try {
      setTimeout(async () => {
        const response = await passengerApi.autoComplete(value, "origin");

        setSuggestionsFrom(response);
        setShowDropdownFrom(true);
        console.log(response);
      }, 100);
    } catch (error) {
      console.error("Auto complete error:", error);
    }
  }
  async function handleAutoCompleteTo(value: string) {
    try {
      setTimeout(async () => {
        const response = await passengerApi.autoComplete(value, "destination");

        setSuggestionsTo(response);
        setShowDropdownTo(true);
        console.log(response);
      }, 100);
    } catch (error) {
      console.error("Auto complete error:", error);
    }
  }

  async function handleBookNow(trip: Item): Promise<void> {
    // if (isTrip(trip)) {
    //   await agentApi.handleBooking(user?.id || "", {
    //     trip_id: trip.trip_id,

    //   });
    //   setTripId(trip.trip_id);
    // }
    setUseInfoToggle(true);
  }

  return (
    <div className="">
      <Toaster richColors position="top-right" />
      <div className="p-8 mt-10">
        <form onSubmit={handleSubmit}>
          <Card className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl max-w-xl lg:max-w-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00a896]" />

                  <input
                    type="text"
                    placeholder="Departure City"
                    value={form.route_from}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, route_from: value });
                      handleAutoCompleteFrom(value);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />

                  {showDropdownFrom && suggestionsFrom.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                      {suggestionsFrom.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectFromCity(city)}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#00a896] hover:text-white transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                        >
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00a896]" />
                  <input
                    type="text"
                    placeholder="Destination City"
                    value={form.route_to}
                    onChange={(e) => {
                      handleAutoCompleteTo(e.target.value);
                      setForm({ ...form, route_to: e.target.value });
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                  {showDropdownTo && suggestionsTo.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                      {suggestionsTo.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectToCity(city)}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#00a896] hover:text-white transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                        >
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Departure Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.departure_date}
                  onChange={(e) =>
                    setForm({ ...form, departure_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-[#00a896] hover:bg-[#028f7f] text-white py-6 text-lg font-semibold">
                  Find Tickets
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Trips
            </h1>
            <p className="mt-2 text-gray-600">
              Select your preferred bus for your journey
            </p>
          </div>

          {data.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">No trips found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50">
                    <TableHead className="px-6 py-4 text-sm font-semibold text-slate-900">
                      Bus Operator
                    </TableHead>
                    {/* <TableHead className="px-6 py-4 text-sm font-semibold text-slate-900">
                      Route
                    </TableHead> */}
                    <TableHead className="px-6 py-4 text-sm font-semibold text-slate-900">
                      Departure
                    </TableHead>
                    <TableHead className="px-6 py-4 text-sm font-semibold text-slate-900">
                      Arrival
                    </TableHead>

                    <TableHead className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Fare
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                      Availability
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100">
                  {data.map((route, index) => (
                    <TableRow
                      key={index}
                      className="transition-all duration-200 hover:bg-slate-50/60"
                    >
                      {/* Bus Operator */}
                      <TableCell className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {route.operator.operator_name}
                        </p>
                      </TableCell>

                      {/* Route */}
                      {/* <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="text-sm">
                            {route_from.split(" ")[0]} →{" "}
                            {route_to.split(" ")[0]}
                          </span>
                        </div>
                      </TableCell> */}

                      {/* Departure */}
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {formatTime(route.departure_at)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Arrival */}
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-slate-700">
                          {route_to}
                        </span>
                      </TableCell>

                      {/* Duration */}
                      {/* <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{route.}</span>
                    </div>
                  </TableCell> */}

                      {/* Fare */}
                      <TableCell className="px-6 py-5 text-right">
                        <span className="text-lg font-bold text-teal-600">
                          {route.price} Birr
                        </span>
                      </TableCell>

                      {/* Availability */}
                      <TableCell className="px-6 py-5 text-center">
                        <Badge
                          variant="secondary"
                          className={`${
                            route.available_seats < 5
                              ? "bg-red-100/80 text-red-800 hover:bg-red-100"
                              : "bg-green-100/80 text-green-800 hover:bg-green-100"
                          }`}
                        >
                          {route.available_seats} Available
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            className="bg-teal-600 px-4 font-medium hover:bg-teal-700"
                            onClick={() => handleBookNow(route)}
                          >
                            Book
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-slate-100"
                              >
                                <MoreHorizontal className="h-5 w-5 text-slate-500" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  if (isTrip(route)) {
                                    handleViewDetails(route);
                                  }
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem className="cursor-pointer">
                                Check Seat Map
                              </DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <div className="hidden">
        <SeatBookingDialog
          toggle={useInfoToggle}
          setToggle={setUseInfoToggle}
          tripId={tripId}
        />
        <TripDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tripData={selectedTrip}
        />
      </div>
    </div>
  );
}
