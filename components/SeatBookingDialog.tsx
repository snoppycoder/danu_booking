"use client";

import { useEffect, useState } from "react";
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
import type { Bus, Passenger, Seat } from "@/lib/model";
import { passengerApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";

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
  const [bus, setBus] = useState<Bus>();
  const [idx, setIdx] = useState<number>();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [editingPassenger, setEditingPassenger] = useState<
    Record<number, number>
  >({});

  const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    const fetch = async () => {
      if (tripId.length == 0) return;
      const response = await passengerApi.getTripDetails(tripId);
      console.log(response, "logged");
      // const data = response.data as TripData;
      // console.log(data);
      setBus(response.bus);
    };
    fetch();
  }, [tripId]);

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
      if (seatArr.length == 0 || passengerArr.length == 0) return;

      const response = await passengerApi.holdSeat(tripId, {
        seat_codes: seatArr,
        passenger_details: passengerArr,
      });
      if (response) setToggle(false);
      console.log(response, "booking");
      toast.success("Seats successfully booked!");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.detail) {
          toast.error(error.response?.data.detail?.[0].msg);
        } else {
          toast.error(error.response?.data.error, { duration: 2000 });
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error trying to process your request. Please try again.");
      }
    }
  };

  function handleSeatSelection(arg0: Passenger) {
    setSeatToggle(true);
  }
  if (!bus) {
    return <>Loading</>;
  }
  function handleBack(): void {
    setStep(1);
    setSeatDict({});
    setPassengerArr([]);
    setSeatArr([]);
    setSelectedSeats({});
    setSeats(bus?.seat_template.seats || []); // reset seat statuses
    setIdx(undefined);
    setIndexBeingEdited(null);
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
                        setIdx(index);
                        setEditingPassenger((prev) => ({
                          ...prev,
                          [index]: (prev[index] ?? 0) + 1,
                        }));
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
                <Button variant="outline" onClick={() => handleBack()}>
                  Back
                </Button>

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
        // toggle={editingPassenger === idx}
        setToggle={setSeatToggle}
        setSelectedSeats={setSelectedSeats}
        selectedSeats={selectedSeats}
        editingPassenger={editingPassenger}
        bus={bus!}
        seats={seats!}
        idx={Number(idx)}
        setSeats={setSeats}
        onSelect={(seatId) => {
          // Map selected seat to the current passenger
          setSeatDict((prev) => ({
            ...prev,
            [seatId]: passengers[indexBeingEdited ?? 0], // track which passenger is selecting
          }));
          // setSelectedSeat(seatId); // optional if you want to show it in UI
        }}
      />
    </div>
  );
}
