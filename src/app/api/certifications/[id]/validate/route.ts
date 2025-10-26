import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { certification } from "@/db/schema/tables/certification";
import { getSession } from "@/lib/session";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params;
    const session = await getSession();
    const user = session?.user;

    if (!user || (user.role !== "partner" && user.role !== "admin")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer la certification
    const [cert] = await db
      .select()
      .from(certification)
      .where(eq(certification.id, resolvedParams.id))
      .limit(1);

    if (!cert) {
      return NextResponse.json(
        { error: "Certification introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que le partenaire est bien assigné à cette certification
    if (user.role === "partner" && cert.partnerId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Mettre à jour le statut de la certification à "certifie" (certified)
    await db
      .update(certification)
      .set({
        status: "certifie",
        inspectedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(certification.id, resolvedParams.id));

    return NextResponse.json({
      success: true,
      message: "Certification validée avec succès",
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Error logging is acceptable in API routes
    console.error("Erreur lors de la validation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la validation" },
      { status: 500 }
    );
  }
}
