"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import type { Bus, Passenger, Seat } from "@/lib/model";
import GuestSeatBookingDialog from "./GuestSeatBookingDialog";

type SeatLayoutProps = {
  toggle: boolean;
  bus: Bus;
  trip_id: string;
  seats: Seat[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess?: () => void;
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;

  setToggle: (val: boolean) => void;
};

export default function GuestSeatLayoutDialog({
  toggle,
  trip_id,
  bus,
  onSuccess,
  seats,
  setSeats,
  selectedSeats,
  setSelectedSeats,
  setToggle,
}: SeatLayoutProps) {
  const [multiSelectSeats, setMultiSelectSeats] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (bus) {
      setSeats(bus.seat_template.seats);
    }
  }, [bus]);

  useEffect(() => {
    // Reset multi-select when dialog closes
    if (!toggle) {
      setMultiSelectSeats([]);
    }
  }, [toggle]);
  console.log(multiSelectSeats);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked" || seat.status === "held") return;

    setMultiSelectSeats((prev) => {
      const isSelected = prev.includes(seat.seat_code);
      if (isSelected) {
        return prev.filter((s) => s !== seat.seat_code);
      } else {
        return [...prev, seat.seat_code];
      }
    });
  };

  const handleConfirm = () => {
    // if (multiSelectSeats.length === 0) return;
    setSelectedSeats(multiSelectSeats);
    // Mark selected seats as booked
    setSeats((prev) =>
      prev?.map((s) =>
        multiSelectSeats.includes(s.seat_code) ? { ...s, status: "booked" } : s,
      ),
    );
    console.log("openingggggg...");

    // Assign seats to passengers in order - first selected seat to first passenger, etc.
    setOpen(true);
    setToggle(false);

    setMultiSelectSeats([]);
  };
  if (!bus) {
    return <div>Loading...</div>;
  }
  const grouped = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  Object.values(grouped).forEach((row) => row.sort((a, b) => a.col - b.col));

  return (
    <div>
      <Dialog open={toggle} onOpenChange={setToggle}>
        <DialogTrigger asChild>
          <Button>Choose Seats</Button>
        </DialogTrigger>

        <DialogContent className="max-w-md h-[80%] overflow-y-scroll">
          <DialogTitle>Choose your seats</DialogTitle>
          <div className="flex flex-col items-center gap-4 mt-4">
            {/* {multiSelectSeats.length > 0 && (
            <div className="w-full bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm font-medium">
                Selected: {multiSelectSeats.join(", ")}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {multiSelectSeats.length} of {passengers.length} seat
                {passengers.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )} */}

            <div className="grid gap-2">
              <div className="flex justify-start pl-6 mb-2">
                {/* <div className="w-10 h-10 flex items-center justify-center text-xs font-bold">
                <SteeringWheel />
              </div> */}
              </div>
              <div className="flex flex-col gap-2">
                {Object.entries(grouped).map(([rowNumber, rowSeats]) => (
                  <div
                    key={rowNumber}
                    className="flex gap-2 justify-start items-center"
                  >
                    {rowSeats.map((seat, index) => (
                      <>
                        {/* aisle gap between col 2 and 3 */}
                        {rowSeats.length === 4 && index === 2 && (
                          <div className="w-9" />
                        )}

                        <button
                          key={seat.id}
                          onClick={() => {
                            setMultiSelectSeats((prev) => {
                              const isSelected = prev.includes(seat.seat_code);

                              // If already selected → remove
                              if (isSelected) {
                                return prev.filter((s) => s !== seat.seat_code);
                              }

                              // If not selected AND we reached max → replace last seat

                              // Otherwise just add
                              return [...prev, seat.seat_code];
                            });
                          }}
                          disabled={
                            seat.status === "booked" || seat.status === "held"
                          }
                          className={clsx(
                            "w-10 h-10 rounded border text-xs font-semibold",
                            (seat.status === "booked" ||
                              seat.status === "held") &&
                              "bg-gray-300 cursor-not-allowed",
                            multiSelectSeats.includes(seat.seat_code) &&
                              "bg-primary hover:bg-primary/90 text-white",
                            seat.status === "available" &&
                              !multiSelectSeats.includes(seat.seat_code) &&
                              "bg-white hover:bg-primary/60 border-gray-400",
                          )}
                        >
                          {seat.seat_code}
                        </button>
                      </>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-between text-xs mt-4 gap-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-white border border-gray-400 rounded" />{" "}
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-primary border border-primary rounded" />{" "}
              Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-300 rounded" /> Booked
            </span>
          </div>

          <Button
            className="w-full mt-4"
            disabled={multiSelectSeats.length === 0}
            onClick={handleConfirm}
          >
            Confirm{" "}
            {multiSelectSeats.length > 0
              ? `${multiSelectSeats.length} Seat${multiSelectSeats.length !== 1 ? "s" : ""}`
              : "Seats"}
          </Button>
        </DialogContent>
      </Dialog>
      <GuestSeatBookingDialog
        toggle={open}
        setToggle={setOpen}
        onSucess={onSuccess}
        tripId={trip_id}
        selectedSeats={selectedSeats}
        number_of_passengers={selectedSeats.length}
      />
    </div>
  );
}
