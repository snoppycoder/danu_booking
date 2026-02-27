"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function SessionManagerSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="w-full mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center space-y-3">
          <Skeleton className="h-10 w-10 mb-6 rounded-full" />{" "}
          {/* ArrowBack placeholder */}
          <Skeleton className="h-10 w-64 rounded-md" /> {/* Title */}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="border-primary/20 bg-card/50 backdrop-blur-sm p-6 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" /> {/* Icon */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32 rounded-md" /> {/* Label */}
                  <Skeleton className="h-6 w-20 rounded-md" /> {/* Value */}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
        </div>

        {/* Session Cards */}
        <div className="space-y-4 mb-12">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card
              key={idx}
              className="overflow-hidden border animate-pulse p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Device Info */}
                <div className="flex gap-4 flex-1">
                  <Skeleton className="h-12 w-12 rounded-lg" />{" "}
                  {/* Device Icon */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 rounded-md" />{" "}
                    {/* Device Name */}
                    <Skeleton className="h-3 w-48 rounded-md" />{" "}
                    {/* Location */}
                    <Skeleton className="h-3 w-32 rounded-md" />{" "}
                    {/* Last active */}
                  </div>
                </div>

                {/* Revoke Button */}
                <Skeleton className="h-10 w-24 rounded-md sm:flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6 animate-pulse">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-5 rounded-full mt-0.5" />{" "}
            {/* Shield Icon */}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32 rounded-md" /> {/* Title */}
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-4/6 rounded-md" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
