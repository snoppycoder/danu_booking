"use client";

import { useAuth } from "@/lib/authContext";

export default function RefundList() {
  const { user } = useAuth();
  console.log(user);
  return <>{user?.email}</>;
}
