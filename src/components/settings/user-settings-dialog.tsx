"use client";

import {
  Bell,
  Globe,
  Key,
  Loader2,
  Moon,
  Shield,
  Sun,
  Upload,
  User as UserIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  removeProfileImage,
  updateProfile,
  updateProfileImage,
} from "@/app/actions/settings";
import { ChangePasswordDialog } from "@/components/settings/change-password-dialog";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useUploadThing } from "@/lib/uploadthing";

// ============================================
// USER SETTINGS DIALOG
// ============================================

type UserSettingsDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Component requires complex state management for settings
export function UserSettingsDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
}: UserSettingsDialogProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [internalOpen, setInternalOpen] = useState(false);

  // Profile edit state
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { startUpload } = useUploadThing("avatarUploader", {
    onClientUploadComplete: async (res) => {
      // File uploaded successfully
      if (res?.[0]?.url) {
        const result = await updateProfileImage(res[0].url);
        if (result.success) {
          router.refresh();
        } else {
          setProfileError(result.message);
        }
      }
      setIsUploadingAvatar(false);
    },
    onUploadError: (error: Error) => {
      // Upload failed
      setProfileError(error.message || "Failed to upload image");
      setIsUploadingAvatar(false);
    },
  });

  // Dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Use controlled or uncontrolled state
  const open = controlledOpen ?? internalOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  // Initialize form when dialog opens
  if (open && !name) {
    setName(user.name);
  }

  const getUserInitials = (userName: string) =>
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleSaveProfile = async () => {
    setProfileError("");
    setIsSaving(true);

    const result = await updateProfile({ name, email: user.email });

    setIsSaving(false);

    if (result.success) {
      router.refresh();
    } else {
      setProfileError(result.message);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingAvatar(true);
    setProfileError(""); // Clear previous errors

    try {
      await startUpload([file]);
      // Success/error handled by callbacks above
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    const result = await removeProfileImage();
    setIsUploadingAvatar(false);

    if (result.success) {
      router.refresh();
    }
  };

  const hasChanges = name !== user.name;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs className="px-6 pb-6" defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Globe className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent className="space-y-4" value="profile">
            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage alt={user.name} src={user.image || undefined} />
                  <AvatarFallback className="text-xl">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Profile Picture</h3>
                  <p className="text-muted-foreground text-xs">
                    Upload a new avatar for your account
                  </p>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      disabled={isUploadingAvatar}
                      size="sm"
                      variant="outline"
                    >
                      <label>
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                        <input
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                          type="file"
                        />
                      </label>
                    </Button>
                    {user.image && (
                      <Button
                        disabled={isUploadingAvatar}
                        onClick={handleRemoveAvatar}
                        size="sm"
                        variant="ghost"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <p className="text-muted-foreground text-xs">
                  This is the name that will be displayed on your profile
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input disabled id="email" type="email" value={user.email} />
                <p className="text-muted-foreground text-xs">
                  {user.emailVerified ? (
                    <span className="text-green-600 dark:text-green-500">
                      ✓ Email verified
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-500">
                      ⚠ Email not verified
                    </span>
                  )}
                </p>
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  className="capitalize"
                  defaultValue={user.role || "user"}
                  disabled
                  id="role"
                />
              </div>

              {profileError && (
                <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
                  {profileError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  disabled={isSaving}
                  onClick={() => {
                    setName(user.name);
                    setProfileError("");
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSaving || !hasChanges}
                  onClick={handleSaveProfile}
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent className="space-y-4" value="security">
            <div className="space-y-4">
              {/* Password Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Password</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Change your password to keep your account secure
                </p>
                <Button
                  className="mt-2"
                  onClick={() => setPasswordDialogOpen(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">
                    Two-Factor Authentication
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Add an extra layer of security to your account
                </p>
                <Button className="mt-2" disabled variant="outline">
                  Enable 2FA
                </Button>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Active Sessions</h3>
                <p className="text-muted-foreground text-sm">
                  Manage devices where you're currently signed in
                </p>
                <div className="mt-2 space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Current Device</p>
                      <p className="text-muted-foreground text-xs">
                        Last active: Just now
                      </p>
                    </div>
                    <Button disabled size="sm" variant="ghost">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-2 rounded-lg border border-destructive/50 p-4">
                <h3 className="font-medium text-destructive text-sm">
                  Danger Zone
                </h3>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all associated data
                </p>
                <Button
                  className="mt-2"
                  onClick={() => setDeleteDialogOpen(true)}
                  size="sm"
                  variant="destructive"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent className="space-y-4" value="preferences">
            <div className="space-y-4">
              {/* Theme Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Theme</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Choose how Certificate looks to you
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <Button
                    className="justify-start"
                    onClick={() => setTheme("light")}
                    size="sm"
                    variant={theme === "light" ? "default" : "outline"}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    className="justify-start"
                    onClick={() => setTheme("dark")}
                    size="sm"
                    variant={theme === "dark" ? "default" : "outline"}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    className="justify-start"
                    onClick={() => setTheme("system")}
                    size="sm"
                    variant={theme === "system" ? "default" : "outline"}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Notifications</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Configure how you receive notifications
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">Email Notifications</p>
                      <p className="text-muted-foreground text-xs">
                        Receive updates via email
                      </p>
                    </div>
                    <Button disabled size="sm" variant="outline">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">Push Notifications</p>
                      <p className="text-muted-foreground text-xs">
                        Receive push notifications
                      </p>
                    </div>
                    <Button disabled size="sm" variant="outline">
                      Enable
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Language */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Language</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Select your preferred language
                </p>
                <Input defaultValue="English (US)" disabled />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Password Change Dialog */}
      <ChangePasswordDialog
        onOpenChange={setPasswordDialogOpen}
        open={passwordDialogOpen}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
    </Dialog>
  );
}

// ============================================
// STANDALONE SETTINGS BUTTON
// ============================================

export function SettingsButton() {
  return (
    <UserSettingsDialog
      trigger={
        <Button size="sm" variant="outline">
          <Shield className="mr-2 h-4 w-4" />
          Settings
        </Button>
      }
    />
  );
}
