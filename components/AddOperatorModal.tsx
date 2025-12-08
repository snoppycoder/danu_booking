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
import { AddOperatorForm } from "@/lib/model";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export function AddOperatorModal() {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [form, setForm] = useState<AddOperatorForm>({
    name: "",
    slug: slug,
    contact_phone: "",
    contact_email: "",
    extra_metadata: {
      website: "selam-bus",
    },
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!form.contact_email || !form.contact_phone || !form.name) {
      toast.warning("Please insert all the fields");
      return;
    }
    const response = await superAdminApi.addOperator(form);

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
          <Plus /> Add Operator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]  ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Operator</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
            {/* <DialogClose asChild>
              <Button variant="ghost" className="absolute top-3 right-3">
                <X />
              </Button>
            </DialogClose> */}
          </DialogHeader>
          <div className="min-w-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-4 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="name">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  // name="name"
                  value={form?.name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      name: e?.target.value,
                    }));
                    setSlug(e.target.value.replace(" ", "-").toLowerCase());
                  }}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label htmlFor="lname">
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  required
                  id="phonenumber"
                  name="phonenumber"
                  value={form?.contact_phone}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      contact_phone: e?.target.value,
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
                  value={form.contact_email}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      contact_email: e?.target.value,
                    }));
                  }}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  required
                  readOnly
                  value={form?.name.replace(" ", "-").toLowerCase()}
                  id="slug"
                  name="slug"
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
