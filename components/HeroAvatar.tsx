"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { onLogout } from "@/lib/common_functions";
import { useAuth } from "@/lib/authContext";
import { usePathname } from "next/navigation";

export default function AvatarHero() {
  const router = useRouter();
  const { user } = useAuth();
  const path = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={user?.avatar_file_id} alt={user?.display_name} />
          <AvatarFallback>
            {user?.first_name[0].toUpperCase()}
            {user?.last_name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            router.replace(`/profile?from=${path}`);
          }}
          className="text-black cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        {user?.roles[0] == "passenger" && (
          <DropdownMenuItem
            onClick={() => {
              router.replace(`/history?from=${path}`);
            }}
            className="text-black cursor-pointer"
          >
            History
          </DropdownMenuItem>
        )}
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
