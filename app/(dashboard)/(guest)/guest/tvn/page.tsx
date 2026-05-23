"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import QRCode from "react-qr-code";
import {
  AlertCircle,
  MapPin,
  Ticket,
  Bus,
  User,
  Hash,
  CreditCard,
  Clock,
} from "lucide-react";

import { useTicketNumber } from "@/components/Query";

export default function GuestTicketSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [ticketNumber, setTicketNumber] = useState<string>("");

  const {
    data: ticket,
    isLoading: loading,
    error,
  } = useTicketNumber(ticketNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setTicketNumber(searchInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Ticket className="size-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Ticket Search
            </h1>
          </div>
          <p className="text-slate-500">
            Enter your ticket number to view your boarding pass details
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-2 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter ticket number (e.g., C1A55674)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="min-w-32 rounded-md"
            >
              {loading ? <Spinner className="size-4" /> : "Search"}
            </Button>
          </form>
        </Card>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600 border border-red-100 shadow-sm">
            <AlertCircle className="size-5 shrink-0" />
            <p className="font-medium">{error.message}</p>
          </div>
        )}

        {/* Not Found State */}
        {!ticket && ticketNumber && !loading && !error && (
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-amber-600 border border-amber-100 shadow-sm">
            <AlertCircle className="size-5 shrink-0" />
            <p className="font-medium">No ticket found with that number.</p>
          </div>
        )}

        {/* Empty State */}
        {!ticket && !loading && !error && !ticketNumber && (
          <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed shadow-sm">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Ticket className="size-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Ready to travel?
            </h3>
            <p className="text-xs md:text-md text-slate-500 mt-1 max-w-sm">
              Search for your ticket number above to pull up your digital
              boarding pass.
            </p>
          </Card>
        )}

        {/* Ticket Result - Boarding Pass Style */}
        {ticket && (
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
            {/* Operator Banner */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {/* <Bus className="size-5 text-primary" /> */}
                <span className="text-xl font-semibold tracking-wide">
                  {ticket.booking?.operator.name || "Bus Operator"}
                </span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
                Confirmed
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Left Side: Main Details */}
              <div className="flex-1 p-6 md:p-8">
                {/* Route Information */}
                <div className="flex items-center justify-between mb-8 relative">
                  {/* From */}
                  <div className="flex flex-col items-center text-center w-1/3">
                    <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">
                      From
                    </p>
                    <h2 className="md:text-xl font-bold text-slate-900">
                      {ticket.booking?.trip.schedule.route.route_from}
                    </h2>
                  </div>

                  {/* Arrow/Distance */}
                  <div className="flex flex-col items-center justify-center w-1/3 px-4">
                    <div className="flex items-center w-full relative">
                      <div className="h-0.5 w-full bg-slate-200"></div>
                      <Bus className="size-6 text-slate-400 absolute left-1/2 -translate-x-1/2 bg-white px-1" />
                      <div className="absolute -right-1 size-2 rounded-full bg-slate-300"></div>
                      <div className="absolute -left-1 size-2 rounded-full bg-slate-300"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                      {ticket.booking?.trip.schedule.route.distance_km} km
                    </p>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="size-3" />
                      {
                        ticket.booking?.trip.schedule.route
                          .estimated_duration_minutes
                      }{" "}
                      mins
                    </p>
                  </div>

                  {/* To */}
                  <div className="flex flex-col items-center text-center w-1/3">
                    <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">
                      To
                    </p>
                    <h2 className="md:text-xl font-bold text-slate-900">
                      {ticket.booking?.trip.schedule.route.route_to}
                    </h2>
                  </div>
                </div>

                <hr className="my-6 border-slate-100" />

                {/* Passenger & Booking Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {ticket.passenger && (
                    <>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <User className="size-3" /> Passenger
                        </p>
                        <p className="font-semibold text-slate-900">
                          {ticket.passenger.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {ticket.passenger.gender}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                          Seat
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {ticket.passenger.seat_code}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <CreditCard className="size-3" /> Fare
                        </p>
                        <p className="font-semibold text-slate-900">
                          {ticket.passenger.seat_fare.toFixed(2)} ETB
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Hash className="size-3" /> Booking Ref
                    </p>
                    <p className="font-mono font-semibold text-slate-900">
                      {ticket.booking?.booking_ref}
                    </p>
                  </div>

                  <div className="col-span-2 bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Lottery Number
                    </p>
                    <p className="font-mono text-sm text-slate-700">
                      {ticket.lottery_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider (Dashed) */}
              <div className="hidden md:flex flex-col justify-between items-center relative w-8">
                <div className="absolute top-0 -mt-4 size-8 rounded-full bg-slate-50"></div>
                <div className="h-full w-px border-l-2 border-dashed border-slate-200"></div>
                <div className="absolute bottom-0 -mb-4 size-8 rounded-full bg-slate-50"></div>
              </div>

              {/* Right Side: QR Code & Ticket Info */}
              <div className="bg-slate-50 p-6 md:p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:w-72">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-4">
                  {/* Rendering the actual QR code image */}
                  <QRCode
                    value={`${ticket.qr_code_url}`} // or booking_ref or full URL
                    size={160}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Ticket Number
                  </p>
                  <p className="font-mono text-xl font-bold tracking-widest text-slate-900">
                    {ticket.ticket_number}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
