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
import { superAdminApi } from "@/app/api/api";
import { toast } from "sonner";

import { User } from "@/lib/model";
import { AddUserModal } from "./AddUserModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import DisableReasonModal from "./DisableReasonModal";
import { useQueryClient } from "@tanstack/react-query";
import { useOperator, useUsers } from "./Query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { exportToCSV } from "@/lib/common_functions";

export default function UserList() {
  const [displayCount, setDisplayCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailToggle, setDetailToggle] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [_operator, setOperatorId] = useState("");
  // const [data, setData] = useState<User[]>([]);
  const [disableOpen, setDisableOpen] = useState(false);
  const [detail, setDetail] = useState<User>();

  const { data, isLoading, refetch } = useUsers(
    currentPage,
    Number(displayCount)
  );

  const filteredUser = data?.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleViewDetail(id: string) {
    const res = await superAdminApi.viewOperatorDetail(id);
    if (res) {
      setDetail(res);
      setDetailToggle(true);
    }
  }

  async function handleAssignRole(role_identifier: string, id: string) {
    const response = await superAdminApi.assignRole(id, role_identifier);
    console.log(response);
  }

  async function handleEnable(id: string) {
    const response = await superAdminApi.enableUser(id);
    if (response) {
      toast.success("User successfully enabled ");
    }
  }

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
    toast.success(`Copied ${filteredUser.length} users`);
  }
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  async function handleRefetch(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    setSpinning(true);
    await refetch();
    setSpinning(false);
  }

  return (
    <div className="relative space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-3xl font-bold text-center ml-2.5 md:text-left text-foreground mb-5 md:md-auto ">
          User List
        </h1>
        <AddUserModal onSuccess={refetch} />
      </div>

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
                  data!.map((u) => ({
                    "First name": u.first_name,
                    "Last name": u.last_name,
                    email: u.email,
                    "email verified": u.email_verified ? "Yes" : "No",
                    // address: `${u.address.country ?? "Ethiopia"}, ${
                    //   u.address.city
                    // }`,
                    // kebele: u.address.kebele,
                    "Date of birth": u.dob,
                  })),
                  ` users_${new Date()}.csv`
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
              placeholder="Search User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {data?.length === 0 ? (
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
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {(u.first_name ?? "") + " " + (u.last_name ?? "")}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone ?? "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        {/* <pre className="z-90 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-700 px-3 py-1 max-w-xs text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 break-words pointer-events-none shadow-lg">
                            This will enable you to assign {`\n`} a user to a
                            operator
                          </pre> */}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => console.log("View")}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => console.log("Delete")}
                            >
                              Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEnable(u.id)}
                            >
                              Enable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAssignRole("super_admin", u.id)
                              }
                            >
                              Assign Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(u.id); // track which user to disable
                                setDisableOpen(true); // open the modal
                              }}
                            >
                              Disable
                            </DropdownMenuItem>
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
        {(data?.length ?? 0) > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {filteredUser?.length} of {filteredUser?.length}{" "}
              entries
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
