"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  Copy,
  Plus,
  RefreshCcw,
  RefreshCw,
  MoreHorizontal,
  CircleQuestionMark,
  UserX,
  UserPlus,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AddOperatorModal } from "./AddOperatorModal";
import { superAdminApi } from "@/app/api/api";
import { toast } from "sonner";
import { Operator } from "@/lib/model";

import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import InfoRow from "./InfoRow";
import { useOperator, useUsers } from "./Query";
import axios, { isAxiosError } from "axios";
import { exportToCSV } from "@/lib/common_functions";

export default function OperatorList() {
  const [displayCount, setDisplayCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  // const [userId, setUserId] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [detailToggle, setDetailToggle] = useState(false);
  const [detail, setDetail] = useState<Operator>();
  const [spinning, setSpinning] = useState<boolean>(false);
  const { data, isLoading, refetch } = useOperator(
    currentPage,
    Number(displayCount),
  );
  const { data: users, ...rest } = useUsers(1, 200, true); //make all
  const filteredUsers =
    users?.items?.filter(
      (u) => u.roles[0]?.name == "Operator Admin" && !u.organization_id,
    ) ?? [];

  console.log(filteredUsers, "all");

  useEffect(() => {
    setCurrentPage(1);
  }, [displayCount]);
  const filteredOperators = data?.items?.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.contact_email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function handleViewDetail(id: string) {
    const res = await superAdminApi.viewOperatorDetail(id);
    if (res) {
      setDetail(res);
      setDetailToggle(true);
    }
  }
  async function handleActivate(id: string) {
    try {
      await superAdminApi.activateOperator(id);
      refetch();
      toast.success("Operator sucessfully activated");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data.error ||
            "Error while trying to activate the operator",
        );
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await superAdminApi.deleteOperator(id);
      refetch();
      toast.success("Operator deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete operator. Please try again.");
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
    if (!filteredOperators?.length) {
      toast.warning("Nothing to copy");
      return;
    }
    const jsonData = {
      metadata: {
        exported_at: new Date().toISOString(),
        total_operators: filteredOperators?.length,
        source: "Operator Management System",
      },
      operators: filteredOperators,
    };

    await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    toast.success(`Copied ${filteredOperators.length} operators`);
  }
  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }
  async function handleAssignOperatorToUser(userId: string) {
    try {
      await superAdminApi.assignOperatorToUser(operatorId, userId);
      toast.success("Successfully assigned the user to the operator");
      setOpen(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function handleRefetch(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault();
    setSpinning(true);
    await refetch();
    setSpinning(false);
  }
  const hasUsers = filteredUsers?.length > 0;
  console.log(hasUsers);

  return (
    <div className="relative space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-3xl font-bold text-center md:text-left text-foreground mb-5 md:md-auto ">
          Operator List
        </h1>
        <AddOperatorModal onSuccess={refetch} />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md sm:rounded-2xl border-none shadow-2xl overflow-hidden p-0">
          <div className="bg-gray-50/50 p-6 border-b border-gray-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Assign User
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Select a user from the list below to assign them to this
                operator.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {hasUsers ? (
                filteredUsers.map((user) => {
                  const firstName = user.first_name || "";
                  const lastName = user.last_name || "";
                  const initials =
                    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

                  return (
                    <div
                      key={user.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar Placeholder */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {initials || "?"}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900 leading-none mb-1">
                            {firstName} {lastName}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            ID: {user.id.substring(0, 8)}...{" "}
                            {/* Example subtitle */}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 hover:bg-primary/15 text-primary"
                        onClick={() => handleAssignOperatorToUser(user.id)}
                      >
                        Select
                      </Button>
                    </div>
                  );
                })
              ) : (
                /* Beautiful Empty State */
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <UserX className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    No users available
                  </h3>
                  <p className="text-sm text-gray-500 max-w-[250px]">
                    There are currently no users available for assignment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="flex gap-1"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4" /> Copy
            </Button>

            <Button
              variant="outline"
              disabled={!data}
              onClick={() =>
                exportToCSV(
                  data!.items.map((o) => ({
                    name: o.name,
                    email: o.contact_email,
                    slug: o.slug,
                    "create at": o.created_at,
                  })),
                  ` operators_${new Date()}.csv`,
                )
              }
            >
              CSV
            </Button>
            <Button variant="outline">PDF</Button>
            <Button variant="outline">Print</Button>

            <Button
              className="ml-3.5 "
              variant="outline"
              onClick={handleRefetch}
            >
              <RefreshCw className={spinning ? "animate-spin" : ""} />
            </Button>
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
        {data?.items.length === 0 ? (
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
                {filteredOperators?.map((op, i) => (
                  <TableRow key={op.id} className="hover:bg-muted/30">
                    <TableCell>
                      {(currentPage - 1) * Number(displayCount) + i + 1}
                    </TableCell>
                    <TableCell>{op.name}</TableCell>
                    <TableCell>{op.contact_email}</TableCell>
                    <TableCell>{op.contact_phone}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <div className="relative inline-block group">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-black p-2 flex items-center gap-1"
                            onClick={() => {
                              setOperatorId(op.id);
                              setOpen(true);
                            }}
                          >
                            Assign
                            <CircleQuestionMark className="text-blue-600 cursor-pointer" />
                          </Button>

                          <pre className="z-90 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-700 px-3 py-1 max-w-xs text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 break-words pointer-events-none shadow-lg">
                            This will enable you to assign {`\n`} a user to this
                            operator
                          </pre>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetail(op.id)}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleActivate(op.id);
                              }}
                            >
                              Activate
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDelete(op.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {(data?.items.length ?? 0) > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * Number(displayCount) + 1} to{" "}
              {(currentPage - 1) * Number(displayCount) +
                (filteredOperators?.length ?? 0)}{" "}
              of {data?.total} entries
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button className="bg-primary text-primary-foreground">
                {currentPage}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={
                  (data?.total ?? 0) <= currentPage * Number(displayCount)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
