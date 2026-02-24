"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useCreateOperatorAgent } from "./Query";
import { normalize } from "path";
import { normalizeEthiopianPhone } from "@/lib/common_functions";

interface CreateOperatorAgentDialogProps {
  operatorId: string;
  onSuccess?: () => void;
}

export function CreateOperatorAgentDialog({
  operatorId,
  onSuccess,
}: CreateOperatorAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const createMutation = useCreateOperatorAgent();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      toast.warning("Please fill in all fields");
      return;
    }
    const normalizedPhone = normalizeEthiopianPhone(form.phone);

    try {
      await createMutation.mutateAsync({
        operator_id: operatorId,
        body: {
          ...form,
          phone: normalizedPhone,
          is_active: isActive,
        },
      });

      toast.success("Operator agent created successfully");
      setOpen(false);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
      });
      setIsActive(true);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to create operator agent";
      toast.error(errorMessage);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster richColors position="top-right" />

      <DialogTrigger asChild>
        <Button variant="default" className="flex gap-2.5">
          <Plus className="w-4 h-4" /> Add Operator Agent
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Operator Agent</DialogTitle>
            <DialogDescription>
              Add a new operator agent to your system
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="w-full grid gap-2">
                <Label htmlFor="fname">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fname"
                  required
                  placeholder="John"
                  value={form.first_name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }));
                  }}
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Last Name */}
              <div className="w-full grid gap-2">
                <Label htmlFor="lname">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lname"
                  required
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }));
                  }}
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Email */}
              <div className="w-full grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Phone */}
              <div className="w-full grid gap-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }));
                  }}
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Password */}
              <div className="w-full grid gap-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  required
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex gap-2"
            >
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
