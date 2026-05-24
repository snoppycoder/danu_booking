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
import QRCode from "qrcode";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { usePassengerHistory } from "@/components/Query";
import { Passenger } from "@/lib/model";
import { AnimatePresence, motion } from "framer-motion";
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

// Assuming you are using date-fns for formatting

export async function exportTicketIntoPDF(booking: any): Promise<void> {
  console.log("Exporting booking to PDF:", booking);

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
  const accentOrange = [249, 115, 22]; // Orange for emphasis (Seat/Price)

  const depDate = new Date(booking.departure_at);

  // Iterate over tickets using a traditional loop to support async/await for the QR Code
  for (let index = 0; index < booking.tickets.length; index++) {
    const ticket = booking.tickets[index];

    // Add new page for subsequent tickets
    if (index > 0) doc.addPage();

    // --- 1. BASE BACKGROUND ---
    doc.setFillColor(bgWhite[0], bgWhite[1], bgWhite[2]);
    doc.rect(0, 0, 240, 100, "F");

    // --- 2. BRANDING ACCENT (Left Edge Bar) ---
    doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
    doc.rect(0, 0, 6, 100, "F");

    // --- 3. SEPARATOR LINE (The "Tear-off" Stub) ---
    const stubX = 170; // Separator for the tear-off stub
    doc.setLineWidth(0.5);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(stubX, 5, stubX, 95);
    doc.setLineDashPattern([], 0); // Reset dash

    // ==========================================
    //          MAIN TICKET BODY (LEFT)
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

    // Subtle Header Divider
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineWidth(0.2);
    doc.line(15, 22, stubX - 10, 22);

    // Helper function for rendering consistent data blocks
    const drawInfoBox = (
      label: string,
      value: string,
      x: number,
      y: number,
      valueSize = 10,
      isBold = false,
      color = textDark,
    ) => {
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(label, x, y);

      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(valueSize);
      doc.text(value, x, y + 5);
    };

    // Row 1: Passenger, Gender, Phone & Date Info
    drawInfoBox("PASSENGER", ticket.passenger_name || "N/A", 15, 32, 11, true);
    drawInfoBox("GENDER", ticket.gender || "N/A", 60, 32);
    drawInfoBox("PHONE", ticket.phone || "N/A", 85, 32);
    drawInfoBox("DATE", format(depDate, "MMM dd, yyyy"), 115, 32);
    drawInfoBox("TIME", format(depDate, "HH:mm"), 145, 32, 10, true);

    // Row 2: Transport & Seat Info
    drawInfoBox("OPERATOR", booking.operator_name, 15, 47, 10, true);
    drawInfoBox("BUS PLATE", booking.bus_plate || "N/A", 75, 47);
    drawInfoBox("SIDE NO", booking.bus_side_no || "N/A", 110, 47);
    drawInfoBox(
      "SEAT NO",
      ticket.seat_no || "TBD",
      140,
      47,
      12,
      true,
      accentOrange,
    ); // Emphasized

    // Row 3: Routing Details
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("FROM", 15, 62);
    doc.text("TO", 75, 62);

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(booking.route_from.toUpperCase(), 15, 68);

    // Arrow graphic between routes
    const arrowY = 66;
    doc.setDrawColor(brandTeal[0], brandTeal[1], brandTeal[2]);
    doc.setLineWidth(0.8);
    doc.line(55, arrowY, 68, arrowY);
    doc.line(68, arrowY, 65, arrowY - 2);
    doc.line(68, arrowY, 65, arrowY + 2);

    doc.text(booking.route_to.toUpperCase(), 75, 68);

    // Ticket Price
    drawInfoBox(
      "PRICE (ETB)",
      `${ticket.price_paid.toFixed(2)}`,
      140,
      62,
      10,
      true,
    );

    // Footer / Reference Info
    // Footer / Reference Info
    doc.setFillColor(249, 250, 251);
    doc.rect(15, 76, stubX - 25, 18, "F");

    // ===== ROW 1 =====
    doc.setFontSize(7);

    // Ticket Number
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.text("TICKET NUMBER:", 18, 81);

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "italic");
    doc.text(ticket.ticket_number || "N/A", 48, 81);

    // Status
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.text("STATUS:", 120, 81);

    const isConfirmed =
      ticket.status.toUpperCase() === "PAID" ||
      booking.booking_status.toLowerCase() === "confirmed";

    doc.setTextColor(
      isConfirmed ? 22 : 200,
      isConfirmed ? 163 : 0,
      isConfirmed ? 74 : 0,
    );

    doc.text(isConfirmed ? "PAID & CONFIRMED" : "PENDING", 135, 81);

    // ===== ROW 2 =====

    // Booking Ref
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING REF:", 18, 87);

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.text(booking.booking_ref, 48, 87);

    // Lottery Number
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.text("LOTTERY NO:", 120, 87);

    doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
    doc.setFont("helvetica", "normal");
    doc.text(ticket.lottery_number || "N/A", 138, 87);

    // ===== ROW 3 =====

    // Amount in words
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "bold");
    doc.text("AMT IN WORDS:", 18, 92);

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "italic");
    doc.text(ticket.price_in_words || "N/A", 48, 92);
    // ==========================================
    //          TEAR-OFF STUB (RIGHT)
    // ==========================================
    const startX = stubX + 8;

    // --- 4. GENERATE AND RENDER QR CODE ---
    if (ticket.qr_code_url) {
      try {
        // Generate a base64 Data URI from the URL
        const qrImage = await QRCode.toDataURL(ticket.qr_code_url, {
          margin: 1,
          width: 80,
          color: {
            dark: "#1F2937", // textDark to match the theme
            light: "#FFFFFF",
          },
        });

        // Add image to PDF at top right of the main ticket section
        // (X: 142, Y: 6, Width: 22mm, Height: 22mm)
        doc.addImage(qrImage, "PNG", startX, 65, 29, 29);
      } catch (err) {
        console.error(
          "Failed to generate QR Code for ticket",
          ticket.ticket_id,
          err,
        );
      }
    }

    doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DANU", startX, 18);

    // Highly Visible Seat Block for Conductor
    doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
    doc.rect(startX, 24, 50, 18, "F");
    doc.setTextColor(bgWhite[0], bgWhite[1], bgWhite[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SEAT NO", startX + 5, 30);
    doc.setFontSize(18);
    doc.text(ticket.seat_no || "TBD", startX + 5, 39);

    // Stub Details (Appended gender format for space-saving)
    const passengerDisplay = ticket.gender
      ? `${ticket.passenger_name || "N/A"} (${ticket.gender.charAt(0).toUpperCase()})`
      : ticket.passenger_name || "N/A";

    drawInfoBox("PASSENGER", passengerDisplay, startX, 48, 9, true);
    drawInfoBox("DEPARTURE", format(depDate, "MMM dd, HH:mm"), startX, 58, 9);
    // drawInfoBox("FROM", booking.route_from.toUpperCase(), startX, 68, 9);
    // drawInfoBox("TO", booking.route_to.toUpperCase(), startX, 78, 9);
    // drawInfoBox("BUS PLATE", booking.bus_plate || "N/A", startX, 88, 9);
  }

  // Save the PDF
  doc.save(`ticket_${booking.booking_ref}.pdf`);
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

  console.log(bookings);
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
    gender: "",
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
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1, // Delays each card by 0.1s
                },
              },
            }}
          >
            <AnimatePresence mode="popLayout">
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
                  <motion.div
                    key={booking.booking_id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        },
                      },
                      exit: {
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.2 },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Card className="overflow-hidden bg-white border-gray-200 hover:shadow-md transition-all duration-200 border-t-4 border-t-primary">
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

                                  refetch();
                                }}
                              >
                                Transfer Seats
                              </Button>
                            )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Pagination remains visually consistent */}
            {(bookings?.items.length ?? 0) > 0 && (
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-gray-200 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
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
              </motion.div>
            )}
          </motion.div>
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
