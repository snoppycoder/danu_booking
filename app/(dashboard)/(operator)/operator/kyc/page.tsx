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
import { useKYCdocuments, OperatorUseUploadKyc } from "@/components/Query";
import { toast, Toaster } from "sonner";
import { kycApi, operatorApi } from "@/app/api/api";
import { isAxiosError } from "axios";

// Mock data for demonstration

export default function KYCPage() {
  const { user } = useAuth();
  const {
    data,
    isLoading: isPageLoading,
    refetch,
  } = useKYCdocuments(user?.organization_id || "");
  console.log("KYC documents data:", data);

  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: uploadKyc, isPending } = OperatorUseUploadKyc();

  const handleUpload = useCallback(
    async (formData: KYCDocumentInput) => {
      if (!formData.file) {
        toast.error("Please select a file to upload.");
        return;
      }

      if (!user?.organization_id) {
        return;
      }
      if (!formData.file) {
        toast.error("Please select a file to upload.");
        return;
      }

      try {
        // const res = await kycApi.uploadKyc(
        //   {
        //     document_name: formData.document_name,
        //     document_type: formData.document_type,
        //     file: formData.file,
        //   },
        //   user.organization_id,
        // );
        const res = await uploadKyc({
          operator_id: user.organization_id,
          document_name: formData.document_name,
          document_type: formData.document_type,
          file: formData.file,
        });
        // console.log("Upload response:", res);
        console.log("Upload response:", res);

        toast.success("Document uploaded successfully!");
        refetch();
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.detail?.[0]?.msg ||
            error.response?.data.error ||
            "Failed to upload document. Please try again.";
          toast.error(errorMessage);
        }
      }
    },
    [uploadKyc, user],
  );

  const handleDelete = useCallback(async (id: string) => {
    console.log("Attempting to delete document with id:", id);
    setIsLoading(true);
    try {
      await operatorApi.delteKYCdocument(user?.organization_id || "", id);

      refetch();

      toast.warning("Document deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stats = {
    approved: data?.filter((d) => d.status === "approved").length,
    pending: data?.filter((d) => d.status === "pending").length,
    rejected: data?.filter((d) => d.status === "rejected").length,
  };

  return (
    <main className="min-h-screen text-primary-foreground">
      <Toaster position="top-right" richColors />
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
            <KYCUploadForm onSubmit={handleUpload} isLoading={isPending} />
          </div>
        </div>

        {/* Documents List Section */}
        <div className="bg-card text-foreground p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-6">Your KYC Documents</h2>
          <KYCDocumentList
            documents={data || []}
            onDelete={handleDelete}
            // onUpdate={handleUpdate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
