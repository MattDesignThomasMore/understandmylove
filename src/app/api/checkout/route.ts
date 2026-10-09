
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY.");
}

const stripe = new Stripe(stripeSecretKey);

const OFFER_ID = "lover-reveal-trial";
const PRODUCT_ID = "your-personal-love-report";
const RECURRING_PRICE_ID = "price_1UNvUgPSE25Qj4T2oo5Df8Et";

// Customer pays €1.99 now.
const INITIAL_AMOUNT = 199;

// Then €29.99/month after the 7-day trial.
const RECURRING_AMOUNT = 2999;
const TRIAL_DAYS = 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const primaryResult =
      typeof body?.primaryResult === "string"
        ? body.primaryResult.trim()
        : "";

    const reportChoices =
      typeof body?.reportChoices === "string"
        ? body.reportChoices
        : "";

    if (!/^[01]{24}$/.test(reportChoices)) {
      return NextResponse.json(
        { error: "Please complete the 24 questions first." },
        { status: 400 }
      );
    }

    const checkoutAttemptId =
      typeof body?.checkoutAttemptId === "string"
        ? body.checkoutAttemptId.trim()
        : "";

    if (!checkoutAttemptId) {
      return NextResponse.json(
        { error: "Invalid checkout attempt." },
        { status: 400 }
      );
    }

    const origin = (
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      "https://understandmylove.com"
    ).replace(/\/+$/, "");

    // IMPORTANT:
    // Stripe must receive {CHECKOUT_SESSION_ID} exactly as written.
    // Do not use URLSearchParams.set() for this placeholder,
    // because it encodes the curly braces.
    const successUrl =
      `${origin}/checkout/success` +
      `?payment=success&session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = new URL("/?resume=report", origin);
    cancelUrl.searchParams.set("payment", "cancelled");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      client_reference_id: checkoutAttemptId,

      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: INITIAL_AMOUNT,
            product_data: {
              name: "Your personal love report",
              description:
                "Instant access • One-time payment • Receive in mailbox",
            },
          },
          quantity: 1,
        },
      ],

      payment_method_types: ["card"],

      locale: "auto",
      billing_address_collection: "auto",
      customer_creation: "always",

      // Save the payment method for future off-session use.
      payment_intent_data: {
        setup_future_usage: "off_session",

        metadata: {
          understandmylove_product: PRODUCT_ID,
          understandmylove_offer: OFFER_ID,
          checkout_attempt_id: checkoutAttemptId,
          primary_result: primaryResult,
          initial_amount: String(INITIAL_AMOUNT),
          recurring_amount: String(RECURRING_AMOUNT),
          recurring_currency: "eur",
          recurring_interval: "month",
          trial_days: String(TRIAL_DAYS),
        },
      },

      metadata: {
        product: PRODUCT_ID,
        offer: OFFER_ID,
        checkoutAttemptId,
        primaryResult,
        reportChoices,
        recurring_price_id: RECURRING_PRICE_ID,
        trial_days: String(TRIAL_DAYS),
        upfront_amount: String(INITIAL_AMOUNT),
        recurring_amount: String(RECURRING_AMOUNT),
        recurring_interval: "month",
      },

      // FIX: Pass the unencoded Stripe placeholder.
      success_url: successUrl,

      cancel_url: cancelUrl.toString(),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      {
        error: "Unable to start checkout. Please try again.",
      },
      { status: 500 }
    );
  }
}
