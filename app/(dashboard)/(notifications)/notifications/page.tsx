"use client";

import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeft,
  Bell,
  Calendar,
  Hash,
  Hourglass,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/lib/dixiedb";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMyNotifications } from "@/components/Query";
import { useEffect } from "react";
import { notificationAPI } from "@/app/api/api";

const notificationConfig: Record<string, any> = {
  delay: {
    icon: Clock,
    bgColor: "bg-orange-100 dark:bg-orange-500/20",
    borderColor: "border-orange-500",
    iconColor: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 dark:bg-orange-500/20",
    badgeText: "text-orange-700 dark:text-orange-300",
  },
  confirmation: {
    icon: CheckCircle,
    bgColor: "bg-green-100 dark:bg-green-500/20",
    borderColor: "border-green-500",
    iconColor: "text-green-600 dark:text-green-400",
    badgeBg: "bg-green-100 dark:bg-green-500/20",
    badgeText: "text-green-700 dark:text-green-300",
  },
  alert: {
    icon: AlertTriangle,
    bgColor: "bg-red-100 dark:bg-red-500/20",
    borderColor: "border-red-500",
    iconColor: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-100 dark:bg-red-500/20",
    badgeText: "text-red-700 dark:text-red-300",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    borderColor: "border-blue-500",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-100 dark:bg-blue-500/20",
    badgeText: "text-blue-700 dark:text-blue-300",
  },
};

function NotificationItem({ notification }: { notification: Notification }) {
  // Fallback to 'info' if the type is somehow missing from the config
  const config =
    notificationConfig[notification.type] || notificationConfig.info;
  const Icon = config.icon;

  const createdDate = new Date(notification.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div
      className={`relative group overflow-hidden border border-border/50 bg-card rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:border-border ${
        !notification.is_read ? "shadow-sm ring-1 ring-primary/10" : ""
      }`}
    >
      {/* Left colored accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bgColor}`} />

      <div className="flex gap-4 sm:gap-5">
        {/* Icon Container */}
        <div className="shrink-0">
          <div
            className={`p-3 rounded-full ${config.bgColor} ${config.iconColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="grow min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3
              className={`font-semibold text-base ${!notification.is_read ? "text-foreground" : "text-foreground/80"}`}
            >
              {notification.title}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase ${config.badgeBg} ${config.badgeText}`}
              >
                {notification.type}
              </span>
              {!notification.is_read && (
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  title="Unread"
                />
              )}
            </div>
          </div>

          {/* Message Body */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {notification.message}
          </p>

          {/* Conditional Delay Data Details */}
          {notification.type === "delay" && notification.data && (
            <div className="bg-muted/50 rounded-lg p-3.5 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-border/50">
              {notification.data.delay_minutes && (
                <div className="flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-orange-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                      Delay
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {notification.data.delay_minutes} mins
                    </span>
                  </div>
                </div>
              )}
              {notification.data.trip_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                      Date
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(notification.data.trip_date).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>
              )}
              {notification.data.trip_id && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                      Trip Ref
                    </span>
                    <span className="text-sm font-mono font-medium text-foreground uppercase">
                      {typeof notification.data.trip_id === "string"
                        ? notification.data.trip_id.slice(0, 8)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Timestamps */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span>{timeAgo}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>
              {new Date(notification.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data: notifications } = useMyNotifications();
  const router = useRouter();

  useEffect(() => {
    const readAll = async () => {
      const res = await notificationAPI.readAllNotifications();
    };
    readAll();
  }, [notifications]);

  const totalItems = notifications?.items || [];
  const delayCount = totalItems.filter(
    (n: Notification) => n.type === "delay",
  ).length;
  const alertCount = totalItems.filter(
    (n: Notification) => n.type === "alert",
  ).length;
  const confirmationCount = totalItems.filter(
    (n: Notification) => n.type === "confirmation",
  ).length;

  return (
    <div className="min-h-screen relative bg-background/50 selection:bg-primary/20">
      {/* Back Button pinned to Top Left */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="absolute top-4 left-4 md:top-6 md:left-6 text-muted-foreground hover:text-foreground z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Increased top padding here (py-14 sm:py-16) to clear the absolute button */}
      <div className="lg:max-w-4xl max-w-2xl mx-auto px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-3">
              Notifications
              {totalItems.filter((n: Notification) => !n.is_read).length >
                0 && (
                <span className="flex items-center justify-center bg-primary text-primary-foreground text-sm font-bold w-7 h-7 rounded-full">
                  {totalItems.filter((n: Notification) => !n.is_read).length}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">
              Stay updated with your latest trip alerts and confirmations.
            </p>
          </div>
        </div>

        {/* Notification Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Bell className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Total
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {totalItems.length}
            </div>
          </div>

          <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Delays
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">
              {delayCount}
            </div>
          </div>

          <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-100 dark:border-red-900 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Alerts
              </span>
            </div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">
              {alertCount}
            </div>
          </div>

          <div className="bg-green-50/50 dark:bg-green-950/20 rounded-xl p-4 border border-green-100 dark:border-green-900 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Confirmed
              </span>
            </div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">
              {confirmationCount}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {totalItems.length > 0 ? (
            totalItems.map((notification: Notification, index: number) => (
              <div
                key={notification.id}
                className="animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NotificationItem notification={notification} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Bell className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                All caught up!
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                You don't have any notifications right now. When you do, they'll
                appear right here.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Info className="w-4 h-4" />
          <p>Notifications are synced automatically. Last updated just now.</p>
        </div>
      </div>
    </div>
  );
}
