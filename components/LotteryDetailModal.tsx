"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface getLotteryListDTO {
  ticket_id: string;
  booking_id: string;
  booking_ref: string;
  lottery_number: string;
  passenger_name: string;
  trip_id: string;
  route_from: string;
  route_to: string;
  departure_at: string;
  created_at: string;
  status: string;
}

interface LotteryDetailModalProps {
  lottery: getLotteryListDTO;
  onClose: () => void;
}

export function LotteryDetailModal({
  lottery,
  onClose,
}: LotteryDetailModalProps) {
  const statusColor =
    lottery.status === "PAID"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <Dialog open={!!lottery} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lottery Number - Highlighted */}
          <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">Lottery Number</p>
            <p className="text-2xl font-bold text-primary">
              {lottery.lottery_number}
            </p>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Booking Reference
              </p>
              <p className="font-semibold text-foreground">
                {lottery.booking_ref}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge className={statusColor}>{lottery.status}</Badge>
            </div>
          </div>

          {/* Passenger & Trip Info */}
          <div className="space-y-3 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Passenger Name
              </p>
              <p className="font-medium text-foreground">
                {lottery.passenger_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Route</p>
              <p className="font-medium text-foreground">
                {lottery.route_from} → {lottery.route_to}
              </p>
            </div>
          </div>

          {/* IDs and Dates */}
          <div className="space-y-3 border-t border-border pt-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
              <p className="font-mono text-foreground">{lottery.ticket_id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
              <p className="font-mono text-foreground">{lottery.booking_id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Trip ID</p>
              <p className="font-mono text-foreground">{lottery.trip_id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Departure</p>
              <p className="text-foreground">
                {format(parseISO(lottery.departure_at), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-foreground">
                {format(parseISO(lottery.created_at), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
