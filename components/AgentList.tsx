"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  Eye,
  Trash2,
  Copy,
  Plus,
  RefreshCcw,
  RefreshCw,
  MoreHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AddOperatorModal } from "./AddOperatorModal";
import { superAdminApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { Operator } from "@/lib/model";
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
import { useAgent, useUsers } from "./Query";
import axios from "axios";
import { AddAgentModal } from "./AddAgentModal";
import { exportToCSV } from "@/lib/common_functions";

export default function AgentList() {
  const [displayCount, setDisplayCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const per_page = 10;
  // const [userId, setUserId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [detailToggle, setDetailToggle] = useState(false);
  const [detail, setDetail] = useState<Operator>();
  const [spinning, setSpinning] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, refetch } = useAgent(
    currentPage,
    Number(displayCount),
  );
  const { data: users, refetch: userRefetch } = useUsers();

  const filteredAgents = data?.items.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.contact_email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredUsers = users?.items.filter(
    (user) => !user.organization_id && user?.roles?.[0]?.slug == "agent_admin",
  );
  console.log(filteredUsers, "filtered");
  useEffect(() => {
    setCurrentPage(1);
  }, [displayCount]);

  async function handleDelete(id: string) {
    try {
      await superAdminApi.deleteAgent(id);
      refetch();
      toast.success("Agent deleted");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status == 404) {
          toast.warning(
            error.response?.data.detail || "The agent doesn't exist ",
          );
          return;
        }
      }
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
    if (!filteredAgents?.length) {
      toast.warning("Nothing to copy");
      return;
    }
    const jsonData = {
      metadata: {
        exported_at: new Date().toISOString(),
        total_operators: filteredAgents?.length,
        source: "Agent Management System",
      },
      operators: filteredAgents,
    };

    await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    toast.success(`Copied ${filteredAgents.length} agents`);
  }
  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }
  async function handleAssignAgentToUser(userId: string) {
    try {
      const res = await superAdminApi.assignUserToAgent(agentId, userId);
      console.log(res);
      toast.success(res.detail ?? "Sucessfully Assigned to the Agent!");
      userRefetch();
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
  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    const win = window.open("", "", "width=900,height=650");

    if (!win || !printContents) return;

    win.document.write(`
    <html>
      <head>
        <title>User List</title>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

    win.document.close();
    win.print();
  };

  return (
    <div className="relative space-y-6">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-3xl font-bold text-center md:text-left text-foreground mb-5 md:md-auto ">
          Danu Agent List
        </h1>
        <AddAgentModal onSuccess={refetch} />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm max-h-[80%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User List</DialogTitle>
          </DialogHeader>
          <div ref={printRef}>
            <div className="space-y-2 mt-4 ">
              {filteredUsers?.length == 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No User to Assign
                </div>
              ) : (
                filteredUsers?.map((users) => (
                  <div
                    key={users.id}
                    className="flex justify-between items-center p-2 rounded hover:bg-gray-100 "
                  >
                    <div>
                      <p className="font-medium">
                        {(users.first_name ?? "") +
                          " " +
                          (users.last_name ?? "")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleAssignAgentToUser(users.id);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                ))
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
              onClick={() =>
                exportToCSV(
                  data!.items?.map((u) => ({
                    "First name": u.name[0],
                    "Last name": u.name[1] ?? "",
                    email: u.contact_email,
                    slug: u.slug,
                    mobile: u.contact_phone,
                  })),
                  `agents_${new Date()}.csv`,
                )
              }
            >
              CSV
            </Button>

            <Button variant="outline" onClick={handlePrint}>
              Print
            </Button>

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
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {data?.items.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            No Agent registered.
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
                {filteredAgents?.map((op, i) => (
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
                              setAgentId(op.id!);
                              setOpen(true);
                            }}
                          >
                            Assign
                            <CircleQuestionMark className="text-blue-600 cursor-pointer" />
                          </Button>

                          <pre className="z-90 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-700 px-3 py-1 max-w-xs text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 break-words pointer-events-none shadow-lg">
                            This will enable you to assign {`\n`} a user to this
                            agent
                          </pre>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {/* <DropdownMenuItem
                              onClick={() => handleViewDetail(op.id)}
                            >
                              View
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() => handleDelete(op.id!)}
                              className="text-red-400"
                            >
                              Delete
                            </DropdownMenuItem>

                            {/* <DropdownMenuItem
                              onClick={() => handleDelete(op.id)}
                            >
                              Delete
                            </DropdownMenuItem> */}
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
                (filteredAgents?.length ?? 0)}{" "}
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
                disabled={(data?.total ?? 0) <= currentPage * per_page}
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
