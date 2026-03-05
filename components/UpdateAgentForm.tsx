"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { operatorApi } from "@/app/api/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { EyeOff, Eye } from "lucide-react";

export interface UpdateAgentDto {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  is_active: boolean;
}

export default function UpdateAgentForm({
  body,
  operator_id,
  agent_id,
  open,
  setOpen,
  onSubmit,
}: {
  body: UpdateAgentDto;
  operator_id: string;
  agent_id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: () => void;
}) {
  const [form, setForm] = useState<UpdateAgentDto>(body);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      console.log(form, "before sending it...");
      const response = await operatorApi.updateAgentInfo(
        operator_id,
        agent_id,
        form,
      );
      toast.success("Successfully update the user info");
      setOpen(false);
      onSubmit?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl h-[36rem] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Operator Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          {/* First Name */}
          <div className="grid gap-2">
            <Label>First Name</Label>
            <Input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="John"
              //   required
            />
          </div>

          {/* Last Name */}
          <div className="grid gap-2">
            <Label>Last Name</Label>
            <Input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Doe"
              //   required
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              //   required
            />
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+251..."
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label>Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                // required
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">Active Account</p>
              <p className="text-sm text-muted-foreground">
                Enable or disable the agent
              </p>
            </div>

            <Switch
              checked={form.is_active}
              onCheckedChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  is_active: value,
                }))
              }
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Updated Agent"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
