import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
  Rocket,
  Shield,
  BarChart,
  Sun,
  FileText,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import NavBar from "../components/NavBar";

const plans = [
  {
    name: "Basic",
    price: 0,
    currency: "$",
    isMonthly: true,
    isPopular: false,
    isUltimate: false,
    description: "Start learning with core features.",
    features: [
      { text: "Limited AI-powered summaries", included: true, icon: BarChart },
      { text: "Basic quiz generator", included: true, icon: Sun },
      { text: "Standard access (no priority)", included: false, icon: XCircle },
      { text: "Ad-supported experience", included: false, icon: XCircle },
      { text: "Limited concept explanation", included: true, icon: XCircle },
    ],
    cta: "Start Free",
    isFree: true, // 👈 to handle button logic
    ctaColor: "bg-gray-600 hover:bg-gray-500 text-white",
    borderColor: "border-gray-500",
    glow: "rgba(107,114,128,0.5)",
  },
  {
    name: "Premium",
    price: 10,
    currency: "$",
    isMonthly: true,
    isPopular: true,
    isUltimate: false,
    description: "Unlock unlimited power for ultimate productivity.",
    features: [
      { text: "Unlimited AI-powered summaries", included: true, icon: Zap },
      {
        text: "Personalized quiz and exam generator",
        included: true,
        icon: Rocket,
      },
      { text: "Priority access to new features", included: true, icon: Shield },
      {
        text: "Ad-free, focused study environment",
        included: true,
        icon: CheckCircle,
      },
      { text: "Direct concept explanation", included: true, icon: CheckCircle },
    ],
    cta: "Subscribe Now",
    ctaColor:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/40",
    special: "Most Popular",
    borderColor: "border-indigo-500",
    glow: "rgba(99,102,241,0.7)",
  },
  {
    name: "Premium Pro",
    price: 20,
    currency: "$",
    isMonthly: true,
    isPopular: false,
    isUltimate: true,
    description:
      "The complete package for dedicated academic and career success.",
    features: [
      {
        text: "Specific AI-summaries for one module",
        included: true,
        icon: TrendingUp,
      },
      { text: "Module-specific flashcard packs", included: true, icon: Rocket },
      {
        text: "Curated practice test questions",
        included: true,
        icon: CheckCircle,
      },
      { text: "AI tutor focused on your module", included: true, icon: Zap },
      {
        text: "Improve your CV with AI-assistance",
        included: true,
        icon: Shield,
      },
      { text: "PDF CV's generation", included: true, icon: FileText },
    ],
    cta: "Go Pro",
    ctaColor:
      "bg-amber-500 hover:bg-amber-600 text-gray-900 shadow-xl shadow-amber-500/40",
    special: "Ultimate Value",
    borderColor: "border-amber-500",
    glow: "rgba(251,191,36,0.7)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const TestPage = () => {
  const { user } = useAuthStore();

  const subscribeToPlan = async (planName, price) => {
    if (!user) return alert("Please log in to subscribe.");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        { userId: user._id, planName, price },
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 font-['Inter'] relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 100% 0%, #4f46e540, transparent 70%), radial-gradient(circle at 0% 100%, #1f293780, transparent 70%)",
            opacity: 0.7,
          }}
        ></div>

        <div className="text-center relative z-10 mb-12">
          <motion.h1
            className="text-4xl sm:text-6xl font-extrabold text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            UniProfs <span className="text-indigo-400">Payment Plans</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-indigo-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Choose a plan to simulate a payment via Stripe Checkout.
          </motion.p>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch relative z-10">
          {plans.map((plan) => {
            const isUltimate = plan.isUltimate;
            const isPopular = plan.isPopular;
            const titleColor = isUltimate
              ? "text-amber-400"
              : isPopular
              ? "text-indigo-400"
              : "text-white";
            const priceColor = isUltimate
              ? "text-amber-400"
              : "text-indigo-400";

            return (
              <motion.div
                key={plan.name}
                className={`relative p-8 rounded-2xl shadow-xl bg-gray-800/90 ${plan.borderColor} border-4 flex flex-col`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.04,
                  rotateY: 2,
                  rotateX: 1,
                  boxShadow: `0 0 60px ${plan.glow}`,
                }}
                style={{ perspective: 1000 }}
              >
                {/* Badges */}
                {isUltimate && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 px-4 py-1 bg-amber-500 text-gray-900 text-sm font-bold uppercase rounded-full shadow-lg transform rotate-3">
                    {plan.special}
                  </div>
                )}
                {!isUltimate && isPopular && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 px-4 py-1 bg-indigo-600 text-white text-sm font-bold uppercase rounded-full shadow-lg transform rotate-3">
                    {plan.special}
                  </div>
                )}

                <h2 className={`text-4xl font-extrabold ${titleColor}`}>
                  {plan.name}
                </h2>
                <p className="mt-2 text-base text-gray-400">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className={`ml-2 text-3xl font-semibold ${priceColor}`}>
                    {plan.currency}
                  </span>
                  <span className="ml-1 text-gray-400">
                    /{plan.isMonthly ? "month" : "year"}
                  </span>
                </div>

                {/* Features */}
                <motion.ul
                  className="mt-8 space-y-4 flex-grow"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  {plan.features.map((feature, i) => {
                    const Icon = feature.icon || CheckCircle;
                    return (
                      <motion.li
                        key={i}
                        className="flex items-start text-gray-300"
                        variants={featureItemVariants}
                      >
                        <div
                          className={`mt-1 mr-3 flex-shrink-0 ${
                            feature.included ? "text-green-400" : "text-red-500"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={
                            feature.included ? "font-medium" : "text-gray-500"
                          }
                        >
                          {feature.text}
                        </span>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                <div className="mt-8">
                  <motion.button
                    onClick={() =>
                      plan.isFree
                        ? alert("You are using the Free plan!")
                        : subscribeToPlan(plan.name, plan.price)
                    }
                    className={`w-full py-4 px-6 rounded-xl text-xl font-bold uppercase tracking-wider ${plan.ctaColor}`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TestPage;
