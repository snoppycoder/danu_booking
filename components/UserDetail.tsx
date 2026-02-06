"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  is_disabled: boolean;
  disabled_reason?: string;
  last_login_at?: string;
}

export default function UserDetail({
  userData,
  open,
  setOpen,
}: {
  userData: UserData;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  console.log(userData, "user data in detail component");

  // Sample user data

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm w-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">User Profile</DialogTitle>
          <DialogDescription className="text-xs">
            Account information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* User Header */}
          <div className="flex items-start justify-between border-b border-border pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {userData?.first_name} {userData?.last_name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  ID: {userData?.id}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {userData.is_active ? (
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-xs py-0.5"
                >
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs py-0.5">
                  Inactive
                </Badge>
              )}
              {userData.is_disabled && (
                <Badge variant="destructive" className="text-xs py-0.5">
                  Disabled
                </Badge>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-xs mb-2 text-foreground uppercase tracking-wide">
              Contact
            </h3>
            <div className="grid gap-2">
              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">
                      {userData.email}
                    </p>
                  </div>
                  {userData.email_verified && (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </Card>

              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{userData.phone}</p>
                  </div>
                  {userData.phone_verified && (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h3 className="font-semibold text-xs mb-2 text-foreground uppercase tracking-wide">
              Status
            </h3>
            <div className="grid gap-2">
              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm font-medium">
                      {formatDate(userData?.last_login_at)}
                    </p>
                  </div>
                </div>
              </Card>

              {userData.is_disabled && userData.disabled_reason && (
                <Card className="p-3 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-red-900 dark:text-red-300">
                        Disabled Reason
                      </p>
                      <p className="text-xs text-red-800 dark:text-red-400 mt-0.5">
                        {userData.disabled_reason}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Verification Status Summary */}
          <div>
            <h3 className="font-semibold text-xs mb-2 text-foreground uppercase tracking-wide">
              Verification
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-2 bg-card border-border">
                <div className="flex items-center gap-1.5">
                  {userData.email_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-xs font-medium">
                      {userData.email_verified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-2 bg-card border-border">
                <div className="flex items-center gap-1.5">
                  {userData.phone_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-xs font-medium">
                      {userData.phone_verified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2 justify-end pt-3 border-t border-border mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-xs h-8"
            >
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs h-8">
              Edit
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
