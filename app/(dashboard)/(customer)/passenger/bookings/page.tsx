"use client";

import { MapPin, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useState } from "react";
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
import { Item, PopularRoute, SearchRouteResponse } from "@/lib/model";
import { passengerApi } from "@/app/api/api";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    route_from: searchParams.get("from") || "",
    route_to: searchParams.get("to") || "",
    departure_date: searchParams.get("date") || new Date().toString(),
  });
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const [data, setData] = useState<Item[]>([]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
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

  return (
    <div className="">
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
                    placeholder="Departure City"
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
                  Depart
                </label>
                <input
                  type="date"
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
      <div className="w-full flex justify-center mt-8 mb-8">
        <Card className="hover:shadow-lg w-[70%] p-4 rounded-md border border-gray-300">
          <CardContent className="px-4 py-2 flex space-x-[40%] items-center">
            <div>
              <h2 className="text-lg font-mono mb-2.5">Departure</h2>
              <div className="text-md font-mono">{form.route_from}</div>
              <div className="text-md font-mono">
                {formatTime(form.departure_date)}
              </div>
            </div>

            <div className="flex gap-x-8 h-full">
              <div className="h-full py-2 w-[1px] bg-gray-400 mx-2"></div>
              <div>
                <h2 className="text-lg font-mono mb-2.5">Return</h2>
                <div className="text-md font-mono">{form.route_to}</div>
                <div className="text-md font-mono">
                  {formatTime(form.departure_date)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="p-4">
        {data.length === 0 ? (
          <p className="text-center text-gray-500">No trips found</p>
        ) : (
          <Table className="mt-4 w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Bus Name</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead className="text-center">Fare</TableHead>
                <TableHead className="text-center">Seat Available</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((route, index) => (
                <TableRow key={index}>
                  <TableCell>{route.operator.operator_name}</TableCell>
                  <TableCell>{form.route_from}</TableCell>
                  <TableCell>{form.route_to}</TableCell>
                  <TableCell>{formatTime(route.departure_at)}</TableCell>
                  <TableCell className="text-center">
                    {route.price} Birr
                  </TableCell>
                  <TableCell className="text-center">0</TableCell>
                  <TableCell>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      Book Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
