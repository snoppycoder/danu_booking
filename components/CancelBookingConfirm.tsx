"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CancelTripDialog({
  open,
  setOpen,
  onConfirm,
}: {
  onConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}

      {/* Dialog content */}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel Trip</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your trip? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            No, Keep Trip
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Yes, Cancel Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
