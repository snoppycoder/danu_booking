"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";
import { TripData } from "@/lib/model";

type Trip = {
  id: string;
  trip_date: string;
  departure_time: string;

  route: {
    id: string;
    from_city: string;
    to_city: string;
  };

  operator: {
    id: string;
    name: string;
  };

  bus: {
    id: string;
    plate_no: string;
  };

  driver: {
    id: string;
    name: string;
  };

  price: number;
  is_available: boolean;
};
interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: Trip | null;
}

export function TripDetailsModal({
  isOpen,
  onClose,
  tripData,
}: TripDetailsModalProps) {
  if (!tripData) return null;

  const formatDate = (dateString: string) => {
    console.log(dateString, "dateString");
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Trip Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Route Information */}
          <div className="rounded-lg bg-linear-to-r from-teal-50 to-blue-50 p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Route</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tripData.route.from_city ?? ""} →{" "}
                  {tripData.route.to_city ?? ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(tripData.departure_time ?? "")}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              {/* <DollarSign className="h-5 w-5 text-teal-600" /> */}
              <span className="text-gray-700">Fare</span>
            </div>
            <span className="text-2xl font-bold text-teal-600">
              {tripData.price ?? "0"} Birr
            </span>
          </div>

          <Separator />

          {/* Operator Information */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Bus className="h-5 w-5 text-teal-600" />
              Operator Information
            </h3>
            <div className="space-y-2 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">
                  {tripData.operator.name ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bus Information */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Bus className="h-5 w-5 text-teal-600" />
              Bus Information
            </h3>
            <div className="space-y-2 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Plate Number</span>
                <Badge variant="secondary" className="font-mono">
                  {tripData.bus?.plate_no ?? "N/A"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Driver Information */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5 text-teal-600" />
              Driver Information
            </h3>
            <div className="space-y-2 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">
                  {tripData.driver?.name ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Trip created: {formatDate(tripData.trip_date ?? "")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
