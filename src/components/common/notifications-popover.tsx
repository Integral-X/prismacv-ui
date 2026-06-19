"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { initialDashboardNotifications } from "./notifications-data";
import { NotificationsPanel } from "./notifications-panel";

interface NotificationsPopoverProps {
  triggerClassName?: string;
  bellClassName?: string;
}

export function NotificationsPopover({
  triggerClassName,
  bellClassName,
}: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => initialDashboardNotifications.filter((item) => !item.read).length,
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "relative text-content-secondary hover:bg-transparent hover:text-content-primary",
            unreadCount > 0 && "text-primary",
            triggerClassName
          )}
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className={cn("size-5 shrink-0", bellClassName)} />
          {unreadCount > 0 ? (
            <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,380px)] border-0 bg-transparent p-0 shadow-none"
      >
        <NotificationsPanel variant="popover" onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
