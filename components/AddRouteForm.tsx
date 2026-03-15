"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import { superAdminApi } from "@/app/api/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type RouteFormValues = {
  route_from: string;
  route_to: string;
  distance_km: string;
  estimated_duration_minutes: string;
};
type Prop = {
  onSuccess?: () => void;
};

export default function AddRouteForm({ onSuccess }: Prop) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<RouteFormValues>({
    defaultValues: {
      route_from: "",
      route_to: "",
      distance_km: "",
      estimated_duration_minutes: "",
    },
  });

  const onSubmit = async (data: RouteFormValues) => {
    try {
      setLoading(true);

      await superAdminApi.addRoute({
        route_from: data.route_from,
        route_to: data.route_to,
        distance_km: Number(data.distance_km),
        estimated_duration_minutes: Number(data.estimated_duration_minutes),
      });

      form.reset();
      toast.success("Route created successfully");
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Route</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Route</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="route_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route From</FormLabel>
                  <FormControl>
                    <Input placeholder="Addis Ababa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="route_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route To</FormLabel>
                  <FormControl>
                    <Input placeholder="Adama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance (KM)</FormLabel>
                  <FormControl>
                    <Input
                      //   type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Distance in KM"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration (Minutes)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Route"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
