"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KYCDocument } from "@/lib/model";
import { AdminKYCList } from "@/components/AdminKYCList";
import { AdminKYCDetail } from "@/components/AdminKYCDetail";
import {
  useAgentsKYCdocuments,
  useKYCdocuments,
  useOperatorsKYCdocuments,
} from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { toast, Toaster } from "sonner";
import { superAdminApi } from "@/app/api/api";

// Mock data for demonstration

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminKYCPage() {
  const { data, isLoading: isPageLoading, refetch } = useAgentsKYCdocuments();
  const [documents, setDocuments] = useState<KYCDocument[]>([]); // Replace with fetched data
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null,
  );
  console.log("Fetched KYC documents:", documents);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setDocuments(data);
    }
  }, [data]);
  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      const matchesSearch =
        searchQuery.toLowerCase() === "" ||
        doc.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.operator_name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false) ||
        (doc.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      return matchesStatus && matchesSearch;
    });
  }, [documents, statusFilter, searchQuery]);

  // Calculate stats
  const stats = useMemo(
    () => ({
      pending: documents.filter((d) => d.status === "pending").length,
      approved: documents.filter((d) => d.status === "approved").length,
      rejected: documents.filter((d) => d.status === "rejected").length,
      total: documents.length,
    }),
    [documents],
  );

  // Handle bulk verification
  const handleBulkApprove = useCallback(async () => {
    if (selectedIds.size === 0) {
      toast.warning("Please select documents to approve");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setDocuments((prev) =>
        prev.map((doc) =>
          selectedIds.has(doc.id)
            ? {
                ...doc,
                status: "approved" as const,
                reviewed_at: new Date().toISOString(),
              }
            : doc,
        ),
      );

      toast.success(`${selectedIds.size} document(s) approved successfully!`);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Bulk approve failed:", error);
      toast.error("Failed to approve documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedIds]);

  // Handle bulk rejection
  const handleBulkReject = useCallback(async () => {
    if (selectedIds.size === 0) {
      toast.warning("Please select documents to reject");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setDocuments((prev) =>
        prev.map((doc) =>
          selectedIds.has(doc.id)
            ? {
                ...doc,
                status: "rejected" as const,
                reviewed_at: new Date().toISOString(),
              }
            : doc,
        ),
      );

      toast.success(`${selectedIds.size} document(s) rejected successfully!`);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Bulk reject failed:", error);
      toast.error("Failed to reject documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedIds]);

  const handleDelete = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setSelectedDocument(null);
      toast.error("Document deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredDocuments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDocuments.map((d) => d.id)));
    }
  }, [filteredDocuments, selectedIds]);

  return (
    <main className="min-h-screen ">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-balance">
            Agent KYC Document Review
          </h1>
          <p className="text-md text-gray-400 mt-2">
            Review and approve Know-Your-Customer documents from agents
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-bg-primary text-primary p-6 rounded-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm font-medium opacity-75">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="border border-bg-primary text-primary p-6 rounded-md">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm font-medium opacity-75">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="border border-bg-primary text-primary p-6 rounded-md">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm font-medium opacity-75">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="border border-bg-primary text-primary p-6 rounded-md">
            <div>
              <p className="text-sm font-medium opacity-75">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-card text-foreground p-6 rounded-lg border border-border">
              {/* Filters and Search */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name or document..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="w-[180px]">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) =>
                        setStatusFilter(value as StatusFilter)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedIds.size > 0 && statusFilter === "pending" && (
                  <div className="flex items-center justify-between bg-secondary p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium">
                      {selectedIds.size} document(s) selected
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleBulkApprove}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium text-sm"
                      >
                        Approve All
                      </button>
                      <button
                        onClick={handleBulkReject}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium text-sm"
                      >
                        Reject All
                      </button>
                    </div>
                  </div>
                )}

                {/* Select All Checkbox */}
                {filteredDocuments.length > 0 && statusFilter === "pending" && (
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === filteredDocuments.length &&
                        filteredDocuments.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-muted-foreground">
                      Select all on this page
                    </label>
                  </div>
                )}
              </div>

              {/* Documents List */}
              <AdminKYCList
                documents={filteredDocuments}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onSelectDocument={(doc) => setSelectedDocument(doc)}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Detail Section */}
          <div className="lg:col-span-1">
            {selectedDocument ? (
              <AdminKYCDetail
                document={selectedDocument}
                onDelete={handleDelete}
                onApprove={async () => {
                  setIsLoading(true);
                  try {
                    await superAdminApi.verifyKYCdocument(
                      selectedDocument.operator_id || "",
                      selectedDocument.id,
                      "approved",
                    );
                    refetch();

                    setSelectedDocument(null);
                    toast.success("Document has been approved!");
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onReject={async () => {
                  setIsLoading(true);
                  try {
                    await superAdminApi.verifyKYCdocument(
                      selectedDocument.operator_id || "",
                      selectedDocument.id,
                      "rejected",
                    );
                    refetch();

                    setSelectedDocument(null);
                    toast.success("Document has been rejected!");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                isLoading={isLoading}
              />
            ) : (
              <div className="bg-card text-foreground p-6 rounded-lg border border-border text-center py-12">
                <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a document to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
