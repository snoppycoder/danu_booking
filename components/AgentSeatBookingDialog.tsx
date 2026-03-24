"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

import PassengerInfoForm from "./PassengerInfoForm";
import type { Bus, Passenger, Seat } from "@/lib/model";
import { agentApi, DanuAgentApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";
import SeatLayoutDialog from "./SeatLayoutDialog";

type SeatBookingDialogProps = {
  toggle: boolean;
  agentId: string;
  selectedSeats: string[];
  setToggle: (val: boolean) => void;
  number_of_passengers: number;
  tripId: string;
  operator_id: string;
  onSucess?: () => void;
  setLayoutToggle: React.Dispatch<SetStateAction<boolean>>;
  setMultiSelect: React.Dispatch<SetStateAction<string[]>>;
};

export default function AgentSeatBookingDialog({
  tripId,
  agentId,

  selectedSeats,
  number_of_passengers,
  toggle,
  onSucess,
  setLayoutToggle,
  setToggle,

  setMultiSelect,
}: SeatBookingDialogProps) {
  // Step 1: Passenger Info, Step 2: Seat Selection, Step 3: Confirmation
  const [step, setStep] = useState<1 | 2>(1);

  // Passenger information state
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      name: "",
      email: "",
      phone: "",
      id_number: "",
    },
  ]);

  // Seat selection state
  const [seatToggle, setSeatToggle] = useState(false);
  const [seatDict, setSeatDict] = useState<Record<string, Passenger>>({});
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState<number>(0);
  const [editingPassenger, setEditingPassenger] = useState<
    Record<number, number>
  >({});
  const [passengerArray, setPassengerArr] = useState<Passenger[]>([]);

  useEffect(() => {
    if (!number_of_passengers || number_of_passengers <= 0) return;

    setPassengers(
      Array.from({ length: number_of_passengers }, () => ({
        name: "",
        email: "",
        phone: "",
        id_number: "",
      })),
    );
  }, [number_of_passengers]);

  // Handle moving from passenger info to seat selection
  const handlePassengerInfoNext = () => {
    setStep(2);
    setCurrentPassengerIndex(0);
    setSeatToggle(true);
  };
  const handlePassengerInfoBack = () => {
    setStep(1);
    setSeatDict({});
  };

  // Handle seat selection for a passenger
  const handleSeatSelected = (seatId: string) => {
    setSeatDict((prev) => ({
      ...prev,
      [seatId]: passengers[currentPassengerIndex],
    }));

    // Move to next passenger or finish
    if (currentPassengerIndex < passengers.length - 1) {
      setCurrentPassengerIndex((prev) => prev + 1);

      setEditingPassenger((prev) => ({
        ...prev,
        [currentPassengerIndex + 1]: (prev[currentPassengerIndex + 1] ?? 0) + 1,
      }));
    }
  };

  // Handle final booking submission
  const handleSubmit = async () => {
    const seatArr = Object.keys(seatDict);
    const passengerArr = Object.values(seatDict);
    console.log(passengerArr, "passenger array");
    setPassengerArr(passengerArr);

    let uuid = uuidv4();

    try {
      console.log(selectedSeats, passengers);
      if (selectedSeats.length === 0 || passengers.length === 0) return;
      passengers.forEach(
        (p) => (p.email = (p.email ?? "").trim().length === 0 ? null : p.email),
      );

      await DanuAgentApi.handleBooking(agentId, {
        trip_id: tripId,
        seat_codes: selectedSeats,
        passenger_details: passengers,
        payment_method: "cash",
        payment_reference: `devpay_${uuid}`,
        external_ref: `ex_${uuid}`,
      });

      toast.success("Seats successfully booked!", { duration: 3000 });
      onSucess?.();

      // Reset state
      setPassengers([
        {
          name: "",
          email: "",
          phone: "",
          id_number: "",
        },
      ]);
      setToggle(false);
      setStep(1);
      setLayoutToggle(false);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        if (error.response?.data.detail) {
          toast.error(`${error.response?.data.detail?.[0].msg}`, {
            duration: 3000,
          });
        } else {
          toast.error(error.response?.data.error, { duration: 3000 });
        }
      } else if (error instanceof Error) {
        toast.error(error.message, { duration: 3000 });
      } else {
        toast.error("Error trying to process your request. Please try again.", {
          duration: 3000,
        });
      }
    }
  };

  const handleBack = () => {
    setMultiSelect([]);
    console.log(selectedSeats);
    setToggle(false);
  };

  const handleDialogClose = () => {
    setToggle(false);
    setStep(1);
    setPassengers([
      {
        name: "",
        email: "",
        phone: "",
        id_number: "",
      },
    ]);
    setSeatDict({});

    setCurrentPassengerIndex(0);
    setEditingPassenger({});
  };

  return (
    <div>
      <Toaster richColors position="top-right" />
      <Dialog open={toggle} onOpenChange={setToggle}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Enter Passenger Information"}
              {step === 2 && "Review & Confirm Booking"}
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <PassengerInfoForm
              numberOfPassengers={number_of_passengers}
              passengers={passengers}
              onPassengersChange={setPassengers}
              onNext={handlePassengerInfoNext}
              onBack={handleBack}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="border rounded p-3 mb-2 bg-gray-50"
                  >
                    <p className="font-medium">{passenger.name}</p>
                    <p className="text-sm text-gray-600">
                      Seat: {selectedSeats[index] || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {passenger.phone}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={selectedSeats.length != passengers.length}
                  onClick={handleSubmit}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
