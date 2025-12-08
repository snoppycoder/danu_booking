import { Users, FileText, DollarSign, User } from "lucide-react";

export default function StatCards() {
  const stats = [
    {
      title: "Total Trip",
      value: "4",
      icon: Users,
      gradient: "from-cyan-400 to-red-500",
      accentColor: "from-teal-500 to-pink-600",
    },
    {
      title: "Total Ticket Booking",
      value: "0",
      icon: FileText,
      gradient: "from-purple-700 to-red-500",
      accentColor: "from-purple-800 to-red-600",
    },
    {
      title: "Total Booking Amount",
      value: "0",
      icon: DollarSign,
      gradient: "from-blue-500 to-purple-600",
      accentColor: "from-blue-600 to-purple-700",
    },
    {
      title: "Total Passenger",
      value: "0",
      icon: User,
      gradient: "from-teal-500 to-emerald-500",
      accentColor: "from-teal-600 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-6 text-white relative overflow-hidden bg-gradient-to-br ${stat.gradient} min-h-40`}
        >
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-4xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className="w-12 h-12 opacity-80" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-1 w-12 bg-white rounded-full"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
