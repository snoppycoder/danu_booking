import ProfilePageClient from "@/components/ProfilePageClient";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <ProfilePageClient />
    </Suspense>
  );
}
