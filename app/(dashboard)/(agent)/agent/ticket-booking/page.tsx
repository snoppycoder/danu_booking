import { SearchTicketForm } from "@/components/AgentSearchTicket";
import { AgentSideBar } from "@/components/AgentSideBar";

export default function Page() {
  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <SearchTicketForm />
        </div>
      </div>
    </div>
  );
}
