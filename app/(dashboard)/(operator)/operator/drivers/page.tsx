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
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useCreateDriver, useDrivers } from "@/components/Query";
import { Driver, DriverCreateDTO } from "@/lib/model";
import { set } from "zod";
import { operatorApi } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import { isAxiosError } from "axios";
import { Spinner } from "@/components/ui/spinner";
import { TicketIdCell } from "@/components/TruncatedId";

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
  const [showPassword, setShowPassword] = useState<boolean>();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useDrivers(
    user?.organization_id!,
  );
  const [drivers, setDrivers] = useState<Driver[]>(data ?? []);
  const { mutate, isSuccess } = useCreateDriver();
  const [fullName, setFullName] = useState(
    `${selectedDriver?.first_name || ""} ${selectedDriver?.last_name || ""}`,
  );

  // New driver form state
  const [newDriver, setNewDriver] = useState<DriverCreateDTO>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
  });

  const filteredDrivers =
    data?.filter(
      (driver) =>
        driver.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const isPageLoading = isLoading || !user?.organization_id;

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
        toast.error(
          error.response?.data.error ||
            "The driver is associated with an active trip(s)",
        );
      }
    }
  };

  const handleAddDriver = async () => {
    try {
      console.log(newDriver);
      await operatorApi.createDriver(newDriver, user?.organization_id || "");

      toast.success("Successfully invited the driver");
      setIsAddDriverOpen(false);
    } catch (error) {
      console.log(error, "error");
      if (isAxiosError(error)) {
        const msg =
          error.response?.data?.detail?.reasons?.[0] ||
          error.response?.data?.detail?.[0]?.msg ||
          error.response?.data?.error;
        if (typeof msg == "string") {
          toast.error(msg);
          return;
        }
        toast.error("Error occured while trying to process your request");
      }
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

  const activeCount = 0;
  const onLeaveCount = 0;
  const assignedCount = 0;
  const avgExperience = 0;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Toaster position="top-right" richColors />
      <div className="flex mb-2 w-full justify-between h-16 items-center gap-4 px-6">
        <SidebarTrigger />
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setIsAddDriverOpen(true)}
            className="gap-2"
            disabled={isLoading || isError}
          >
            <Plus className="size-4" />
            Add New Driver
          </Button>
        </div>
      </div>

      <div className="px-6">
        <h1 className="text-lg  font-semibold text-foreground">
          Driver Management
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your driver workforce
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 place-content-center grid-cols-2 lg:grid-cols-3">
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
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPageLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 p-0">
                      <div className="flex h-full w-full items-center justify-center">
                        <Spinner />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isPageLoading &&
                  filteredDrivers &&
                  filteredDrivers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-gray-400 text-center"
                      >
                        No drivers found
                      </TableCell>
                    </TableRow>
                  )}
                {filteredDrivers?.map((driver) => (
                  <TableRow
                    key={driver.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(driver)}
                  >
                    <TicketIdCell id={driver.id} />
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {driver.first_name} {driver.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.phone}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver?.email ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>

                    <TableCell>
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
                              handleStatusChange(driver?.id ?? "", "Active");
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
                ))}
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
                      <Label htmlFor="name">First Name</Label>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Emil</Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedDriver.email?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleUpdateDriver({
                          ...selectedDriver,
                          email: e.target.value,
                        })
                      }
                    />
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
            <div className="grid gap-2.5 grid-cols-1 lg:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="first-name">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first-name"
                  required
                  value={newDriver.first_name}
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="last-name">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last-name"
                  required
                  value={newDriver.last_name}
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone-number">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone-number"
                required
                value={newDriver.phone}
                type="tel"
                onChange={(e) =>
                  setNewDriver({ ...newDriver, phone: e.target.value })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newDriver.email}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, email: e.target.value })
                }
                // placeholder="DL-XXXXXXXXXX"
                className="font-mono"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newDriver.password}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, password: e.target.value })
                  }
                  className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  required
                />

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
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
