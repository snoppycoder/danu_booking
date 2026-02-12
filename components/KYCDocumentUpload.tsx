"use client";

import React from "react";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useKYCdocuments } from "./Query";
import { useAuth } from "@/lib/authContext";

interface KYCUploadFormProps {
  onSubmit: (data: KYCDocumentInput) => void;
  isLoading?: boolean;
}

export interface KYCDocumentInput {
  document_name: string;
  document_type: string;
  file: File | null;
}

export function KYCUploadForm({
  onSubmit,
  isLoading = false,
}: KYCUploadFormProps) {
  const [formData, setFormData] = useState<KYCDocumentInput>({
    document_name: "",
    document_type: "business_license",
    file: null,
  });
  const { user } = useAuth();
  const [fileExist, setFileExist] = useState(false);
  const { data } = useKYCdocuments(user?.organization_id || "");
  const [fileName, setFileName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileExist(true);
      setFormData((prev) => ({
        ...prev,
        file: file,
        document_name: file.name.split(".")[0],
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setType(value);
    setFormData((prev) => ({
      ...prev,
      document_type: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.document_name || !formData.file) {
      toast.error("Please fill in all fields");
      return;
    }

    for (const doc of data || []) {
      if (doc.document_type === formData.document_type) {
        toast.error(
          `You have already uploaded a document of type "${formData.document_type}". Please delete the existing one before uploading a new one.`,
          { duration: 10_000 },
        );
        return;
      }
    }
    onSubmit(formData);
    setFormData({
      document_name: "",
      document_type: "business_license",
      file: null,
    });
    setFileName("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="document-name"
            className="text-foreground font-medium"
          >
            Document Name
          </Label>
          <Input
            id="document-name"
            name="document_name"
            placeholder="Enter document name (e.g., Business License 2026)"
            value={formData.document_name}
            onChange={handleInputChange}
            className="border-input bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="document-type"
            className="text-foreground font-medium"
          >
            Document Type
          </Label>
          <Select
            value={formData.document_type}
            onValueChange={handleDocumentTypeChange}
          >
            <SelectTrigger id="document-type" className="border-input bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business_license">Business License</SelectItem>
              <SelectItem value="tax_certificate">Tax Certificate</SelectItem>
              {/* <SelectItem value="incorporation_certificate">
                Incorporation Certificate
              </SelectItem> */}
              {/* <SelectItem value="identification">
                Identification Document
              </SelectItem> */}
              <SelectItem value="operator_license">Operator License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-foreground font-medium">
            Upload Document
          </Label>
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-border rounded-lg bg-card hover:bg-secondary cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </label>
          </div>
          {fileName && (
            <div className="flex items-center justify-between mt-2 p-3 bg-secondary rounded-md">
              <span className="text-sm text-foreground truncate">
                {fileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFileName("");
                  setFormData((prev) => ({ ...prev, document_url: "" }));
                  setFileExist(false);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !formData.document_name || !fileExist}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
}
