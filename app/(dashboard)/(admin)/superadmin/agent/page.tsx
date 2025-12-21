import AgentList from "@/components/AgentList";
import OperatorList from "@/components/OperatorList";

export default function AgentPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <AgentList />
          </div>
        </main>
      </div>
    </div>
  );
}
