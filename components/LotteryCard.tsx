"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

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

interface LotteryCardProps {
  lottery: getLotteryListDTO;
  onClick: () => void;
}

export function LotteryCard({ lottery, onClick }: LotteryCardProps) {
  const statusColor =
    lottery.status === "PAID"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <Card
      onClick={onClick}
      className="p-4 cursor-pointer hover:shadow-xl transition-shadow border border-border hover:border-primary/70"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">
            Booking Reference
          </p>
          <p className="text-lg font-semibold text-foreground">
            {lottery.booking_ref}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-muted-foreground mb-1">Lottery Number</p>
        <p className="text-xl font-bold text-primary">
          {lottery.lottery_number}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-1">Passenger Name</p>
        <p className="text-base font-medium text-foreground">
          {lottery.passenger_name}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Badge className={statusColor}>{lottery.status}</Badge>
      </div>
    </Card>
  );
}
