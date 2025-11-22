// controllers/payment.controller.js
import Stripe from "stripe";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook to update payment status
export const createCheckoutSession = async (req, res) => {
  const { userId, planName, price } = req.body; // Receive dynamic price & plan
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // Keep this in USD or use TND if supported
            product_data: {
              name: `UniProfs AI - ${planName} Plan`,
            },
            unit_amount: price * 100, // Stripe expects cents (e.g., 20 * 100 = 2000)
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId: user._id.toString(),
        planName,
        price,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Stripe checkout session creation failed" });
  }
};

export const stripeWebhook = async (req, res) => {
  const payload = req.body; // Buffer
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, planName, price } = session.metadata;

    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      await User.findByIdAndUpdate(userId, {
        hasPaid: true,
        paidPlan: planName,
        paidAmount: price,
        paymentDate: new Date(),
        planExpiresAt: expirationDate,
        $push: { paymentHistory: { amount: price, plan: planName, date: new Date() } },
      });

       console.log(
      `User ${userId} paid ${price} for ${planName}. Expiring on ${expirationDate}`
    );
    } catch (dbErr) {
      console.error(
        `Failed to update payment status for user ${userId}:`,
        dbErr
      );
    }
  }

  // Return a response to acknowledge receipt
  res.json({ received: true });
};
