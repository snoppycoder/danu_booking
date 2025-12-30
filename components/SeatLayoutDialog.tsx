"use client";

import type React from "react";

import { SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import type { Bus, Seat } from "@/lib/model";

type SeatLayoutProps = {
  toggle: boolean;
  bus: Bus;
  idx: number;
  seats: Seat[];
  selectedSeats: Record<number, string>;
  setSelectedSeats: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  editingPassenger: Record<number, number>;

  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  setToggle: (val: boolean) => void;
  onSelect: (seatId: string) => void;
};

export default function SeatLayoutDialog({
  toggle,
  bus,
  idx,
  seats,
  editingPassenger,
  setSelectedSeats,
  selectedSeats,
  setSeats,
  setToggle,
  onSelect,
}: SeatLayoutProps) {
  // const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>(
  //   {}
  // );
  useEffect(() => {
    const editCount = editingPassenger[idx];
    if (!editCount) return;

    const prevSeat = Object.entries(selectedSeats).find(
      ([key]) => Number(key) === idx
    )?.[1];

    if (!prevSeat) return;

    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === prevSeat ? { ...seat, status: "available" } : seat
      )
    );
  }, [editingPassenger[idx]]);

  useEffect(() => {
    if (bus) {
      setSeats(bus.seat_template.seats);
    }
  }, [bus]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked") return;

    setSelectedSeats((prev) => {
      // If this passenger already has this seat, unselect it
      if (prev[idx] === seat.seat_code) {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      }

      // Otherwise, select the new seat for this passenger
      return { ...prev, [idx]: seat.seat_code };
    });
  };

  const handleConfirm = () => {
    // Check if seat is selected using passenger index

    setSeats((prev) =>
      prev?.map((s) =>
        s.seat_code === selectedSeats[idx] ? { ...s, status: "booked" } : s
      )
    );
    onSelect(selectedSeats[idx]);
    setToggle(false);

    setSelectedSeats({}); // reset selection after confirm
  };
  if (!bus) {
    return <div>Loading...</div>;
  }
  console.log(bus.seat_template.seats, "here are the layouts");

  return (
    <Dialog open={toggle} onOpenChange={setToggle}>
      <DialogTrigger asChild>
        <Button>Choose Seats</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Select Your Seats</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5  gap-3 justify-items-center mt-4">
          {seats?.map((seat, index) => {
            const isAisle = index % 4 === 2;

            return (
              <div key={seat.id} className="contents">
                {/* Insert aisle gap */}
                {isAisle && <div className="col-span-1"></div>}

                <button
                  onClick={() => toggleSeat(seat)}
                  disabled={seat.status == "booked"}
                  className={clsx(
                    "w-12 h-12 rounded-lg border text-sm font-semibold",
                    "transition-colors",
                    seat.status == "booked" && "bg-gray-300 cursor-not-allowed",
                    // Now correctly checks if this seat is selected for THIS passenger
                    selectedSeats[idx] === seat.seat_code &&
                      "bg-teal-600 text-white",
                    seat.status == "available" &&
                      selectedSeats[idx] !== seat.seat_code &&
                      "bg-white hover:bg-teal-100"
                  )}
                >
                  {seat.seat_code}
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
          disabled={!selectedSeats[idx]} // Check if seat is selected using passenger index
          onClick={handleConfirm}
        >
          Confirm Seats
        </Button>
      </DialogContent>
    </Dialog>
  );
}
