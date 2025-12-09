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

import { User } from "@/lib/model";
import { AddUserModal } from "./AddUserModal";

export default function UserList() {
  const [displayCount, setDisplayCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailToggle, setDetailToggle] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [detail, setDetail] = useState<User>();
  const fetchUsers = async () => {
    const res = await superAdminApi.getUsers();
    console.log(res.items);
    setData(res.items);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUser = data.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      fetchUsers();
    }
  }

  async function handleCopy() {
    if (!filteredUser.length) {
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
    toast.success(`Copied ${filteredUser.length} operators`);
  }

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User List</h1>
        <AddUserModal onSuccess={fetchUsers} />
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
                {filteredUser.map((u, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {(u.first_name ?? "") + " " + (u.last_name ?? "")}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone ?? "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleViewDetail(u.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                          onClick={() => handleDelete(u.id)}
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
              Showing 1 to {filteredUser.length} of {filteredUser.length}{" "}
              entries
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
