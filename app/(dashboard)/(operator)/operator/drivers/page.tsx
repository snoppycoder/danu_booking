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
  Phone,
  Mail,
  Award as IdCard,
  Calendar,
  Bus,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useCreateDriver, useDrivers } from "@/components/Query";
import { Driver } from "@/lib/model";
import { set } from "zod";
import { operatorApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";

type DriverStatus = "Active" | "On Leave" | "Inactive";

const busOptions = [
  { id: "1", licensePlate: "MH-12-AB-1234", model: "Volvo 9400" },
  { id: "2", licensePlate: "MH-12-CD-5678", model: "Mercedes-Benz Travego" },
  { id: "3", licensePlate: "MH-12-EF-9012", model: "Scania Touring" },
  { id: "4", licensePlate: "MH-12-GH-3456", model: "MAN Lion's Coach" },
];

export default function DriversManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [isAssignBusOpen, setIsAssignBusOpen] = useState(false);
  const [driverToAssign, setDriverToAssign] = useState<string | null>(null);
  const { user } = useAuth();
  const { data } = useDrivers(user?.organization_id!);
  const [drivers, setDrivers] = useState<Driver[]>(data ?? []);
  const { mutate, isSuccess, error } = useCreateDriver();
  const [fullName, setFullName] = useState(
    `${selectedDriver?.first_name || ""} ${selectedDriver?.last_name || ""}`,
  );

  // New driver form state
  const [newDriver, setNewDriver] = useState<Driver>({
    id: "",
    first_name: "",
    last_name: "",
    license_no: "",
    created_at: "",
    updated_at: "",
    operator_id: user?.organization_id!,
  });

  const filteredDrivers =
    data?.filter(
      (driver) =>
        driver.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  console.log("Filtered Drivers:", filteredDrivers);

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (driverId: string, newStatus: DriverStatus) => {
    setDrivers((prev) =>
      prev?.map((driver) =>
        driver.id === driverId ? { ...driver, status: newStatus } : driver,
      ),
    );
  };

  const handleDeleteDriver = async () => {
    try {
      if (driverToDelete) {
        await operatorApi.deleteDriver(user?.organization_id!, driverToDelete);
        setDrivers((prev) =>
          prev?.filter((driver) => driver.id !== driverToDelete),
        );
        setDriverToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || "The driver is associated with an active trip(s)");
      }
    }
  };

  const handleAddDriver = () => {
    try {
      setDrivers((prev) => [...prev, newDriver]);
      setIsAddDriverOpen(false);
      console.log(newDriver);
      mutate({
        operator_id: user?.organization_id!,
        body: {
          first_name: fullName.split(" ")[0] || "",
          last_name: fullName.split(" ")[1] || "",
          license_no: newDriver.license_no,
        },
      });

      setNewDriver({
        id: "",
        first_name: "",
        last_name: "",
        license_no: "",
        created_at: "",
        updated_at: "",
        operator_id: user?.organization_id!,
      });
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === updatedDriver.id ? updatedDriver : driver,
      ),
    );
    setSelectedDriver(updatedDriver);
  };

  const handleAssignBus = (busId: string) => {
    if (driverToAssign) {
      const bus = busOptions.find((b) => b.id === busId);
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === driverToAssign
            ? { ...driver, assignedBus: bus?.licensePlate || null }
            : driver,
        ),
      );
      setDriverToAssign(null);
      setIsAssignBusOpen(false);
    }
  };

  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case "Active":
        return "bg-primary/20 text-primary border-primary/30";
      case "On Leave":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      case "Inactive":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  // const activeCount = drivers.filter((d) => d. === "Active").length;
  // const onLeaveCount = drivers.filter((d) => d.status === "On Leave").length;
  // const assignedCount = drivers.filter((d) => d.assignedBus !== null).length;
  // const avgExperience = Math.round(
  //   drivers.reduce((sum, d) => sum + d.experience, 0) / drivers.length,
  // );
  const activeCount = 0;
  const onLeaveCount = 0;
  const assignedCount = 0;
  const avgExperience = 0;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Driver Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your driver workforce
              </p>
            </div>
            <Button onClick={() => setIsAddDriverOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Add New Driver
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
              <CardTitle className="text-sm font-medium">
                Total Drivers
              </CardTitle>
              <IdCard className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredDrivers.length}</div>
              <p className="text-xs text-muted-foreground">In workforce</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <div className="size-2 rounded-full bg-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">On duty</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <Bus className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedCount}</div>
              <p className="text-xs text-muted-foreground">With vehicles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Experience
              </CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgExperience} yrs</div>
              <p className="text-xs text-muted-foreground">Fleet average</p>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Driver Overview</CardTitle>
                <CardDescription>
                  View and manage all drivers in your workforce
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, license, or email..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Experience</TableHead>
                  {/* <TableHead>Assigned Bus</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <TableRow
                      key={driver.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(driver)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {driver.first_name} {driver.last_name}
                          </span>
                          {/* <span className="text-xs text-muted-foreground">
                            
                          </span> */}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {driver.license_no}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      {/*  this is fixed for now */}
                      <TableCell>7 years</TableCell>
                      {/* <TableCell>
                      {driver.assignedBus ? (
                        <span className="font-mono text-sm">
                          {driver.assignedBus}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </TableCell> */}
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
                                handleViewDetails(driver);
                              }}
                            >
                              <Edit className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setDriverToAssign(driver.id);
                                setIsAssignBusOpen(true);
                              }}
                            >
                              <Bus className="mr-2 size-4" />
                              Assign Bus
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(driver.id, "Active");
                              }}
                            >
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(driver.id, "On Leave");
                              }}
                            >
                              Set On Leave
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(driver.id, "Inactive");
                              }}
                            >
                              Set Inactive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDriverToDelete(driver.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete Driver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No drivers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Driver Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedDriver && (
            <>
              <SheetHeader>
                <SheetTitle>Driver Details</SheetTitle>
                <SheetDescription>
                  View and edit driver information
                </SheetDescription>
              </SheetHeader>
              <Tabs defaultValue="personal" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="new-name"
                        value={fullName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFullName(value);

                          const names = value.trim().split(" ");
                          const first = names.shift() || "";
                          const last = names.join(" ");
                          setNewDriver((prev) => ({
                            ...prev,
                            first_name: first,
                            last_name: last,
                          }));
                        }}
                        placeholder="Enter driver's full name"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={selectedDriver.email}
                          onChange={(e) =>
                            handleUpdateDriver({
                              ...selectedDriver,
                              email: e.target.value,
                            })
                          }
                          className="pl-8"
                        />
                      </div> */}
                  </div>
                  {/* <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={selectedDriver.phone}
                          onChange={(e) =>
                            handleUpdateDriver({
                              ...selectedDriver,
                              phone: e.target.value,
                            })
                          }
                          className="pl-8"
                        />
                      </div> 
                    </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={selectedDriver.created_at?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleUpdateDriver({
                          ...selectedDriver,
                          created_at: e.target.value,
                        })
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input
                        id="license"
                        value={newDriver.license_no}
                        onChange={(e) =>
                          setNewDriver({
                            ...newDriver,
                            license_no: e.target.value,
                          })
                        }
                        className="font-mono"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={selectedDriver.status}
                        onValueChange={(value: DriverStatus) =>
                          handleUpdateDriver({
                            ...selectedDriver,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={selectedDriver.experience}
                        onChange={(e) =>
                          handleUpdateDriver({
                            ...selectedDriver,
                            experience: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={selectedDriver.rating}
                          onChange={(e) =>
                            handleUpdateDriver({
                              ...selectedDriver,
                              rating: Number.parseFloat(e.target.value),
                            })
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">
                          / 5.0
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned Bus</Label>
                      <div className="flex items-center gap-2">
                        {selectedDriver.assignedBus ? (
                          <Badge variant="secondary" className="font-mono">
                            {selectedDriver.assignedBus}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not assigned
                          </span>
                        )}
                      </div>
                    </div> */}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Driver Dialog */}
      <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Enter the new driver's information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Full Name</Label>
              <Input
                id="new-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => {
                  const names = fullName.trim().split(" ");
                  const first = names.shift() || ""; // first word
                  const last = names.join(" "); // everything else as last name

                  setNewDriver({
                    ...newDriver,
                    first_name: first,
                    last_name: last,
                  });
                }}
                placeholder="Enter driver's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-license">License Number</Label>
              <Input
                id="new-license"
                value={newDriver.license_no}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, license_no: e.target.value })
                }
                placeholder="DL-XXXXXXXXXX"
                className="font-mono"
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="new-phone">Phone Number</Label>
              <Input
                id="new-phone"
                value={newDriver.phone}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, phone: e.target.value })
                }
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email Address</Label>
              <Input
                id="new-email"
                type="email"
                value={newDriver.email}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, email: e.target.value })
                }
                placeholder="driver@fleetops.com"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="new-experience">Experience (years)</Label>
              <Input
                id="new-experience"
                type="number"
                value={newDriver.experience}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    experience: Number.parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="new-joinDate">Join Date</Label>
              <Input
                id="new-joinDate"
                type="date"
                value={newDriver.created_at?.split("T")[0] || ""}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, created_at: e.target.value })
                }
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDriverOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDriver}
              // disabled={
              //   !newDriver.first_name ||
              //   !newDriver.last_name ||
              //   !newDriver.license_no
              // }
            >
              Add Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Bus Dialog */}
      <Dialog open={isAssignBusOpen} onOpenChange={setIsAssignBusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Bus</DialogTitle>
            <DialogDescription>
              Select a bus to assign to this driver
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select onValueChange={handleAssignBus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bus" />
              </SelectTrigger>
              <SelectContent>
                {busOptions.map((bus) => (
                  <SelectItem key={bus.id} value={bus.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{bus.licensePlate}</span>
                      <span className="text-xs text-muted-foreground">
                        - {bus.model}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this driver? This action cannot be
              undone and will permanently remove the driver from your workforce.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDriver}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Driver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
