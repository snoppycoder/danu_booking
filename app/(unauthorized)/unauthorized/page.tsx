"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { use, useState } from "react";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const [redirect, setRedirect] = useState("");
  if (user && user.roles.length > 0) {
    if (user.roles[0].slug.includes("passenger")) {
      if (redirect !== "/passenger") setRedirect("/passenger");
    } else if (user.roles[0].slug.includes("agent")) {
      if (redirect !== "/agent") setRedirect("/agent");
    } else if (user.roles[0].slug.includes("operator-admin")) {
      if (redirect !== "/operator") setRedirect("/operator");
    }
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary p-4 rounded-full">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please check your
          credentials or contact support if you believe this is an error.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={redirect || "/"}
            className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          {/* <Link
            href="/"
            className="w-full bg-secondary text-secondary-foreground py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </Link> */}
        </div>
      </div>
    </main>
  );
}
