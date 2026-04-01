"use client";

import { useOperatorAgent, useOperatorTransactions } from "@/components/Query";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/authContext";
import { formatCurrency, formatDate } from "@/lib/report-utils";

import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  tx: {
    id: string;
    agent_id?: string;
    operator_id?: string;
    paid_by: {
      id?: string;
      name?: string;
    };
    paid_amount: number;
    paid_date: string;
    transaction_id: string;
  };
};
function TransactionCard({ tx }: Props) {
  const statColor = () => {
    const val = tx?.transaction_id.length == 0 ? "bg-red-500" : "bg-green-500";
    return val;
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/70 z-0 backdrop-blur-lg border border-gray-200 
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
        <p>Paid by: {tx.paid_by.name}</p>

        {tx.agent_id && <p>Agent: {tx.agent_id.slice(0, 8)}...</p>}

        <p className="text-gray-400 text-xs">{formatDate(tx.paid_date)}</p>
      </div>
    </motion.div>
  );
}

function TransactionsList({
  isLoading,
  isError,
  data,
  operatorId,
}: {
  isLoading: boolean;
  isError: boolean;
  data: {
    id: string;
    agent_id: string;
    paid_by: {
      id?: string;
      name?: string;
    };
    paid_amount: number;
    paid_date: string;
    transaction_id: string;
    created_at: string;
    updated_at: string;
  }[];
  operatorId: string;
}) {
  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center ">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">Error loading data</div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No transactions. Please adjust your filter options
      </div>
    );
  }

  return (
    <div className="mt-4.5 py-10 grid gap-6 grid-cols-1 md:grid-cols-2">
      {data.map((tx) => (
        <TransactionCard key={tx.id} tx={tx} />
      ))}
    </div>
  );
}

export default function TranscationPage() {
  const { user } = useAuth();
  const [agent, setAgent] = useState("");
  const operatorId = user?.organization_id || "";
  const { data, isLoading, isError } = useOperatorTransactions(
    operatorId,
    agent.trim().length == 0 || agent == "null" ? undefined : agent,
  );
  console.log(data, "transactions");
  const { data: operatorAgents } = useOperatorAgent(
    user?.organization_id || "",
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500 mt-2.5">
            Track all operator-agents payments
          </p>
        </div>

        {/* Right side (Filter) */}
        <div>
          <Select value={agent} onValueChange={setAgent}>
            <SelectTrigger className="w-[220px] border border-gray-300 bg-white/70 backdrop-blur-sm hover:bg-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              <SelectValue placeholder="Filter by Paid By" />
            </SelectTrigger>

            <SelectContent>
              {!operatorAgents || operatorAgents?.items.length == 0 ? (
                <div className="p-4 z-50 text-sm text-gray-500">
                  No agents found
                </div>
              ) : (
                <>
                  <SelectItem value="null" className="bg-white z-10 text-black">
                    All Agents
                  </SelectItem>
                  {operatorAgents.items.map((agent) => (
                    <SelectItem
                      key={agent.id}
                      value={agent.id}
                      className="bg-white z-10 text-black"
                    >
                      {agent.first_name} {agent.last_name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards */}
      <TransactionsList
        isLoading={isLoading}
        isError={isError}
        data={data!}
        operatorId={user?.organization_id || ""}
      />
    </main>
  );
}
