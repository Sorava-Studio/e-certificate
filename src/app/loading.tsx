import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner className="size-8" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  );
}
