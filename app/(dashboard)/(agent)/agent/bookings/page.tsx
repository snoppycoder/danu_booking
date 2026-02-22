import AgentClientBooking from "@/components/AgentBookingClient";
import { Suspense } from "react";

export default function AgentBooking() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <AgentClientBooking />
    </Suspense>
  );
}
