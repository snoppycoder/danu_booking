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
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import { TripData } from "@/lib/model";

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: TripData | null;
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
          <div className="rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-teal-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Route</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tripData.route_from} → {tripData.route_to}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(tripData.departure_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-teal-600" />
              <span className="text-gray-700">Fare</span>
            </div>
            <span className="text-2xl font-bold text-teal-600">
              {tripData.price} Birr
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
                  {tripData.operator.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contact Phone</span>
                <a
                  href={`tel:${tripData.operator.contact_phone}`}
                  className="flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700"
                >
                  <Phone className="h-4 w-4" />
                  {tripData.operator.contact_phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contact Email</span>
                <a
                  href={`mailto:${tripData.operator.contact_email}`}
                  className="flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700"
                >
                  <Mail className="h-4 w-4" />
                  {tripData.operator.contact_email}
                </a>
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
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Plate Number</span>
                <Badge variant="secondary" className="font-mono">
                  {tripData.bus.plate_no}
                </Badge>
              </div> */}
              <div className="flex justify-between">
                <span className="text-gray-600">Side Number</span>
                <span className="font-medium text-gray-900">
                  {tripData.bus?.side_no ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {tripData.bus?.capacity ?? "0"} seats
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Driver Information */}
          {/* <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5 text-teal-600" />
              Driver Information
            </h3>
            <div className="space-y-2 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">
                  {tripData.driver.first_name} {tripData.driver.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">License Number</span>
                <Badge variant="secondary" className="font-mono">
                  {tripData.driver.license_no}
                </Badge>
              </div>
            </div>
          </div>

          <Separator /> */}

          {/* Additional Information */}
          {/* <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Trip created: {formatDate(tripData.created_at)}</span>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
