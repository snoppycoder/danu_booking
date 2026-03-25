"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bus, Driver, RouteDTO, Trip } from "@/lib/model";
import { operatorApi } from "@/app/api/api";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type FormValues = {
  route_id: string;
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
};

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  drivers: Driver[];
  routes: RouteDTO[];
  buses: Bus[];
  onSuccess: () => void;
};

export function ScheduleDialog({
  open,
  setOpen,
  drivers,
  routes,
  buses,
  onSuccess,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      route_id: "",
      bus_id: "",
      driver_id: "",
      freq: "",
      interval: 0,
      count: 0,
      wkst: 0,
      start_date: "",
      end_date: "",
    },
  });
  console.log(errors, isValid);

  const { user } = useAuth();
  const onSubmit = async (data: FormValues) => {
    try {
      const effectiveEndDate = data.end_date || data.until;
      const startDate = new Date(data.start_date);
      const endDate = effectiveEndDate ? new Date(effectiveEndDate) : null;

      if (endDate) {
        const diffInDays =
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays > 90) {
          toast.error("Schedule cannot span more than 90 days.");
          return; // stop submission
        }
      }
      const payload = {
        ...data,
        until: data.until ? data.until : undefined,
        price: Number(data.price),
        interval: data.interval ? data.interval : 1,
        wkst: Number(data.wkst),
      };

      await operatorApi.createSchedule(user?.organization_id ?? "", payload);
      onSuccess?.();

      toast.success("Schedule created successfully");

      setOpen(false);

      reset();
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        if (typeof error.response?.data.error === "string") {
          toast.error(error.response.data.error);
          return;
        }
      }
      toast.error("Failed to create schedule");
    }
  };
  const freq = watch("freq");
  const until = watch("until");
  const end_date = watch("end_date");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-2xl w-xl h-[60%] lg:h-[80%] overflow-y-scroll scrollbar-hide ">
        <DialogHeader>
          <DialogTitle>Create Bus Schedule</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 mt-2.5"
        >
          {" "}
          <div className="flex flex-col gap-2">
            <Label>
              Route <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="route_id"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes && routes.length > 0 ? (
                      routes.map((r) => (
                        <SelectItem key={r.id} value={r.id ?? ""}>
                          {r.route_from} - {r.route_to}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Null" disabled>
                        Not available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Bus Dropdown */}
          <div className="flex flex-col gap-2">
            <Label>
              Bus <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="bus_id"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses && buses.length > 0 ? (
                      buses.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.plate_no}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Null" disabled>
                        Not available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Driver Dropdown */}
          <div className="flex flex-col gap-2">
            <Label>
              Driver <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="driver_id"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers && drivers.length > 0 ? (
                      drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.first_name} {d.last_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Null" disabled>
                        Not available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* The rest of your inputs */}
          <div className="flex flex-col gap-2">
            <Label>
              {" "}
              Departure Time <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              className="text-emerald-600"
              type="time"
              {...register("departure_time")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              min={100}
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              {" "}
              Frequency<span className="text-red-500">*</span>{" "}
            </Label>
            <Controller
              defaultValue=""
              name="freq"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Interval</Label>
            <Input
              min={1}
              type="number"
              {...register("interval", {
                valueAsNumber: true,
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>By Weekday</Label>
            <Input
              {...register("byweekday", {
                validate: (value) => {
                  if (freq === "WEEKLY" && !value) {
                    return "Weekday is required for weekly schedules";
                  }
                  return true;
                },
              })}
              placeholder="MO,TU,WE"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>By Month Day</Label>
            <Input
              {...register("bymonthday", {
                validate: (value) => {
                  if (freq === "MONTHLY" && !value) {
                    // check this
                    return "Monthday is required for monthly schedules";
                  }
                  return true;
                },
              })}
              placeholder="1,15"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>By Month</Label>
            <Input
              {...register("bymonth", {
                validate: (value) => {
                  if (freq === "MONTHLY" && !value) {
                    return "Monthday is required for monthly schedules"; // work on this
                  }
                  return true;
                },
              })}
              placeholder="1-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Until</Label>
            <Input
              type="datetime-local"
              {...register("until", {
                validate: (value) => {
                  if (!value && !end_date) {
                    return "Please fill either Until or End Date";
                  }
                  return true;
                },
              })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Count</Label>
            <Input type="number" {...register("count")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Week Start</Label>
            <Input type="number" min={0} max={6} {...register("wkst")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input type="date" required {...register("start_date")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>End Date</Label>
            <Input
              type="date"
              {...register("end_date", {
                validate: (value) => {
                  if (!value && !until) {
                    return "Please fill either End Date or Until";
                  }
                  return true;
                },
              })}
            />
          </div>
          <div className="col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
