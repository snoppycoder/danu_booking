"use client";

import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";

type PassengerInfoFormProps = {
  numberOfPassengers: number;
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function PassengerInfoForm({
  numberOfPassengers,
  passengers,
  onPassengersChange,
  onNext,
  onBack,
}: PassengerInfoFormProps) {
  const updatePassenger = <K extends keyof Passenger>(
    index: number,
    field: K,
    value: Passenger[K],
  ) => {
    const updated = [...passengers];
    updated[index][field] = value;
    onPassengersChange(updated);
  };

  const [idx, setIdx] = useState(0);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const allPassengersComplete =
    passengers.length > 0 &&
    passengers.every((p) => p.name.trim() && p.phone.trim() && p.gender);

  return (
    <div className="space-y-8">
      {/* Display existing passengers */}
      <div className="space-y-6">
        {passengers.map((passenger, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Card Header */}
            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                {t("passenger")}{" "}
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
                  {index + 1}
                </span>
              </h3>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor={`name-${index}`}
                  >
                    {t("nameBookingForm")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    id={`name-${index}`}
                    value={passenger.name}
                    onChange={(e) =>
                      updatePassenger(index, "name", e.target.value)
                    }
                    className="focus-visible:ring-primary/20"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor={`email-${index}`}
                  >
                    {t("email")}
                  </Label>
                  <Input
                    type="email"
                    id={`email-${index}`}
                    value={passenger.email ?? ""}
                    onChange={(e) =>
                      updatePassenger(index, "email", e.target.value)
                    }
                    className="focus-visible:ring-primary/20"
                  />
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor={`phone-${index}`}
                  >
                    {t("phone")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    id={`phone-${index}`}
                    value={passenger.phone}
                    onChange={(e) =>
                      updatePassenger(index, "phone", e.target.value.trim())
                    }
                    className="focus-visible:ring-primary/20"
                  />
                </div>

                {/* Fayda ID Input */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor={`id-${index}`}
                  >
                    {t("faydaId")}
                  </Label>
                  <Input
                    id={`id-${index}`}
                    value={passenger.id_number ?? ""}
                    onChange={(e) =>
                      updatePassenger(index, "id_number", e.target.value)
                    }
                    placeholder="FAYDA ID"
                    className="focus-visible:ring-primary/20"
                  />
                </div>

                {/* Gender Input with Shadcn */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor={`gender-${index}`}
                  >
                    {t("gender", "Gender")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={passenger.gender ?? ""}
                    onValueChange={(value) =>
                      updatePassenger(index, "gender", value)
                    }
                  >
                    <SelectTrigger
                      id={`gender-${index}`}
                      className="w-full focus:ring-primary/20 bg-white"
                    >
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

                {/* Divider to separate base info from settings */}
                <div className="col-span-1 md:col-span-2 pt-2">
                  <hr className="border-gray-200" />
                </div>

                {/* Child Switch - Taking Full Line */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-4 shadow-sm">
                    <div className="space-y-1">
                      <Label
                        htmlFor={`child-switch-${index}`}
                        className="font-medium text-sm text-gray-800 cursor-pointer"
                      >
                        {t("isPassengerChild")}
                      </Label>
                    </div>
                    <Switch
                      id={`child-switch-${index}`}
                      checked={passenger.is_child ?? false}
                      onCheckedChange={(checked: boolean) =>
                        updatePassenger(index, "is_child", checked)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>

                {/* Company Info Button - Taking Full Line */}
                <div className="col-span-1 md:col-span-2 flex justify-start">
                  <Button
                    variant="outline"
                    className="text-gray-600 w-full hover:text-gray-900 bg-white border-gray-300"
                    onClick={() => {
                      setIdx(index);
                      setIsOpen(true);
                    }}
                  >
                    {t("companyInfo")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <Button
          className="flex-1 sm:flex-none sm:w-32 order-2 sm:order-1"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="flex-1 order-1 sm:order-2"
          disabled={!allPassengersComplete}
          onClick={onNext}
        >
          Proceed to Summary
        </Button>
      </div>

      {/* Company Info Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Company Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label htmlFor="company" className="text-sm font-medium">
                Company Name
              </Label>
              <Input
                id="company"
                value={passengers[idx]?.company_name ?? ""}
                onChange={(e) =>
                  updatePassenger(idx, "company_name", e.target.value)
                }
                placeholder="Enter company name"
                className="focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tin" className="text-sm font-medium">
                TIN Number
              </Label>
              <Input
                id="tin"
                value={passengers[idx]?.tin_number ?? ""}
                onChange={(e) =>
                  updatePassenger(idx, "tin_number", e.target.value)
                }
                placeholder="Enter TIN number"
                className="focus-visible:ring-primary/20"
              />
            </div>

            <Button
              className="w-full mt-6"
              disabled={
                !passengers[idx]?.company_name || !passengers[idx]?.tin_number
              }
              onClick={() => setIsOpen(false)}
            >
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
