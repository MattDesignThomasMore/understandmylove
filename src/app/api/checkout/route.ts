import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const primaryResult =
      typeof body?.primaryResult === "string"
        ? body.primaryResult.trim()
        : "";

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

    const successUrl = new URL(
      "/checkout/success",
      origin
    );

    successUrl.searchParams.set(
      "payment",
      "success"
    );

    successUrl.searchParams.set(
      "session_id",
      "{CHECKOUT_SESSION_ID}"
    );

    const cancelUrl = new URL(
      "/",
      origin
    );

    cancelUrl.searchParams.set(
      "payment",
      "cancelled"
    );

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        client_reference_id:
          checkoutAttemptId,

        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: 199,

              product_data: {
                name: "UnderstandMylove Personal Love Report",
                description:
                  "€1,99 • One-time payment • Instant access",
              },
            },

            quantity: 1,
          },
        ],

        /*
         * No payment_method_types here.
         *
         * Stripe Checkout will dynamically determine
         * the available payment methods for the customer.
         */

        locale: "auto",

        billing_address_collection: "auto",

        customer_creation: "always",

        /*
         * Save the payment method on the Customer
         * so it can be used later for the subscription.
         */
        payment_intent_data: {
          setup_future_usage: "off_session",

          metadata: {
            understandmylove_product:
              "personal-love-report",

            understandmylove_offer:
              "lover-reveal-trial",

            checkout_attempt_id:
              checkoutAttemptId,

            primary_result:
              primaryResult,

            access_status: "active",
          },
        },

        metadata: {
          product:
            "understandmylove-personal-love-report",

          offer:
            "lover-reveal-trial",

          checkoutAttemptId,

          primaryResult,

          recurring_price_id:
            "price_1UNvUgPSE25Qj4T2oo5Df8Et",

          trial_days: "7",

          upfront_amount: "199",

          recurring_amount: "2999",

          recurring_interval: "month",

          access_status: "active",
        },

        custom_text: {
          submit: {
            message:
              "€1,99 today. Full access for 7 days. After 7 days, €29,99/month until you cancel. Cancel anytime.",
          },
        },

        success_url:
          successUrl.toString(),

        cancel_url:
          cancelUrl.toString(),
      });

    if (!session.url) {
      return NextResponse.json(
        {
          error:
            "Unable to create checkout session.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Stripe Checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to start checkout. Please try again.",
      },
      { status: 500 }
    );
  }
}