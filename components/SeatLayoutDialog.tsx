"use client";

import type React from "react";

import { useEffect } from "react";
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
// import SteeringWheel from "@/components/SteeringWheel";

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
  useEffect(() => {
    const editCount = editingPassenger[idx];
    if (!editCount) return;

    const prevSeat = Object.entries(selectedSeats).find(
      ([key]) => Number(key) === idx,
    )?.[1];

    if (!prevSeat) return;

    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === prevSeat ? { ...seat, status: "available" } : seat,
      ),
    );
  }, [editingPassenger[idx]]);

  useEffect(() => {
    if (bus) {
      setSeats(bus.seat_template.seats);
    }
  }, [bus]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked" || seat.status == "held") return;

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
        s.seat_code === selectedSeats[idx] ? { ...s, status: "booked" } : s,
      ),
    );
    onSelect(selectedSeats[idx]);
    setToggle(false);

    setSelectedSeats({}); // reset selection after confirm
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
    <Dialog open={toggle} onOpenChange={setToggle}>
      <DialogTrigger asChild>
        <Button>Choose Seats</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Select Your Seats</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 mt-4">
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
                        <div className="w-4" />
                      )}

                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat)}
                        disabled={
                          seat.status === "booked" || seat.status === "held"
                        }
                        className={clsx(
                          "w-10 h-10 rounded border text-xs font-semibold",
                          (seat.status === "booked" ||
                            seat.status === "held") &&
                            "bg-gray-300 cursor-not-allowed",
                          selectedSeats[idx] === seat.seat_code &&
                            "bg-primary hover:bg-primary/90 text-white",
                          seat.status === "available" &&
                            selectedSeats[idx] !== seat.seat_code &&
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
          disabled={!selectedSeats[idx]}
          onClick={handleConfirm}
        >
          Confirm Seats
        </Button>
      </DialogContent>
    </Dialog>
  );
}
