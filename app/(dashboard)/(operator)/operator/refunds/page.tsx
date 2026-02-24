"use client";
import { useAuth } from "@/lib/authContext";

import OperatorRefundList from "@/components/OperatorRefund";

export default function RefundsPage() {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Refund Management</h1>
      <p>Manage and process refund requests from customers.</p>

      <div className="mt-6">
        <OperatorRefundList operator_id={user?.organization_id || ""} />
      </div>
    </div>
  );
}
