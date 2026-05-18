"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import SeatLayoutDialog from "./GuestSeatLayoutDialog";
import PassengerInfoForm from "./PassengerInfoForm";
import type { Bus, Passenger, Seat } from "@/lib/model";
import { operatorApi, passengerApi, tempAPI } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";

type SeatBookingDialogProps = {
  toggle: boolean;
  selectedSeats: string[];
  setToggle: (val: boolean) => void;
  number_of_passengers: number;
  tripId: string;
  onSucess?: () => void;
  operator_id: string;
  setLayoutToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SeatBookingDialog({
  tripId,
  selectedSeats,
  number_of_passengers,
  toggle,
  operator_id,
  setLayoutToggle,
  onSucess,
  setToggle,
}: SeatBookingDialogProps) {
  // Step 1: Passenger Info, Step 2: Seat Selection, Step 3: Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [totalFare, setTotalFare] = useState(0);
  const [holdData, setHoldData] = useState<{
    hold_id: string;
    client_ref: string;
    client_ref_token: string;
    expires_at: string;
    passenger_details: Passenger[];
    //client ref when hold was created a guest account
  } | null>();
  // Passenger information state
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      name: "",
      email: "",
      phone: "",
      id_number: "",
      gender: "",
    },
  ]);

  // Seat selection state
  const [seatToggle, setSeatToggle] = useState(false);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [paymentToggle, setPaymentToggle] = useState(false);

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
        gender: "",
      })),
    );
  }, [number_of_passengers]);

  // Handle moving from passenger info to seat selection
  const handlePassengerInfoNext = async () => {
    await handleHold();
    setStep(2);
    setCurrentPassengerIndex(0);
    setSeatToggle(true);
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
    } else {
      // All passengers have seats selected, move to confirmation
      setSeatToggle(false);
      setStep(3);
    }
  };

  // Handle final booking submission
  const handleHold = async () => {
    const seatArr = Object.keys(seatDict);
    const passengerArr = Object.values(seatDict);
    console.log(passengerArr, "passenger array");
    setPassengerArr(passengerArr);

    try {
      console.log(selectedSeats, passengers);
      if (selectedSeats.length === 0 || passengers.length === 0) return;

      passengers.forEach(
        (p) => (p.email = (p.email ?? "").trim().length === 0 ? null : p.email),
      );
      let uuid = uuidv4();
      const response = await passengerApi.holdSeat(tripId, {
        seat_codes: selectedSeats,
        passenger_details: passengers,
        client_ref: uuid,
      });
      console.log(response, "hold response");
      setHoldData(response);
      setTotalFare(response.total_amount);
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
  const handleConfirm = async () => {
    let uuid = uuidv4();
    if (!holdData) return;
    const res = await tempAPI.payment({
      amount: totalFare,
      first_name: user?.first_name ?? "Guest",
      last_name: user?.last_name ?? "Guest",
      phone_number: user?.phone ?? "N/A", // COULD CREATE PROBLEM IN THE FUTURE
      hold_id: holdData.hold_id,
      client_ref: holdData.client_ref,
    });
    window.open(res.data.checkout_url);
    // toast.success("Seats successfully booked!", { duration: 3000 });
    queryClient.invalidateQueries({ queryKey: ["history"] });

    // Reset state
    setPassengers([
      {
        name: "",
        email: "",
        phone: "",
        id_number: "",
        gender: "",
      },
    ]);
    setToggle(false);
    setStep(1);
    setLayoutToggle(false);
    setPaymentToggle(false);
  };
  const handleBack = async () => {
    console.log(holdData);
    // we need to cancel the hold
    if (!holdData || holdData?.hold_id.trim().length == 0) {
      return;
    }
    try {
      const res = await passengerApi.cancelHold(holdData.hold_id);
      console.log(res, "canceling the booking... ");

      // setSeatDict({});

      setCurrentPassengerIndex(0);
      console.log(selectedSeats);
      if (step === 2) {
        setStep(1);
      } else {
        setToggle(false);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.detail || "Please try again later!");
      }
      return;
    }
  };

  const handleDialogClose = () => {
    setToggle(false);
    setStep(1);
    setPassengers([
      {
        name: "",
        gender: "",
        email: "",
        phone: "",
        id_number: "",
      },
    ]);
    setSeatDict({});

    setCurrentPassengerIndex(0);
    setEditingPassenger({});
  };
  // needs to get integrated
  async function handleCancel(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault();
  }

  return (
    <div>
      <Toaster richColors position="top-right" />
      <Dialog open={toggle} onOpenChange={setToggle}>
        {/* <DialogTrigger asChild>
          <Button>Book Seats</Button>
        </DialogTrigger> */}

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && t("enterPassengerInfo")}
              {step === 2 && t("reviewAndConfirm")}
            </DialogTitle>
          </DialogHeader>

          {/* STEP 1: Passenger Information */}
          {step === 1 && (
            <PassengerInfoForm
              numberOfPassengers={number_of_passengers}
              passengers={passengers}
              onPassengersChange={setPassengers}
              onNext={handlePassengerInfoNext}
              onBack={() => setToggle(false)}
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
                  onClick={async () => {
                    await handleConfirm();
                  }}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* <Dialog open={paymentToggle} onOpenChange={setPaymentToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              This is a placeholder for payment integration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="text-sm">Total Passengers: {passengers.length}</p>
              <p className="text-sm font-medium">
                Total Amount: ETB {totalFare}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              Payment options will appear here (Telebirr, Chapa, Card, etc.)
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Pay & Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
