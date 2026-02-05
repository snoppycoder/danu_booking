"use client";

import { format } from "date-fns";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

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

interface AdminKYCListProps {
  documents: KYCDocument[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectDocument: (doc: KYCDocument) => void;
  isLoading: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "approved":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "rejected":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "approved":
      return "bg-green-50 text-green-700 border border-green-200";
    case "rejected":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

export function AdminKYCList({
  documents,
  selectedIds,
  onToggleSelect,
  onSelectDocument,
  isLoading,
}: AdminKYCListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No documents found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelectDocument(doc)}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            selectedIds.has(doc.id)
              ? "bg-secondary border-primary"
              : "bg-background border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedIds.has(doc.id)}
              onChange={() => onToggleSelect(doc.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 mt-1"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-foreground truncate">
                    {doc.document_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doc.operator_name || doc.agent_name || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusIcon(doc.status)}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeClass(doc.status)}`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {doc.document_type.replace(/_/g, " ")}
                </div>
                <div>
                  <span className="font-medium">Uploaded:</span>{" "}
                  {format(new Date(doc.uploaded_at), "MMM d, yyyy")}
                </div>
                {doc.reviewed_at && (
                  <div>
                    <span className="font-medium">Reviewed:</span>{" "}
                    {format(new Date(doc.reviewed_at), "MMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
