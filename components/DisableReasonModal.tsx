"use client";

import { superAdminApi } from "@/app/api/api";

import { toast } from "sonner";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";

interface Prop {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DisableReasonModal({ id, open, setOpen }: Prop) {
  const [reason, setReason] = useState("");

  async function handleDisable() {
    if (!reason.trim()) {
      toast.error("Please enter the reason");
      return;
    }
    const response = await superAdminApi.disableUser(id, reason);
    if (response) {
      toast.success("User successfully disabled");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDisable();
          }}
        >
          <DialogHeader>
            <DialogTitle>What is your reason</DialogTitle>
          </DialogHeader>
          <div className="min-w-full p-4 flex flex-col gap-2">
            <Label htmlFor="reason" className="mt-2">
              Reason <span className="text-red-400">*</span>
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
