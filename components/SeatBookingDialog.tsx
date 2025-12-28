"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SeatLayoutDialog from "./SeatLayoutDialog";
import { Passenger } from "@/lib/model";
import { set } from "zod";
import { passengerApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";

type SeatBookingDialogProps = {
  toggle: boolean;
  setToggle: (val: boolean) => void;
  tripId: string;
};

export default function SeatBookingDialog({
  tripId,
  toggle,
  setToggle,
}: SeatBookingDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [seatCount, setSeatCount] = useState("");
  const [seatToggle, setSeatToggle] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [seatArr, setSeatArr] = useState<string[]>([]);
  const [passengerArr, setPassengerArr] = useState<Passenger[]>([]);
  const [seatDict, setSeatDict] = useState<Record<string, Passenger>>({});
  const [indexBeingEdited, setIndexBeingEdited] = useState<number | null>(null);

  const [selectedSeat, setSelectedSeat] = useState<string>("");
  console.log(passengers, "passenger");
  const handleProceed = () => {
    setPassengers(
      Array.from({ length: Number(seatCount) }, () => ({
        name: "",
        email: "",
        phone: "",
        id_number: "",
      }))
    );
    setStep(2);
  };

  const updatePassenger = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async () => {
    Object.entries(seatDict).forEach(([seat, passenger]) => {
      setSeatArr((prev) => [...prev, seat]);
      setPassengerArr((prev) => [...prev, passenger]);
    });
    try {
      if (
        seatArr.length == 0 ||
        passengerArr.length == 0 ||
        seatArr.length !== passengerArr.length
      ) {
        toast.error("Please select seats for all passengers.");
        return;
      }
      await passengerApi.holdSeat(tripId, {
        seat_codes: seatArr,
        passenger_details: passengerArr,
      });
      toast.success("Seats successfully booked!");
    } catch (error) {
      toast.error("Error trying to process your request. Please try again.");
    }
  };

  function handleSeatSelection(arg0: Passenger) {
    setSeatToggle(true);
  }

  return (
    <div>
      <Toaster richColors position="top-right" theme="system"></Toaster>
      <Dialog open={toggle} onOpenChange={setToggle}>
        <DialogTrigger asChild>
          <Button>Book Seats</Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? "Select Seats" : "Passenger Details"}
            </DialogTitle>
          </DialogHeader>

          {/* STEP 1: Seat Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="mt-3 mb-4">Number of Seats</Label>
                <Input
                  type="number"
                  min={1}
                  value={seatCount}
                  onChange={(e) => setSeatCount(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleProceed}>
                Proceed
              </Button>
            </div>
          )}

          {/* STEP 2: Passenger Forms */}
          {step === 2 && (
            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="border rounded-xl p-4 space-y-4">
                  <h3 className="font-semibold">Passenger {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-3" htmlFor="name">
                        Name
                      </Label>
                      <Input
                        required
                        value={passenger.name}
                        id="name"
                        onChange={(e) =>
                          updatePassenger(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-2" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        required
                        type="email"
                        value={passenger.email}
                        id="email"
                        onChange={(e) =>
                          updatePassenger(index, "email", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label className="mb-2" htmlFor="phone">
                        Phone
                      </Label>
                      <Input
                        required
                        value={passenger.phone}
                        id="phone"
                        onChange={(e) =>
                          updatePassenger(index, "phone", e.target.value.trim())
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-2" htmlFor="id_number">
                        ID Number
                      </Label>
                      <Input
                        required
                        id="id_number"
                        value={passenger.id_number}
                        onChange={(e) =>
                          updatePassenger(index, "id_number", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="default"
                      disabled={
                        passenger.name === "" ||
                        passenger.email === "" ||
                        passenger.phone === "" ||
                        passenger.id_number === ""
                      }
                      onClick={() => {
                        setIndexBeingEdited(index);
                        handleSeatSelection(passengers[index]);
                      }}
                    >
                      {`Select Seat ${
                        Object.entries(seatDict).find(
                          ([, p]) => p === passenger
                        )?.[0] || ""
                      }`}
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                {/* <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button> */}

                <Button className="flex-1" onClick={handleSubmit}>
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <SeatLayoutDialog
        toggle={seatToggle}
        setToggle={setSeatToggle}
        onSelect={(seatId) => {
          // Map selected seat to the current passenger
          setSeatDict((prev) => ({
            ...prev,
            [seatId]: passengers[indexBeingEdited ?? 0], // track which passenger is selecting
          }));
          setSelectedSeat(seatId); // optional if you want to show it in UI
        }}
      />
    </div>
  );
}
