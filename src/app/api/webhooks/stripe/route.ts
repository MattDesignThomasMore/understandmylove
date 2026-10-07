import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

const RECURRING_PRICE_ID =
  "price_1UNvUgPSE25Qj4T2oo5Df8Et";

const OFFER_ID =
  "lover-reveal-trial";

const PRODUCT_ID =
  "understandmylove-personal-love-report";

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): string {
  return typeof customer === "string"
    ? customer
    : customer.id;
}

function getPaymentMethodId(
  paymentMethod:
    | string
    | Stripe.PaymentMethod
    | null
): string | null {
  if (!paymentMethod) {
    return null;
  }

  return typeof paymentMethod === "string"
    ? paymentMethod
    : paymentMethod.id;
}

async function createSubscriptionFromCheckout(
  session: Stripe.Checkout.Session
) {
  /*
   * We only create the recurring subscription for
   * successful one-time Checkout payments.
   */
  if (session.mode !== "payment") {
    return null;
  }

  if (session.payment_status !== "paid") {
    console.log(
      "Checkout session is not paid yet:",
      {
        session: session.id,
        paymentStatus: session.payment_status,
      }
    );

    return null;
  }

  /*
   * Checkout creates the Customer because the checkout
   * route uses customer_creation: "always".
   */
  if (!session.customer) {
    throw new Error(
      `Checkout ${session.id} has no customer.`
    );
  }

  if (!session.payment_intent) {
    throw new Error(
      `Checkout ${session.id} has no payment intent.`
    );
  }

  const customerId = getCustomerId(
    session.customer
  );

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent.id;

  /*
   * Retrieve the PaymentIntent so we can get the
   * PaymentMethod that was actually used.
   */
  const paymentIntent =
    await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

  const paymentMethodId =
    getPaymentMethodId(
      paymentIntent.payment_method
    );

  if (!paymentMethodId) {
    throw new Error(
      `PaymentIntent ${paymentIntent.id} has no payment method.`
    );
  }

  /*
   * Because the Checkout Session uses:
   *
   * payment_intent_data.setup_future_usage = "off_session"
   *
   * Stripe should already attach the PaymentMethod
   * to the Customer.
   *
   * We still verify this here so the webhook is robust.
   */
  const paymentMethod =
    await stripe.paymentMethods.retrieve(
      paymentMethodId
    );

  if (
    paymentMethod.customer &&
    getCustomerId(paymentMethod.customer) !==
      customerId
  ) {
    throw new Error(
      `PaymentMethod ${paymentMethod.id} belongs to another customer.`
    );
  }

  if (!paymentMethod.customer) {
    await stripe.paymentMethods.attach(
      paymentMethod.id,
      {
        customer: customerId,
      }
    );
  }

  /*
   * IMPORTANT:
   *
   * The idempotency key makes repeated webhook
   * deliveries safe. Stripe can send the same event
   * more than once.
   *
   * We deliberately do NOT rely on:
   *
   * subscription.current_period_end
   *
   * because current Stripe API versions moved billing
   * periods to SubscriptionItem.
   */
  const subscription =
    await stripe.subscriptions.create(
      {
        customer: customerId,

        items: [
          {
            price: RECURRING_PRICE_ID,
            quantity: 1,
          },
        ],

        /*
         * Customer gets 7 days before the first
         * €29.99 recurring invoice.
         */
        trial_period_days: 7,

        /*
         * Automatically charge the saved payment
         * method after the trial.
         */
        collection_method: "charge_automatically",

        default_payment_method:
          paymentMethod.id,

        /*
         * If somehow no payment method is attached
         * when the trial ends, cancel instead of
         * generating an unpaid invoice.
         */
        trial_settings: {
          end_behavior: {
            missing_payment_method:
              "cancel",
          },
        },

        metadata: {
          product: PRODUCT_ID,
          offer: OFFER_ID,

          checkout_session_id:
            session.id,

          checkout_attempt_id:
            session.metadata?.checkoutAttemptId ||
            "",

          primary_result:
            session.metadata?.primaryResult ||
            "",

          recurring_price_id:
            RECURRING_PRICE_ID,

          upfront_amount: "199",
          recurring_amount: "2999",
          recurring_currency: "eur",
          recurring_interval: "month",
          trial_days: "7",

          access_status: "active",
        },
      },
      {
        idempotencyKey:
          `understandmylove-subscription-${session.id}`,
      }
    );

  console.log(
    "UnderstandMylove subscription created:",
    {
      checkoutSession: session.id,
      customer: customerId,
      paymentMethod: paymentMethod.id,
      subscription: subscription.id,
      status: subscription.status,
      trialEnd: subscription.trial_end,
    }
  );

  return subscription;
}

