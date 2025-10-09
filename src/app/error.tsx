"use client";

import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangleIcon className="size-6 text-destructive" />
            </div>
          </div>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error.digest && (
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-muted-foreground text-xs">
                Error ID: {error.digest}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload page
          </Button>
          <Button onClick={reset}>Try again</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
