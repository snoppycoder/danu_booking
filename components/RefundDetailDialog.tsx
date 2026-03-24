"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RefundDetail } from "@/lib/model";
import { useRefundDetail } from "./Query";
import { formatCurrency } from "@/lib/report-utils";

interface RefundDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refund_id: string;
  operator_id: string;
  isLoading?: boolean;
}

const getStatusColor = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "success":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function RefundDetailDialog({
  isOpen,
  onOpenChange,
  operator_id,
  refund_id,
}: RefundDetailDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { data, refetch, isLoading } = useRefundDetail(operator_id, refund_id);
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  console.log("Refund Detail Data:", data);

  const CopyableField = ({
    label,
    value,
    id,
  }: {
    label: string;
    value: string;
    id: string;
  }) => (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-mono text-foreground truncate">{value}</p>
      </div>
      <button
        onClick={() => handleCopy(value, id)}
        className="shrink-0 p-2 rounded-md hover:bg-primary/10 transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied === id ? (
          <Check className="w-4 h-4 text-primary" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-2xl font-bold">
              Refund Details
            </DialogTitle>
          </div>
          {data && (
            <Badge
              className={cn("w-fit")}
              variant={getStatusColor(data.status)}
            >
              {data.status}
            </Badge>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
            {/* Refund IDs Section */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Refund Information
              </h3>
              <div className="space-y-2">
                <CopyableField
                  label="Refund ID"
                  value={data.id}
                  id="refund-id"
                />
                <CopyableField
                  label="Booking Ref"
                  value={data.booking.booking_ref}
                  id="booking-ref"
                />
                <CopyableField
                  label="External Reference"
                  value={data.external_ref}
                  id="external-ref"
                />
              </div>
            </section>

            {/* Booking Details Section */}
            <section className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Booking Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-sm font-medium text-muted-foreground">
                    Original Amount
                  </p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {formatCurrency(data.booking.total_amount)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-sm font-medium text-muted-foreground">
                    Refunded Amount
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatCurrency(data.processed_amount)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-sm font-medium text-muted-foreground">
                    Passengers
                  </p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {data.booking.passenger_count}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-sm font-medium text-muted-foreground">
                    Refund Method
                  </p>
                  <p className="text-lg font-bold text-foreground mt-1 capitalize">
                    {data.method}
                  </p>
                </div>
              </div>

              {/* Passengers */}
              {data.booking.passengers.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Passengers
                  </p>
                  <div className="space-y-2">
                    {data.booking.passengers.map((passenger, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-muted flex justify-between items-center text-sm"
                      >
                        <span className="font-medium">{passenger.name}</span>
                        <span className="text-muted-foreground">
                          Seat: {passenger.seat_code} •{" "}
                          {formatCurrency(passenger.fare)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Processing Details Section */}
            <section className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Processing Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-xs font-medium text-muted-foreground">
                    Processed By
                  </p>
                  <p className="font-medium text-foreground mt-1">
                    {data.processed_by_name}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-xs font-medium text-muted-foreground">
                    Processed At
                  </p>
                  <p className="font-medium text-foreground mt-1">
                    {!data.processed_amount
                      ? ""
                      : formatDate(data.processed_at)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-xs font-medium text-muted-foreground">
                    Booked By
                  </p>
                  <p className="font-medium text-foreground mt-1">
                    {data.booked_by_name}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-xs font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="font-medium text-foreground mt-1">
                    {formatDate(data.created_at)}
                  </p>
                </div>
              </div>
            </section>

            {/* Notes Section */}
            {data.notes && (
              <section className="space-y-3 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Notes
                </h3>
                <p className="p-3 rounded-lg bg-muted text-sm leading-relaxed text-foreground">
                  {data.notes}
                </p>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No refund data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
