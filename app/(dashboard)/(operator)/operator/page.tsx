"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Edit,
  MapPin,
  Calendar,
  Users,
  RefreshCcw,
} from "lucide-react";
import { operatorApi } from "@/app/api/api";
import { useAuth } from "@/lib/authContext";
import { useOperatorBuses } from "@/components/Query";
import { Bus, Seat, SeatTemplate } from "@/lib/model";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

import AccountNotActiveBanner from "@/components/AccountBanner";
import { Spinner } from "@/components/ui/spinner";

type BusStatus = "active" | "inactive";

const scheduleOptions = [
  { id: "1", route: "Mumbai - Pune", time: "06:00 AM" },
  { id: "2", route: "Mumbai - Nashik", time: "08:30 AM" },
  { id: "3", route: "Mumbai - Goa", time: "10:00 AM" },
  { id: "4", route: "Pune - Bangalore", time: "07:00 PM" },
];

export default function OperatorPage() {
  // const [buses, setBuses] = useState<Bus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState<string | null>(null);
  const [addBusStep, setAddBusStep] = useState(1);
  const [isAssignTripOpen, setIsAssignTripOpen] = useState(false);
  const [busToAssign, setBusToAssign] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  //const [seatTemplates, setSeatTemplates] = useState<SeatTemplate[]>();
  const [seatTemplates, setSeatTemplates] = useState<any[]>();
  const {
    data: buses = [],
    isLoading,
    isError,
    error,
  } = useOperatorBuses(user?.organization_id);
  console.log(seatTemplates);

  useEffect(() => {
    if (!user?.organization_id) return;

    operatorApi
      .getAllSeatTemplates(user.organization_id)
      .then(setSeatTemplates)
      .catch(console.error);
  }, [user?.organization_id]);

  const [newBus, setNewBus] = useState({
    plate_no: "",
    side_no: "",
    capacity: 0,
    seat_template_id: "",
    bus_status: "active",

    // facilities: [] as string[],
  });

  const filteredBuses =
    buses?.filter(
      (bus: Bus) =>
        bus.plate_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.side_no.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const handleViewDetails = (bus: Bus) => {
    setSelectedBus(bus);
    setIsDetailsOpen(true);
  };
  //const [selectedTemplate, setSelectedTemplate] = useState<SeatTemplate>();
  const [selectedTemplate, setSelectedTemplate] = useState<any>();
  console.log(selectedTemplate);
  const showAccountBanner =
    isError &&
    error &&
    typeof error === "object" &&
    "response" in error &&
    (
      error as {
        response: {
          status: number;
        };
      }
    ).response?.status === 403;
  const isPageLoading = isLoading && !showAccountBanner;
  const isAuthReady = !!user?.organization_id;
  const isDataLoading = isAuthReady && isLoading;
  const isEmpty = isAuthReady && !isLoading && filteredBuses.length === 0;

  const handleTemplateSelect = (template: SeatTemplate) => {
    setSelectedTemplate(template);
  };

  const handleStatusChange = async (bus: Bus, newStatus: BusStatus) => {
    if (!user?.organization_id) return;

    try {
      await operatorApi.updateBusStatus(user.organization_id, bus, newStatus);

      await queryClient.invalidateQueries({
        queryKey: ["buses", user.organization_id],
      });

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteBus = async () => {
    if (!busToDelete || !user?.organization_id) return;

    try {
      await operatorApi.deleteBus(user.organization_id, busToDelete);

      await queryClient.invalidateQueries({
        queryKey: ["buses", user.organization_id],
      });

      toast.success("Bus deleted successfully");
    } catch (error) {
      toast.error("Failed to delete bus");
    } finally {
      setBusToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddBus = async () => {
    if (!user?.organization_id) return;
    const seat51template = seatTemplates?.find((s) =>
      s.name.includes("Standard 51 "),
    );

    //FIXED will be changed when level is add danubooking2.0
    const seat_numbers = 51;

    const data = {
      plate_no: newBus.plate_no,
      side_no: newBus.side_no,
      capacity: seat_numbers,
      seat_template_id: selectedTemplate?.id ?? "",
      bus_status: "active",
    };

    try {
      await operatorApi.createBus(data, user.organization_id);

      await queryClient.invalidateQueries({
        queryKey: ["buses", user.organization_id],
      });

      toast.success("Added the vehicle successfully");
      setIsAddBusOpen(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else {
        toast.error("Failed to add bus");
      }
    } finally {
      setNewBus({
        plate_no: "",
        side_no: "",
        capacity: 0,
        seat_template_id: "",
        bus_status: "active",
      });
      setAddBusStep(1);
    }
  };

  const handleUpdateBus = (updatedBus: Bus) => {
    // setBuses((prev) =>
    //   prev.map((bus) => (bus.id === updatedBus.id ? updatedBus : bus)),
    // );
    // setSelectedBus(updatedBus);
  };

  const getStatusColor = (status: BusStatus) => {
    switch (status) {
      case "active":
        return "bg-primary/20 text-primary border-primary/30";

      case "inactive":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const activeCount = buses.filter(
    (b: Bus) => b.bus_status === "active",
  ).length;
  const maintenanceCount = buses.filter(
    (b: Bus) => b.bus_status === "inactive",
  ).length;
  const totalCapacity = buses.reduce(
    (sum: number, b: Bus) => sum + b.capacity,
    0,
  );

  return (
    <div className="flex flex-col">
      <Toaster position="top-right" richColors />

      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        {showAccountBanner && <AccountNotActiveBanner />}

        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex flex-1 flex-row-reverse">
            <Button
              onClick={() => setIsAddBusOpen(true)}
              className="gap-2"
              disabled={isLoading || isError}
            >
              <Plus className="size-4" />
              Add New Bus
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buses.length}</div>
              <p className="text-xs text-muted-foreground">Fleet vehicles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <div className="size-2 rounded-full bg-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">On road</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <div className="size-2 rounded-full bg-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceCount}</div>
              <p className="text-xs text-muted-foreground">Under service</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Capacity
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacity}</div>
              <p className="text-xs text-muted-foreground">Passenger seats</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fleet Overview</CardTitle>
                <CardDescription>
                  View and manage all buses in your fleet
                </CardDescription>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by license plate or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Side Number</TableHead>
                  <TableHead>Status</TableHead>

                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {( user?.organization_id || "").length == 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Loading buses...
                    </TableCell>
                  </TableRow>
                )}

                {isPageLoading &&( user?.organization_id || "").length == 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Loading buses...
                    </TableCell>
                  </TableRow>
                )} */}

                {/* {!isPageLoading &&
                  filteredBuses.length === 0 &&
                  (user?.organization_id || "").length > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No buses found
                      </TableCell>
                    </TableRow>
                  )} */}
                {!isAuthReady || isDataLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6">
                      <div className="flex justify-center items-center w-full">
                        <Spinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isEmpty ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No buses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBuses?.map((bus: Bus) => (
                    <TableRow
                      key={bus.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(bus)}
                    >
                      <TableCell className="font-mono font-medium">
                        {bus.plate_no}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {bus.side_no}
                      </TableCell>
                      {/* <TableCell>{bus.model}</TableCell> */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(
                            bus.bus_status as BusStatus,
                          )}
                        >
                          {bus.bus_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bus.capacity} seats</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(bus);
                              }}
                            >
                              <Edit className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setBusToAssign(bus.id);
                                setIsAssignTripOpen(true);
                              }}
                            >
                              <Calendar className="mr-2 size-4" />
                              Assign Trip
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuLabel>Change Status</DropdownMenuLabel> */}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(bus, "active");
                              }}
                            >
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(bus, "inactive");
                              }}
                            >
                              Set Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Add Seatmap
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBusToDelete(bus.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete Bus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full p-6 sm:max-w-2xl overflow-y-auto">
          {selectedBus && (
            <>
              <SheetHeader>
                <SheetTitle>Bus Details</SheetTitle>
                <SheetDescription>
                  View and edit bus information and seat layout
                </SheetDescription>
              </SheetHeader>
              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="seats">Seat Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="license">License Plate</Label>
                      <Input
                        id="license"
                        value={selectedBus.plate_no}
                        onChange={(e) =>
                          handleUpdateBus({
                            ...selectedBus,
                            plate_no: e.target.value,
                          })
                        }
                        className="font-mono"
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={selectedBus.status}
                        onValueChange={(value: BusStatus) =>
                          handleUpdateBus({ ...selectedBus, status: value })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="Deactivated">
                            Deactivated
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={selectedBus.capacity}
                        onChange={(e) =>
                          handleUpdateBus({
                            ...selectedBus,
                            capacity: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label>Facilities</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedBus.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="secondary">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </TabsContent>
                <TabsContent value="seats" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Seat Layout</h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedBus.capacity} total seats
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        {`${Math.ceil(selectedBus.capacity / 4)}  `} rows × 4
                        columns
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-6">
                      <div className="mb-4 flex items-center justify-center">
                        <div className="rounded-md bg-secondary px-4 py-2 text-xs font-medium">
                          Driver
                        </div>
                      </div>
                      <div
                        className="grid gap-3"
                        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                      >
                        {/* {selectedBus..map((seat, idx) => (
                          <div
                            key={idx}
                            className="flex aspect-square items-center justify-center rounded-md border border-border bg-card text-xs font-medium"
                          >
                            {idx + 1}
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isAddBusOpen} onOpenChange={setIsAddBusOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[92vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add New Bus</DialogTitle>
          </DialogHeader>

          <div className="flex-1 space-y-4 py-4 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="new-license">License Plate</Label>
              <Input
                id="new-license"
                placeholder="MH-12-XX-0000"
                value={newBus.plate_no}
                onChange={(e) =>
                  setNewBus({ ...newBus, plate_no: e.target.value })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="side-number">Side Number</Label>
              <Input
                id="side-number"
                placeholder="MH-12-XX-0000"
                value={newBus.side_no}
                onChange={(e) =>
                  setNewBus({ ...newBus, side_no: e.target.value })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Bus Level Type</Label>

                <Select
                  value={selectedTemplate?.id || ""}
                  onValueChange={(value) => {
                    const template = seatTemplates?.find((t) => t.id === value);

                    if (template) {
                      setSelectedTemplate(template);

                      setNewBus({
                        ...newBus,
                        seat_template_id: template.id,
                        capacity: template.layout?.grid?.length || 0,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose template" />
                  </SelectTrigger>

                  <SelectContent>
                    {seatTemplates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.association}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="flex flex-col items-center gap-6 p-6 border border-border/50 rounded-2xl bg-card shadow-sm">
                  <div className="w-full space-y-1 text-center pb-4 border-b border-border/50">
                    <h3 className="text-lg font-semibold tracking-tight">
                      Seat Layout
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.name}
                    </p>
                  </div>

                  <div
                    // Added justify-center to keep the whole grid centered nicely in the card
                    className="grid gap-x-2 gap-y-3 justify-center"
                    style={{
                      gridTemplateColumns: "repeat(5, 3rem)",
                    }}
                  >
                    {selectedTemplate.layout?.grid?.map((seat: Seat) => (
                      <div
                        key={seat.seat_code}
                        style={{
                          gridColumn: seat.col,
                          gridRow: seat.row,
                        }}
                        className="relative flex justify-center"
                      >
                        <div
                          className="
              flex flex-col items-center justify-center
              w-12 h-12
              border-2 border-border/60
              rounded-t-xl rounded-b-md
              bg-background
              text-foreground
              shadow-sm
            "
                        >
                          <span className="text-sm font-bold">
                            {seat.seat_code}
                          </span>

                          <span className="text-[9px] text-muted-foreground uppercase">
                            {seat.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddBus}>Add Bus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Trip Dialog */}
      <Dialog open={isAssignTripOpen} onOpenChange={setIsAssignTripOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Trip</DialogTitle>
            <DialogDescription>
              Select a schedule to assign to this bus
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a route" />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      <span>{schedule.route}</span>
                      <span className="text-muted-foreground">
                        • {schedule.time}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignTripOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAssignTripOpen(false)}>
              Assign Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bus
              from your fleet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBus}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
