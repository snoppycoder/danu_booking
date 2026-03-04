import AgentClientBooking from "@/components/AgentBookingClient";
import { Suspense } from "react";
import EmailPasswordExtractorClient from "@/components/ForgotEmailClient";

export default function EmailPasswordExtractor() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <EmailPasswordExtractorClient />
    </Suspense>
  );
}
