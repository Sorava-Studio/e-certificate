// ============================================
// 💳 STRIPE CHECKOUT API
// ============================================
// Create Stripe checkout session for certification payment
// ============================================

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { ServiceTierId } from "@/config/pricing";
import { calculateTotalPrice, getPricingTier } from "@/config/pricing";
import { auth } from "@/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripe = new Stripe(stripeSecretKey);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================
// POST /api/stripe/checkout - Create Checkout Session
// ============================================
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const hasValidUser = session?.user?.id && session?.user?.email;
    if (!hasValidUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      serviceId,
      options,
      certificationData,
    }: {
      serviceId: ServiceTierId;
      options?: {
        transportKit?: boolean;
        transportPackage?: boolean;
        insurance?: "basic" | "standard" | "premium";
      };
      certificationData: {
        objectType: string;
        brand: string;
        model: string;
        reference?: string;
        price: number;
      };
    } = body;

    // Get pricing information
    const tier = getPricingTier(serviceId);
    if (!tier) {
      return NextResponse.json(
        { error: "Invalid service tier" },
        { status: 400 }
      );
    }

    const pricing = calculateTotalPrice(serviceId, options);

    // Skip payment for free tier (Initium)
    if (pricing.totalPrice === 0) {
      return NextResponse.json({
        success: true,
        paid: true,
        sessionId: null,
        message: "Free tier - no payment required",
      });
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${tier.name} Certification`,
            description: `${tier.tagline} - ${certificationData.brand} ${certificationData.model}`,
            metadata: {
              serviceId,
              tierName: tier.name,
              objectBrand: certificationData.brand,
              objectModel: certificationData.model,
            },
          },
          unit_amount: tier.price,
        },
        quantity: 1,
      },
    ];

    // Add additional fees as separate line items
    if (options?.transportKit) {
      const TRANSPORT_KIT_FEE = 1500;
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Transport Kit",
            description: "Secure packaging and shipping kit",
          },
          unit_amount: TRANSPORT_KIT_FEE,
        },
        quantity: 1,
      });
    }

    if (options?.transportPackage) {
      const TRANSPORT_PACKAGE_FEE = 2500;
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Transport Package",
            description: "Premium transport service",
          },
          unit_amount: TRANSPORT_PACKAGE_FEE,
        },
        quantity: 1,
      });
    }

    if (options?.insurance) {
      const insuranceFees = {
        basic: 1000,
        standard: 2500,
        premium: 5000,
      };
      const insuranceFee = insuranceFees[options.insurance];
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Insurance - ${options.insurance.charAt(0).toUpperCase() + options.insurance.slice(1)}`,
            description: "Coverage for your certified item",
          },
          unit_amount: insuranceFee,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      success_url: `${APP_URL}/dashboard/certificates?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        userId: session.user.id,
        serviceId,
        objectType: certificationData.objectType,
        brand: certificationData.brand,
        model: certificationData.model,
        reference: certificationData.reference || "",
        declaredPrice: certificationData.price.toString(),
        hasTransportKit: options?.transportKit ? "true" : "false",
        hasTransportPackage: options?.transportPackage ? "true" : "false",
        insurance: options?.insurance || "none",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    // Log detailed error for debugging
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log to console for development debugging
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint: Development logging only
      console.error("Stripe checkout error:", {
        message: errorMessage,
        stack: errorStack,
        error,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
