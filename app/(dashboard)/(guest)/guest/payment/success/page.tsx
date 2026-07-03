"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Your TeleBirr payment has been processed successfully.
        </p>
        <div className="pt-4 space-y-3">
          <Button 
            onClick={() => router.push("/guest/bookings")}
            className="w-full"
          >
            View My Bookings
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push("/guest")}
            className="w-full"
          >
            Book Another Trip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
