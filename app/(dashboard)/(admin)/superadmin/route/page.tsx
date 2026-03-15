"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { superAdminApi } from "@/app/api/api";
import AddRouteForm from "@/components/AddRouteForm";
import { Toaster } from "sonner";
import { useRoutes } from "@/components/Query";
import { ArrowRight } from "lucide-react";

interface Route {
  id: string;
  route_from: string;
  route_to: string;
  distance_km: number;
  estimated_duration_minutes: number;
}

export default function RoutePage() {
  // const [routes, setRoutes] = useState<Route[]>([]);
  const { data: routes, isLoading, refetch } = useRoutes();
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const handleGetRouteDetail = async (routeId: string) => {
    try {
      const data = await superAdminApi.getRouteDetail(routeId);
      setSelectedRoute(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch route details",
      );
    }
  };

  return (
    <main className="min-h-screen py-8">
      <Toaster richColors position="top-right" />
      <div className="max-w-6xl mx-auto px-4">
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-3xl font-bold text-center md:text-left text-foreground mb-5 md:md-auto ">
              Route Management
            </h1>
            <AddRouteForm onSuccess={refetch} />
          </div>
          <div className="mt-2 mb-2 text-gray-700 text-sm">
            Here you can define and configure the available routes that
            operators will use for their trips. This includes specifying the
            starting point, destination, distance, and estimated duration for
            each route, ensuring that the operators have clear guidance and
            accurate information when managing and scheduling their journeys.
          </div>

          {error && (
            <Card className="mb-6 p-4 bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {isLoading ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
                  <div className="flex flex-col gap-2.5 items-center space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  {/* <div className="h-8 bg-gray-300 rounded w-full"></div> */}
                </Card>
              ))}
            </div>
          ) : routes?.items.length === 0 ? (
            <Card className="mt-6 p-6 text-center">
              <p className="text-gray-600">No route found</p>
            </Card>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes?.items.map((route) => (
                <Card key={route.id} className="p-4">
                  <div className="w-full flex gap-2.5 items-center justify-center text-lg font-semibold mb-3">
                    {route.route_from} <ArrowRight size={16} /> {route.route_to}
                  </div>
                  <div className="flex flex-col gap-2.5 items-center space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Distance:</span>{" "}
                      {route.distance_km} km
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> ~
                      {Math.round(route.estimated_duration_minutes / 60)} Hour
                    </p>
                  </div>
                  {/* <Button
                    onClick={() => handleGetRouteDetail(route.id)}
                    variant="outline"
                    className="w-full"
                  >
                    View Details
                  </Button> */}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Selected Route Details */}
        {selectedRoute && (
          <Card className="mt-8 p-6 bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">Route Details</h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Route ID:</span>{" "}
                {selectedRoute.id}
              </p>
              <p>
                <span className="font-medium">From:</span>{" "}
                {selectedRoute.route_from}
              </p>
              <p>
                <span className="font-medium">To:</span>{" "}
                {selectedRoute.route_to}
              </p>
              <p>
                <span className="font-medium">Distance:</span>{" "}
                {selectedRoute.distance_km} km
              </p>
              <p>
                <span className="font-medium">Estimated Duration:</span>{" "}
                {selectedRoute.estimated_duration_minutes} minutes
              </p>
            </div>
            <Button
              onClick={() => setSelectedRoute(null)}
              variant="outline"
              className="mt-4"
            >
              Close Details
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
}
