"use client";
import { SearchTicketForm } from "@/components/AgentSearchTicket";
import { AgentSideBar } from "@/components/AgentSideBar";
import OperatorSalesLineChart from "@/components/OperatorAgentReport";
import { useOperatorAgentReportData } from "@/components/Query";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/authContext";

export default function OperatorAgentPage() {
  const { user } = useAuth();
  const daySetter = (back_in_days: number) => {
    const today = new Date();
    today.setDate(today.getDate() - back_in_days);
    today.setHours(0, 0, 0, 0);

    return today.toLocaleDateString("en-CA");
  };
  const { data, isLoading } = useOperatorAgentReportData(
    user?.organization_id || "",
    daySetter(60),
    daySetter(0),
  );

  if (isLoading || (user?.organization_id ?? "").length == 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-linear-to-r from-green-50/99 to-teal-50/90 p-4">
      {/* Main Content */}
      <div className="flex flex-col w-full">
        <SearchTicketForm link={"operator-agent"} />
      </div>
      <OperatorSalesLineChart data={data!} />
    </div>
  );
}
