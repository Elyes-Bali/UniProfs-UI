// routes/payment.route.js
import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import bodyParser from "body-parser";
import { createCheckoutSession, stripeWebhook } from "../controllers/payment.controller.js";
import { checkPlanExpiration } from "../middleware/checkPlanExpiration.js";

const router = express.Router();

// Endpoint to create checkout session
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Stripe webhook (disable JSON parser for this endpoint)
router.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhook);

router.get("/protected-route", verifyToken, checkPlanExpiration, (req, res) => {
  res.json({ message: "Access granted" });
});


export default router;
