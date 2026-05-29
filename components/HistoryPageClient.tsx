"use client";

import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePassengerHistory } from "@/components/Query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { passengerApi } from "@/app/api/api";
import CancelTripDialog from "./CancelBookingConfirm";

export default function HistoryPageClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const data = useSearchParams();
  const router = useRouter();

  const [bookingId, setBookingId] = useState<string>("");
  const numberOfCard = 5;
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = usePassengerHistory(currentPage, numberOfCard);
  const [open, setOpen] = useState(false);
  const canCancel = (departure_at: string) => {
    const now = new Date().getTime();
    const departure = new Date(departure_at).getTime();

    const fiveDaysAfterDeparture = departure + 5 * 24 * 60 * 60 * 1000;

    return now <= fiveDaysAfterDeparture;
  };
  async function cancelBooking(id: string) {
    await passengerApi.cancelBooking(id);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br  flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading your tickets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Error Loading Tickets
              </h3>
              <p className="text-red-700 text-sm">
                Unable to fetch your booking history. Please try again later.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen from-blue-50 to-indigo-100 p-6 md:p-8">
      <Button
        onClick={() => {
          router.replace(data.get("from") || "/");
        }}
        size={"lg"}
        variant="secondary"
        className="absolute cursor-pointer top-4 left-4 p-6 bg-transparent hover:bg-transparent"
      >
        <ArrowLeft size={24} className="w-6 h-6 text-gray-700" />
      </Button>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Booking
          </h1>
          <p className="text-gray-600 text-center">
            View all your past and upcoming trips
          </p>
        </div>

        {/* Empty State */}
        {!bookings || bookings.items.length === 0 ? (
          <Card className="p-12 text-center border-gray-200">
            <div className="mb-4">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600">
                Start booking your first trip to see it here
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.items.map((booking) => {
              const statusConfig: Record<
                string,
                { text: string; label: string }
              > = {
                confirmed: {
                  text: "text-green-800",
                  label: "Confirmed",
                },
                pending: {
                  text: "text-yellow-800",
                  label: "Pending",
                },
                cancelled: {
                  text: "text-red-500 ",
                  label: "Cancelled",
                },
                completed: {
                  text: "text-blue-800",
                  label: "Completed",
                },
              };

              const status = statusConfig[
                booking.booking_status?.toLowerCase()
              ] || {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: booking.booking_status,
              };

              return (
                <Card
                  key={booking.booking_id}
                  className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow pt-0"
                >
                  <div className="bg-primary px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Booking Reference</p>
                        <p className="text-white font-mono font-semibold text-lg">
                          {booking.booking_ref}
                        </p>
                      </div>
                      <Badge
                        className={` ${status.text} bg-white font-bold text-xs px-3 py-1 border-0`}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm">Route</p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {booking.route_from}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold text-gray-900">
                            {booking.route_to}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Departure Date & Time */}
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm mb-1">Departure</p>
                        <p className="font-semibold text-gray-900">
                          {format(
                            new Date(booking.departure_at),
                            "MMM dd, yyyy · HH:mm",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Operator */}
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="w-5 h-5 bg-indigo-600 rounded-full mt-1" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm mb-1">Operator</p>
                        <p className="font-semibold text-gray-900">
                          {booking.operator_name}
                        </p>
                      </div>
                    </div>

                    {/* Passengers & Amount */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600 text-sm">Passengers</p>
                          <p className="font-semibold text-gray-900">
                            {booking.passenger_count}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <DollarSign className="w-4 h-4 text-gray-400" /> */}
                        <div>
                          <p className="text-gray-600 text-sm">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {booking.total_amount.toFixed(2)} Birr
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full pt-4 grid grid-cols-1 md:grid-cols-2 border-t border-gray-200 gap-4">
                      <div className="">
                        <p className="text-gray-500 text-xs">
                          Booked on{" "}
                          {format(
                            new Date(booking.booked_at),
                            "MMM dd, yyyy HH:mm",
                          )}
                        </p>
                      </div>
                      <div>
                        {booking.booking_status === "confirmed" &&
                          canCancel(booking.departure_at) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setBookingId(booking.booking_id);
                                setOpen(true);
                              }}
                            >
                              Cancel Booking
                            </Button>
                          )}
                      </div>
                    </div>
                    {/* Booked At */}
                  </div>
                </Card>
              );
            })}
            {(bookings?.items.length ?? 0) > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * numberOfCard + 1} to{" "}
                  {(currentPage - 1) * numberOfCard +
                    (bookings?.items.length ?? 0)}{" "}
                  of {bookings?.total} entries
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button className="bg-primary text-primary-foreground">
                    {currentPage}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={
                      (bookings?.total ?? 0) <= currentPage * numberOfCard
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <CancelTripDialog
        open={open}
        setOpen={setOpen}
        onConfirm={() => {
          cancelBooking(bookingId);
        }}
      />
    </div>
  );
}
