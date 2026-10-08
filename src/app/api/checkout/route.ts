import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const OFFER_ID = "lover-reveal-trial";
const PRODUCT_ID = "your-personal-love-report";
const RECURRING_PRICE_ID = process.env.STRIPE_RECURRING_PRICE_ID || "price_1UNvUgPSE25Qj4T2oo5Df8Et";
const INITIAL_AMOUNT = 199;
const RECURRING_AMOUNT = 2999;
const TRIAL_DAYS = 7;

export async function POST(request: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });
    const stripe = new Stripe(secret);
    const body = await request.json();
    const attempt = typeof body?.checkoutAttemptId === "string" ? body.checkoutAttemptId : "";
    const primary = typeof body?.primaryResult === "string" ? body.primaryResult.slice(0, 80) : "";
    if (!/^[a-zA-Z0-9-]{12,100}$/.test(attempt)) {
      return NextResponse.json({ error: "Invalid checkout attempt." }, { status: 400 });
    }

    // Verify configuration rather than accidentally charging an incorrect price.
    const recurringPrice = await stripe.prices.retrieve(RECURRING_PRICE_ID);
    if (!recurringPrice.active || recurringPrice.currency !== "eur" ||
        recurringPrice.unit_amount !== RECURRING_AMOUNT ||
        recurringPrice.recurring?.interval !== "month" ||
        recurringPrice.recurring?.interval_count !== 1) {
      throw new Error("Recurring Stripe price does not match the displayed offer.");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.understandmylove.com";
    const origin = new URL(appUrl).origin;
    const successUrl = new URL("/checkout/success", origin);
    successUrl.searchParams.set("payment", "success");
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
    const cancelUrl = new URL("/", origin);
    cancelUrl.searchParams.set("resume", "report");
    cancelUrl.searchParams.set("payment", "cancelled");

    // Subscription Checkout lets Stripe display only payment methods that
    // support this recurring payment and are enabled for this Stripe account.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: attempt,
      locale: "auto",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      line_items: [
        { price: RECURRING_PRICE_ID, quantity: 1 },
        { price_data: {
            currency: "eur",
            unit_amount: INITIAL_AMOUNT,
            product_data: {
              name: "Introductory access",
            },
          }, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
        metadata: {
          product: PRODUCT_ID,
          offer: OFFER_ID,
          checkout_attempt_id: attempt,
          primary_result: primary,
          recurring_price_id: RECURRING_PRICE_ID,
        },
      },
      metadata: {
        product: PRODUCT_ID,
        offer: OFFER_ID,
        checkoutAttemptId: attempt,
        primaryResult: primary,
      },
      // Dynamic payment methods: Stripe chooses eligible recurring-compatible
      // local methods and wallets for the customer and connected account.
      // Do not force payment_method_types or payment_method_configuration.
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
    }, { idempotencyKey: `uml-checkout-${attempt}` });

    if (!session.url) throw new Error("Checkout session has no URL.");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json({ error: "Unable to start checkout. Please try again." }, { status: 500 });
  }
}
