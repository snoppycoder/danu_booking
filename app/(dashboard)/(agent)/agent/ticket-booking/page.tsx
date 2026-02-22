import { SearchTicketForm } from "@/components/AgentSearchTicket";
import { AgentSideBar } from "@/components/AgentSideBar";

export default function Page() {
  return (
    <div className="flex  w-full h-full">
      {/* Main Content */}
      <div className="flex flex-col flex-1  w-full">
        <SearchTicketForm />
      </div>
    </div>
  );
}
