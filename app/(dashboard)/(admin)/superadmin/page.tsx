import Charts from "@/components/charts";
import Sidebar from "@/components/SuperAdminSideBar";

import StatCards from "@/components/stat-card";

export default function SuperAdmin() {
  return (
    <div className="w-full flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <div className="p-6 space-y-6">
            <StatCards />
            <Charts />
          </div>
        </main>
      </div>
    </div>
  );
}
