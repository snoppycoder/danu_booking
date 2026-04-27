"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  ArrowRightLeft,
  Ticket,
  Map,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useBookingHistoryPublic,
  usePassengerHistory,
} from "@/components/Query";
import CancelTripDialog from "@/components/CancelBookingConfirm";
import { useAuth } from "@/lib/authContext";
import { agentApi, operatorApi } from "@/app/api/api";
import TransferTicketDialog from "@/components/TransferTicketDialog";
import { isAxiosError } from "axios";
import { Passenger } from "@/lib/model";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function TicketBookedPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const [bookingId, setBookingId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const numberOfCard = 5;
  const [openTransfer, setOpenTransfer] = useState(false);
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
  const [ticketIds, setTicketIds] = useState<string[]>([]);

  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useBookingHistoryPublic(user?.user_id ?? "", currentPage, numberOfCard);

  const canCancel = (departure_at: string) => {
    const now = new Date().getTime();
    const departure = new Date(departure_at).getTime();
    const fiveDaysAfterDeparture = departure + 5 * 24 * 60 * 60 * 1000;
    return now <= fiveDaysAfterDeparture;
  };

  async function cancelBooking(id: string) {
    const res = await agentApi.cancelBooking(user?.organization_id || "", id);
    toast.success(res.message);
    refetch();
  }

  // Placeholder for transfer logic
  // const handleTransfer = async (id: string) => {
  //   const response = await agentApi.transferTickets(
  //     user?.organization_id || "",
  //     id,
  //   );

  //   refetch()
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-primary"
        >
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="text-lg font-medium text-slate-600">
            Fetching your itineraries...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="w-full max-w-md p-6 border-red-200 bg-red-50/50 backdrop-blur-sm shadow-xl shadow-red-900/5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  Error Loading Tickets
                </h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  We encountered an issue while fetching your booking history.
                  Please refresh the page or try again later.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 p-6 md:p-8 selection:bg-primary/20">
      <Toaster position="top-right" richColors />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 mt-4 text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Booking History
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-lg">
            Manage your upcoming journeys and review past trips
          </p>
        </motion.div>

        {/* Empty State */}
        {!bookings || bookings.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-16 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Map className="w-12 h-12 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No journeys planned yet
                  </h3>
                  <p className="text-slate-500">
                    When you book a ticket, it will safely land right here.
                  </p>
                </div>
                <Button className="mt-4" onClick={() => window.history.back()}>
                  Explore Destinations
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {bookings.items.map((booking) => {
                const statusConfig: Record<
                  string,
                  { bg: string; text: string; label: string; dot: string }
                > = {
                  confirmed: {
                    bg: "bg-emerald-100",
                    text: "text-emerald-800",
                    dot: "bg-emerald-500",
                    label: "Confirmed",
                  },
                  pending: {
                    bg: "bg-amber-100",
                    text: "text-amber-800",
                    dot: "bg-amber-500",
                    label: "Pending",
                  },
                  cancelled: {
                    bg: "bg-rose-100",
                    text: "text-rose-800",
                    dot: "bg-rose-500",
                    label: "Cancelled",
                  },
                  completed: {
                    bg: "bg-indigo-100",
                    text: "text-indigo-800",
                    dot: "bg-indigo-500",
                    label: "Completed",
                  },
                };

                const status = statusConfig[
                  booking.booking_status?.toLowerCase()
                ] || {
                  bg: "bg-slate-100",
                  text: "text-slate-800",
                  dot: "bg-slate-500",
                  label: booking.booking_status,
                };

                return (
                  <motion.div
                    key={booking.booking_id}
                    variants={itemVariants}
                    layout
                  >
                    <Card className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group">
                      {/* Top section: Ticket Header */}
                      <div className="bg-slate-900 px-6 py-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="flex items-center justify-between relative z-10">
                          <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                              Booking Reference
                            </p>
                            <p className="text-white font-mono font-semibold text-xl tracking-tight">
                              {booking.booking_ref}
                            </p>
                          </div>
                          <Badge
                            className={`${status.bg} ${status.text} hover:${status.bg} font-semibold text-xs px-3 py-1.5 border-0 flex items-center gap-1.5`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                            />
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Ticket Perforation line */}
                      <div className="relative h-0">
                        <div className="absolute left-0 -mt-2 -ml-2 w-4 h-4 bg-slate-50 rounded-full border-r border-slate-200/60" />
                        <div className="absolute right-0 -mt-2 -mr-2 w-4 h-4 bg-slate-50 rounded-full border-l border-slate-200/60" />
                        <div className="border-t-2 border-dashed border-slate-200 mx-3" />
                      </div>

                      {/* Main section: Trip Details */}
                      <div className="px-6 py-5 bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Route */}
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                              <MapPin className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-500 text-sm font-medium mb-1">
                                Route
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-slate-900">
                                  {booking.route_from}
                                </span>
                                <span className="text-slate-300">→</span>
                                <span className="font-semibold text-slate-900">
                                  {booking.route_to}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Departure Date & Time */}
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                              <Calendar className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-500 text-sm font-medium mb-1">
                                Departure
                              </p>
                              <p className="font-semibold text-slate-900">
                                {format(
                                  new Date(booking.departure_at),
                                  "MMM dd, yyyy · HH:mm",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info Footer */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-6">
                            {/* Passengers */}
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">
                                  {booking.passenger_count}{" "}
                                  <span className="font-normal text-slate-500">
                                    Passengers
                                  </span>
                                </p>
                              </div>
                            </div>
                            {/* Amount */}
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">
                                  {booking.total_amount.toFixed(2)}{" "}
                                  <span className="font-normal text-slate-500">
                                    Birr
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            {booking.booking_status === "confirmed" &&
                              canCancel(booking.departure_at) && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 md:flex-none gap-2"
                                    onClick={() => {
                                      console.log(
                                        booking,
                                        "booking for transfer",
                                      );
                                      setBookingId(booking.booking_id);
                                      setOpenTransfer(true);

                                      // setTicketIds(booking.ticket_ids);
                                      refetch();
                                    }}
                                  >
                                    <ArrowRightLeft className="w-4 h-4" />
                                    Transfer
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1 md:flex-none shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => {
                                      setBookingId(booking.booking_id);
                                      setOpen(true);
                                    }}
                                  >
                                    Cancel Booking
                                  </Button>
                                </>
                              )}
                          </div>
                        </div>

                        {/* Booking Timestamp */}
                        <div className="mt-2 flex items-center justify-between">
                          {/* <p className="text-slate-400 text-xs">
                            Operator:{" "}
                            <span className="font-medium text-slate-600">
                              {booking.operator_name}
                            </span>
                          </p> */}
                          <p className="text-slate-400 text-xs">
                            Booked on{" "}
                            {format(
                              new Date(booking.booked_at),
                              "MMM dd, yyyy HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Pagination */}
            {(bookings?.items.length ?? 0) > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200"
              >
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-900">
                    {(currentPage - 1) * numberOfCard + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-900">
                    {(currentPage - 1) * numberOfCard +
                      (bookings?.items.length ?? 0)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-900">
                    {bookings?.total}
                  </span>{" "}
                  entries
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="shadow-sm"
                  >
                    Previous
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                    {currentPage}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={
                      (bookings?.total ?? 0) <= currentPage * numberOfCard
                    }
                    className="shadow-sm"
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
              console.log(ticketIds);
              await agentApi.transferTickets(
                user?.organization_id || "",
                bookingId,
                ticketIds,
                passenger,
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
