"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { superAdminApi } from "@/app/api/api";

export interface LotteryDTO {
  lottery_number: string;
  ticket_id: string;
  ticket: {
    ticket_id: string;
    status: string;
    created_at: string;
  };
  passenger: {
    name: string;
    email: string;
    phone: string;
  };
  trip: {
    trip_id: string;
    route_from: string;
    route_to: string;
    departure_date: string;
    departure_time: string;
  };
  operator: {
    operator_id: string;
    operator_name: string;
  };
  booking: {
    booking_id: string;
    booking_reference: string;
    booking_date: string;
    booked_by: string | null;
  };
}

export default function LotteryDraw() {
  const today = new Date();

  function toExactDateString(date: Date | undefined) {
    if (!date) return undefined;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
  }

  const [lottery, setLottery] = useState<LotteryDTO | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>(today);
  const [toDate, setToDate] = useState<Date | undefined>(() => {
    const d = new Date(today);
    d.setDate(today.getDate() + 7); // add 7 days
    return d;
  });

  async function handleDraw(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const data = await superAdminApi.drawLottery(
      toExactDateString(fromDate),
      toExactDateString(toDate),
    );
    console.log(data);
    setLottery(data); // optional: set lottery state if API returns the drawn lottery
  }

  return (
    <div className="p-6">
      {/* Date Pickers */}
      <div className="p-4 flex gap-4">
        {/* From Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-48 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate
                ? format(fromDate, "MMM dd, yyyy")
                : new Date().toDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate || undefined}
              onSelect={setFromDate}
              disabled={(date) => (toDate ? date > toDate : false)}
            />
          </PopoverContent>
        </Popover>

        {/* To Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-48 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={toDate || undefined}
              onSelect={setToDate}
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>

        <Button variant="default" onClick={handleDraw}>
          Draw
        </Button>
      </div>

      {lottery && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full min-w-lg rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                Lottery{" "}
                <span className="font-bold">{lottery?.lottery_number}</span>
              </h2>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  lottery.ticket.status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {lottery.ticket.status}
              </span>
            </div>

            {/* Passenger */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                Passenger
              </h3>
              <p className="text-sm font-medium">{lottery.passenger.name}</p>
              <p className="text-xs text-gray-500">{lottery.passenger.email}</p>
              <p className="text-xs text-gray-500">{lottery.passenger.phone}</p>
            </div>

            {/* Trip */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Trip</h3>
              <p className="text-sm font-medium">
                {lottery.trip.route_from} → {lottery.trip.route_to}
              </p>
              <p className="text-xs text-gray-500">
                {lottery.trip.departure_date} • {lottery.trip.departure_time}
              </p>
            </div>

            {/* Operator */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                Operator
              </h3>
              <p className="text-sm">{lottery.operator.operator_name}</p>
            </div>

            {/* Booking info */}
            <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
              <span>Ref: {lottery.booking.booking_reference}</span>
              <span>{lottery.booking.booking_date}</span>
            </div>

            <div className="text-xs text-gray-400">
              Ticket ID: {lottery.ticket_id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
