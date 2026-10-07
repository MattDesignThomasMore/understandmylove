import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccess({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId || !/^cs_(test_|live_)[a-zA-Z0-9]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY) {
    return <main><h1>We could not verify this checkout.</h1><a href="/">Return to the site</a></main>;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
    const subscription = session.subscription;
    const valid = session.mode === "subscription" && session.status === "complete" &&
      session.payment_status === "paid" && session.amount_total === 195 && session.currency === "eur" &&
      session.metadata?.offer === "lover-reveal-trial" &&
      subscription !== null && typeof subscription !== "string" &&
      (subscription.status === "trialing" || subscription.status === "active");

    if (!valid) {
      return <main><h1>Payment is still being confirmed.</h1><p>If you completed checkout, check again shortly or contact support.</p><a href="/">Return to the site</a></main>;
    }

    const trialEnd = subscription.trial_end
      ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(subscription.trial_end * 1000)
      : null;
    const portal = process.env.STRIPE_PORTAL_LOGIN_URL;

    return <main style={{ maxWidth: 600, margin: "10vh auto", padding: 24, fontFamily: "system-ui", lineHeight: 1.6 }}>
      <h1>Payment confirmed</h1>
      <p>Your €1.95 payment is complete and your 7 days of access have started.</p>
      <p>Your first €29.95 renewal is {trialEnd ? `scheduled for ${trialEnd}` : "scheduled after the 7-day access period"}; then every 4 weeks until you cancel.</p>
      <p>You can manage or cancel your membership at any time{portal ? <> through the <a href={portal}>customer portal</a></> : " by contacting support"}.</p>
      <p>Your result reference: {session.metadata?.primaryResult}</p>
      <a href="/">Return to understandmylove</a>
    </main>;
  } catch (error) {
    console.error("Could not verify Stripe checkout", error);
    return <main><h1>We could not verify this checkout yet.</h1><p>Please try again shortly or contact support.</p></main>;
  }
}
