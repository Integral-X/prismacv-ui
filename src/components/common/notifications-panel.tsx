"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  initialDashboardNotifications,
  notificationGroupOrder,
  type DashboardNotification,
  type NotificationGroupLabel,
} from "./notifications-data";

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: DashboardNotification;
  onMarkRead: (id: string) => void;
}) {
  const Icon = notification.icon;

  return (
    <button
      type="button"
      onClick={() => onMarkRead(notification.id)}
      className={cn(
        "flex w-full gap-3 px-4 py-3 text-left transition-colors",
        "hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      )}
    >
      <span className="mt-2 flex w-2 shrink-0 justify-center">
        {!notification.read ? (
          <span
            className="size-2 rounded-full bg-primary"
            aria-label="Unread"
          />
        ) : (
          <span className="size-2" aria-hidden />
        )}
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <p className="font-semibold text-content-primary">
          {notification.title}
        </p>
        <p className="mt-0.5 text-sm text-content-secondary">
          {notification.description}
        </p>
        <p className="mt-1 text-xs text-content-muted">
          {notification.timeLabel}
        </p>
      </span>
    </button>
  );
}

function NotificationGroup({
  label,
  items,
  onMarkRead,
}: {
  label: NotificationGroupLabel;
  items: DashboardNotification[];
  onMarkRead: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="bg-surface-page px-4 py-2">
        <p className="text-xs font-semibold tracking-wide text-content-muted uppercase">
          {label}
        </p>
      </div>
      <ul>
        {items.map((notification) => (
          <li
            key={notification.id}
            className="border-b border-subtle last:border-b-0"
          >
            <NotificationRow
              notification={notification}
              onMarkRead={onMarkRead}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface NotificationsPanelProps {
  variant?: "popover" | "page";
  onClose?: () => void;
  className?: string;
}

export function NotificationsPanel({
  variant = "page",
  onClose,
  className,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(
    initialDashboardNotifications
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const grouped = useMemo(
    () =>
      notificationGroupOrder.map((label) => ({
        label,
        items: notifications.filter((item) => item.group === label),
      })),
    [notifications]
  );

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  const listMaxHeight =
    variant === "popover"
      ? "max-h-[min(400px,calc(100svh-14rem))]"
      : "max-h-[min(640px,calc(100svh-16rem))]";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-subtle bg-surface-card shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-subtle px-4 py-3">
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={onClose}
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Back to dashboard"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        )}
        <h2 className="min-w-0 flex-1 text-base font-semibold text-content-primary">
          Notifications
        </h2>
        <Button
          type="button"
          variant="link"
          className="h-auto shrink-0 px-0 text-sm text-primary"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className={cn("min-h-0 overflow-y-auto", listMaxHeight)}>
        {notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-content-secondary">
            You&apos;re all caught up.
          </p>
        ) : (
          grouped.map((group) => (
            <NotificationGroup
              key={group.label}
              label={group.label}
              items={group.items}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>

      {variant === "popover" ? (
        <div className="relative border-t border-subtle p-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/notifications" onClick={onClose}>
              See all
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
