"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Settings,
  Menu,
  X,
  AlertCircle,
  BarChart3,
  Briefcase,
  HelpCircle,
  Luggage,
  Users,
  Zap,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authAPI } from "@/app/api/api";

import AvatarHero from "./HeroAvatar";

export default function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { icon: Zap, label: "Dashboard", href: "/superadmin" },
    { icon: BarChart3, label: "Driver Dashboard", href: "/superadmin/driver" },
    { icon: Briefcase, label: "Ticket Booking", href: "/ticket-booking" },
    { icon: Users, label: "Agent", href: "/superadmin/agent" },
    { icon: Settings, label: "Account", href: "/account" },
    {
      icon: Users,
      label: "Users",
      subItems: [
        { label: "User List", href: "/superadmin/user" },
        { label: "Manage User", href: "/superadmin/user/manage" },
      ],
    },
    {
      icon: Briefcase,
      label: "Operator",

      subItems: [
        { label: "Operator List", href: "/superadmin/operator" },
        { label: "Operator Users", href: "/superadmin/operator/manage" },
      ],
    },
    { icon: BarChart3, label: "Report", href: "/report" },
    { icon: HelpCircle, label: "Inquiry", href: "/inquiry" },
    { icon: Luggage, label: "Luggage", href: "/luggage" },
    { icon: AlertCircle, label: "Settings", href: "/settings" },
  ];

  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative w-full md:min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden w-full flex items-center justify-between p-5 border-b border-b-gray-300">
        <span className="font-bold text-xl hidden lg:inline">Danu Booking</span>

        {/* Toggle Icon */}
        {isOpen ? (
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
        ) : (
          <Menu onClick={() => setIsOpen(true)} className="cursor-pointer" />
        )}
        <AvatarHero />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 z-30 w-64 h-screen flex flex-col gap-y-3 p-2 border-r 
          border-gray-300 bg-white transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 md:flex-shrink-0`}
      >
        <div className="flex flex-1 flex-col gap-y-3 p-2 ">
          <div className="w-full flex gap-x-2.5 my-4 md:mb-5">
            <span className="font-bold text-2xl">Danu Booking</span>
          </div>

          {menuItems.map((link) => {
            const isActive = pathname === link.href;

            // If link has subItems
            if (link.subItems) {
              const isExpanded = expandedMenu === link.label;

              return (
                <div key={link.label} className="flex flex-col">
                  <button
                    onClick={() =>
                      setExpandedMenu(isExpanded ? null : link.label)
                    }
                    className={`flex items-center gap-x-3 px-3 py-2 rounded-xl w-full text-left
                      ${
                        isActive
                          ? "bg-primary text-white"
                          : " hover:bg-primary/90 hover:text-white"
                      }`}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`ml-auto transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col ml-8 mt-1">
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className={`px-3 py-2 rounded-xl text-gray-500  ${
                            pathname === sub.href
                              ? "bg-primary text-white"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Normal menu item
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-x-3 px-3 py-2 rounded-xl transition-colors
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
