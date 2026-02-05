"use client";

import { useState } from "react";
import { Trash2, Edit2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/authContext";

interface KYCDocument {
  id: string;
  document_name: string;
  document_type: string;
  document_url: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  reviewed_at?: string;
}

interface KYCDocumentListProps {
  documents: KYCDocument[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
  isLoading?: boolean;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> =
  {
    approved: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
    },
    rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  };

const getStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function KYCDocumentList({
  documents,
  onDelete,
  onUpdate,
  isLoading = false,
}: KYCDocumentListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const approved = documents.filter((d) => d.status === "approved");
  const pending = documents.filter((d) => d.status === "pending");
  const rejected = documents.filter((d) => d.status === "rejected");

  const DocumentCard = ({ doc }: { doc: KYCDocument }) => {
    const colors = statusColors[doc.status];

    return (
      <div className={`p-4 rounded-lg border border-border ${colors.bg}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">
                {doc.document_name}
              </h4>
              <Badge variant="outline" className={colors.text}>
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-1 ${colors.dot}`}
                />
                {getStatusLabel(doc.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              Type: {doc.document_type.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div className="mb-3 text-xs text-muted-foreground space-y-1">
          <p>Uploaded: {formatDate(doc.uploaded_at)}</p>
          {doc.reviewed_at && <p>Reviewed: {formatDate(doc.reviewed_at)}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(doc.document_url, "_blank")}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          {doc.status === "pending" || doc.status === "rejected" ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdate?.(doc.id)}
                disabled={isLoading}
                className="flex-1"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Update
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteId(doc.id)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-3 mt-4">
          {approved.length > 0 ? (
            approved.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No approved documents
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {pending.length > 0 ? (
            pending.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No pending documents
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-3 mt-4">
          {rejected.length > 0 ? (
            rejected.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No rejected documents
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(deleteId!);
                setDeleteId(null);
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
