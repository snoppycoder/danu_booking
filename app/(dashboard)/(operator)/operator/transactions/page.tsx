"use client";

import { useOperatorTransactions } from "@/components/Query";
import { useAuth } from "@/lib/authContext";
import { formatCurrency, formatDate } from "@/lib/report-utils";

import { tr } from "date-fns/locale";
import { motion } from "framer-motion";

type Props = {
  tx: {
    id: string;
    agent_id?: string;
    operator_id?: string;
    paid_by_id: string;
    paid_amount: number;
    paid_date: string;
    transaction_id: string;
  };
};
function TransactionCard({ tx }: Props) {
  const statColor = () => {
    const val = tx.transaction_id.length == 0 ? "bg-red-500" : "bg-green-500";
    return val;
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/70 backdrop-blur-lg border border-gray-200 
                 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-sm text-gray-800">
          Transaction ID:{" "}
          {tx.transaction_id.length == 0 ? "N/A" : tx.transaction_id}
        </h2>

        <span
          className={`text-xs py-1 px-2 rounded-full text-white font-semibold ${statColor()}`}
        >
          {tx.transaction_id.length == 0 ? "Not Paid" : "Paid"}
        </span>
      </div>

      {/* Amount */}
      <p className="text-2xl font-bold text-teal-800 mb-2">
        {formatCurrency(tx.paid_amount)}
      </p>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>Paid by: {tx.paid_by_id.slice(0, 8)}...</p>

        {tx.agent_id && <p>Agent: {tx.agent_id.slice(0, 8)}...</p>}
        {tx.operator_id && <p>Operator: {tx.operator_id.slice(0, 8)}...</p>}

        <p className="text-gray-400 text-xs">{formatDate(tx.paid_date)}</p>
      </div>
    </motion.div>
  );
}

function TransactionsList({ operatorId }: { operatorId: string }) {
  const { data, isLoading, isError } = useOperatorTransactions(operatorId);
  console.log(data);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">Error loading data</div>
    );
  }

  if (!data?.length) {
    return <div className="text-center py-10">No transactions</div>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {data.map((tx) => (
        <TransactionCard key={tx.id} tx={tx} />
      ))}
    </div>
  );
}

export default function TranscationPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-500">Track all operator payments</p>
      </div>

      {/* Cards */}
      <TransactionsList operatorId={user?.organization_id || ""} />
    </main>
  );
}
