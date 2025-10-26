"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function RefreshSessionButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Sign out and redirect to login
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      // Force redirect even if signout fails
      router.push("/login");
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      disabled={isRefreshing}
      onClick={handleRefresh}
      size="sm"
      variant="outline"
    >
      <RefreshCw
        className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
      />
      {isRefreshing ? "Refreshing..." : "Refresh Session"}
    </Button>
  );
}
