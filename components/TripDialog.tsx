"use client";

import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Bus, Driver, Route, User } from "@/lib/model";
import { useAuth } from "@/lib/authContext";

const tripSchema = z.object({
  route_from: z.string().min(2, "Starting location is required"),
  route_to: z.string().min(2, "Destination is required"),
  departure_at: z.string().min(1, "Departure date and time is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  bus_id: z.string().min(1, "Please select a bus"),
  driver_id: z.string().min(1, "Please select a driver"),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TripFormData) => void;
  buses: Bus[];
  drivers: Driver[];
  trip?: {
    route_from: string;
    route_to: string;
    departure_at: string;
    price: number;
    bus_id: string;
    driver_id: string;
  };
}

export function TripDialog({
  open,
  onOpenChange,
  onSubmit,
  buses,
  drivers,
  trip,
}: TripDialogProps) {
  const isEdit = !!trip;
  const { user } = useAuth();
  const filteredBus = buses.filter(
    (b) => b.operator_id === user?.organization_id && b.bus_status === "active",
  );

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema) as Resolver<TripFormData>,
    defaultValues: {
      route_from: "",
      route_to: "",
      departure_at: "",
      price: 0,
      bus_id: "",
      driver_id: "",
    },
  });

  const selectedBusId = form.watch("bus_id");
  const selectedBus = filteredBus.find((b) => b.id === selectedBusId);

  // Filter drivers by selected bus operator
  const filteredDrivers = selectedBus
    ? drivers.filter((d) => d.operator_id === selectedBus.operator_id)
    : [];

  // Reset form when dialog opens/closes or trip changes
  useEffect(() => {
    if (open && trip) {
      // Convert ISO string to datetime-local format
      const departureDate = new Date(trip.departure_at);
      const localDateTime = new Date(
        departureDate.getTime() - departureDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16);

      form.reset({
        route_from: trip.route_from,
        route_to: trip.route_to,
        departure_at: localDateTime,
        price: trip.price,
        bus_id: trip.bus_id,
        driver_id: trip.driver_id,
      });
    } else if (open && !trip) {
      form.reset({
        route_from: "",
        route_to: "",
        departure_at: "",
        price: 0,
        bus_id: "",
        driver_id: "",
      });
    }
  }, [open, trip, form]);

  // Reset driver when bus changes
  useEffect(() => {
    if (selectedBusId && !isEdit) {
      const currentDriverId = form.getValues("driver_id");
      const isDriverValid = filteredDrivers.some(
        (d) => d.id === currentDriverId,
      );
      if (!isDriverValid) {
        form.setValue("driver_id", "");
      }
    }
  }, [selectedBusId, filteredDrivers, form, isEdit]);

  const handleSubmit = (data: TripFormData) => {
    // Convert datetime-local to ISO string
    const formattedData = {
      ...data,
      departure_at: new Date(data.departure_at).toISOString(),
      operator_id: selectedBus?.operator_id || "",
    };
    onSubmit(formattedData);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Trip" : "Create New Trip"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the trip information below."
              : "Fill in the details to create a new trip."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {/* Route From */}
              <FormField
                control={form.control}
                name="route_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="Starting location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Route To */}
              <FormField
                control={form.control}
                name="route_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="Destination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Departure Date/Time */}
              <FormField
                control={form.control}
                name="departure_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (ETB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bus Selection */}
            <FormField
              control={form.control}
              name="bus_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Bus</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a bus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredBus.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.plate_no} | {bus.side_no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Driver Selection */}
            <FormField
              control={form.control}
              name="driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Driver</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedBusId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedBusId
                              ? "Choose a driver"
                              : "Select a bus first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.first_name ?? ""} {driver.last_name ?? ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Update Trip" : "Create Trip"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
