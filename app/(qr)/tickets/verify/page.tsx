"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { publicApi } from "@/app/api/api";

interface TicketVerificationResponse {
  success: boolean;
  message: string;
  data?: any; // Replace 'any' with your actual ticket type
}

export default function TicketVerification() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TicketVerificationResponse | null>(null);

  const token = params?.get("token");
  useEffect(() => {
    if (!token) return;

    const verifyTicket = async () => {
      try {
        const data = await publicApi.verifyTicketToken(token ?? "");
        setResult(data);
      } catch (error) {
        console.error("Verification error:", error);
        setResult({ success: false, message: "Failed to verify ticket. o" });
      } finally {
        setLoading(false);
      }
    };

    verifyTicket();
  }, [token]);

  if (loading) return <p>Verifying ticket...</p>;

  if (!result) return <p>No ticket information available.</p>;

  return (
    <div>
      {result.success ? (
        <div>
          <h1>
            Ticket Verified <CheckCircle size={26} />{" "}
          </h1>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      ) : (
        <h1>
          Verification Failed <X className="text-red-500" size={26} />
        </h1>
      )}
      <p>{result.message}</p>
    </div>
  );
}
