"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAccount } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await deleteAccount(confirmationText);

    setIsLoading(false);

    if (result.success) {
      // Sign out and redirect to login
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setError("");
    onOpenChange(false);
  };

  const isConfirmationValid = confirmationText === "DELETE";

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <span className="font-bold">DELETE</span> to confirm
            </Label>
            <Input
              autoComplete="off"
              id="confirmation"
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="DELETE"
              required
              value={confirmationText}
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <h4 className="mb-2 font-medium text-sm">What will be deleted:</h4>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>• Your profile and account information</li>
              <li>• All your certificates and documents</li>
              <li>• Your subscription and payment history</li>
              <li>• All preferences and settings</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              disabled={isLoading}
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || !isConfirmationValid}
              type="submit"
              variant="destructive"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete My Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
