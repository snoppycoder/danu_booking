"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Clock, User, Building2, Shield } from "lucide-react";
import { OperatorAgent } from "@/lib/model";

interface OperatorAgentDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agentData: OperatorAgent;
}

export function OperatorAgentDetailDialog({
  open,
  setOpen,
  agentData,
}: OperatorAgentDetailDialogProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRolesList = () => {
    return Object.keys(agentData.roles || {}).filter((role) => role);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm w-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">Agent Profile</DialogTitle>
          <DialogDescription className="text-xs">
            Operator agent information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Agent Header */}
          <div className="flex items-start justify-between border-b border-border pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {agentData.first_name} {agentData.last_name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  ID: {agentData.id}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {agentData.is_active ? (
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
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">
                      {agentData.email}
                    </p>
                  </div>
                </div>
              </Card>

              {agentData.phone && (
                <Card className="p-3 bg-card border-border">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{agentData.phone}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Organization & Account */}
          <div>
            <h3 className="font-semibold text-xs mb-2 text-foreground uppercase tracking-wide">
              Account
            </h3>
            <div className="grid gap-2">
              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Organization ID
                    </p>
                    <p className="text-sm font-medium truncate">
                      {agentData.organization_id}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="text-sm font-medium">
                      {formatDate(agentData.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Roles */}
          {/* {getRolesList().length > 0 && (
            <div>
              <h3 className="font-semibold text-xs mb-2 text-foreground uppercase tracking-wide">
                Roles
              </h3>
              <div className="flex flex-wrap gap-2">
                {getRolesList().map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )} */}

          {/* Verification Status */}
          {Object.keys(agentData.verification || {}).length > 0 && (
            <div>
              <h3 className="font-semibold text-xs mb-2 text-foreground uppercase tracking-wide">
                Verification
              </h3>
              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium">
                      {Object.keys(agentData.verification || {}).length > 0
                        ? "Verified"
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
