"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { Session } from "@/lib/model";
import { useSession } from "@/components/Query";
import { sessionMgmt } from "@/app/api/api";
import { useRouter } from "next/navigation";
import { formatTime } from "@/lib/common_functions";

export default function SessionManager() {
  const { data = [], isLoading, refetch } = useSession();

  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    setSessions(data);
  }, [data]);
  const getDeviceIcon = (type: Session["deviceType"]) => {
    switch (type) {
      case "desktop":
        return <Monitor className="h-5 w-5" />;
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast("The session has been successfully terminated.");
  };

  const handleRevokeAll = async () => {
    // Keep only the current session
    await sessionMgmt.revokeAllSession();
    toast("All sessions revoked");
    window.location.href = "/login";

    // setSessions((prev) => prev.filter((s) => s.isCurrent));
  };
  async function handleRevokeOther(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();

    await sessionMgmt.revokeOtherSession();
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  }

  const router = useRouter();

  const activeSessionCount = sessions.length;
  const otherSessionCount = sessions.filter((s) => !s.isCurrent).length;
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="relative inset-0 w-full mx-auto p-2 md:p-12">
      {/* Header with back button */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 absolute top-2.5 left-2.5"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft className="h-15 w-15" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Active Sessions
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage and monitor all devices currently signed into your account
          </p>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {activeSessionCount}{" "}
              {activeSessionCount === 1 ? "session" : "sessions"} active
            </span>
          </div>
        </div>

        {otherSessionCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Revoke All Sessions</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke all other sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out of all devices including the current
                  one. You'll need to sign in again on those devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevokeAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Revoke All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {otherSessionCount > 1 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Revoke All Other Sessions</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke all other sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out of all devices excluding the current
                  one. You'll need to sign in again on those devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevokeOther}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Revoke other
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="overflow-hidden border-border bg-card transition-colors hover:border-muted-foreground/20"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {getDeviceIcon(session.deviceType)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">
                      {session.user_agent}
                    </h3>
                    {session.isCurrent && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{session.location ?? "Ethiopia, Addis Ababa"}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatTime(session.last_seen_at)}</span>
                    </div>
                  </div>

                  <div className="text-xs  text-black">
                    IP: {session.ip_address}
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 bg-transparent"
                    >
                      Revoke
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will sign you out of{" "}
                        <strong>{session.user_agent}</strong>. You'll need to
                        sign in again on that device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRevokeSession(session.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Revoke Session
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Security notice */}
      <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">Security tip</p>
            <p className="text-muted-foreground">
              If you notice any unfamiliar sessions, revoke them immediately and
              consider changing your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
