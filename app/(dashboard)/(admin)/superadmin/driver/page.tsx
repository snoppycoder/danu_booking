"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Download } from "lucide-react";
const data: {
  name: string;
  contact: string;
  pickup: string;
  drop: string;
}[] = [
  {
    name: "John Doe",
    contact: "0123456789",
    pickup: "Location A",
    drop: "Location B",
  },
  {
    name: "Jane Smith",
    contact: "0987654321",
    pickup: "Location C",
    drop: "Location D",
  },
  {
    name: "Alice Johnson",
    contact: "0112233445",
    pickup: "Location E",
    drop: "Location F",
  },
  {
    name: "Bob Brown",
    contact: "0556677889",
    pickup: "Location G",
    drop: "Location H",
  },
];

export default function Driver() {
  function handleDownload(event: React.MouseEvent<HTMLTableCellElement>) {
    event.preventDefault();
    throw new Error("Function not implemented.");
  }

  return (
    <div className="p-4 w-full min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Driver Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 text-center">
          <CardHeader className="text-gray-500 text-sm font-medium">
            Total Trips
          </CardHeader>
          <CardContent className="text-3xl font-bold text-gray-900 mt-2">
            120
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 text-center">
          <CardHeader className="text-gray-500 text-sm font-medium">
            Completed Trips
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600 mt-2">
            95
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 text-center">
          <CardHeader className="text-gray-500 text-sm font-medium">
            Pending Trips
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-500 mt-2">
            20
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 text-center">
          <CardHeader className="text-gray-500 text-sm font-medium">
            Cancelled Trips
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-500 mt-2">
            5
          </CardContent>
        </Card>
      </div>
      <div className="p-2 mt-5 bg-white rounded-lg w-full">
        {" "}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100/80">
                <TableHead className="px-6 py-4 text-gray-700 font-semibold">
                  Passenger Name
                </TableHead>
                <TableHead className="px-6 py-4 text-gray-700 font-semibold">
                  Contact
                </TableHead>
                <TableHead className="px-6 py-4 text-gray-700 font-semibold">
                  Pickup Location
                </TableHead>
                <TableHead className="px-6 py-4 text-gray-700 font-semibold">
                  Drop Location
                </TableHead>
                <TableHead className="px-6 py-4 text-gray-700 font-semibold text-center">
                  Download CSV
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((passenger, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 transition-all border-b"
                >
                  <TableCell className="px-6 py-4 font-medium text-gray-900">
                    {passenger.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">
                    {passenger.contact}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">
                    {passenger.pickup}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">
                    {passenger.drop}
                  </TableCell>
                  <TableCell
                    className="px-6 py-4 flex justify-center"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black transition" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
