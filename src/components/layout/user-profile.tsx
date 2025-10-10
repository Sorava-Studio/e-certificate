"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserSettingsDialog } from "@/components/settings/user-settings-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

// ============================================
// AUTHENTICATED USER PROFILE WITH DROPDOWN
// ============================================

type UserProfileAuthenticatedProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
};

export function UserProfileAuthenticated({
  user,
}: UserProfileAuthenticatedProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative h-9 w-9 rounded-full"
            size="icon"
            variant="ghost"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage alt={user.name} src={user.image || undefined} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">{user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isLoading}
            onClick={handleLogout}
            variant="destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserSettingsDialog onOpenChange={setSettingsOpen} open={settingsOpen} />
    </>
  );
}

// ============================================
// UNAUTHENTICATED USER PROFILE WITH BUTTONS
// ============================================

export function UserProfileUnauthenticated() {
  return (
    <ButtonGroup>
      <Link href="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
      <Link href="/register">
        <Button>Get Started</Button>
      </Link>
    </ButtonGroup>
  );
}

// ============================================
// SMART USER PROFILE (AUTO-DETECTS AUTH STATE)
// ============================================

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (session?.user) {
    return <UserProfileAuthenticated user={session.user} />;
  }

  return <UserProfileUnauthenticated />;
}
