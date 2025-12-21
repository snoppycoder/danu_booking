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

type DriverStatus = "Active" | "On Leave" | "Inactive";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: DriverStatus;
  experience: number;
  assignedBus: string | null;
  joinDate: string;
  rating: number;
}

const initialDrivers: Driver[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    licenseNumber: "DL-0720230001234",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@fleetops.com",
    status: "Active",
    experience: 12,
    assignedBus: "MH-12-AB-1234",
    joinDate: "2015-03-15",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Amit Sharma",
    licenseNumber: "DL-0720230002345",
    phone: "+91 98765 43211",
    email: "amit.sharma@fleetops.com",
    status: "Active",
    experience: 8,
    assignedBus: "MH-12-CD-5678",
    joinDate: "2018-07-22",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Prakash Yadav",
    licenseNumber: "DL-0720230003456",
    phone: "+91 98765 43212",
    email: "prakash.yadav@fleetops.com",
    status: "On Leave",
    experience: 15,
    assignedBus: null,
    joinDate: "2012-11-08",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Suresh Patil",
    licenseNumber: "DL-0720230004567",
    phone: "+91 98765 43213",
    email: "suresh.patil@fleetops.com",
    status: "Active",
    experience: 10,
    assignedBus: "MH-12-GH-3456",
    joinDate: "2016-05-19",
    rating: 4.7,
  },
  {
    id: "5",
    name: "Vijay Singh",
    licenseNumber: "DL-0720230005678",
    phone: "+91 98765 43214",
    email: "vijay.singh@fleetops.com",
    status: "Active",
    experience: 6,
    assignedBus: null,
    joinDate: "2020-02-10",
    rating: 4.5,
  },
];

const busOptions = [
  { id: "1", licensePlate: "MH-12-AB-1234", model: "Volvo 9400" },
  { id: "2", licensePlate: "MH-12-CD-5678", model: "Mercedes-Benz Travego" },
  { id: "3", licensePlate: "MH-12-EF-9012", model: "Scania Touring" },
  { id: "4", licensePlate: "MH-12-GH-3456", model: "MAN Lion's Coach" },
];

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [isAssignBusOpen, setIsAssignBusOpen] = useState(false);
  const [driverToAssign, setDriverToAssign] = useState<string | null>(null);

  // New driver form state
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    experience: 0,
    joinDate: new Date().toISOString().split("T")[0],
  });

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (driverId: string, newStatus: DriverStatus) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === driverId ? { ...driver, status: newStatus } : driver
      )
    );
  };

  const handleDeleteDriver = () => {
    if (driverToDelete) {
      setDrivers((prev) =>
        prev.filter((driver) => driver.id !== driverToDelete)
      );
      setDriverToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddDriver = () => {
    const driver: Driver = {
      id: String(drivers.length + 1),
      ...newDriver,
      status: "Active",
      assignedBus: null,
      rating: 4.0,
    };
    setDrivers((prev) => [...prev, driver]);
    setIsAddDriverOpen(false);
    setNewDriver({
      name: "",
      licenseNumber: "",
      phone: "",
      email: "",
      experience: 0,
      joinDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === updatedDriver.id ? updatedDriver : driver
      )
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
            : driver
        )
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

  const activeCount = drivers.filter((d) => d.status === "Active").length;
  const onLeaveCount = drivers.filter((d) => d.status === "On Leave").length;
  const assignedCount = drivers.filter((d) => d.assignedBus !== null).length;
  const avgExperience = Math.round(
    drivers.reduce((sum, d) => sum + d.experience, 0) / drivers.length
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
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
              <div className="text-2xl font-bold">{drivers.length}</div>
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
                  <TableHead>Assigned Bus</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow
                    key={driver.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(driver)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{driver.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {driver.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.licenseNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(driver.status)}
                      >
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{driver.experience} years</TableCell>
                    <TableCell>
                      {driver.assignedBus ? (
                        <span className="font-mono text-sm">
                          {driver.assignedBus}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={selectedDriver.name}
                        onChange={(e) =>
                          handleUpdateDriver({
                            ...selectedDriver,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
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
                      </div>
                    </div>
                    <div className="space-y-2">
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={selectedDriver.joinDate}
                        onChange={(e) =>
                          handleUpdateDriver({
                            ...selectedDriver,
                            joinDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="professional" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input
                        id="license"
                        value={selectedDriver.licenseNumber}
                        onChange={(e) =>
                          handleUpdateDriver({
                            ...selectedDriver,
                            licenseNumber: e.target.value,
                          })
                        }
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
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
                    </div>
                    <div className="space-y-2">
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
                    </div>
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
                value={newDriver.name}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, name: e.target.value })
                }
                placeholder="Enter driver's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-license">License Number</Label>
              <Input
                id="new-license"
                value={newDriver.licenseNumber}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, licenseNumber: e.target.value })
                }
                placeholder="DL-XXXXXXXXXX"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-joinDate">Join Date</Label>
              <Input
                id="new-joinDate"
                type="date"
                value={newDriver.joinDate}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, joinDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDriverOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDriver}
              disabled={
                !newDriver.name || !newDriver.licenseNumber || !newDriver.email
              }
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
