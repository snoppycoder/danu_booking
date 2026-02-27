"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Passenger } from "@/lib/model";

type PassengerInfoFormProps = {
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
  onNext: () => void;
};

export default function PassengerInfoForm({
  passengers,
  onPassengersChange,
  onNext,
}: PassengerInfoFormProps) {
  const [showAddPassenger, setShowAddPassenger] = useState(false);

  const updatePassenger = (
    index: number,
    field: keyof Passenger,
    value: string,
  ) => {
    const updated = [...passengers];
    updated[index][field] = value;
    onPassengersChange(updated);
  };

  const addPassenger = () => {
    const newPassenger: Passenger = {
      name: "",
      email: "",
      phone: "",
      id_number: "",
    };
    onPassengersChange([...passengers, newPassenger]);
    setShowAddPassenger(false);
  };

  const removePassenger = (index: number) => {
    const updated = passengers.filter((_, i) => i !== index);
    onPassengersChange(updated);
  };

  // Check if all passengers have required fields filled
  const allPassengersComplete =
    passengers.length > 0 &&
    passengers.every(
      (p) => p.name.trim() && p.phone.trim() && p.id_number.trim(),
    );

  return (
    <div className="space-y-6">
      {/* Display existing passengers */}
      {passengers.map((passenger, index) => (
        <div key={index} className="border rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Passenger {index + 1}</h3>
            {passengers.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePassenger(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
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
                value={passenger.email}
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
                ID Number <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id={`id-${index}`}
                value={passenger.id_number}
                onChange={(e) =>
                  updatePassenger(index, "id_number", e.target.value)
                }
                placeholder="ID number"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Passenger Button */}
      {!showAddPassenger && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => addPassenger()}
        >
          + Add Another Passenger
        </Button>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          className="flex-1"
          disabled={!allPassengersComplete}
          onClick={onNext}
        >
          Next: Select Seats
        </Button>
      </div>
    </div>
  );
}
