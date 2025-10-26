// ============================================
// 🎯 STRIPE WEBHOOK HANDLER
// ============================================
// Handle Stripe webhook events for certification payments
// ============================================

import { eq as drizzleEq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { certification } from "@/db/schema/tables/certification";
import { generateCertificateNumber } from "@/lib/certification-utils";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET environment variable is not set");
}

const stripe = new Stripe(stripeSecretKey);

const CENTS_PER_EURO = 100;
const MAX_CERT_NUMBER_ATTEMPTS = 5;

// ============================================
// POST /api/webhooks/stripe - Process Stripe Events
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      if (!webhookSecret) {
        throw new Error("Webhook secret not configured");
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid signature",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      // Extract metadata
      const metadata = checkoutSession.metadata;
      if (!metadata) {
        return NextResponse.json(
          { error: "Missing session metadata" },
          { status: 400 }
        );
      }

      const {
        userId,
        serviceId,
        objectType,
        brand,
        model,
        reference,
        declaredPrice,
        hasTransportKit,
        hasTransportPackage,
        insurance,
      } = metadata;

      // Generate unique certificate number
      let certificateNumber = generateCertificateNumber();
      let attempts = 0;

      while (attempts < MAX_CERT_NUMBER_ATTEMPTS) {
        const existing = await db
          .select()
          .from(certification)
          .where(drizzleEq(certification.certificateNumber, certificateNumber))
          .limit(1);

        if (existing.length === 0) {
          break;
        }

        certificateNumber = generateCertificateNumber();
        attempts++;
      }

      if (attempts >= MAX_CERT_NUMBER_ATTEMPTS) {
        return NextResponse.json(
          { error: "Failed to generate unique certificate number" },
          { status: 500 }
        );
      }

      // Calculate pricing from session
      const amountTotal = checkoutSession.amount_total || 0;

      // Create certification
      const [newCertification] = await db
        .insert(certification)
        .values({
          userId,
          certificateNumber,
          objectType: objectType as
            | "montre"
            | "bijou"
            | "sac"
            | "chaussures"
            | "vetement"
            | "art"
            | "electronique"
            | "autre",
          brand,
          model,
          reference: reference || undefined,
          price: Math.round(Number.parseFloat(declaredPrice) * CENTS_PER_EURO),
          hasDocuments: false,
          hasAccessories: false,
          serviceType: serviceId as
            | "initium"
            | "visus"
            | "custodia"
            | "imperium",
          options: {
            transportKit: hasTransportKit === "true",
            transportPackage: hasTransportPackage === "true",
            insurance: insurance !== "none" ? insurance : undefined,
          },
          basePrice: amountTotal,
          additionalFees: 0,
          totalPrice: amountTotal,
          status: "en_attente",
          paidAt: new Date(),
        })
        .returning();

      return NextResponse.json({
        success: true,
        certificateNumber: newCertification.certificateNumber,
      });
    }

    // Return success for other events
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
