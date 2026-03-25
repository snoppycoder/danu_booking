"use client";
import { ChangePasswordForm } from "@/components/ChangePassword";
import { DeleteAccountButton } from "@/components/DeleteAccount";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateUserForm } from "@/components/UpdateUser";
import { useAuth } from "@/lib/authContext";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function ProfilePageClient() {
  const router = useRouter();
  const data = useSearchParams();

  return (
    <div className="relative min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <Button
        onClick={() => {
          router.replace(data.get("from") || "/");
        }}
        variant="secondary"
        className="absolute top-8 left-8"
      >
        <ArrowLeft className=" w-5 h-5 " />
      </Button>

      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Update User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateUserForm />
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
