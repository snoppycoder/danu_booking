"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock data - replace with your actual API call
const mockOperatorUsers = [
  {
    id: "1",
    first_name: "Abebe",
    last_name: "Kebede",
    email: "abebe.kebede@zemen.com",
    phone: "+251911234567",
    email_verified: true,
    phone_verified: true,
    is_active: true,
    is_disabled: false,
    disabled_reason: null,
    last_login_at: "2025-12-23T18:30:00.000Z",
    roles: [
      { name: "Admin", permissions: ["manage_bookings", "manage_routes"] },
    ],
    operator: "Zemen Bus",
  },
  {
    id: "2",
    first_name: "Tigist",
    last_name: "Alemu",
    email: "tigist.alemu@ethiobus.com",
    phone: "+251922345678",
    email_verified: true,
    phone_verified: false,
    is_active: true,
    is_disabled: false,
    disabled_reason: null,
    last_login_at: "2025-12-23T15:45:00.000Z",
    roles: [{ name: "Operator", permissions: ["view_bookings"] }],
    operator: "Ethiobus",
  },
  {
    id: "3",
    first_name: "Dawit",
    last_name: "Tesfaye",
    email: "dawit.tesfaye@zemen.com",
    phone: "+251933456789",
    email_verified: true,
    phone_verified: true,
    is_active: false,
    is_disabled: true,
    disabled_reason: "Policy violation",
    last_login_at: "2025-12-20T10:15:00.000Z",
    roles: [{ name: "Manager", permissions: ["manage_fleet", "manage_staff"] }],
    operator: "Zemen Bus",
  },
  {
    id: "4",
    first_name: "Meron",
    last_name: "Hailu",
    email: "meron.hailu@ethiobus.com",
    phone: "+251944567890",
    email_verified: false,
    phone_verified: true,
    is_active: true,
    is_disabled: false,
    disabled_reason: null,
    last_login_at: "2025-12-23T12:00:00.000Z",
    roles: [{ name: "Support", permissions: ["manage_customers"] }],
    operator: "Ethiobus",
  },
];

type OperatorUser = (typeof mockOperatorUsers)[0];

export default function OperatorUsersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOperator, setFilterOperator] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Extract unique operators
  const operators = Array.from(
    new Set(mockOperatorUsers.map((user) => user.operator))
  );

  // Filter users based on search and filters
  const filteredUsers = mockOperatorUsers.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOperator =
      filterOperator === "all" || user.operator === filterOperator;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.is_active && !user.is_disabled) ||
      (filterStatus === "inactive" && !user.is_active) ||
      (filterStatus === "disabled" && user.is_disabled);

    return matchesSearch && matchesOperator && matchesStatus;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Operator Users
          </h1>
          {/* <p className="text-muted-foreground">
            Manage administrators and staff from different bus companies
          </p> */}
        </div>

        {/* <Card className="p-4"> */}
        <div className="flex flex-col p-4 gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterOperator} onValueChange={setFilterOperator}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Operators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operators</SelectItem>
                {operators.map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* </Card> */}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {mockOperatorUsers.length}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-primary">
                {
                  mockOperatorUsers.filter((u) => u.is_active && !u.is_disabled)
                    .length
                }
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Operators</p>
              <p className="text-2xl font-bold text-foreground">
                {operators.length}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Disabled</p>
              <p className="text-2xl font-bold text-destructive">
                {mockOperatorUsers.filter((u) => u.is_disabled).length}
              </p>
            </div>
          </Card>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground">
                  No users found matching your filters
                </p>
              </div>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* User Info */}
                  <div className="flex flex-1 gap-4">
                    <Avatar className="size-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {user.first_name} {user.last_name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {user.operator}
                        </Badge>
                        {user.is_active && !user.is_disabled && (
                          <Badge className="bg-primary text-primary-foreground">
                            Active
                          </Badge>
                        )}
                        {!user.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {user.is_disabled && (
                          <Badge variant="destructive">Disabled</Badge>
                        )}
                      </div>

                      <div className="grid gap-2 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="size-4" />
                          <span>{user.email}</span>
                          {user.email_verified && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="size-4" />
                          <span>{user.phone}</span>
                          {user.phone_verified && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="size-4" />
                          <span>
                            Last login: {formatLastLogin(user.last_login_at)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Shield className="size-4" />
                          <span>
                            {user.roles
                              .map((role: any) => role.name)
                              .join(", ")}
                          </span>
                        </div>
                      </div>

                      {user.is_disabled && user.disabled_reason && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>Disabled: {user.disabled_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Manage Roles</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        {user.is_disabled ? "Enable User" : "Disable User"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
