import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function OperatorAgentBooked() {
  return (
    <div className="">
      <Toaster richColors position="top-right" />
      <div className="mb-1 p-4 border-b border-gray-300 pt-4">
        <SidebarTrigger />
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">Booked Tickets</h2>
        <p>Manage the tickets you booked to passengers.</p>
      </div>
      <div className="p-4 mt-2">Here is the table</div>
    </div>
  );
}
