"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { onLogout } from "@/lib/common_functions";

export default function AvatarHero() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          {/* <AvatarImage src={user.avatarUrl} alt={user.name} /> */}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            router.replace("/manage-sessions");
          }}
          className="text-black cursor-pointer"
        >
          Manage Sessions
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
