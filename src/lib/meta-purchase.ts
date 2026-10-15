
import type Stripe from "stripe";

export async function sendMetaInitialPurchase(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.metadata?.meta_marketing_consent !== "yes") {
    return;
  }

  if (session.metadata?.offer !== "lover-reveal-trial") {
    return;
  }

  if (
    session.payment_status !== "paid" ||
    session.amount_total !== 199 ||
    session.currency !== "eur"
  ) {
    return;
  }

  const pixelId =
    process.env.META_PIXEL_ID ??
    process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const accessToken =
    process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Meta CAPI is not configured.");
    return;
  }

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `initial_purchase_${session.id}`,
        action_source: "website",
        event_source_url:
          "https://www.understandmylove.com/checkout/success",
        user_data: {},
        custom_data: {
          currency: "EUR",
          value: 1.99,
          content_name: "Personal Love Report",
          order_id: session.id,
        },
      },
    ],
  };

  const response = await fetch(
    `https://graph.facebook.com/v22.0/${encodeURIComponent(pixelId)}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Meta Conversions API returned HTTP ${response.status}`
    );
  }

  const result = await response.json();

  if (
    typeof result.events_received === "number" &&
    result.events_received < 1
  ) {
    throw new Error("Meta did not accept the Purchase event.");
  }
}
