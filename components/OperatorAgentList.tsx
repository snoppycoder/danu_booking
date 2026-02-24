"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  Copy,
  Plus,
  MoreHorizontal,
  RefreshCw,
  CircleQuestionMark,
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
import { AddOperatorModal } from "./AddOperatorModal";
import { operatorApi, superAdminApi } from "@/app/api/api";
import { toast } from "sonner";

import { OperatorAgent, User } from "@/lib/model";
import { AddUserModal } from "./AddUserModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { isAxiosError } from "axios";
import DisableReasonModal from "./DisableReasonModal";
import { useQueryClient } from "@tanstack/react-query";
import { useOperator, useOperatorAgent, useUsers } from "./Query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { exportToCSV } from "@/lib/common_functions";
import UserDetail from "./UserDetail";
import { useAuth } from "@/lib/authContext";
import { CreateOperatorAgentDialog } from "./AddOperatorAgentModal";

export default function OperatorAgentList() {
  const [displayCount, setDisplayCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [detailToggle, setDetailToggle] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [_operator, setOperatorId] = useState("");

  const { user } = useAuth();

  const [disableOpen, setDisableOpen] = useState(false);
  const [detail, setDetail] = useState<User | null>(null);

  const { data, isLoading, refetch } = useOperatorAgent(
    user?.organization_id || "",
    currentPage,
    Number(displayCount),
  );

  const filteredUser = data?.items?.filter(
    (emp) =>
      emp?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log("Filtered Users: ", data);

  async function handleViewDetail(id: string) {
    const res = await superAdminApi.getUser(id);
    if (res) {
      setDetail(res);
      setDetailToggle(true);
    }
  }
  useEffect(() => {
    setCurrentPage(1);
  }, [displayCount]);

  async function handleCopy() {
    if (!filteredUser?.length) {
      toast.warning("Nothing to copy");
      return;
    }
    const jsonData = {
      metadata: {
        exported_at: new Date().toISOString(),
        total_operators: filteredUser.length,
        source: "Operator Management System",
      },
      operators: filteredUser,
    };

    await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    toast.success(`Copied ${filteredUser.length} Operator Agents`);
  }
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  async function handleRefetch(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault();
    setSpinning(true);
    await refetch();
    setSpinning(false);
  }

  async function handleDeleteOperatorAgent(id: string): Promise<void> {
    try {
      await operatorApi.deleteOperatorAgent(user?.organization_id || "", id);
      toast.success("Operator Agent deleted successfully");
      refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.detail || "Failed to delete operator agent",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="relative space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Manage Agent Dashboard</h1>
        <CreateOperatorAgentDialog
          operatorId={user?.organization_id || ""}
          onSuccess={refetch}
        />
      </div>

      <p>
        Welcome to the Agent Dashboard! Here you can manage your Organization's
        agents,
      </p>

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

            <Button
              variant="outline"
              disabled={!data}
              onClick={() =>
                exportToCSV(
                  data!.items?.map((u) => ({
                    "First name": u.first_name,
                    "Last name": u.last_name,
                    email: u.email,
                    "email verified": u.is_active ? "Yes" : "No",
                  })),
                  ` operator_agents_${new Date()}.csv`,
                )
              }
            >
              CSV
            </Button>
            {/* <Button variant="outline">PDF</Button> */}
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
              placeholder="Search User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {data?.items.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            No User registered.
          </p> // though this is impossible
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
                {filteredUser?.map((u, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell>
                      {(currentPage - 1) * Number(displayCount) + i + 1}
                    </TableCell>
                    <TableCell>
                      {(u.first_name ?? "") + " " + (u.last_name ?? "")}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone ?? "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetail(u.id)}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOperatorAgent(u.id)}
                              className="text-red-500"
                            >
                              Delete
                            </DropdownMenuItem>

                            {/* <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(u.id); // track which user to disable
                                setDisableOpen(true); // open the modal
                              }}
                              disabled={u.is_disabled}
                            >
                              Disable
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {selectedUserId && (
                          <DisableReasonModal
                            id={selectedUserId}
                            open={disableOpen}
                            setOpen={setDisableOpen}
                          />
                        )}
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
                (filteredUser?.length ?? 0)}{" "}
              of {data?.total} entries
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                }}
              >
                Previous
              </Button>
              <Button className="bg-primary text-primary-foreground">
                {currentPage}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                }}
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

      {detail && (
        <UserDetail
          userData={detail}
          open={detailToggle}
          setOpen={setDetailToggle}
        />
      )}
    </div>
  );
}
