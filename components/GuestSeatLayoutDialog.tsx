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
import Image from "next/image";
import { operatorApi, passengerApi } from "@/app/api/api";
import { Spinner } from "./ui/spinner";

type SeatLayoutProps = {
  toggle: boolean;
  trip_id: string;
  seats: Seat[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess?: () => void;
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  operator_id: string;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GuestSeatLayoutDialog({
  toggle,
  trip_id,
  operator_id,
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
    if (!trip_id) return;
    const fetch = async () => {
      const data = await passengerApi.getSeatLayout(trip_id);
      if (data) {
        setSeats(data?.seats);
      }
    };
    fetch();
  }, [trip_id]);

  useEffect(() => {
    // Reset multi-select when dialog closes
    if (!toggle) {
      setMultiSelectSeats([]);
    }
  }, [toggle]);
  console.log(multiSelectSeats);
  console.log(selectedSeats);

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

    // Assign seats to passengers in order - first selected seat to first passenger, etc.
    setOpen(true);
    setToggle(false);

    setMultiSelectSeats([]);
  };

  const grouped = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  Object.values(grouped).forEach((row) => row.sort((a, b) => a.col - b.col));

  return (
    <div>
      <Dialog open={toggle} onOpenChange={setToggle}>
        <DialogContent className="max-w-md h-[80%] overflow-y-scroll">
          <DialogTitle>Choose your seats</DialogTitle>
          <div className="flex flex-col items-center gap-4 mt-4">
            {seats.length == 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid gap-2">
                <div className="w-18 h-18 mb-1 flex items-center justify-center text-xs font-bold">
                  <img src="/steering-wheel.png" alt={"steering wheel"} />
                </div>

                <div className="flex flex-col gap-2">
                  {Object.entries(grouped).map(([rowNumber, rowSeats]) => (
                    <div
                      key={rowNumber}
                      className="flex gap-2 justify-start items-center"
                    >
                      {rowSeats.map((seat, index) => (
                        <>
                          {rowSeats.length === 4 && index === 2 && (
                            <div className="w-9" />
                          )}

                          <button
                            key={seat.id}
                            onClick={() => {
                              setMultiSelectSeats((prev) => {
                                const isSelected = prev.includes(
                                  seat.seat_code,
                                );

                                if (isSelected) {
                                  return prev.filter(
                                    (s) => s !== seat.seat_code,
                                  );
                                }

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
            )}
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
        operator_id={operator_id}
        setLayoutToggle={setToggle}
        setMultiSelect={setSelectedSeats}
      />
    </div>
  );
}
