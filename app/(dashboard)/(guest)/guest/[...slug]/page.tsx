"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeleBirrRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string[];

  const isTeleBirrRedirect = slug?.some(
    (s) => s.includes("appid=") || s.includes("prepay_id=") || s.includes("merch_code=")
  );

  useEffect(() => {
    if (!isTeleBirrRedirect) {
      router.push("/guest");
    }
  }, [isTeleBirrRedirect, router]);

  if (!isTeleBirrRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
