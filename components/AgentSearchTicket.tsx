"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { MapPin } from "lucide-react";
import { passengerApi } from "@/app/api/api";
import { useRouter } from "next/navigation";
import EtDatePicker from "./eth-calendar/habesha-date-picker/src/EtDatePicker";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

type SearchTicketFormProp = {
  link: string;
};

export function SearchTicketForm({ link }: SearchTicketFormProp) {
  const [form, setForm] = useState({
    route_from: "",
    route_to: "",
    departure_date: new Date().toISOString().split("T")[0],
  });

  const [suggestionsFrom, setSuggestionsFrom] = useState<string[]>([]);
  const [suggestionsTo, setSuggestionsTo] = useState<string[]>([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!form.route_from.trim()) {
      setSuggestionsFrom([]);
      setShowDropdownFrom(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await passengerApi.autoComplete(form.route_from, "origin");
        setSuggestionsFrom(res);
        setShowDropdownFrom(true);
      } catch (err) {
        console.error("Origin autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.route_from]);

  useEffect(() => {
    if (!form.route_to.trim()) {
      setSuggestionsTo([]);
      setShowDropdownTo(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await passengerApi.autoComplete(
          form.route_to,
          "destination",
        );
        setSuggestionsTo(res);
        setShowDropdownTo(true);
      } catch (err) {
        console.error("Destination autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.route_to]);

  const handleSelectFromCity = (city: string) => {
    setForm((prev) => ({ ...prev, route_from: city }));
    setShowDropdownFrom(false);
  };

  const handleSelectToCity = (city: string) => {
    setForm((prev) => ({ ...prev, route_to: city }));
    setShowDropdownTo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/${link}/bookings?from=${form.route_from}&to=${form.route_to}&date=${form.departure_date}`,
    );
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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center p-4 md:mb-2.5">
        <SidebarTrigger />
      </div>

      <h2 className="text-xl md:text-2xl text-center font-bold text-gray-900 mb-6 px-4">
        Book a Ticket for a Passenger
      </h2>

      <div className="flex justify-center flex-1 pb-8 mt-8 md:mt-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-full md:max-w-4xl"
        >
          <Card className="p-4 md:p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* From Field */}
              <div className="sm:col-span-2 lg:col-span-1">
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

              {/* To Field */}
              <div className="sm:col-span-2 lg:col-span-1">
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

              {/* Date Field */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Departure Date
                </label>

                <EtDatePicker
                  minDate={new Date()}
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

              {/* Button */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <Button
                  disabled={
                    !form.route_from || !form.route_to || !form.departure_date
                  }
                  className="w-full bg-[#00a896] hover:bg-[#028f7f] text-white py-6 text-base md:text-lg font-semibold"
                >
                  Find Tickets
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
