"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Passenger } from "@/lib/model";
import "@/i18n";

type TransferTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passenger: Passenger;
  onPassengerChange: (passenger: Passenger) => void;
  onSubmit: () => void;
};

export default function TransferTicketDialog({
  open,
  onOpenChange,
  passenger,
  onPassengerChange,
  onSubmit,
}: TransferTicketDialogProps) {
  const { t } = useTranslation();

  // Distinct state for the sub-dialog
  const [isCompanyInfoOpen, setIsCompanyInfoOpen] = useState(false);

  // Safely update passenger fields directly on the single object
  const updateField = <K extends keyof Passenger>(
    field: K,
    value: Passenger[K],
  ) => {
    onPassengerChange({ ...passenger, [field]: value });
  };

  // Require Name, Phone, and Gender for completion
  const isComplete = Boolean(
    passenger?.name?.trim() && passenger?.phone?.trim() && passenger?.gender,
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transfer Seat</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{t("passenger")}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <Label className="mb-2 block" htmlFor="name">
                    {t("nameBookingForm")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    id="name"
                    value={passenger?.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder={t("nameBookingForm")}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className="mb-2 block" htmlFor="email">
                    {t("email")}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={passenger?.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder={t("email")}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label className="mb-2 block" htmlFor="phone">
                    {t("phone")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    id="phone"
                    value={passenger?.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder={t("phone")}
                  />
                </div>

                {/* Fayda ID */}
                <div>
                  <Label className="mb-2 block" htmlFor="id">
                    {t("faydaId")}
                  </Label>
                  <Input
                    id="id"
                    value={passenger?.id_number || ""}
                    onChange={(e) => updateField("id_number", e.target.value)}
                    placeholder="ID number"
                  />
                </div>

                {/* Gender (Shadcn Select) */}
                <div>
                  <Label className="mb-2 block" htmlFor="gender">
                    {t("gender", "Gender")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={passenger?.gender || ""}
                    onValueChange={(value) => updateField("gender", value)}
                  >
                    <SelectTrigger id="gender" className="w-full bg-white">
                      <SelectValue
                        placeholder={t("selectGender", "Select gender")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">{t("male", "Male")}</SelectItem>
                      <SelectItem value="Female">
                        {t("female", "Female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Is Child Switch */}
                <div className="flex flex-col col-span-1 md:col-span-2 justify-center mt-1">
                  <Label className="mb-3 block" htmlFor="is-child">
                    {t("isPassengerChild")}
                  </Label>
                  <Switch
                    id="is-child"
                    checked={passenger?.is_child || false}
                    onCheckedChange={(checked: boolean) =>
                      updateField("is_child", checked)
                    }
                  />
                </div>

                {/* Company Info Trigger */}
                <div className="flex flex-col justify-end col-span-1 md:col-span-2 mt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsCompanyInfoOpen(true)}
                  >
                    {t("companyInfo")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!isComplete}
                onClick={onSubmit}
                type="button"
              >
                Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* COMPANY INFO SUB-DIALOG */}
      <Dialog open={isCompanyInfoOpen} onOpenChange={setIsCompanyInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company Information</DialogTitle>
          </DialogHeader>

          {passenger && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2.5">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={passenger.company_name || ""}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="tin">TIN Number</Label>
                <Input
                  id="tin"
                  value={passenger.tin_number || ""}
                  onChange={(e) => updateField("tin_number", e.target.value)}
                  placeholder="Enter TIN number"
                />
              </div>

              <Button
                className="w-full mt-4"
                disabled={
                  !passenger.company_name?.trim() ||
                  !passenger.tin_number?.trim()
                }
                onClick={() => setIsCompanyInfoOpen(false)}
                type="button"
              >
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
