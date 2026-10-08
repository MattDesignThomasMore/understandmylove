import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY.");
}

const stripe = new Stripe(stripeSecretKey);

const OFFER_ID = "lover-reveal-trial";
const PRODUCT_ID = "understandmylove-personal-love-report";
const RECURRING_PRICE_ID = "price_1UNvUgPSE25Qj4T2oo5Df8Et";

const INITIAL_AMOUNT = 199;
const RECURRING_AMOUNT = 2999;
const TRIAL_DAYS = 7;

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
): string {
  return typeof customer === "string" ? customer : customer.id;
}

function getPaymentMethodId(
  paymentMethod: string | Stripe.PaymentMethod | null,
): string | null {
  if (!paymentMethod) return null;
  return typeof paymentMethod === "string"
    ? paymentMethod
    : paymentMethod.id;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function verifyRecurringPrice(): Promise<void> {
  const price = await stripe.prices.retrieve(RECURRING_PRICE_ID);

  if (!price.active) {
    throw new Error(`Recurring Stripe Price ${RECURRING_PRICE_ID} is inactive.`);
  }

  if (price.currency !== "eur") {
    throw new Error(
      `Recurring Stripe Price has currency ${price.currency}, expected eur.`,
    );
  }

  if (price.unit_amount !== RECURRING_AMOUNT) {
    throw new Error(
      `Recurring Stripe Price is ${price.unit_amount} cents, expected ${RECURRING_AMOUNT}.`,
    );
  }

  if (price.type !== "recurring" || !price.recurring) {
    throw new Error(
      `Stripe Price ${RECURRING_PRICE_ID} is not a recurring price.`,
    );
  }

  if (price.recurring.interval !== "month") {
    throw new Error(
      `Stripe Price ${RECURRING_PRICE_ID} has interval ${price.recurring.interval}, expected month.`,
    );
  }
}

async function findExistingSubscription(
  customerId: string,
  checkoutSessionId: string,
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  });

  return (
    subscriptions.data.find(
      (subscription) =>
        subscription.metadata?.checkout_session_id === checkoutSessionId,
    ) ?? null
  );
}

