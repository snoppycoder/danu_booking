"use client";
import { useEffect, useState } from "react";
import db from "./dixiedb";
import { Notification } from "./dixiedb";
import { useAuth } from "./authContext";
// your typed Dexie DB

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      const all = (await db.notifications.toArray()).filter(
        (notification) => notification.user_id === user?.id,
      );
      setNotifications(all);
    };

    fetchNotifications();

    // Listen for changes on the notifications table
    const onCreate = () => fetchNotifications();
    const onUpdate = () => fetchNotifications();
    const onDelete = () => fetchNotifications();

    db.notifications.hook.creating.subscribe(onCreate);
    db.notifications.hook.updating.subscribe(onUpdate);
    db.notifications.hook.deleting.subscribe(onDelete);

    return () => {
      db.notifications.hook.creating.unsubscribe(onCreate);
      db.notifications.hook.updating.unsubscribe(onUpdate);
      db.notifications.hook.deleting.unsubscribe(onDelete);
    };
  }, []);

  return notifications;
};
