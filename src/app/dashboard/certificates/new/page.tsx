import { redirect } from "next/navigation";
import { ItemRegistrationForm } from "@/components/forms/item-registration-form";
import { getCurrentUser } from "@/lib/session";

export default async function NewCertificatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Register New Item</h1>
        <p className="mt-2 text-muted-foreground">
          Create a certificate for your luxury watch, jewelry, or other valuable
          item.
        </p>
      </div>

      <ItemRegistrationForm />
    </div>
  );
}
