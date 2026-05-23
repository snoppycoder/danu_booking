import GuestBooking from "@/components/GuestBooking";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center">
          Loading bookings...
        </div>
      }
    >
      <GuestBooking />
    </Suspense>
  );
}
