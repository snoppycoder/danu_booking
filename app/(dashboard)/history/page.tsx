import HistoryPageClient from "@/components/HistoryPageClient";
import { Suspense } from "react";

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <HistoryPageClient />
    </Suspense>
  );
}
