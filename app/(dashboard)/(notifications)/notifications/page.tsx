"use client";

import { useNotifications } from "@/lib/notificationhook";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/lib/dixiedb";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
const notificationConfig: Record<string, any> = {
  delay: {
    icon: Clock,
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-l-orange-500",
    iconColor: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 dark:bg-orange-900/50",
    badgeText: "text-orange-800 dark:text-orange-200",
  },
  confirmation: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-l-green-500",
    iconColor: "text-green-600 dark:text-green-400",
    badgeBg: "bg-green-100 dark:bg-green-900/50",
    badgeText: "text-green-800 dark:text-green-200",
  },
  alert: {
    icon: AlertTriangle,
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-l-red-500",
    iconColor: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-100 dark:bg-red-900/50",
    badgeText: "text-red-800 dark:text-red-200",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-l-blue-500",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50",
    badgeText: "text-blue-800 dark:text-blue-200",
  },
};

function NotificationItem({ notification }: { notification: Notification }) {
  const config = notificationConfig[notification.type];
  // const Icon = config?.icon;
  const createdDate = new Date(notification.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div
      className={`border-l-4 
       
         rounded-lg p-4 transition-all hover:shadow-md`}
    >
      <div className="flex gap-4">
        <div className={`shrink-0 mt-0.5`}>
          {/* <Icon className="w-6 h-6" /> */}
        </div>

        <div className="grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="grow">
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {notification.message}
              </p>
            </div>
            <span
              className={`shrink-0 inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
              `}
            >
              {notification.type.charAt(0).toUpperCase() +
                notification.type.slice(1)}
            </span>
          </div>

          {/* Additional details based on notification type */}
          {notification.type === "delay" && notification.data.delay_minutes && (
            <div className="bg-background/50 dark:bg-background/20 rounded-md p-3 mb-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Delay Duration</span>
                <span className="font-semibold text-foreground">
                  {notification.data.delay_minutes} minutes
                </span>
              </div>
              {notification.data.trip_date && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trip Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(notification.data.trip_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {notification.data.trip_id && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trip ID</span>
                  <span className="font-mono text-foreground text-xs">
                    {typeof notification.data.trip_id === "string"
                      ? notification.data.trip_id.slice(0, 8)
                      : ""}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            <span className="text-xs text-muted-foreground opacity-60">
              {new Date(notification.received_at).toLocaleTimeString([], {
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
  const notifications = useNotifications();
  const router = useRouter();
  return (
    <div className="min-h-screen relative bg-background">
      <Button
        variant={"outline"}
        onClick={() => router.back()}
        className="absolute top-4 left-4"
        //className="flex items-center mb-2.5 gap-2 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="lg:max-w-4xl max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="md:mt-6 mt-8 mb-8 flex items-start justify-between">
          <div>
            <h1 className="md:text-3xl text-2xl font-bold text-foreground mb-1">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with all your trip notifications
            </p>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-2xl font-bold text-foreground">
              {notifications.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {notifications.filter((n) => n.type === "delay").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Delays</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {notifications.filter((n) => n.type === "alert").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Alerts</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {notifications.filter((n) => n.type === "confirmation").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Notifications are automatically synced. Last updated just now.
            Please manual sync if you are expecting a notification but don't see
            it here.
          </p>
        </div>
      </div>
    </div>
  );
}
