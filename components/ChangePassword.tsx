"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { profileApi } from "@/app/api/api";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to change password

      await profileApi.changePassword(
        formData.old_password,
        formData.new_password
      );

      toast.success("Your password has been successfully updated.");

      // Reset form
      setFormData({ old_password: "", new_password: "" });
    } catch (error) {
      toast.error("Failed to change your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="old_password">Current Password</Label>
        <div className="relative">
          <Input
            id="old_password"
            type={showOldPassword ? "text" : "password"}
            value={formData.old_password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, old_password: e.target.value }))
            }
            placeholder="Enter current password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showOldPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="new_password">New Password</Label>
        <div className="relative">
          <Input
            id="new_password"
            type={showNewPassword ? "text" : "password"}
            value={formData.new_password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, new_password: e.target.value }))
            }
            placeholder="Enter new password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showNewPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
