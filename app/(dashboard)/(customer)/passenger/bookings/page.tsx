"use client";

import { MapPin, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { handleSearch } from "@/lib/handleSearch";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BookingPage() {
  const busData: {
    busName: string;
    departure: string;
    duration: string;
    arrival: string;
    fare: string;
    seatAvailable: number;
  }[] = [
    {
      busName: "Express Line",

      departure: "Addis Ababa",
      duration: "10h 30m",
      arrival: "Bahir Dar",
      fare: "1200 ETB",
      seatAvailable: 1,
    },
    {
      busName: "City Connector",
      departure: "Addis Ababa",
      duration: "4h 20m",
      arrival: "Hawassa",
      fare: "650 ETB",
      seatAvailable: 7,
    },
    {
      busName: "Rapid Transit",
      departure: "Bahir Dar",
      duration: "11h 00m",
      arrival: "Addis Ababa",
      fare: "1100 ETB",
      seatAvailable: 3,
    },
    {
      busName: "Sunshine Travels",
      departure: "Hawassa",
      duration: "5h 10m",
      arrival: "Addis Ababa",
      fare: "700 ETB",
      seatAvailable: 9,
    },
    {
      busName: "Blue Nile Coaches",
      departure: "Addis Ababa",
      duration: "3h 50m",
      arrival: "Adama",
      fare: "300 ETB",
      seatAvailable: 20,
    },
    {
      busName: "Starline Buses",
      departure: "Adama",
      duration: "4h 10m",
      arrival: "Dire Dawa",
      fare: "500 ETB",
      seatAvailable: 6,
    },
    {
      busName: "Northern Express",
      departure: "Addis Ababa",
      duration: "14h 00m",
      arrival: "Mekelle",
      fare: "1500 ETB",
      seatAvailable: 5,
    },
    {
      busName: "Southern Comfort",
      departure: "Mekelle",
      duration: "13h 40m",
      arrival: "Addis Ababa",
      fare: "1600 ETB",
      seatAvailable: 8,
    },
    {
      busName: "Eastern Star Lines",
      departure: "Dire Dawa",
      duration: "15h 20m",
      arrival: "Mekelle",
      fare: "1700 ETB",
      seatAvailable: 2,
    },
    {
      busName: "Lakeview Travels",
      departure: "Bahir Dar",
      duration: "6h 15m",
      arrival: "Gondar",
      fare: "400 ETB",
      seatAvailable: 14,
    },
    {
      busName: "Highland Express",
      departure: "Gondar",
      duration: "6h 05m",
      arrival: "Bahir Dar",
      fare: "380 ETB",
      seatAvailable: 11,
    },
    {
      busName: "Coffee Land Buses",
      departure: "Addis Ababa",
      duration: "9h 00m",
      arrival: "Jimma",
      fare: "900 ETB",
      seatAvailable: 10,
    },
    {
      busName: "Valley Line Coaches",
      departure: "Jimma",
      duration: "8h 45m",
      arrival: "Addis Ababa",
      fare: "950 ETB",
      seatAvailable: 4,
    },
    {
      busName: "Omo River Travels",
      departure: "Hawassa",
      duration: "6h 30m",
      arrival: "Arba Minch",
      fare: "800 ETB",
      seatAvailable: 13,
    },
    {
      busName: "Savannah Express",
      departure: "Arba Minch",
      duration: "6h 25m",
      arrival: "Hawassa",
      fare: "780 ETB",
      seatAvailable: 15,
    },
    {
      busName: "Gambella Coaches",
      departure: "Addis Ababa",
      duration: "7h 50m",
      arrival: "Gambella",
      fare: "1300 ETB",
      seatAvailable: 6,
    },
  ];
  const [data, setData] = useState(busData);

  return (
    <div className="">
      <div className="p-8 bg-primary">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 mt-2.5">
          <div className="flex-1 min-w-0">
            <label className="block text-sm text-gray-600 mb-2 text-left">
              From
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
              <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Departure City"
                readOnly
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-sm text-gray-600 mb-2 text-left">
              Depart
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
              <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <input
                type="date"
                readOnly
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-sm text-gray-600 mb-2 text-left">
              Return (Optional)
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
              <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <input
                type="date"
                readOnly
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-colors whitespace-nowrap"
            onClick={handleSearch}
          >
            Search Again
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center mt-8 mb-8">
        <Card className="hover:shadow-lg w-[70%] p-4 rounded-md border border-gray-300">
          <CardContent className="px-4 py-2 flex space-x-[40%] items-center">
            <div>
              <h2 className="text-lg font-mono mb-2.5">Departure</h2>
              <div className="text-md font-mono">Cox's bazar - Dhaka</div>
              <div className="text-md font-mono">2025-11-28</div>
            </div>

            <div className="flex gap-x-8 h-full">
              <div className="h-full py-2 w-[1px] bg-gray-400 mx-2"></div>
              <div>
                <h2 className="text-lg font-mono mb-2.5">Return</h2>
                <div className="text-md font-mono">Cox's bazar - Dhaka</div>
                <div className="text-md font-mono">2025-11-28</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="p-4">
        <Table className="mt-4 w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Bus Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Departure
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Duration
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Arrival
              </TableHead>
              <TableHead className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Fare
              </TableHead>
              <TableHead className="px-8  py-3 text-center text-sm font-semibold text-gray-700">
                Seat Available
              </TableHead>
              <TableHead className="px-8py-3 text-left text-sm font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((passenger, index) => (
              <TableRow
                key={index}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <TableCell className="px-6 py-3 text-sm text-gray-800">
                  {passenger.busName}
                </TableCell>
                <TableCell className="px-6 py-3 text-sm text-gray-800">
                  {passenger.departure}
                </TableCell>
                <TableCell className="px-6 py-3 text-sm text-gray-800">
                  {passenger.duration}
                </TableCell>
                <TableCell className="px-6 py-3 text-sm text-gray-800">
                  {passenger.arrival}
                </TableCell>
                <TableCell className="flex justify-center px-6 py-3 text-sm text-gray-800">
                  {passenger.fare}
                </TableCell>
                <TableCell className="px-6 py-3 text-sm text-gray-800">
                  <div className="flex justify-center">
                    {passenger.seatAvailable > 1 ? (
                      <span className="text-green-600 font-semibold">
                        {passenger.seatAvailable} Seats Available
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">
                        {passenger.seatAvailable} Seat Available
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded transition-colors">
                    Book Now
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
