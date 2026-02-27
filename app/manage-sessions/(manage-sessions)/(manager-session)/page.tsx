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
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
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
import { useSession } from "@/components/Query";
import { sessionMgmt } from "@/app/api/api";
import { toast } from "sonner";
import { Session } from "@/lib/model";
import { useRouter } from "next/navigation";
import SessionManagerSkeleton from "@/components/SessionSkeleton";
import { useAuth } from "@/lib/authContext";

// Mock data for demonstration

export default function SessionManager() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, refetch } = useSession();
  const getDeviceIcon = (type: "desktop" | "mobile" | "tablet") => {
    const iconClass = "h-6 w-6";
    switch (type) {
      case "desktop":
        return <Monitor className={iconClass} />;
      case "mobile":
        return <Smartphone className={iconClass} />;
      case "tablet":
        return <Tablet className={iconClass} />;
    }
  };
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    setSessions(data ?? []);
  }, [data]);
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast("The session has been successfully terminated.");
  };

  const handleRevokeAll = async () => {
    // Keep only the current session
    const res = await sessionMgmt.revokeAllSession();
    toast.success("All sessions revoked");
    window.location.href = "/login";

    // setSessions((prev) => prev.filter((s) => s.isCurrent));
  };
  async function handleRevokeOther(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault();

    await sessionMgmt.revokeOtherSession();
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  }

  const activeSessionCount = sessions?.length ?? 0;
  const otherSessionCount = sessions?.filter((s) => !s.isCurrent).length ?? 0;
  if (isLoading) {
    return <SessionManagerSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="w-full mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="icon"
            className="mb-6 hover:bg-secondary"
            onClick={() => {
              if (user?.roles[0] == "super_admin") {
                router.replace("/superadmin");
                return;
              }
              if (user?.roles[0] == "passenger") {
                router.replace("/passenger");
                return;
              }
              if (user?.roles[0] == "operator_admin") {
                router.replace("/operator");
                return;
              }
              if (user?.roles[0] == "agent_admin") {
                router.replace("/agent/ticket-booking");
                return;
              }
            }}
          >
            <ArrowLeft className="h-10 w-10" />
          </Button>

          <div className="space-y-3">
            <h1 className="text-center text-2xl md:text-5xl font-bold text-foreground">
              Active Sessions
            </h1>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-3xl font-bold text-foreground">
                  {activeSessionCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Other Devices</p>
                <p className="text-3xl font-bold text-foreground">
                  {otherSessionCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-3xl font-bold text-foreground">Just now</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        {otherSessionCount > 0 && (
          <div className="mb-8 flex  flex-col justify-center sm:flex-row gap-3">
            {otherSessionCount > 1 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-border hover:bg-secondary"
                  >
                    Revoke Other Sessions
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">
                      Revoke all other sessions?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will sign you out of all devices except this one. You
                      can sign back in on those devices at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-border">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRevokeOther}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Revoke Sessions
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-destructive text-white hover:bg-destructive/90">
                  Revoke All Sessions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">
                    Sign out everywhere?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This will sign you out of all devices including this one.
                    You'll need to sign in again on all devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRevokeAll}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Sign Out Everywhere
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {sessions.length > 0 ? (
          <div className="space-y-4 mb-12">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={`overflow-hidden border transition-all duration-300 hover:shadow-lg ${
                  session.isCurrent
                    ? "border-primary/30 bg-gradient-to-r from-primary/5 to-transparent"
                    : "border-border/50 hover:border-primary/20"
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Device Info */}
                    <div className="flex gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {getDeviceIcon(session.deviceType)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {session.user_agent}
                          </h3>
                          {session.isCurrent && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
                              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                              Current Device
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>Last active: {session.last_seen_at}</span>
                          </div>
                          <div className="text-xs">
                            IP:{" "}
                            <span className="font-mono">
                              {session.ip_address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!session.isCurrent && (
                      <div className="sm:flex-shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10"
                            >
                              Revoke
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">
                                Revoke this session?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                This will sign you out of{" "}
                                <strong className="text-foreground">
                                  {session.user_agent}
                                </strong>
                                . You can sign back in at any time.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevokeSession(session.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Session
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50 bg-card/50 p-12 text-center mb-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              No active sessions. Sign in to begin.
            </p>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
          <div className="flex gap-4">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Security Tip</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review your sessions regularly and revoke any unfamiliar
                devices. If you notice suspicious activity, we recommend
                changing your password immediately.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
