"use client";

import { useState } from "react";
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
  DropdownMenuLabel,
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
} from "lucide-react";
import { operatorApi } from "@/app/api/api";
import { useAuth } from "@/lib/authContext";

type BusStatus = "Active" | "Maintenance" | "Deactivated";

interface FleetBus {
  id: string;
  plate_number: string;
  side_no: string;
  status: BusStatus;
  capacity: number;

  seats: { row: number; col: number; available: boolean }[];
}

const initialBuses: FleetBus[] = [
  {
    id: "1",
    plate_number: "MH-12-AB-1234",
    side_no: "S-001",
    status: "Active",
    capacity: 45,
    // facilities: ["AC", "WiFi", "USB Charging"],
    seats: Array.from({ length: 45 }, (_, i) => ({
      row: Math.floor(i / 4) + 1,
      col: (i % 4) + 1,
      available: true,
    })),
  },
];

const scheduleOptions = [
  { id: "1", route: "Mumbai - Pune", time: "06:00 AM" },
  { id: "2", route: "Mumbai - Nashik", time: "08:30 AM" },
  { id: "3", route: "Mumbai - Goa", time: "10:00 AM" },
  { id: "4", route: "Pune - Bangalore", time: "07:00 PM" },
];

export default function OperatorPage() {
  const [buses, setBuses] = useState<FleetBus[]>(initialBuses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBus, setSelectedBus] = useState<FleetBus | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState<string | null>(null);
  const [addBusStep, setAddBusStep] = useState(1);
  const [isAssignTripOpen, setIsAssignTripOpen] = useState(false);
  const [busToAssign, setBusToAssign] = useState<string | null>(null);
  const { user } = useAuth();

  // New bus form state
  const [newBus, setNewBus] = useState({
    plate_number: "",
    side_no: "",
    capacity: 45,
    // facilities: [] as string[],
  });

  const filteredBuses = buses.filter((bus) =>
    bus.plate_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (bus: FleetBus) => {
    setSelectedBus(bus);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (busId: string, newStatus: BusStatus) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, status: newStatus } : bus
      )
    );
  };

  const handleDeleteBus = () => {
    if (busToDelete) {
      setBuses((prev) => prev.filter((bus) => bus.id !== busToDelete));
      setBusToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddBus = async () => {
    const bus: FleetBus = {
      id: String(buses.length + 1),
      ...newBus,
      status: "Active",
      seats: Array.from({ length: newBus.capacity }, (_, i) => ({
        row: Math.floor(i / 4) + 1,
        col: (i % 4) + 1,
        available: true,
      })),
    };
    setBuses((prev) => [...prev, bus]);
    setIsAddBusOpen(false);
    setAddBusStep(1);

    operatorApi.createBus(newBus, user?.id || "");
    setNewBus({ plate_number: "", capacity: 45, side_no: "" });
  };

  const handleUpdateBus = (updatedBus: FleetBus) => {
    setBuses((prev) =>
      prev.map((bus) => (bus.id === updatedBus.id ? updatedBus : bus))
    );
    setSelectedBus(updatedBus);
  };

  const getStatusColor = (status: BusStatus) => {
    switch (status) {
      case "Active":
        return "bg-primary/20 text-primary border-primary/30";
      case "Maintenance":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      case "Deactivated":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const activeCount = buses.filter((b) => b.status === "Active").length;
  const maintenanceCount = buses.filter(
    (b) => b.status === "Maintenance"
  ).length;
  const totalCapacity = buses.reduce((sum, b) => sum + b.capacity, 0);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex flex-1 flex-row-reverse">
            <Button onClick={() => setIsAddBusOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Add New Bus
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <div className="size-2 rounded-full bg-chart-3" />
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

        {/* Fleet Table */}
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
                  {/* <TableHead>Model</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuses.map((bus) => (
                  <TableRow
                    key={bus.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(bus)}
                  >
                    <TableCell className="font-mono font-medium">
                      {bus.plate_number}
                    </TableCell>
                    {/* <TableCell>{bus.model}</TableCell> */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(bus.status)}
                      >
                        {bus.status}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
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
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(bus.id, "Active");
                            }}
                          >
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(bus.id, "Maintenance");
                            }}
                          >
                            Set Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(bus.id, "Deactivated");
                            }}
                          >
                            Deactivate
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
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
                        value={selectedBus.plate_number}
                        onChange={(e) =>
                          handleUpdateBus({
                            ...selectedBus,
                            plate_number: e.target.value,
                          })
                        }
                        className="font-mono"
                      />
                    </div>

                    <div className="space-y-2">
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
                    </div>
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
                        {Math.ceil(selectedBus.capacity / 4)} rows × 4 columns
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
                        {selectedBus.seats.map((seat, idx) => (
                          <div
                            key={idx}
                            className="flex aspect-square items-center justify-center rounded-md border border-border bg-card text-xs font-medium"
                          >
                            {idx + 1}
                          </div>
                        ))}
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
            <DialogDescription>
              Step {addBusStep} of 2:{" "}
              {addBusStep === 1
                ? "Vehicle Specifications"
                : "Seat Configuration"}
            </DialogDescription>
          </DialogHeader>
          {addBusStep === 1 ? (
            <div className="flex-1 space-y-4 py-4 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="new-license">License Plate</Label>
                <Input
                  id="new-license"
                  placeholder="MH-12-XX-0000"
                  value={newBus.plate_number}
                  onChange={(e) =>
                    setNewBus({ ...newBus, plate_number: e.target.value })
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

              {/* <div className="space-y-2">
                <Label htmlFor="new-facilities">
                  Facilities (comma-separated)
                </Label>
                <Input
                  id="new-facilities"
                  placeholder="AC, WiFi, USB Charging"
                  onChange={(e) =>
                    setNewBus({
                      ...newBus,
                      facilities: e.target.value
                        .split(",")
                        .map((f) => f.trim()),
                    })
                  }
                />
              </div> */}
            </div>
          ) : (
            <div className="space-y-4 py-4 overflow-auto">
              <div className="space-y-2">
                <Label htmlFor="new-capacity">Seating Capacity</Label>
                <Input
                  id="new-capacity"
                  type="number"
                  min="20"
                  max="60"
                  value={newBus.capacity}
                  onChange={(e) =>
                    setNewBus({
                      ...newBus,
                      capacity: Number.parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Layout will be generated as {Math.ceil(newBus.capacity / 4)}{" "}
                  rows × 4 columns
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center justify-center">
                  <div className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium">
                    Driver
                  </div>
                </div>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                >
                  {Array.from(
                    { length: Math.min(newBus.capacity, 16) },
                    (_, i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-md border border-border bg-card text-xs font-medium"
                      >
                        {i + 1}
                      </div>
                    )
                  )}
                </div>
                {newBus.capacity > 16 && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    + {newBus.capacity - 16} more seats
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            {addBusStep === 2 && (
              <Button variant="outline" onClick={() => setAddBusStep(1)}>
                Back
              </Button>
            )}
            {addBusStep === 1 ? (
              <Button
                onClick={() => setAddBusStep(2)}
                disabled={!newBus.plate_number}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleAddBus}>Add Bus</Button>
            )}
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
