"use client";
import { Users, FileText, DollarSign, User } from "lucide-react";
import { useSuperAdminStat, useTrips } from "./Query";

import { Skeleton } from "@/components/ui/skeleton";
export default function StatCards() {
  const { data, isLoading } = useSuperAdminStat();

  const stats = [
    {
      title: "Total Trip",
      value: data?.total_trips || "0",
      icon: Users,
      bgGradient: "from-blue-500 to-cyan-500",
      accentGradient: "from-blue-400 to-cyan-400",
      textColor: "text-white",
    },
    {
      title: "Total Ticket Booking",
      value: data?.total_bookings,
      icon: FileText,
      bgGradient: "from-purple-500 to-pink-500",
      accentGradient: "from-purple-400 to-pink-400",
      textColor: "text-white",
    },
    {
      title: "Total Booking Amount",
      value: `${data?.total_amount} ETB`,
      icon: DollarSign,
      bgGradient: "from-emerald-500 to-teal-500",
      accentGradient: "from-emerald-400 to-teal-400",
      textColor: "text-white",
    },
    {
      title: "Total Passenger",
      value: data?.total_passengers,
      icon: User,
      bgGradient: "from-orange-500 to-red-500",
      accentGradient: "from-orange-400 to-red-400",
      textColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-default min-h-48 group`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-2">
                <p className="text-sm font-medium opacity-90 text-white tracking-wide ">
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-2 text-white leading-tight">
                  {data ? (
                    stat.value
                  ) : (
                    <Skeleton className="h-12 w-28 rounded-lg opacity-30" />
                  )}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.accentGradient} bg-opacity-30 backdrop-blur-sm`}
              >
                <stat.icon className="w-6 h-6 text-white opacity-90" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white opacity-75">
              <div
                className={`h-1.5 w-8 bg-gradient-to-r ${stat.accentGradient} rounded-full`}
              ></div>
              <span>Updated today</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
