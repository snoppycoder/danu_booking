"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import QRCode from "react-qr-code";
import {
  AlertCircle,
  MapPin,
  Ticket,
  Bus,
  User,
  Hash,
  CreditCard,
  Clock,
} from "lucide-react";

import { useTicketNumber } from "@/components/Query";
import TicketSearch from "@/components/TicketSearchClient";

// import { useAuth } from "@/lib/authContext";

export default function TVN() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <TicketSearch />
    </Suspense>
  );
}
