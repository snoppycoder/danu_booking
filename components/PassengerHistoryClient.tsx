"use client";

import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  Share,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { usePassengerHistory } from "@/components/Query";
import { History } from "@/lib/model";
import { passengerApi } from "@/app/api/api";
import { useState } from "react";

import CancelTripDialog from "./CancelBookingConfirm";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { useTranslation } from "react-i18next";

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

  const arrowY = 55;
  const arrowStart = 65;
  const endX = 75;

  doc.setDrawColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setLineWidth(0.8);
  doc.line(arrowStart, arrowY, endX, arrowY);
  doc.line(endX, arrowY, endX - 3, arrowY - 2);
  doc.line(endX, arrowY, endX - 3, arrowY + 2);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(booking.route_to.toUpperCase(), 80, 58);

  // Footer / Reference Info
  doc.setFillColor(249, 250, 251);
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
  );
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

  // Save the PDF
  doc.save(`ticket_${booking.booking_ref}.pdf`);
}

export default function PassengerHistoryPageClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingId, setBookingId] = useState<string>("");

  const { t } = useTranslation();
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Toaster richColors position="top-right" />
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
    <div className="relative min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("myBookings")}
          </h1>
          <p className="text-gray-600 text-center">{t("viewAllPast")}</p>
        </div>

        {/* Empty State */}
        {!bookings || bookings.items.length === 0 ? (
          <Card className="p-12 text-center border-gray-200 bg-white">
            <div className="mb-4">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500">
                Start booking your first trip to see it here
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.items.map((booking) => {
              // Modern, professional status styling using subtle backgrounds and inset rings
              const statusConfig: Record<
                string,
                { bg: string; text: string; ring: string; label: string }
              > = {
                confirmed: {
                  bg: "bg-emerald-50",
                  text: "text-emerald-700",
                  ring: "ring-emerald-600/20",
                  label: "confirmed",
                },
                pending: {
                  bg: "bg-amber-50",
                  text: "text-amber-700",
                  ring: "ring-amber-600/20",
                  label: "Pending",
                },
                cancelled: {
                  bg: "bg-red-50",
                  text: "text-red-700",
                  ring: "ring-red-600/10",
                  label: "cancelled",
                },
                completed: {
                  bg: "bg-blue-50",
                  text: "text-blue-700",
                  ring: "ring-blue-700/10",
                  label: "Completed",
                },
              };

              const status = statusConfig[
                booking.booking_status?.toLowerCase()
              ] || {
                bg: "bg-gray-50",
                text: "text-gray-700",
                ring: "ring-gray-600/20",
                label: booking.booking_status,
              };

              return (
                <Card
                  key={booking.booking_id}
                  className="overflow-hidden bg-white border-gray-200 hover:shadow-md transition-all duration-200 border-t-4 border-t-primary"
                >
                  {/* Card Header: Ref & Status */}
                  <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Booking Reference
                      </p>
                      <p className="font-mono font-bold text-gray-900 text-lg">
                        {booking.booking_ref}
                      </p>
                    </div>
                    <Badge
                      className={`${status.bg} ${status.text} ring-1 ring-inset ${status.ring} hover:${status.bg} font-medium text-xs px-3 py-1 shadow-none`}
                    >
                      {t(status.label)}
                    </Badge>
                  </div>

                  {/* Card Body: Route & Details */}
                  <div className="px-6 py-6">
                    {/* Visual Route Indicator */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          {t("from")}
                        </p>
                        <p className="font-bold text-gray-900 text-xl truncate">
                          {booking.route_from}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center px-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          {t("to")}
                        </p>
                        <p className="font-bold text-gray-900 text-xl truncate">
                          {booking.route_to}
                        </p>
                      </div>
                    </div>

                    {/* 2x2 Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary/70 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">
                            {t("departureDate")}
                          </p>
                          <p className="font-medium text-gray-900">
                            {format(
                              new Date(booking.departure_at),
                              "MMM dd, yyyy · HH:mm",
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary/70 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                          {booking.operator_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">
                            {t("operator")}
                          </p>
                          <p className="font-medium text-gray-900">
                            {booking.operator_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary/70 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">
                            {t("passengers")}
                          </p>
                          <p className="font-medium text-gray-900">
                            {booking.passenger_count}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-primary/70 shrink-0 font-bold flex items-center justify-center">
                          Br
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">
                            {t("total")}
                          </p>
                          <p className="font-medium text-gray-900">
                            {booking.total_amount.toFixed(2)} Birr
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Meta Info & Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 font-medium">
                      {t("bookedOn")}{" "}
                      {format(
                        new Date(booking.booked_at),
                        "MMM dd, yyyy 'at' HH:mm",
                      )}
                    </p>

                    <div className="flex w-full sm:w-auto items-center gap-3">
                      {booking.booking_status === "confirmed" && (
                        <Button
                          className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                          size="sm"
                          onClick={() => exportTicketIntoPDF(booking)}
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      )}

                      {booking.booking_status === "confirmed" &&
                        canCancel(booking.departure_at) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full sm:w-auto"
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
                </Card>
              );
            })}

            {/* Pagination remains visually consistent */}
            {(bookings?.items.length ?? 0) > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-600 font-medium">
                  Showing {(currentPage - 1) * numberOfCard + 1} to{" "}
                  {(currentPage - 1) * numberOfCard +
                    (bookings?.items.length ?? 0)}{" "}
                  of {bookings?.total} entries
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-none">
                    {currentPage}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white"
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
