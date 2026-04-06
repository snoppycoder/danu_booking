"use client";

import {
  MapPin,
  Calendar,
  MoreVertical,
  MoreHorizontal,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useState } from "react";
import { formatTime } from "@/lib/common_functions";
import { useRouter, useSearchParams } from "next/navigation";
import { Bus, Item, Seat, Trip, TripData } from "@/lib/model";
import { passengerApi } from "@/app/api/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TripDetailsModal } from "@/components/TripDetailModal";
import SeatBookingDialog from "@/components/SeatBookingDialog";
import { Toaster } from "sonner";
import { searchResult, useSearchRoute } from "@/components/Query";
import EtDatePicker from "@/components/eth-calendar/habesha-date-picker/src/EtDatePicker";
import SeatLayoutDialog from "@/components/SeatLayoutDialog";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/report-utils";
import "@/i18n";
import { useTranslation } from "react-i18next";

export default function DanuBooking() {
  const searchParams = useSearchParams();
  const route_from = searchParams.get("from") || "";
  const route_to = searchParams.get("to") || "";
  const departure_date = searchParams.get("date") || new Date().toString();
  const [searchParamsState, setSearchParamsState] = useState({
    from: route_from,
    to: route_to,
    date: departure_date,
  });
  const { t } = useTranslation();
  const [form, setForm] = useState({
    route_from: searchParamsState.from || "",
    route_to: searchParamsState.to || "",
    departure_date: searchParamsState.date,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const per_page = 10;
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const [useInfoToggle, setUseInfoToggle] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [bus, setBus] = useState<
    { id: string; plate_no: string } | undefined
  >();
  const [tripId, setTripId] = useState<string>("");
  // const debouncedTo = useDebounce(form.route_to, 300);
  // const deboundedFrom = useDebounce(form.route_from, 300);
  const { data, isLoading, refetch } = useSearchRoute(
    searchParamsState.from,
    searchParamsState.to,
    searchParamsState.date,
    currentPage,
    per_page,
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setSearchParamsState({
      from: form.route_from,
      to: form.route_to,
      date: form.departure_date,
    });
    router.replace(
      `/passenger/bookings?from=${form.route_from}&to=${form.route_to}&date=${form.departure_date}`,
    );
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

  function handleAutoCompleteFrom(value: string) {
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

  function handleAutoCompleteTo(value: string) {
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

  async function handleBookNow(trip: searchResult): Promise<void> {
    console.log(trip);
    const response = await passengerApi.getTripDetails(trip.id);
    setBus(response.bus);
    setTripId(trip.id);
    setId(trip.operator.id);

    setUseInfoToggle(true);
  }
  return (
    <div className="">
      <Toaster richColors position="top-right" />
      <div className="p-8 bg-primary">
        <form onSubmit={handleSubmit}>
          <Card className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl max-w-xl lg:max-w-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("from")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00a896]" />

                  <input
                    type="text"
                    placeholder={t("departureCity")}
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
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("to")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00a896]" />
                  <input
                    type="text"
                    placeholder={t("destinationCity")}
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
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("departureDate")}
                </label>
                <EtDatePicker
                  minDate={new Date() ?? undefined}
                  value={
                    form.departure_date
                      ? (() => {
                          const [y, m, d] = form.departure_date
                            .split("-")
                            .map(Number);
                          return new Date(y, m - 1, d); // LOCAL date
                        })()
                      : null
                  }
                  sx={{ color: "#00a896", width: "100%" }}
                  onChange={(
                    date: Date | [Date | null, Date | null] | null,
                  ) => {
                    let selectedDate: Date | null = null;
                    if (Array.isArray(date)) {
                      selectedDate = date[0] ?? null;
                    } else {
                      selectedDate = date ?? null;
                    }
                    setForm({
                      ...form,
                      departure_date: selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : "",
                    });
                  }}
                  className="w-full px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-[#00a896] hover:bg-[#028f7f] text-white py-6 text-lg font-semibold">
                  {t("findTickets")}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
      <div className="w-full hidden md:flex justify-center mt-8 mb-8">
        <Card className="hover:shadow-lg w-[70%] p-4 rounded-md border border-gray-300">
          <CardContent className="px-4 py-2 flex space-x-[40%] items-center">
            <div>
              <h2 className="text-lg font-mono mb-2.5">Departure</h2>
              <div className="text-md font-mono">{route_from}</div>
              <div className="text-md font-mono">
                {formatTime(departure_date)}
              </div>
            </div>

            <div className="flex gap-x-8 h-full">
              <div className="h-full py-2 w-px bg-gray-400 mx-2"></div>
              <div>
                <h2 className="text-lg font-mono mb-2.5">Return</h2>
                <div className="text-md font-mono">{route_to}</div>
                <div className="text-md font-mono">
                  {formatTime(departure_date)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("availableTrips")}
            </h1>
            <p className="mt-2 text-gray-600">{t("selectYourPreferedBus")}</p>
          </div>

          {isLoading ? (
            <div className="rounded-xl bg-white p-12  flex justify-center text-center shadow-sm">
              <Spinner />
            </div>
          ) : data?.items.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">{t("noTripsFound")}</p>
            </div>
          ) : (
            <div className="w-full">
              {/* Routes Grid */}
              <div className="grid gap-6 grid-cols-1">
                {(data?.items || [])?.length > 0 ? (
                  data?.items.map((route) => (
                    <div
                      key={route.id}
                      className="group relative bg-card/70 backdrop-blur-sm border border-border/60 rounded-2xl p-6 
        hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 
        transition-all duration-300 ease-out"
                    >
                      {/* Top Section */}
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <h3
                            className="text-lg font-semibold tracking-tight text-foreground 
            group-hover:text-primary transition-colors duration-300"
                          >
                            {route.operator.name}
                          </h3>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-muted/60"
                            >
                              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                            // onClick={() => handleViewDetails(route)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Check Seats</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {/* Info Section */}
                      <div className="grid grid-cols-2 place-items-center md:grid-cols-3 gap-4 mb-6">
                        {/* Price */}
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground  tracking-wide">
                            Price
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {route.price}
                            <span className="text-sm font-medium ml-1 text-muted-foreground">
                              Birr
                            </span>
                          </span>
                        </div>

                        {/* Seats */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-muted-foreground tracking-wide">
                            Departure Time
                          </span>
                          <div className="flex items-center justify-center mt-1 px-3 py-1 rounded-full bg-green-500/10">
                            <span className="text-sm font-semibold text-black">
                              {route.departure_time.split(":")[0]} :{" "}
                              {route.departure_time.split(":")[1]}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className=" grid col-span-2 md:col-span-1 md:flex flex-col items-center">
                          <span className="text-xs text-center text-muted-foreground  tracking-wide">
                            Status
                          </span>
                          <div
                            className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full 
            bg-green-500/10 text-green-600"
                          >
                            <span className="text-sm font-semibold">
                              {route.is_available ? "Available" : "Sold Out"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handleBookNow(route)}
                        className="w-full h-11 rounded-xl font-semibold 
          bg-primary hover:bg-primary/90 
          shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {t("bookNow")}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-muted-foreground text-sm">
                      No routes available for your search
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {(data?.total ?? 0) > 0 && (
          <div className="flex mt-4 items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * per_page + 1} to{" "}
              {(currentPage - 1) * per_page + (data?.items.length ?? 0)} of{" "}
              {data?.total} entries
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button className="bg-primary text-primary-foreground">
                {currentPage}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={(data?.total ?? 0) <= currentPage * per_page}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden">
        <SeatLayoutDialog
          toggle={useInfoToggle}
          setToggle={setUseInfoToggle}
          setSelectedSeats={setSelectedSeats}
          seats={seats}
          setSeats={setSeats}
          trip_id={tripId}
          selectedSeats={selectedSeats}
          onSuccess={refetch}
          operator_id={id}
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
