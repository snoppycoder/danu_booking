import { OperatorReportDashboard } from "@/components/OperatorReportDashboard";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Operator Reports
          </h1>
          <p className="text-slate-600 mt-2">
            View detailed ticket sales and revenue reports by operator
          </p>
        </div>

        <OperatorReportDashboard />
      </div>
    </div>
  );
}
