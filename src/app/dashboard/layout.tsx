import { Shield } from "lucide-react";
import Link from "next/link";
import { UserProfileAuthenticated } from "@/components/layout/user-profile";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      {/* Dashboard Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center gap-2" href="/dashboard">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Certificate</span>
          </Link>
          <div className="flex items-center gap-4">
            {user && <UserProfileAuthenticated user={user} />}
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main>{children}</main>
    </div>
  );
}
