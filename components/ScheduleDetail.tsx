"use client";

import { operatorApi } from "@/app/api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/authContext";

import { MapPin, Route, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type RouteDTO = {
  id: string;
  route_from: string;
  route_to: string;
  distance_km: number;
  estimated_duration_minutes: number;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  route_to: string;
  route_from: string;
};

export function RouteDetailDialog({
  open,
  setOpen,
  route_to,
  route_from,
}: Props) {
  const [route, setRoute] = useState<RouteDTO>({
    route_from: "",
    route_to: "",
    id: "",
    estimated_duration_minutes: 0,
    distance_km: 0,
  });
  const { user } = useAuth();
  useEffect(() => {
    const fetch = async () => {
      if (!route_from || !route_to || !user?.organization_id) return;
      const res = await operatorApi.getDetailSchedule(
        user.organization_id,
        route_from,
        route_to,
      );
      setRoute(res);
    };
    fetch();
  }, [route_from, route_to, user?.organization_id]);
  if (!route_from || !route_to) return null;

  const durationHours = Math.round(route.estimated_duration_minutes / 60);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Route className="w-5 h-5 text-emerald-600" />
            Route Details
          </DialogTitle>
          <DialogDescription>
            Information about this travel route.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Route */}
          <div className="flex items-center gap-3 bg-muted/40 p-4 rounded-xl">
            <MapPin className="text-emerald-600 w-5 h-5" />
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="font-medium">
                {route.route_from} → {route.route_to}
              </p>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center justify-between border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Distance</p>
            <p className="font-semibold">{route.distance_km} km</p>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              Estimated Duration
            </div>
            <p className="font-semibold">{durationHours} hr</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
