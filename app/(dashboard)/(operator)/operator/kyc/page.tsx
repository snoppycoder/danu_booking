"use client";

import { useState, useCallback, use } from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import {
  KYCDocumentInput,
  KYCUploadForm,
} from "@/components/KYCDocumentUpload";
import { KYCDocumentList } from "@/components/KYCDocumentList";
import { KYCDocument } from "@/lib/model";
import { useAuth } from "@/lib/authContext";
import { useKYCdocuments } from "@/components/Query";

// Mock data for demonstration

export default function KYCPage() {
  const { user } = useAuth();
  const { data, isLoading: isPageLoading } = useKYCdocuments(
    user?.organization_id || "",
  );
  console.log(data, "KYC documents data");
  const [documents, setDocuments] = useState<KYCDocument[]>(data || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = useCallback(async (data: KYCDocumentInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newDocument: KYCDocument = {
        id: Math.random().toString(36).substr(2, 9),
        owner_type: "operator",
        owner_id: "user-123",
        document_name: data.document_name,
        document_type: data.document_type,
        document_url: data.document_url,
        status: "pending",
        uploaded_by: "user-123",
        uploaded_at: new Date().toISOString(),
      };

      setDocuments((prev) => [newDocument, ...prev]);
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      alert("Document deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdate = useCallback((id: string) => {
    // In a real app, this would open a modal or redirect to an edit page
    alert(`Update functionality for document ${id} would be implemented here.`);
  }, []);

  const stats = {
    approved: documents.filter((d) => d.status === "approved").length,
    pending: documents.filter((d) => d.status === "pending").length,
    rejected: documents.filter((d) => d.status === "rejected").length,
  };

  return (
    <main className="min-h-screen text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-black md:text-3xl font-bold mb-1 text-balance">
            KYC Document Upload
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Submit and manage your know-your-customer documents
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="border border-bg-primary text-primary p-6 rounded-md">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium opacity-80">Approved</p>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="border border-bg-primary text-primary p-6  rounded-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium opacity-80">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="border border-bg-primary text-primary p-6 rounded-md">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm font-medium opacity-80">Rejected</p>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form Section */}
        <div className="mb-12">
          <div className="bg-card text-foreground p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-6">Upload New Document</h2>
            <KYCUploadForm onSubmit={handleUpload} isLoading={isLoading} />
          </div>
        </div>

        {/* Documents List Section */}
        <div className="bg-card text-foreground p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-6">Your KYC Documents</h2>
          <KYCDocumentList
            documents={documents}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
