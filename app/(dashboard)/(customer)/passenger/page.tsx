"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Toaster, toast } from "sonner";
import "@/i18n";
import { PopularRoute } from "@/lib/model";
import { passengerApi } from "@/app/api/api";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import EtDatePicker from "@/components/eth-calendar/habesha-date-picker/src";
import { useAuth } from "@/lib/authContext";

export default function DanuBooking() {
  const router = useRouter();
  const { access_token } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [date, setDate] = useState<Date | null>();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    route_from: "",
    route_to: "",
    departure_date: today,
  });
  useEffect(() => {
    // Fetch popular routes from your backend
    const fetchPopularRoutes = async () => {
      try {
        const response = await passengerApi.getPopularRoutes();

        setPopularRoutes(response.slice(0, 6)); // Show top 6 routes
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  const handleRouteSelect = (route: PopularRoute) => {
    if (!route) return;
    setForm({
      ...form,
      route_from: route.route_from,
      route_to: route.route_to,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!form.departure_date || !form.route_from || !form.route_to) {
      toast.error("Please enter all necessary inputs");
      return;
    }
    router.push(
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
      }, 300);
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
      }, 200);
    } catch (error) {
      console.error("Auto complete error:", error);
    }
  }

  const handleSelect = (newSelected: Date | undefined) => {
    // Update the selected dates
    setDate(newSelected);
  };

  return (
    <div className="w-full">
      <Toaster richColors position="top-right"></Toaster>

      <section className="relative py-20 px-4 sm:py-32 text-center text-white overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/bus.mp4" type="video/mp4" />
        </video>

        <div className="relative max-w-6xl mx-auto z-10">
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold mb-4 text-balance">
            {t("bookYourTickets")}
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 mb-8">
            {t("chooseYourDestinationsAndDatesToReserveATicket")}
          </p>

          <form onSubmit={handleSubmit}>
            <Card className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl max-w-xl lg:max-w-max mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
                  <Button
                    disabled={
                      !form.route_from || !form.route_to || !form.departure_date
                    }
                    className="w-full bg-[#00a896] hover:bg-[#028f7f] text-white py-6 text-lg font-semibold"
                  >
                    {t("findTickets")}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </section>
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mb-5">
            <TrendingUp className="w-8 h-8 text-[#00a896]" />
            <h3 className="text-3xl font-bold text-foreground">
              {t("popularRoutes")}
            </h3>
          </div>

          {/* Has data */}
          {!loading && popularRoutes?.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularRoutes?.map((route, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#00a896] group"
                    onClick={() => handleRouteSelect(route)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-[#00a896]" />
                          <span className="font-semibold text-lg text-foreground">
                            {route.route_from}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 ml-6">
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold text-lg text-foreground">
                            {route.route_to}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {route.trip_count.toLocaleString()} trips
                      </span>
                      <span className="text-sm font-medium text-[#00a896] opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Empty */}
          {!loading && popularRoutes?.length === 0 && (
            <div className="text-center">
              <p className="text-muted-foreground text-lg">
                No popular routes available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get More Out of Danu Booking with our Mobile App
          </h2>
          <p className="text-lg text-teal-50 mb-8 max-w-2xl mx-auto">
            Download our mobile app for exclusive deals, real-time updates, and
            seamless booking on the go.
          </p>
          <button className="bg-coral-500 hover:bg-coral-600 text-white font-semibold px-8 py-3 rounded inline-flex items-center gap-2 transition-colors">
            Download App
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
