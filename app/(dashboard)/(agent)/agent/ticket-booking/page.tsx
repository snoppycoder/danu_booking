import { SearchTicketForm } from "@/components/AgentSearchTicket";

export default function Page() {
  return (
    <div className="flex  w-full h-full">
      <div className="flex flex-col flex-1  w-full">
        <SearchTicketForm link={"agent"} />
      </div>
    </div>
  );
}
