import GuestBooking from "@/components/GuestBooking";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading bookings...</div>}>
      <GuestBooking />
    </Suspense>
  );
}
