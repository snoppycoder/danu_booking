"use client";

import { format } from "date-fns";
import { AlertCircle, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

interface KYCDocument {
  id: string;
  operator_id?: string;
  operator_name?: string;
  agent_id?: string;
  agent_name?: string;
  document_type: string;
  document_name: string;
  document_url: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  reviewed_at?: string;
}

interface AdminKYCDetailProps {
  document: KYCDocument;
  onDelete: (id: string) => Promise<void>;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isLoading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "approved":
      return "text-green-600 bg-green-50";
    case "rejected":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export function AdminKYCDetail({
  document,
  onDelete,
  onApprove,
  onReject,
  isLoading,
}: AdminKYCDetailProps) {
  const ownerName = document.operator_name || document.agent_name || "Unknown";
  const ownerType = document.operator_id ? "Operator" : "Agent";

  const handleDeleteClick = async () => {
    if (confirm("Are you sure you want to delete this document?")) {
      await onDelete(document.id);
    }
  };

  return (
    <div className="bg-card text-foreground p-6 rounded-lg border border-border space-y-6">
      {/* Status Badge */}
      <div className={`p-3 rounded-lg ${getStatusColor(document.status)}`}>
        <div className="flex items-center gap-2 mb-1">
          {document.status === "pending" && <AlertCircle className="w-5 h-5" />}
          {document.status === "approved" && (
            <CheckCircle className="w-5 h-5" />
          )}
          {document.status === "rejected" && <XCircle className="w-5 h-5" />}
          <span className="font-semibold capitalize">{document.status}</span>
        </div>
      </div>

      {/* Document Name */}
      <div>
        <h3 className="text-lg font-bold mb-2">{document.document_name}</h3>
        <p className="text-sm text-muted-foreground">ID: {document.id}</p>
      </div>

      {/* Owner Information */}
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="font-semibold text-foreground">Owner Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{ownerType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-medium text-xs">
              {document.operator_id || document.agent_id}
            </span>
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="font-semibold text-foreground">Document Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">
              {document.document_type.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uploaded:</span>
            <span className="font-medium">
              {format(new Date(document.uploaded_at), "MMM d, yyyy HH:mm")}
            </span>
          </div>
          {document.reviewed_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviewed:</span>
              <span className="font-medium">
                {format(new Date(document.reviewed_at), "MMM d, yyyy HH:mm")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Link */}
      <div className="border-t border-border pt-4">
        <a
          href={document.document_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Document
        </a>
      </div>

      {/* Action Buttons */}
      {document.status === "pending" && (
        <div className="space-y-2 border-t border-border pt-4">
          <button
            onClick={onApprove}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            Approve Document
          </button>
          <button
            onClick={onReject}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            Reject Document
          </button>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        Delete Document
      </button>
    </div>
  );
}
