"use client";
import { useAuth } from "@/lib/authContext";

import OperatorRefundList from "@/components/OperatorRefund";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import DanuAgentRefundList from "@/components/DanuAgentRefund";
import AgentRefundList from "@/components/AgentRefund";

export default function DanuAgentRefundsPage() {
  const { user } = useAuth();

  return (
    <div className="">
      <Toaster richColors position="top-right" />
      <div className="mb-1 p-4 border-b border-gray-300 pt-4">
        <SidebarTrigger />
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">Refund Management</h2>
        <p>Manage and process refund requests from customers.</p>
      </div>
      <div className="p-4 mt-2">
        <AgentRefundList organization_id={user?.organization_id || ""} />
      </div>
    </div>
  );
}
