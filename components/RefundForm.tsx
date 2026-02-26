import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { operatorApi } from "@/app/api/api";

type RefundFormProp = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refund_id: string;
  method: "processed" | "rejected" | "pending";
  OnSucess?: () => void;
  operator_id: string;
};
export default function RefundForm(props: RefundFormProp) {
  const [form, setForm] = useState({
    status: "processed",
    processed_amount: "",
    method: "",
    notes: "",
  });

  async function handleUpdateStatus() {
    const cleaned = {
      ...form,
      processed_amount: Number(form.processed_amount),
    };
    await operatorApi.processRefund(
      props.operator_id,
      props.refund_id,
      cleaned,
    );
    props.OnSucess?.();
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Details</DialogTitle>
          {/* <DialogDescription>Refund ID: {props.refund_id}</DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4 max-w-sm">
          <div className="grid gap-2 ">
            <Label htmlFor="processed_amount">
              Processed Amount <span className="text-red-500">*</span>
            </Label>

            <Input
              id="processed_amount"
              value={form.processed_amount}
              type="number"
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  processed_amount: e.target.value,
                }));
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>
              Refund Method <span className="text-red-500">*</span>
            </Label>

            <Select
              value={form.method}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  method: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select refund method" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="no_refund">No Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="refund_id" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={form.notes}
              className="col-span-3"
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }));
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              handleUpdateStatus();
              props.onOpenChange(false);
            }}
            type="submit"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
