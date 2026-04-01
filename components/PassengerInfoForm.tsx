"use client";

import React, { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Passenger } from "@/lib/model";
import { X } from "lucide-react";
import { Toggle } from "./ui/toggle";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  // Check if all passengers have required fields filled
  const [isOpen, setIsOpen] = useState(false);
  const allPassengersComplete =
    passengers.length > 0 &&
    passengers.every((p) => p.name.trim() && p.phone.trim());

  return (
    <div className="space-y-6">
      {/* Display existing passengers */}
      {passengers.map((passenger, index) => (
        <div key={index} className="border rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Passenger {index + 1}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2" htmlFor={`name-${index}`}>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id={`name-${index}`}
                value={passenger.name}
                onChange={(e) => updatePassenger(index, "name", e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor={`email-${index}`}>
                Email
              </Label>
              <Input
                type="email"
                id={`email-${index}`}
                value={passenger.email ?? ""}
                onChange={(e) =>
                  updatePassenger(index, "email", e.target.value)
                }
                placeholder="Email address"
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor={`phone-${index}`}>
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id={`phone-${index}`}
                value={passenger.phone}
                onChange={(e) =>
                  updatePassenger(index, "phone", e.target.value.trim())
                }
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor={`id-${index}`}>
                ID Number
              </Label>
              <Input
                id={`id-${index}`}
                value={passenger.id_number ?? ""}
                onChange={(e) =>
                  updatePassenger(index, "id_number", e.target.value)
                }
                placeholder="ID number"
              />
            </div>
            <div className="ml-1 mt-2.5">
              <Label className="mb-2" htmlFor={`id-${index}`}>
                Is this passenger a child?
              </Label>
              <Switch
                id={`id-${index}`}
                checked={passenger.is_child ?? false}
                onCheckedChange={(checked: boolean) =>
                  updatePassenger(index, "is_child", checked)
                }
              />
            </div>
            <div className="ml-1 mt-2.5">
              <Button
                variant={"outline"}
                onClick={() => {
                  setIdx(index);
                  setIsOpen(true);
                }}
              >
                Company Info
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        <Button className="flex-1" variant={"outline"} onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!allPassengersComplete}
          onClick={onNext}
        >
          Summary
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={passengers[idx].company_name ?? ""}
                onChange={(e) =>
                  updatePassenger(idx, "company_name", e.target.value)
                }
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="tin">TIN Number</Label>
              <Input
                id="tin"
                value={passengers[idx].tin_number ?? ""}
                onChange={(e) =>
                  updatePassenger(idx, "tin_number", e.target.value)
                }
                placeholder="Enter TIN number"
              />
            </div>

            <Button
              className="w-full"
              disabled={
                passengers[idx].company_name === "" ||
                passengers[idx].tin_number === ""
              }
              onClick={() => setIsOpen(false)}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