export async function POST(
  request: Request
) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "Missing STRIPE_WEBHOOK_SECRET"
    );

    return NextResponse.json(
      {
        error:
          "Webhook secret is not configured.",
      },
      { status: 500 }
    );
  }

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Missing Stripe signature.",
      },
      { status: 400 }
    );
  }

  /*
   * IMPORTANT:
   *
   * Stripe webhook signature verification must use
   * the raw request body.
   */
  const payload =
    await request.text();

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Invalid webhook signature.",
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      /*
       * NORMAL PAYMENT METHODS
       *
       * For cards and other immediately successful
       * methods, this is the main event.
       */
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        await createSubscriptionFromCheckout(
          session
        );

        break;
      }

      /*
       * DELAYED PAYMENT METHODS
       *
       * Some payment methods can complete asynchronously.
       */
      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        await createSubscriptionFromCheckout(
          session
        );

        break;
      }

      /*
       * The initial €1.99 payment failed after
       * an asynchronous payment flow.
       *
       * No subscription should be created.
       */
      case "checkout.session.async_payment_failed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.error(
          "UnderstandMylove initial payment failed:",
          {
            checkoutSession:
              session.id,
            paymentStatus:
              session.payment_status,
          }
        );

        break;
      }

      /*
       * Stripe sends this event shortly before
       * the 7-day trial ends.
       */
      case "customer.subscription.trial_will_end": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const firstItem =
          subscription.items.data[0];

        console.log(
          "UnderstandMylove trial ending soon:",
          {
            subscription:
              subscription.id,

            customer:
              subscription.customer,

            trialEnd:
              subscription.trial_end,

            currentPeriodEnd:
              firstItem?.current_period_end ??
              null,
          }
        );

        break;
      }

      /*
       * Subscription status changes.
       */
      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        /*
         * CURRENT STRIPE API:
         *
         * current_period_end is on the
         * SubscriptionItem, not Subscription.
         */
        const firstItem =
          subscription.items.data[0];

        console.log(
          "UnderstandMylove subscription updated:",
          {
            subscription:
              subscription.id,

            status:
              subscription.status,

            customer:
              subscription.customer,

            cancelAtPeriodEnd:
              subscription.cancel_at_period_end,

            trialEnd:
              subscription.trial_end,

            currentPeriodStart:
              firstItem
                ?.current_period_start ??
              null,

            currentPeriodEnd:
              firstItem
                ?.current_period_end ??
              null,
          }
        );

        break;
      }

      /*
       * Successful recurring payment.
       */
      case "invoice.paid": {
        const invoice =
          event.data.object as Stripe.Invoice;

        console.log(
          "UnderstandMylove invoice paid:",
          {
            invoice:
              invoice.id,

            customer:
              invoice.customer,

            amountPaid:
              invoice.amount_paid,

            currency:
              invoice.currency,

            status:
              invoice.status,
          }
        );

        break;
      }

      /*
       * Recurring payment failed.
       */
      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        console.error(
          "UnderstandMylove invoice payment failed:",
          {
            invoice:
              invoice.id,

            customer:
              invoice.customer,

            amountDue:
              invoice.amount_due,

            currency:
              invoice.currency,

            status:
              invoice.status,
          }
        );

        break;
      }

      /*
       * Stripe may require the customer to perform
       * an additional authentication step.
       */
      case "invoice.payment_action_required": {
        const invoice =
          event.data.object as Stripe.Invoice;

        console.warn(
          "UnderstandMylove invoice requires customer action:",
          {
            invoice:
              invoice.id,

            customer:
              invoice.customer,

            amountDue:
              invoice.amount_due,

            currency:
              invoice.currency,
          }
        );

        break;
      }

      /*
       * Subscription cancelled/ended.
       */
      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        console.log(
          "UnderstandMylove subscription ended:",
          {
            subscription:
              subscription.id,

            customer:
              subscription.customer,

            status:
              subscription.status,

            endedAt:
              subscription.ended_at,
          }
        );

        break;
      }

      default: {
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
      }
    }

    /*
     * Returning 2xx tells Stripe that the event was
     * successfully processed.
     */
    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    /*
     * IMPORTANT:
     *
     * Return 500 when processing fails.
     * Stripe will retry the webhook.
     */
    console.error(
      "UnderstandMylove Stripe webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}