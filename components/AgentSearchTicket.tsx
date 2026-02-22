"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { MapPin } from "lucide-react";
import { passengerApi } from "@/app/api/api";
import { useRouter } from "next/navigation";

export function SearchTicketForm() {
  const [form, setForm] = useState({
    route_from: "",
    route_to: "",
    departure_date: new Date().toISOString().split("T")[0],
  });

  const [suggestionsFrom, setSuggestionsFrom] = useState<string[]>([]);
  const [suggestionsTo, setSuggestionsTo] = useState<string[]>([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const today = new Date().toISOString().split("T")[0];
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

  // =========================
  // Select handlers
  // =========================
  const selectFromCity = (city: string) => {
    setForm((prev) => ({ ...prev, route_from: city }));
    setShowDropdownFrom(false);
  };

  const selectToCity = (city: string) => {
    setForm((prev) => ({ ...prev, route_to: city }));
    setShowDropdownTo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/agent/bookings?from=${form.route_from}&to=${form.route_to}&date=${form.departure_date}`,
    );
  };

  return (
    <div className="w-full bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* FROM */}
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, route_from: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />

                {showDropdownFrom && suggestionsFrom.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestionsFrom.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectFromCity(city)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#00a896] hover:text-white transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                      >
                        <MapPin className="w-4 h-4" />
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, route_to: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />

                {showDropdownTo && suggestionsTo.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestionsTo.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectToCity(city)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#00a896] hover:text-white transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={form.departure_date}
                min={today}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    departure_date: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            {/* SUBMIT */}
            <div className="flex items-end">
              <Button className="w-full bg-[#00a896] hover:bg-[#028f7f] text-white py-6 text-lg font-semibold">
                Find Tickets
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
