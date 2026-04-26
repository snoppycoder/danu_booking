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
import { History, Passenger } from "@/lib/model";
import { passengerApi } from "@/app/api/api";
import { useState } from "react";

import CancelTripDialog from "./CancelBookingConfirm";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { useTranslation } from "react-i18next";
import TransferTicketDialog from "./TransferTicketDialog";
import { isAxiosError } from "axios";
import { toast } from "sonner";

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

// Ensure your History interface matches the payload
export function exportTicketIntoPDF(booking: any): void {
  console.log("Exporting booking to PDF:", booking);

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [240, 100],
  });

  // Extract first ticket (since passenger_count is 1 in this payload)
  const ticket = booking.tickets[0];
  const depDate = new Date(booking.departure_at);

  // --- MODERN COLOR PALETTE ---
  const brandTeal = [13, 148, 136]; // Deep, sophisticated teal (#0d9488)
  const bgWhite = [255, 255, 255]; // Clean white background
  const textDark = [31, 41, 55]; // Gray 800 for primary text
  const textMuted = [107, 114, 128]; // Gray 500 for labels
  const borderLight = [229, 231, 235]; // Gray 200 for subtle lines
  const bgHighlight = [249, 250, 251]; // Gray 50 for footer/cards

  // --- 1. BASE BACKGROUND ---
  doc.setFillColor(bgWhite[0], bgWhite[1], bgWhite[2]);
  doc.rect(0, 0, 240, 100, "F");

  // --- 2. BRANDING ACCENT (Left Edge Bar) ---
  doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.rect(0, 0, 6, 100, "F");

  // --- 3. SEPARATOR LINE (The "Tear-off" Stub) ---
  const stubX = 175; // The perforation line
  doc.setLineWidth(0.5);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(stubX, 5, stubX, 95);
  doc.setLineDashPattern([], 0);

  // ==========================================
  //        MAIN TICKET BODY (LEFT)
  // ==========================================

  // Header
  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("DANU", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(10);
  doc.text("BOARDING PASS", 42, 18);

  // Header Divider
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.3);
  doc.line(15, 24, stubX - 10, 24);

  // Helper function for standard info blocks
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

  // Row 1: Passenger & Operator
  drawInfoBox("PASSENGER NAME", ticket.passenger_name, 15, 33, 11);
  drawInfoBox("BUS OPERATOR", booking.operator_name, 80, 33, 11);

  // Row 2: Routing
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.text("FROM", 15, 48);
  doc.text("TO", 80, 48);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(booking.route_from.toUpperCase(), 15, 55);

  // Arrow graphic
  const arrowY = 52.5;
  const arrowStart = 58;
  const endX = 70;
  doc.setDrawColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setLineWidth(0.8);
  doc.line(arrowStart, arrowY, endX, arrowY);
  doc.line(endX, arrowY, endX - 2.5, arrowY - 2.5);
  doc.line(endX, arrowY, endX - 2.5, arrowY + 2.5);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(booking.route_to.toUpperCase(), 80, 55);

  // Row 3: Bus Details & Date/Time
  drawInfoBox(
    "BUS PLATE / SIDE NO.",
    `${booking.bus_plate}  (Side: ${booking.bus_side_no})`,
    15,
    68,
  );
  drawInfoBox(
    "DEPARTURE DATE & TIME",
    format(depDate, "MMM dd, yyyy • HH:mm"),
    80,
    68,
  );

  // --- SEAT HIGHLIGHT BADGE (Right aligned on main body) ---
  const badgeX = 135;
  const badgeY = 30;
  doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  // Use rounded rectangle for a modern look
  doc.roundedRect(badgeX, badgeY, 28, 28, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SEAT", badgeX + 14, badgeY + 7, { align: "center" });

  doc.setFontSize(20);
  doc.text(ticket.seat_no, badgeX + 14, badgeY + 20, { align: "center" });

  // --- FOOTER: Receipt & Status Info ---
  doc.setFillColor(bgHighlight[0], bgHighlight[1], bgHighlight[2]);
  doc.roundedRect(15, 78, stubX - 25, 14, 2, 2, "F");

  // Booking Ref
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("REF:", 18, 83);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFontSize(9);
  doc.text(booking.booking_ref, 26, 83);

  // Price
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.text("PRICE:", 18, 89);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFontSize(9);
  doc.text(`Br. ${ticket.price_paid.toFixed(2)}`, 28, 89);

  // Lottery / Status
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.text("LOTTERY:", 65, 83);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFontSize(9);
  doc.text(ticket.lottery_number || "N/A", 80, 83);

  // Colored Status
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.text("STATUS:", 65, 89);

  const isPaid = ticket.status.toLowerCase() === "paid";
  doc.setTextColor(isPaid ? 22 : 220, isPaid ? 163 : 38, isPaid ? 74 : 38); // Green if paid, Red if not
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(ticket.status.toUpperCase(), 78, 89);

  const startX = stubX + 8;

  // Stub Header
  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("DANU", startX, 18);

  // Huge Seat Number on Stub for easy reading by attendants
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(8);
  doc.text("SEAT", startX, 28);
  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setFontSize(22);
  doc.text(ticket.seat_no, startX, 36);

  // Stub Fields
  drawInfoBox("PASSENGER", ticket.passenger_name, startX, 45, 9);
  drawInfoBox("BUS PLATE", booking.bus_plate, startX, 57, 9);
  drawInfoBox("DEPARTURE", format(depDate, "MMM dd • HH:mm"), startX, 69, 9);
  drawInfoBox(
    "ROUTE",
    `${booking.route_from} - ${booking.route_to}`,
    startX,
    81,
    9,
  );

  // Save the PDF
  doc.save(`Ticket_${booking.booking_ref}.pdf`);
}

