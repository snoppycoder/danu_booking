import { useState } from "react";
import { TableCell } from "./ui/table";

export function TicketIdCell({ id }: { id: string }) {
  const [showFull, setShowFull] = useState(false);
  const displayId = showFull ? id : id.slice(0, 8) + "..."; // truncate first 8 chars

  return (
    <TableCell
      className="p-4 font-semibold text-primary cursor-pointer"
      onClick={() => setShowFull(!showFull)}
      title={id}
    >
      {displayId}
    </TableCell>
  );
}