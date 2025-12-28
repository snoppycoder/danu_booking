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
import clsx from "clsx";

type Seat = {
  id: string;
  isBooked: boolean;
};
type SeatLayoutProps = {
  toggle: boolean;
  setToggle: (val: boolean) => void;
  onSelect: (seatId: string) => void;
};

const SEATS: Seat[] = [
  { id: "A1", isBooked: false },
  { id: "A2", isBooked: true },
  { id: "A3", isBooked: false },
  { id: "A4", isBooked: false },

  { id: "B1", isBooked: false },
  { id: "B2", isBooked: true },
  { id: "B3", isBooked: false },
  { id: "B4", isBooked: false },

  { id: "C1", isBooked: false },
  { id: "C2", isBooked: false },
  { id: "C3", isBooked: true },
  { id: "C4", isBooked: false },
];

export default function SeatLayoutDialog({
  toggle,
  setToggle,
  onSelect,
}: SeatLayoutProps) {
  const [selectedSeats, setSelectedSeats] = useState<string>();
  const [seats, setSeats] = useState<Seat[]>(SEATS);

  const toggleSeat = (seat: Seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) => (prev === seat.id ? undefined : seat.id));
  };

  const handleConfirm = () => {
    if (!selectedSeats) return;

    setSeats((prev) =>
      prev.map((s) => (s.id === selectedSeats ? { ...s, isBooked: true } : s))
    );
    onSelect(selectedSeats);
    setToggle(false);
    console.log("Selected seat:", selectedSeats);
    setSelectedSeats(undefined); // reset selection after confirm
  };

  return (
    <Dialog open={toggle} onOpenChange={setToggle}>
      <DialogTrigger asChild>
        <Button>Choose Seats</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Seats</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-3 justify-items-center mt-4">
          {seats.map((seat, index) => {
            const isAisle = index % 4 === 2;

            return (
              <div key={seat.id} className="contents">
                {/* Insert aisle gap */}
                {isAisle && <div className="col-span-1"></div>}

                <button
                  onClick={() => toggleSeat(seat)}
                  disabled={seat.isBooked}
                  className={clsx(
                    "w-12 h-12 rounded-lg border text-sm font-semibold",
                    "transition-colors",
                    seat.isBooked && "bg-gray-300 cursor-not-allowed",
                    selectedSeats === seat.id && "bg-teal-600 text-white",
                    !seat.isBooked &&
                      selectedSeats !== seat.id &&
                      "bg-white hover:bg-teal-100"
                  )}
                >
                  {seat.id}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-between text-sm mt-4">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-white border rounded" /> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-teal-600 border rounded" /> Selected
          </span>

          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-gray-300 rounded" /> Held
          </span>
        </div>

        <Button
          className="w-full mt-4"
          disabled={selectedSeats === undefined}
          onClick={handleConfirm}
        >
          Confirm Seats
        </Button>
      </DialogContent>
    </Dialog>
  );
}
