"use client";

import { superAdminApi } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddOperatorForm, AddUserForm } from "@/lib/model";
import { isAxiosError } from "axios";
import { Plus, UserPlus, Mail, Phone, Lock } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";

interface AddUserModalProps {
  onSuccess?: () => void; // callback when a new operator is added
}

export function AddUserModal({ onSuccess }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<AddUserForm>({
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    email: "",
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    if (
      !form.first_name ||
      !form.last_name ||
      !form.password ||
      !form.phone ||
      !form.email
    ) {
      toast.warning("Please insert all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await superAdminApi.addUser(form);
      if (response) {
        onSuccess?.();
      }
      setOpen(false);
      setForm({
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        email: "",
      });
      toast.success("Successfully created a user");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.detail?.[0]?.msg) {
          let err_ = error.response.data.detail[0].msg.replace(
            "String",
            error.response.data.detail[0].loc[1],
          );
          toast.error(err_);
        } else if (error.response?.data.detail?.reasons) {
          toast.error(error.response?.data.detail.reasons[0]);
        } else {
          toast.error(error.response?.data.detail);
        }
      }
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster richColors position="top-right" />

      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </DialogTrigger>

      {/* Added p-0 and overflow-hidden to customize the header/footer backgrounds smoothly */}
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl sm:rounded-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                Add New User
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 pt-1">
                Fill in the details below to create a new user account. All
                fields are required.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Body Section */}
          <div className="p-6 space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="fname"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fname"
                  required
                  value={form.first_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  className="focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="lname"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lname"
                  required
                  value={form.last_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                  className="focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="phonenumber"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phonenumber"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="space-y-2.5 pt-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="bg-white">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
