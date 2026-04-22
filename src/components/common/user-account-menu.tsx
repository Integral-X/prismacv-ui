"use client";

import { LogOut, Settings } from "lucide-react";

import { logoutUserAction } from "@/modules/auth/data/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { NavbarUser } from "./navbar-client";

function getUserInitials(user: NavbarUser): string {
  const nameParts = user.name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (nameParts.length > 0) {
    return nameParts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return user.email.slice(0, 2).toUpperCase();
}

export function UserAccountMenu({ user }: { user: NavbarUser }) {
  const initials = getUserInitials(user);
  const displayName = user.name?.trim() || "PrismaCV user";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full p-0"
          aria-label="Open user menu"
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="flex items-center gap-3 border-b p-4">
          <Avatar className="h-11 w-11 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="p-2">
          <Button
            variant="ghost"
            className="h-10 w-full justify-start px-2"
            asChild
          >
            <a href="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </a>
          </Button>

          <form action={logoutUserAction}>
            <Button
              type="submit"
              variant="ghost"
              className="h-10 w-full justify-start px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
