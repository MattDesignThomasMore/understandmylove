import { redirect } from "next/navigation";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

const INITIAL_AMOUNT = 199;
const RECURRING_AMOUNT = 2999;
const OFFER_ID = "lover-reveal-trial";

export default async function CheckoutSuccess({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  if (
    !sessionId ||
    !/^cs_(test_|live_)[a-zA-Z0-9]+$/.test(sessionId) ||
    !process.env.STRIPE_SECRET_KEY
  ) {
    return (
      <main>
        <h1>We could not verify this checkout.</h1>
        <a href="/">Return to the site</a>
      </main>
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const validPayment =
      session.mode === "payment" &&
      session.status === "complete" &&
      session.payment_status === "paid" &&
      session.amount_total === INITIAL_AMOUNT &&
      session.currency === "eur" &&
      session.metadata?.offer === OFFER_ID;

    if (!validPayment) {
      return (
        <main>
          <h1>Payment is still being confirmed.</h1>
          <p>
            If you completed checkout, check again shortly or contact support.
          </p>
          <a href="/">Return to the site</a>
        </main>
      );
    }

    if (/^[01]{24}$/.test(session.metadata?.reportChoices ?? "")) {
      redirect(`/personal-report?session_id=${encodeURIComponent(session.id)}`);
    }

    let subscription: Stripe.Subscription | null = null;

    if (session.customer) {
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer.id;

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 100,
      });

      subscription =
        subscriptions.data.find(
          (item) =>
            item.metadata?.checkout_session_id === session.id,
        ) ?? null;
    }

    const trialEnd = subscription?.trial_end
      ? new Intl.DateTimeFormat("en-GB", {
          dateStyle: "long",
          timeZone: "Europe/Brussels",
        }).format(subscription.trial_end * 1000)
      : null;

    const portal = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LOGIN_URL?.trim();

    return (
      <main
        style={{
          maxWidth: 600,
          margin: "10vh auto",
          padding: 24,
          fontFamily: "system-ui",
          lineHeight: 1.6,
        }}
      >
        <h1>Payment confirmed</h1>

        <p>
          Your €{(INITIAL_AMOUNT / 100).toFixed(2).replace(".", ",")} payment
          is complete and your 7 days of full access have started.
        </p>

        {subscription ? (
          <p>
            Your membership is set to renew at €{(RECURRING_AMOUNT / 100)
              .toFixed(2)
              .replace(".", ",")}
            /month after the 7-day access period
            {trialEnd ? `, starting ${trialEnd}` : ""}. It will then renew
            monthly until you cancel.
          </p>
        ) : (
          <p>
            Your recurring membership is being finalized. Your payment is
            confirmed; the recurring subscription is normally created by the
            payment webhook within moments. Please refresh this page shortly.
          </p>
        )}

        <p>
          You can manage or cancel future renewals at any time
          {portal ? (
            <> through the <a href={portal}>customer portal</a></>
          ) : (
            " through the cancellation page or by contacting support"
          )}.
        </p>

        <p>Your result reference: {session.metadata?.primaryResult || "—"}</p>
        <a href="/">Return to understandmylove</a>
      </main>
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
    console.error("Could not verify Stripe checkout", error);
    return (
      <main>
        <h1>We could not verify this checkout yet.</h1>
        <p>Please try again shortly or contact support.</p>
      </main>
    );
  }
}