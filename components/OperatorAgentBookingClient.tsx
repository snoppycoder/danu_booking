"use client";

import {
  MapPin,
  Calendar,
  MoreVertical,
  MoreHorizontal,
  Users,
  Zap,
  BusIcon,
  CheckCircle2,
  Clock,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useRef, useState } from "react";
import { formatAmharicTime, formatTime } from "@/lib/common_functions";
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
import AgentSeatLayoutDialog from "./AgentSeatLayoutDialog";
import OperatorAgentSeatLayoutDialog from "./OperatorAgentSeatLayout";
import { AnimatePresence, motion, Variants } from "framer-motion";
import "@/i18n";
import { useTranslation } from "react-i18next";
export default function OperatorAgentBookingClient() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    route_from: searchParams.get("from") || "",
    route_to: searchParams.get("to") || "",
    departure_date: searchParams.get("date") || new Date().toString(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const per_page = 10;
  const route_from = searchParams.get("from") || "";
  const route_to = searchParams.get("to") || "";
  const departure_date = searchParams.get("date") || new Date().toString();
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const [useInfoToggle, setUseInfoToggle] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each card appearing
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };
  const fadeVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const [bus, setBus] = useState<
    { id: string; plate_no: string } | undefined
  >();
  const [tripId, setTripId] = useState<string>("");
  const debouncedTo = useDebounce(form.route_to, 300);
  const resultsRef = useRef<HTMLDivElement>(null);

  const deboundedFrom = useDebounce(form.route_from, 300);
  const { data, isLoading, refetch } = useSearchRoute(
    deboundedFrom,
    debouncedTo,
    form.departure_date,
    currentPage,
    per_page,
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    router.replace(
      `/operator-agent/bookings?from=${form.route_from}&to=${form.route_to}&date=${form.departure_date}`,
      { scroll: false },
    );
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
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
                <Button className="cursor-pointer w-full bg-[#00a896] hover:bg-[#028f7f] text-white py-6 text-lg font-semibold">
                  Find Tickets
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
              <div className="h-full py-2 w-[1px] bg-gray-400 mx-2"></div>
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
      <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50/50 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {t("availableTrips")}
            </h1>
            <p className="mt-2 text-gray-600 text-lg" ref={resultsRef}>
              {t("selectYourPreferedBus")}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                variants={fadeVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="rounded-2xl bg-white/80 backdrop-blur-sm p-16 flex justify-center items-center shadow-sm border border-gray-100"
              >
                <Spinner />
              </motion.div>
            ) : data?.items.length === 0 ? (
              <motion.div
                key="empty"
                variants={fadeVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-sm p-12 text-center shadow-sm sm:p-20"
              >
                <div className="mb-6 rounded-full bg-blue-50 p-5 text-primary ring-8 ring-blue-50/50">
                  <BusIcon className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {t("noTripsFound")}
                </h3>
                <p className="text-gray-500 max-w-sm">
                  We couldn't find any available buses for this route. Try
                  adjusting your search criteria or date.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                variants={fadeVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-full space-y-6"
              >
                {/* Routes Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid gap-5 grid-cols-1"
                >
                  {(data?.items || [])?.length > 0 ? (
                    data?.items.map((route: searchResult) => (
                      <motion.div
                        variants={itemVariants}
                        key={route.id}
                        className="group relative flex flex-col md:flex-row bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 ease-out"
                      >
                        <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 overflow-hidden bg-gray-100">
                          <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%] animate-[shimmer_2s_infinite]" />

                          {/* Availability Badge superimposed on image */}
                          <div className="absolute top-4 left-4">
                            <div
                              className={`px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold flex items-center gap-1.5 shadow-sm
                              ${
                                route.is_available
                                  ? "bg-green-500/90 text-white"
                                  : "bg-red-500/90 text-white"
                              }`}
                            >
                              {route.is_available ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              {route.is_available ? "Available" : "Sold Out"}
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col grow p-6 sm:p-8">
                          {/* Top Row: Operator & Menu */}
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                                {route.operator.name}
                              </h3>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 -mt-2 -mr-2"
                                >
                                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-44 rounded-xl"
                              >
                                {/* <DropdownMenuItem
                                  onClick={() => handleViewDetails(route.id)}
                                  className="cursor-pointer"
                                >
                                  {t("viewDetails")}
                                </DropdownMenuItem> */}
                                <DropdownMenuItem className="cursor-pointer">
                                  Check Seats
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-6 mb-8">
                            {/* Departure Time */}
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                                <Clock className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Departure and Arrival time
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatAmharicTime(route.departure_time)} -{" "}
                                  {formatAmharicTime(route.arrival_time)}
                                </p>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 rounded-xl bg-green-50 text-green-600 shrink-0 mt-0.5">
                                <Wallet className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Price
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {route.price}
                                  <span className="text-sm font-medium ml-1 text-gray-500">
                                    Birr
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex gap-3 flex-col sm:flex-row mt-auto pt-6 border-t border-gray-100">
                            <Button
                              onClick={() => handleBookNow(route)}
                              disabled={!route.is_available}
                              className="w-full text-lg font-semibold h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-none"
                            >
                              {t("bookNow")}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center">
                      <p className="text-gray-500 text-sm">
                        No routes available for your search
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          <AnimatePresence>
            {(data?.total ?? 0) > 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} // Appears slightly after the list renders
                className="flex flex-col sm:flex-row mt-8 items-center justify-between gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/60"
              >
                <p className="text-sm font-medium text-gray-500">
                  Showing{" "}
                  <span className="text-gray-900">
                    {(currentPage - 1) * per_page + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-gray-900">
                    {(currentPage - 1) * per_page + (data?.items.length ?? 0)}
                  </span>{" "}
                  of <span className="text-gray-900">{data?.total}</span>{" "}
                  entries
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-9 px-4 border-gray-200"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground rounded-lg h-9 w-9 p-0"
                  >
                    {currentPage}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-9 px-4 border-gray-200"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={(data?.total ?? 0) <= currentPage * per_page}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden">
        <OperatorAgentSeatLayoutDialog
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
        {/* <TripDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tripData={selectedTrip}
        /> */}
      </div>
    </div>
  );
}
