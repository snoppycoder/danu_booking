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
import { Item, SearchRouteResponse } from "@/lib/model";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    route_from: searchParams.get("from") || "",
    route_to: searchParams.get("to") || "",
    departure_date: searchParams.get("date") || new Date().toString(),
  });

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

  return (
    <div className="">
      <div className="p-8 bg-primary">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                From
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Departure City"
                  value={form.route_from}
                  onChange={(e) =>
                    setForm({ ...form, route_from: e.target.value })
                  }
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                To
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Destination City"
                  value={form.route_to}
                  onChange={(e) =>
                    setForm({ ...form, route_to: e.target.value })
                  }
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                Depart
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                {/* <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0" /> */}
                <input
                  type="date"
                  value={form.departure_date}
                  onChange={(e) =>
                    setForm({ ...form, departure_date: e.target.value })
                  }
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                Return date (Optional)
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div> */}

            <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-colors whitespace-nowrap">
              Find Tickets
            </Button>
          </div>
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
