"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Refund } from "@/lib/model";
import { useDanuAgentRefundList } from "./Query";
import { useAuth } from "@/lib/authContext";
import { RefundDetailDialog } from "./RefundDetailDialog";
import RefundForm from "./RefundForm";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { operatorApi } from "@/app/api/api";

interface RefundListProps {
  agent_id: string;
  onApprove?: (refund: Refund) => void;
  onSuccess?: () => void;
  onReject?: (refund: Refund) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processed":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "rejected":
      return "bg-white text-red-500";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    case "failed":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

function RefundCard({ refund }: { refund: Refund }) {
  const { user } = useAuth();
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Left Section - Passenger & Booking Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600">Passenger</h3>
          <p className="font-medium text-lg">{refund.passenger_name}</p>
          <p className="text-xs text-gray-500">Ref: {refund.booking_ref}</p>
        </div>

        {/* Middle Section - Amount Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600">Amount</h3>
          <div className="flex items-baseline gap-2">
            <p className="font-bold text-xl text-gray-900">
              {refund?.processed_amount?.toFixed(2) ?? "0.00"} Birr
            </p>
            {refund.total_amount !== refund?.processed_amount && (
              <p className="text-xs text-gray-500">
                of {refund.total_amount.toFixed(2)} Birr
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            via {refund?.method ?? "Unknown"}
          </p>
        </div>

        {/* Right Section - Status & Time */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-sm text-gray-600">Status</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getStatusColor(refund.status)} capitalize`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(refund.status)}
                {refund.status}
              </span>
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(refund.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      {/* Notes */}
      {refund.notes && (
        <div className="mb-4 pb-4 border-t pt-3">
          <p className="text-xs text-gray-600 italic">{refund.notes}</p>
        </div>
      )}
    </Card>
  );
}

function RefundListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function DanuAgentRefundList({ agent_id }: RefundListProps) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {},
  );
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState<string>("");
  const [openRefundForm, setOpenRefundForm] = useState(false);
  const [method, setMethod] = useState<"processed" | "rejected" | "pending">(
    "pending",
  );
  const { data, isLoading, error, refetch } = useDanuAgentRefundList(
    agent_id,
    page,
    pageSize,
  );
  if (agent_id.trim().length === 0) {
    return <RefundListSkeleton></RefundListSkeleton>;
  }

  if (isLoading) {
    return <RefundListSkeleton />;
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-800 font-medium">
          Failed to load refunds. Please try again later.
        </p>
      </Card>
    );
  }

  const refunds = data || [];
  const total = data?.length || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (agent_id.trim().length > 0 && refunds.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500 mb-2">No refunds found</p>
        <p className="text-sm text-gray-400">
          Try adjusting your filters or date range
        </p>
      </Card>
    );
  }

  function onViewDetails(id: string, agent_id: string) {
    setSelectedRefundId(id);
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mt-4">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, total)} of {total} refunds
          </p>
        </div>
      </div>

      {/* Refund Cards */}
      <div className="space-y-4">
        {refunds.map((refund: Refund) => (
          <RefundCard key={refund.id} refund={refund} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
      {/* <RefundDetailDialog
        agent_id={user? || ""}
        isOpen={open}
        onOpenChange={setOpen}
        refund_id={selectedRefundId}
      /> */}
    </div>
  );
}
