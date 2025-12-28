"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  DollarSign,
  Bus,
  User,
  ArrowRight,
} from "lucide-react";
import { Trip_ } from "@/app/(dashboard)/(operator)/operator/trips/page";

interface TripDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip_;
  onEdit: () => void;
  onDelete: () => void;
}

export function TripDetailDialog({
  open,
  onOpenChange,
  trip,
  onEdit,
  onDelete,
}: TripDetailDialogProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Trip Details</DialogTitle>
          <DialogDescription>
            Complete information about this trip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Route Section */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Route Information
            </h3>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex flex-1 items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="text-lg font-semibold">{trip.route_from}</div>
                </div>
              </div>
              <ArrowRight className="size-6 text-muted-foreground" />
              <div className="flex flex-1 items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="text-lg font-semibold">{trip.route_to}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Departure & Price */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Departure
              </h3>
              <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                <Calendar className="mt-1 size-5 text-primary" />
                <div>
                  <div className="font-semibold">
                    {formatDateTime(trip.departure_at)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Price
              </h3>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                <DollarSign className="size-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{trip.price} ETB</div>
                  <div className="text-xs text-muted-foreground">Per seat</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Operator, Bus, Driver */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Trip Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bus className="size-4" />
                  <span className="text-sm">Operator</span>
                </div>
                <Badge variant="outline">{trip.operator.operator_name}</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bus className="size-4" />
                  <span className="text-sm">Bus Number</span>
                </div>
                <span className="font-medium">{trip.bus_id}</span>
              </div>

              {/* <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4" />
                  <span className="text-sm">Driver</span>
                </div>
                <span className="font-medium">{trip.driver_id}</span>
              </div> */}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Metadata
            </h3>
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trip ID</span>
                <span className="font-mono font-medium">{trip.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {formatDate(trip.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {formatDate(trip.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full sm:w-auto"
          >
            Delete Trip
          </Button>
          <div className="flex flex-1 gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button onClick={onEdit} className="flex-1">
              Edit Trip
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
