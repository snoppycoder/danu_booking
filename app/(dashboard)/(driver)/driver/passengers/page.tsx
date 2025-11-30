"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
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
export default function Passenger() {
  useEffect(() => {
    //api call to fetch passengers data
  }, []);

  const [data_, setData] = useState(data);
  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const query = e.currentTarget.value.toLowerCase();
    const res = data.filter((d) => d.name.toLowerCase().includes(query));
    setData(res);
  }

  function handleDownload(
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ): void {
    event.stopPropagation();
    // generate the csv and create a a.download link
  }

  return (
    <div className="w-full min-h-screen ">
      <h1 className="font-semibold text-xl text-center">Passenger List</h1>
      <div className="relative w-full max-w-sm my-4 flex justify-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search..."
          className="pl-10 w-full"
          onInput={handleInput}
        />
      </div>

      <Table className="mt-4 w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Passenger Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Contact
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Pickup Location
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Drop Location
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Download CSV
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data_.map((passenger, index) => (
            <TableRow
              key={index}
              className={`transition-colors duration-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <TableCell className="px-6 py-3 text-sm text-gray-800">
                {passenger.name}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-gray-800">
                {passenger.contact}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-gray-800">
                {passenger.pickup}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-gray-800">
                {passenger.drop}
              </TableCell>
              <TableCell
                className="flex justify-center px-6 py-3 text-sm text-gray-800"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