async function createSubscriptionFromCheckout(
  session: Stripe.Checkout.Session,
): Promise<Stripe.Subscription | null> {
  if (session.mode !== "payment") {
    return null;
  }

  if (session.metadata?.offer !== OFFER_ID) {
    return null;
  }

  if (session.payment_status !== "paid") {
    console.log("Checkout session is not paid:", {
      session: session.id,
      paymentStatus: session.payment_status,
    });
    return null;
  }

  // Never create the recurring subscription for the wrong amount.
  if (session.amount_total !== INITIAL_AMOUNT || session.currency !== "eur") {
    throw new Error(
      `Unexpected initial payment for ${session.id}: amount=${session.amount_total}, currency=${session.currency}`,
    );
  }

  if (!session.customer) {
    throw new Error(`Checkout ${session.id} has no customer.`);
  }

  if (!session.payment_intent) {
    throw new Error(`Checkout ${session.id} has no payment intent.`);
  }

  await verifyRecurringPrice();

  const customerId = getCustomerId(session.customer);

  // Durable duplicate protection. This catches a webhook retry even after
  // Stripe's idempotency-key window has expired.
  const existingSubscription = await findExistingSubscription(
    customerId,
    session.id,
  );

  if (existingSubscription) {
    console.log("Subscription already exists:", {
      checkoutSession: session.id,
      subscription: existingSubscription.id,
      status: existingSubscription.status,
    });
    return existingSubscription;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent.id;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method"],
  });

  if (paymentIntent.status !== "succeeded") {
    throw new Error(
      `PaymentIntent ${paymentIntent.id} is ${paymentIntent.status}, not succeeded.`,
    );
  }

  const paymentMethodId = getPaymentMethodId(paymentIntent.payment_method);

  if (!paymentMethodId) {
    throw new Error(
      `PaymentIntent ${paymentIntent.id} has no payment method.`,
    );
  }

  const paymentMethod =
    typeof paymentIntent.payment_method === "object" &&
    paymentIntent.payment_method !== null
      ? paymentIntent.payment_method
      : await stripe.paymentMethods.retrieve(paymentMethodId);

  // We intentionally use card-only Checkout so the saved payment method is
  // suitable for the future off-session recurring card charge.
  if (paymentMethod.type !== "card") {
    throw new Error(
      `Unsupported payment method ${paymentMethod.id}: ${paymentMethod.type}.`,
    );
  }

  if (
    paymentMethod.customer &&
    getCustomerId(paymentMethod.customer) !== customerId
  ) {
    throw new Error(
      `PaymentMethod ${paymentMethod.id} belongs to another customer.`,
    );
  }

  // Normally Checkout has already attached it because of
  // setup_future_usage=off_session. Keep this as a safe fallback.
  if (!paymentMethod.customer) {
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });
  }

  const subscription = await stripe.subscriptions.create(
    {
      customer: customerId,
      items: [
        {
          price: RECURRING_PRICE_ID,
          quantity: 1,
        },
      ],

      // No €29.99 invoice is generated during these first 7 days.
      trial_period_days: TRIAL_DAYS,

      // After the trial Stripe automatically charges the saved card.
      collection_method: "charge_automatically",
      default_payment_method: paymentMethod.id,

      // If the saved payment method is missing at trial end, cancel rather
      // than leaving an unpaid subscription/invoice behind.
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },

      metadata: {
        product: PRODUCT_ID,
        offer: OFFER_ID,
        checkout_session_id: session.id,
        checkout_attempt_id: session.metadata?.checkoutAttemptId ?? "",
        primary_result: session.metadata?.primaryResult ?? "",
        recurring_price_id: RECURRING_PRICE_ID,
        upfront_amount: String(INITIAL_AMOUNT),
        recurring_amount: String(RECURRING_AMOUNT),
        recurring_currency: "eur",
        recurring_interval: "month",
        trial_days: String(TRIAL_DAYS),
      },
    },
    {
      // Same Checkout Session => same Stripe operation if two webhook
      // deliveries arrive at the same time.
      idempotencyKey: `understandmylove-subscription-${session.id}`,
    },
  );

  console.log("UnderstandMylove subscription created:", {
    checkoutSession: session.id,
    customer: customerId,
    paymentMethod: paymentMethod.id,
    subscription: subscription.id,
    status: subscription.status,
    trialEnd: subscription.trial_end,
  });

  return subscription;
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  // Stripe signature verification MUST use the untouched raw body.
  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  console.log("Stripe webhook received:", {
    id: event.id,
    type: event.type,
    livemode: event.livemode,
  });

  try {
    switch (event.type) {
      // For the current card Checkout flow this is the event that creates
      // the 7-day-trial subscription.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await createSubscriptionFromCheckout(session);
        break;
      }

      // Kept for safety if you later enable an asynchronous payment method.
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await createSubscriptionFromCheckout(session);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.error("Initial payment failed:", {
          checkoutSession: session.id,
          paymentStatus: session.payment_status,
        });
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session expired:", session.id);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription created:", {
          subscription: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          trialEnd: subscription.trial_end,
        });
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Trial ending soon:", {
          subscription: subscription.id,
          customer: subscription.customer,
          trialEnd: subscription.trial_end,
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const firstItem = subscription.items.data[0];

        console.log("Subscription updated:", {
          subscription: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscription.trial_end,
          currentPeriodStart: firstItem?.current_period_start ?? null,
          currentPeriodEnd: firstItem?.current_period_end ?? null,
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Recurring invoice paid:", {
          invoice: invoice.id,
          customer: invoice.customer,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.error("Recurring invoice payment failed:", {
          invoice: invoice.id,
          customer: invoice.customer,
          amountDue: invoice.amount_due,
          currency: invoice.currency,
          status: invoice.status,
        });
        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn("Recurring invoice requires customer action:", {
          invoice: invoice.id,
          customer: invoice.customer,
          amountDue: invoice.amount_due,
          currency: invoice.currency,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription ended:", {
          subscription: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          endedAt: subscription.ended_at,
        });
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", {
      eventId: event.id,
      eventType: event.type,
      message: getErrorMessage(error),
      error,
    });

    // 500 is intentional: Stripe will retry a failed webhook.
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
