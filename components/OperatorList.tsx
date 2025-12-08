"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { AddOperatorModal } from "./AddOperatorModal";
import { superAdminApi } from "@/app/api/api";
import { toast } from "sonner";
import { Operator } from "@/lib/model";

import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import InfoRow from "./InfoRow";

export default function OperatorList() {
  const [displayCount, setDisplayCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailToggle, setDetailToggle] = useState(false);
  const [data, setData] = useState<Operator[]>([]);
  const [detail, setDetail] = useState<Operator>();
  const fetchOperators = async () => {
    const res = await superAdminApi.getOperator();
    setData(res.items);
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const filteredOperators = data.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleViewDetail(id: string) {
    const res = await superAdminApi.viewOperatorDetail(id);
    if (res) {
      setDetail(res);
      setDetailToggle(true);
    }
  }

  async function handleDelete(id: string) {
    const response = await superAdminApi.deleteOperator(id);
    if (response) {
      toast.success("Operator deleted");
      fetchOperators();
    }
  }
  function dateformatter(date: Date) {
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    return formatted;
  }

  async function handleCopy() {
    if (!filteredOperators.length) {
      toast.warning("Nothing to copy");
      return;
    }
    const jsonData = {
      metadata: {
        exported_at: new Date().toISOString(),
        total_operators: filteredOperators.length,
        source: "Operator Management System",
      },
      operators: filteredOperators,
    };

    await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    toast.success(`Copied ${filteredOperators.length} operators`);
  }

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Operator List</h1>
        <AddOperatorModal />
      </div>

      <Dialog open={detailToggle} onOpenChange={setDetailToggle}>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        <DialogContent
          className="
      fixed top-1/2 left-1/2 
      -translate-x-1/2 -translate-y-1/2
      z-50
      max-w-[460px] w-[90%]
      p-5 rounded-xl
      bg-card shadow-lg border border-border/40
      space-y-4
    "
        >
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold">
              Operator Details
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Quick information summary
            </DialogDescription>
          </DialogHeader>

          {/* Compact Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 space-y-2 text-sm">
            <InfoRow label="Name" value={detail?.name} />
            <InfoRow label="Slug" value={detail?.slug} />
            <InfoRow label="Email" value={detail?.contact_email} />
            <InfoRow label="Mobile" value={detail?.contact_phone} />
            <InfoRow label="Website" value="N/A" />
            <InfoRow
              label="Created"
              value={
                detail?.created_at && dateformatter(new Date(detail.created_at))
              }
            />
            <InfoRow
              label="Updated"
              value={
                detail?.updated_at && dateformatter(new Date(detail.updated_at))
              }
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Controls Section */}
      <div className="bg-card rounded-lg p-6 space-y-6 border border-border/50">
        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Display Count */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Display</span>
            <Select value={displayCount} onValueChange={setDisplayCount}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">Entries</span>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="flex gap-1"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4" /> Copy
            </Button>

            <Button variant="outline">CSV</Button>
            <Button variant="outline">PDF</Button>
            <Button variant="outline">Print</Button>
          </div>

          {/* Search */}
          <div className="max-w-xs w-full">
            <Input
              placeholder="Search operators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            No operators registered.
          </p>
        ) : (
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperators.map((op, i) => (
                  <TableRow key={op.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{op.name}</TableCell>
                    <TableCell>{op.contact_email}</TableCell>
                    <TableCell>{op.contact_phone}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleViewDetail(op.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                          onClick={() => handleDelete(op.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {data.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {filteredOperators.length} of{" "}
              {filteredOperators.length} entries
            </p>

            <div className="flex gap-2">
              <Button variant="outline" disabled={currentPage === 1}>
                Previous
              </Button>
              <Button className="bg-primary text-primary-foreground">
                {currentPage}
              </Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
