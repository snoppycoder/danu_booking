"use client";

import { SetStateAction, useEffect, useState } from "react";
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
import {
  isInTelebirrSuperApp,
  startTelebirrPay,
} from "@/lib/telebirr/bridge";

type SeatBookingDialogProps = {
  toggle: boolean;
  selectedSeats: string[];
  setToggle: (val: boolean) => void;
  number_of_passengers: number;
  tripId: string;
  onSucess?: () => void;
  operator_id: string;
  setLayoutToggle: React.Dispatch<SetStateAction<boolean>>;
  setMultiSelect: React.Dispatch<SetStateAction<string[]>>;
};

export default function GuestSeatBookingDialog({
  tripId,
  selectedSeats,
  number_of_passengers,
  toggle,
  onSucess,
  operator_id,
  setLayoutToggle,
  setMultiSelect,
  setToggle,
}: SeatBookingDialogProps) {
  // Step 1: Passenger Info, Step 2: Seat Selection, Step 3: Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [totalFare, setTotalFare] = useState(0);
  const [holdData, setHoldData] = useState<{
    hold_id: string;
    client_ref: string;
    client_ref_token: string;
    expires_at: string;
    passengers: Passenger[];

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
  const [paymentToggle, setPaymentToggle] = useState(false);

  // Seat selection state
  const [seatToggle, setSeatToggle] = useState(false);
  const [bus, setBus] = useState<Bus>();
  const [seats, setSeats] = useState<Seat[]>([]);

  const [seatDict, setSeatDict] = useState<Record<string, Passenger>>({});
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState<number>(0);
  const [selectedPayment, setSelectedPayment] = useState<
    "star_pay" | "chapa" | "telebirr"
  >("chapa");
  // When the app is opened inside the telebirr SuperApp, default to telebirr.
  const [inSuperApp, setInSuperApp] = useState(false);
  useEffect(() => {
    if (isInTelebirrSuperApp()) {
      setInSuperApp(true);
      setSelectedPayment("telebirr");
    }
  }, []);
  const [editingPassenger, setEditingPassenger] = useState<
    Record<number, number>
  >({});
  const [passengerArray, setPassengerArr] = useState<Passenger[]>([]);

  // Fetch bus details
  useEffect(() => {
    const fetch = async () => {
      const data = await operatorApi.getAllSeatTemplates(operator_id);
      if (data) {
        setSeats(data?.[0].seats);
      }
    };
    fetch();
  }, [bus]);
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
      const response = await passengerApi.guestHoldBooking(tripId, {
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
    console.log(holdData.passengers, "hold data at confirmation");
    const resetAndClose = () => {
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

    if (selectedPayment === "chapa") {
      const res = await tempAPI.guestPayment({
        payment_method: "chapa",
        amount: totalFare,
        first_name: holdData.passengers?.[0].name.split(" ")[0] ?? "Guest",
        last_name: holdData.passengers?.[0].name.split(" ")[1] ?? "Guest",
        phone_number: holdData.passengers?.[0].phone,
        hold_id: holdData.hold_id,
        client_ref: holdData.client_ref,
      });
      window.open(res.data.checkout_url);
      resetAndClose();
    } else if (selectedPayment === "star_pay") {
      const res = await tempAPI.guestPayment({
        payment_method: "star_pay",
        amount: totalFare,
        first_name: holdData.passengers?.[0].name.split(" ")[0] ?? "Guest",
        last_name: holdData.passengers?.[0].name.split(" ")[1] ?? "Guest",
        phone_number: holdData.passengers?.[0].phone?.replace(/^0/, "+251"),
        hold_id: holdData.hold_id,
        client_ref: holdData.client_ref,
      });
      window.open(res.data.payment_url);
      resetAndClose();
    } else if (selectedPayment === "telebirr") {
      let res;
      try {
        res = await tempAPI.guestPayment({
          payment_method: "telebirr",
          amount: totalFare,
          first_name: holdData.passengers?.[0].name.split(" ")[0] ?? "Guest",
          last_name: holdData.passengers?.[0].name.split(" ")[1] ?? "Guest",
          phone_number: holdData.passengers?.[0].phone?.replace(/^0/, "+251"),
          hold_id: holdData.hold_id,
          client_ref: holdData.client_ref,
        });
      } catch (error) {
        const detailMsg = isAxiosError(error)
          ? error.response?.data?.detail?.[0]?.msg ?? error.response?.data?.error
          : undefined;
        toast.error(
          detailMsg ?? "Could not start telebirr payment. Please try again.",
          { duration: 3000 },
        );
        return; // keep the dialog open so the user can retry
      }

      // Backend returns the telebirr rawRequest as payment_url. Inside the
      // SuperApp this pulls up the native cashier; in a browser it opens the H5.
      const payUrl =
        res?.data?.payment_url ?? res?.data?.checkout_url ?? res?.data?.toPayUrl;
      if (!payUrl) {
        toast.error(
          res?.error ?? "Could not start telebirr payment. Please try again.",
          { duration: 3000 },
        );
        return;
      }

      const result = await startTelebirrPay(payUrl);
      if (result === "failed") {
        toast.error("Telebirr payment could not be completed. Please try again.", {
          duration: 3000,
        });
        return; // keep dialog open for retry
      }
      if (result === "cancelled") {
        toast.message("Payment cancelled.", { duration: 3000 });
        return;
      }
      if (result === "pending") {
        toast.message(
          "Complete the payment in telebirr to confirm your booking.",
          { duration: 4000 },
        );
        return;
      }

      // result === "success": ma.tradePay reported 9000. InApp does not use
      // notify_url, so confirm server-side (backend runs queryOrder) before
      // finalizing the booking.
      try {
        const conf = await tempAPI.guestTelebirrConfirm(
          holdData.client_ref,
          holdData.hold_id,
        );
        if (conf?.success) {
          toast.success("Booking confirmed.", { duration: 3000 });
          onSucess?.();
          resetAndClose();
        } else {
          toast.error(
            "Payment could not be verified. If you were charged, your seat is held — please contact support.",
            { duration: 5000 },
          );
        }
      } catch (e) {
        toast.error(
          "Payment is being verified. If you were charged, your seat is held — please do not pay again.",
          { duration: 5000 },
        );
      }
    }
  };

  const handleBack = async () => {
    if (!holdData || holdData?.hold_id === "") return;
    try {
      await passengerApi.guestCancelHold(holdData?.hold_id);

      // setSeatDict({});

      setCurrentPassengerIndex(0);
      console.log(selectedSeats);

      if (step === 2) {
        setStep(1);
      } else {
        setToggle(false);
      }
    } catch (error) {
      console.log(error);
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
                    setPaymentToggle(true);
                  }}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={paymentToggle} onOpenChange={setPaymentToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment option to continue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50 space-y-1">
              <p className="text-sm">Total Passengers: {passengers.length}</p>
              <p className="text-sm font-medium">
                Total Amount: {totalFare} ETB
              </p>
            </div>

            <div className="grid gap-3">
              <div
                onClick={() => setSelectedPayment("chapa")}
                className={`rounded-lg border p-4 cursor-pointer transition hover:bg-muted/50 ${
                  selectedPayment === "chapa"
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/logos/chapa.svg"
                    alt="Chapa"
                    className="h-8 w-auto object-contain"
                  />

                  <div>
                    <p className="font-medium">Chapa</p>
                    <p className="text-sm text-muted-foreground">
                      Use chapa for secure transaction.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedPayment("star_pay")}
                className={`rounded-lg border p-4 cursor-pointer transition hover:bg-muted/50 ${
                  selectedPayment === "star_pay"
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/logos/star_pay.svg"
                    alt="StarPay"
                    className="h-8 w-auto object-contain"
                  />

                  <div>
                    <p className="font-medium">StarPay</p>
                    <p className="text-sm text-muted-foreground">
                      Use StarPay for quick checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedPayment("telebirr")}
                className={`rounded-lg border p-4 cursor-pointer transition hover:bg-muted/50 ${
                  selectedPayment === "telebirr"
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">telebirr</p>
                    <p className="text-sm text-muted-foreground">
                      Pay directly with telebirr.
                    </p>
                  </div>
                  {inSuperApp && (
                    <span className="text-xs font-medium text-primary">
                      Recommended
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentToggle(false)}>
              Cancel
            </Button>

            <Button disabled={!selectedPayment} onClick={handleConfirm}>
              Continue Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
