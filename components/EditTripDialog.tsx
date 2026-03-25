"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useDrivers, useOperatorBuses } from "./Query";
import { useAuth } from "@/lib/authContext";
import { Bus, Driver } from "@/lib/model";
import { User } from "lucide-react";
import { operatorApi } from "@/app/api/api";

export default function EditTripForm({
  isOpen,
  setIsOpen,
  infoAddition,
  schedule_id,
  refetch,
}: {
  isOpen: boolean;
  schedule_id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  infoAddition: {
    id: string;

    operator: {
      id: string;
      name: string;
    };

    route: {
      id: string;
      route_from: string;
      route_to: string;
    };

    bus: {
      id: string;
      plate_no: string;
    };

    driver: {
      id: string;
      name: string;
    };

    departure_time: string;
    price: number;

    // Recurrence
    freq: string;
    interval: number;
    byweekday: string;
    bymonthday: string;
    bymonth: string;
    until: string;
    count: number;
    wkst: number;

    // Dates
    start_date: string;
    end_date: string;

    created_at: string;
    updated_at: string;
  };
}) {
  console.log(infoAddition, "additional info");
  const { user } = useAuth();
  const { data: buses, isLoading: isBusesLoading } = useOperatorBuses(
    user?.organization_id,
  );
  const { data: drivers, isLoading: isDriverLoading } = useDrivers(
    user?.organization_id ?? "",
  );
  const [formData, setFormData] = useState<{
    bus_id: string;
    driver_id: string;
    departure_time: string;
    price: number;

    freq: string;
    interval: number;
    byweekday: string;
    bymonthday: string;
    bymonth: string;
    until: string;
    count: number;
    wkst: number;

    start_date: string;
    end_date: string;
  }>({
    bus_id: "",
    driver_id: "",
    departure_time: "",
    price: 0,

    freq: "",
    interval: 0,
    byweekday: "",
    bymonthday: "",
    bymonth: "",
    until: "",
    count: 0,
    wkst: 0,

    start_date: "",
    end_date: "",
  });
  useEffect(() => {
    if (infoAddition) {
      setFormData({
        bus_id: infoAddition.bus.id,
        driver_id: infoAddition.driver.id,
        departure_time: infoAddition.departure_time,
        price: infoAddition.price,
        freq: infoAddition.freq,
        interval: infoAddition.interval,
        byweekday: infoAddition.byweekday,
        bymonthday: infoAddition.bymonthday,
        bymonth: infoAddition.bymonth,
        until: infoAddition.until,
        count: infoAddition.count,
        wkst: infoAddition.wkst,
        start_date: infoAddition.start_date,
        end_date: infoAddition.end_date,
      });
    }
  }, [infoAddition]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      operatorApi.updateOperatorSchedule(
        user?.organization_id || "",
        schedule_id,
        formData,
      );
      toast.success("Successfully updated the trip");
      refetch();
      setIsOpen(false);
    } catch (err) {
      toast.error("Error while trying to update the trip");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}

      {/* Dialog Content */}
      <DialogContent className="max-w-md h-[80%] lg:h-[90%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create Trip</DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bus */}
              <div>
                <Label className="mb-2">Bus</Label>
                <Select
                  value={formData.bus_id}
                  onValueChange={(val) => handleChange("bus_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.length == 0 ? (
                      <SelectItem value={"none"} disabled>
                        No Buses Found
                      </SelectItem>
                    ) : (
                      buses.map((bus: Bus) => (
                        <SelectItem value={bus.id}>{bus.plate_no}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver */}
              <div>
                <Label className="mb-2">Driver</Label>
                <Select
                  value={formData.driver_id}
                  onValueChange={(val) => handleChange("driver_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {!drivers || drivers?.length == 0 ? (
                      <SelectItem value={"none"} disabled>
                        No Drivers Found
                      </SelectItem>
                    ) : (
                      drivers.map((driver: Driver) => (
                        <SelectItem value={driver.id}>
                          {driver.first_name} {driver.last_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Departure Time */}
              <div>
                <Label className="mb-2">Departure Time</Label>
                <Input
                  value={formData.departure_time}
                  type="time"
                  onChange={(e) =>
                    handleChange("departure_time", e.target.value)
                  }
                />
              </div>

              {/* Price */}
              <div>
                <Label className="mb-2">Price</Label>
                <Input
                  value={formData.price}
                  type="number"
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

              {/* Frequency */}
              <div>
                <Label className="mb-2">Frequency</Label>
                <Input
                  value={formData.freq}
                  placeholder="e.g. DAILY"
                  onChange={(e) => handleChange("freq", e.target.value)}
                />
              </div>

              {/* Interval */}
              <div>
                <Label className="mb-2">Interval</Label>
                <Input
                  value={formData.interval}
                  type="number"
                  onChange={(e) => handleChange("interval", e.target.value)}
                />
              </div>

              {/* By Weekday */}
              <div>
                <Label className="mb-2">By Weekday</Label>
                <Input
                  value={formData.byweekday}
                  placeholder="MO,TU"
                  onChange={(e) => handleChange("byweekday", e.target.value)}
                />
              </div>

              {/* By Month Day */}
              <div>
                <Label className="mb-2">By Month Day</Label>
                <Input
                  value={formData.bymonthday}
                  placeholder="1,15"
                  onChange={(e) => handleChange("bymonthday", e.target.value)}
                />
              </div>

              {/* By Month */}
              <div>
                <Label className="mb-2">By Month</Label>
                <Input
                  value={formData.bymonth}
                  placeholder="1,2,3"
                  onChange={(e) => handleChange("bymonth", e.target.value)}
                />
              </div>

              {/* Until */}
              <div>
                <Label className="mb-2">Until</Label>
                <Input
                  value={formData.until}
                  type="datetime-local"
                  onChange={(e) => handleChange("until", e.target.value)}
                />
              </div>

              {/* Count */}
              <div>
                <Label className="mb-2">Count</Label>
                <Input
                  value={formData.count}
                  type="number"
                  onChange={(e) => handleChange("count", e.target.value)}
                />
              </div>

              {/* Week Start */}
              <div>
                <Label className="mb-2">Week Start</Label>
                <Input
                  value={formData.wkst}
                  type="number"
                  onChange={(e) => handleChange("wkst", e.target.value)}
                />
              </div>

              {/* Start Date */}
              <div>
                <Label className="mb-2">Start Date</Label>
                <Input
                  value={formData.start_date}
                  type="date"
                  onChange={(e) => handleChange("start_date", e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <Label className="mb-2">End Date</Label>
                <Input
                  value={formData.end_date}
                  type="date"
                  onChange={(e) => handleChange("end_date", e.target.value)}
                />
              </div>

              <Button disabled={!formData} type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
