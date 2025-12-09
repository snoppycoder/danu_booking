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
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
interface AddUserModalProps {
  onSuccess?: () => void; // callback when a new operator is added
}

export function AddUserModal({ onSuccess }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [form, setForm] = useState<AddUserForm>({
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    email: "",
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    // Memo to future self write zod
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

    const response = await superAdminApi.addUser(form);
    if (response) {
      onSuccess?.();
    }
    setOpen(false);

    console.log(response);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster richColors position="top-right"></Toaster>

      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex gap-2.5"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Plus /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]  ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <div className="min-w-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-4 gap-3">
              <div className="w-full grid gap-3">
                <Label htmlFor="fname">
                  First Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="fname"
                  required
                  // name="name"
                  value={form?.first_name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      first_name: e?.target.value,
                    }));
                  }}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label htmlFor="lname">
                  Last Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="lname"
                  required
                  // name="name"
                  value={form?.last_name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      last_name: e?.target.value,
                    }));
                  }}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">
                  Password <span className="text-red-400">*</span>
                </Label>
                <Input
                  required
                  type="password"
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      password: e?.target.value,
                    }));
                  }}
                  value={form?.password}
                  id="password"
                  name="password"
                />
              </div>
              <div className="w-full grid gap-3">
                <Label htmlFor="phonenumber">
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  required
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  value={form?.phone}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      phone: e?.target.value,
                    }));
                  }}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      email: e?.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {/* <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose> */}
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
