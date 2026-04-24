"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  TrendingUp,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
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

  // --- PARTNER SLIDESHOW LOGIC ---
  const PARTNER_LOGOS = [
    "/images/partner1.png",
    "/images/partner2.png",
    "/images/partner3.png",
    "/images/partner4.png",
    "/images/partner5.png",
    // You can add more image paths here to increase the slideshow length!
  ];

  const [partnerIndex, setPartnerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPartnerIndex((prevIndex) => (prevIndex + 1) % PARTNER_LOGOS.length);
    }, 3000); // Cycles every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const arcClasses = [
    "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-lg bg-white flex items-center justify-center overflow-hidden transform translate-y-12 sm:translate-y-16 -mr-4 sm:-mr-8 z-0 transition-all duration-500",
    "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-2xl bg-white flex items-center justify-center overflow-hidden transform -translate-y-4 sm:-translate-y-6 z-10 transition-all duration-500",
    "w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl bg-white flex items-center justify-center overflow-hidden transform -translate-y-8 sm:-translate-y-12 mx-4 sm:mx-8 z-20 transition-all duration-500",
    "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-2xl bg-white flex items-center justify-center overflow-hidden transform -translate-y-4 sm:-translate-y-6 z-10 transition-all duration-500",
    "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-lg bg-white flex items-center justify-center overflow-hidden transform translate-y-12 sm:translate-y-16 -ml-4 sm:-ml-8 z-0 transition-all duration-500",
  ];
  // -------------------------------

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

      <section className="py-16 px-4 bg-background relative z-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-3 mb-10">
            <h3 className="text-3xl font-bold text-foreground">
              {t("popularRoutes")}
            </h3>
          </div>
          {loading && (
            <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          )}

          {/* Has data */}
          {!loading && popularRoutes?.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularRoutes?.map((route, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-[#00a896] group rounded-xl"
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
                          <span className="text-muted-foreground">—</span>
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

      {/* Our Partners Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-12">
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[250px] px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-black mt-12 mb-4">
            Our Partners
          </h2>
        </div>

        {/* Curved Grey Background */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180%] sm:w-[130%] md:w-[110%] h-[80%] bg-[#f4f5f6]"
          style={{
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 100%",
          }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[250px] px-4">
          {/* Logos Arc Dynamic Rendering */}
          <div className="flex justify-center items-center w-full relative h-32 md:h-40 mb-8 sm:mb-4 px-2 sm:px-10 max-w-4xl mx-auto">
            {arcClasses.map((className, idx) => {
              // Get the proper image index based on the interval offset
              const imageIndex = (partnerIndex + idx) % PARTNER_LOGOS.length;

              return (
                <div key={idx} className={className}>
                  <img
                    src={PARTNER_LOGOS[imageIndex]}
                    alt={`Partner ${imageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/150?text=Bus";
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#098274] text-white pt-12 pb-8 px-6 sm:px-12 w-full border-t border-[#098274]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="flex flex-col gap-1.5 text-sm text-gray-100">
            <p>danubooking@gmail.com</p>
            <p>0911854567</p>
            <p>XYZ Building Third Floor, Bole, Addis Ababa</p>

            <div className="flex gap-3 mt-6">
              <button className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-900 transition-colors h-11 shadow-sm">
                <svg
                  viewBox="0 0 512 512"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] leading-none uppercase mb-0.5 tracking-wide">
                    GET IT ON
                  </div>
                  <div className="text-sm font-semibold leading-tight">
                    Google Play
                  </div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-900 transition-colors h-11 shadow-sm">
                <svg
                  viewBox="0 0 384 512"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] leading-none mb-0.5 tracking-wide">
                    Download on the
                  </div>
                  <div className="text-sm font-semibold leading-tight">
                    App Store
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-gray-100">
            <a href="#" className="hover:text-white transition-colors">
              Terms and Conditions
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact Us
            </a>
            <a href="#" className="hover:text-white transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-white transition-colors">
              FAQ
            </a>

            <div className="flex items-center gap-2 mt-6">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <Facebook
                  size={16}
                  fill="currentColor"
                  className="text-gray-200"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <Instagram size={16} className="text-gray-200" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <Youtube size={16} className="text-gray-200" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <Linkedin
                  size={16}
                  fill="currentColor"
                  className="text-gray-200"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}