export default function PassengerHistoryPageClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingId, setBookingId] = useState<string>("");
  const [ticketIds, setTicketIds] = useState<string[]>([]);

  const { t } = useTranslation();
  const numberOfCard = 5;
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = usePassengerHistory(currentPage, numberOfCard);
  const [open, setOpen] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const canCancel = (departure_at: string) => {
    const now = new Date().getTime();
    const departure = new Date(departure_at).getTime();
    const fiveDaysAfterDeparture = departure + 5 * 24 * 60 * 60 * 1000;
    return now <= fiveDaysAfterDeparture;
  };
  const [passenger, setPassenger] = useState<Passenger>({
    name: "",
    email: "",
    phone: "",
    id_number: "",
    is_child: false,
    tin_number: "",
    company_name: "",
  });

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
      <Toaster richColors position="top-right" />
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

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      {booking.booking_status === "confirmed" &&
                        canCancel(booking.departure_at) && (
                          <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => {
                              setBookingId(booking.booking_id);
                              setOpenTransfer(true);
                              setTicketIds(booking.ticket_ids);
                            }}
                          >
                            Transfer Seats
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

      {open && (
        <CancelTripDialog
          open={open}
          setOpen={setOpen}
          onConfirm={() => {
            cancelBooking(bookingId);
          }}
        />
      )}
      {openTransfer && (
        <TransferTicketDialog
          open={openTransfer}
          onOpenChange={setOpenTransfer}
          passenger={passenger}
          onPassengerChange={setPassenger}
          onSubmit={async () => {
            try {
              await passengerApi.transferBooking(
                bookingId,
                passenger,
                ticketIds,
              );
              setOpenTransfer(false);
              refetch();
              toast.success("Booking transfer successful!");
            } catch (error) {
              if (isAxiosError(error)) {
                const message =
                  error.response?.data.error ||
                  "An error occured while transferring the booking.";
                console.log(message);
                toast.error(message);
              }
            }
          }}
        />
      )}
    </div>
  );
}
