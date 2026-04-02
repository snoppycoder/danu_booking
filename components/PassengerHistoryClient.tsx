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
  Share,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
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
import { History } from "@/lib/model";
import { passengerApi } from "@/app/api/api";
import { useState } from "react";

import CancelTripDialog from "./CancelBookingConfirm";
import { Button } from "./ui/button";

function formatEthiopianTime(date: Date): string {
  let hour = date.getHours();
  const minutes = date.getMinutes();

  // Convert to Ethiopian hour
  let ethHour = hour - 6;
  if (ethHour <= 0) ethHour += 12;
  if (ethHour > 12) ethHour -= 12;

  // Determine period
  let period = "";

  if (hour >= 6 && hour < 12) {
    period = "ጠዋት"; // morning
  } else if (hour >= 12 && hour < 18) {
    period = "ከሰዓት"; // afternoon
  } else {
    period = "ማታ"; // night
  }

  return `${ethHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}
export function exportTicketIntoPDF(booking: History): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [240, 100],
  });

  // --- MODERN COLOR PALETTE ---
  const brandTeal = [13, 148, 136]; // Deep, sophisticated teal (#0d9488)
  const bgWhite = [255, 255, 255]; // Clean white background
  const textDark = [31, 41, 55]; // Gray 800 for primary text
  const textMuted = [107, 114, 128]; // Gray 500 for labels
  const borderLight = [229, 231, 235]; // Gray 200 for subtle lines

  const depDate = new Date(booking.departure_at);

  // --- 1. BASE BACKGROUND ---
  doc.setFillColor(bgWhite[0], bgWhite[1], bgWhite[2]);
  doc.rect(0, 0, 240, 100, "F");

  // --- 2. BRANDING ACCENT (Left Edge Bar) ---
  doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.rect(0, 0, 6, 100, "F");

  // --- 3. SEPARATOR LINE (The "Tear-off" Stub) ---
  const stubX = 170; // Moved slightly right to give the main body more breathing room
  doc.setLineWidth(0.5);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(stubX, 5, stubX, 85);
  doc.setLineDashPattern([], 0); // Reset dash

  // ==========================================
  //         MAIN TICKET BODY (LEFT)
  // ==========================================

  // Header
  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("DANU", 15, 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(10);
  doc.text("BOARDING PASS", 38, 18);

  // Subtle Header Divider
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.2);
  doc.line(15, 24, stubX - 10, 24);

  // Helper function to draw label/value pairs to keep code DRY
  const drawInfoBox = (
    label: string,
    value: string,
    x: number,
    y: number,
    valueSize = 10,
  ) => {
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(label, x, y);

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(valueSize);
    doc.text(value, x, y + 5);
  };

  // Row 1: Key Info
  drawInfoBox("PASSENGER / OPERATOR", booking.operator_name, 15, 33);
  drawInfoBox("DATE", format(depDate, "MMM dd, yyyy"), 80, 33);
  drawInfoBox("TIME", format(depDate, "HH:mm"), 115, 33);
  //   doc.setFont("ethiopic");
  //   drawInfoBox("TIME", formatEthiopianTime(depDate), 115, 33);

  // Row 2: Large Routing (From -> To)
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.text("FROM", 15, 50);
  doc.text("TO", 80, 50);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(booking.route_from.toUpperCase(), 15, 58);

  // Arrow graphic between routes
  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setFont("helvetica", "normal");
  // Draw a clean arrow between FROM and TO
  const arrowY = 55;
  const arrowStart = 65;
  const endX = 75;

  doc.setDrawColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setLineWidth(0.8);

  // Main line
  doc.line(arrowStart, arrowY, endX, arrowY);

  // Arrow head
  doc.line(endX, arrowY, endX - 3, arrowY - 2);
  doc.line(endX, arrowY, endX - 3, arrowY + 2);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(booking.route_to.toUpperCase(), 80, 58);

  // Footer / Reference Info
  doc.setFillColor(249, 250, 251); // Very light gray background for footer
  doc.rect(15, 70, stubX - 25, 12, "F");

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`REF:`, 18, 77);
  drawInfoBox("TRIP ID", booking.trip_id, 18, 82);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(booking.booking_ref, 26, 77);

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`STATUS:`, 65, 77);

  // Color code the status
  const isConfirmed = booking.booking_status.toLowerCase() === "confirmed";
  doc.setTextColor(
    isConfirmed ? 22 : 200,
    isConfirmed ? 163 : 0,
    isConfirmed ? 74 : 0,
  ); // Green or Red
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(booking.booking_status.toUpperCase(), 84, 77);

  const startX = stubX + 8;

  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("DANU", startX, 18);

  drawInfoBox("OPERATOR", booking.operator_name, startX, 30);
  drawInfoBox("FROM", booking.route_from.toUpperCase(), startX, 42);
  drawInfoBox("TO", booking.route_to.toUpperCase(), startX, 54);

  doc.setFont("ethiopic");
  drawInfoBox("TIME", format(depDate, "HH:mm"), startX, 66);
  //   drawInfoBox("TIME", formatEthiopianTime(depDate), startX, 66);

  // Faux Barcode generated with rectangles for aesthetic

  // Save the PDF
  doc.save(`ticket_${booking.booking_ref}.pdf`);
}

export default function PassengerHistoryPageClient() {
  const [currentPage, setCurrentPage] = useState(1);

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Bookings
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
                    <div className="w-full pt-4 grid  grid-cols-1 md:grid-cols-2 border-t border-gray-200 gap-4 md:gap-8">
                      <div className="">
                        <p className="text-gray-500 text-xs">
                          Booked on{" "}
                          {format(
                            new Date(booking.booked_at),
                            "MMM dd, yyyy HH:mm",
                          )}
                        </p>
                      </div>
                      <div></div>
                      <div className="">
                        <Button
                          className={"w-full"}
                          variant="outline"
                          size="sm"
                          onClick={() => exportTicketIntoPDF(booking)}
                        >
                          <Share /> Export
                        </Button>
                      </div>
                      <div>
                        {booking.booking_status === "confirmed" &&
                          canCancel(booking.departure_at) && (
                            <Button
                              variant="destructive"
                              className="w-full"
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
