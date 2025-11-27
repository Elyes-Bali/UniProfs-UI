import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  ClipboardCheck,
  Tally3,
  Menu,
  X,
  ArrowRight,
  DollarSign,
  University,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Quote,
  PlayCircle, // Added for video section icon
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
// --- Framer Motion Variants for Staggered Animations ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// --- Feature Data ---
const features = [
  {
    icon: BookOpen,
    title: "Summarize PDFs & Courses",
    description:
      "Instantly condense lengthy lecture notes and documents into focused, digestible, AI-powered summaries.",
  },
  {
    icon: HelpCircle,
    title: "Generate Custom Quizzes",
    description:
      "Create personalized practice quizzes on any uploaded content to test your retention and knowledge gaps effectively.",
  },
  {
    icon: Lightbulb,
    title: "Explain Difficult Concepts",
    description:
      "Get simple, step-by-step explanations for complex theories, perfect for immediate understanding and deeper clarity.",
  },
  {
    icon: ClipboardCheck,
    title: "Simulate Practice Exams",
    description:
      "Generate full-length, timed practice exams that mimic real university conditions for stress-free preparation.",
  },
  {
    icon: Tally3,
    title: "Convert to Flashcards",
    description:
      "Transform course content into organized, effective digital flashcard decks for efficient spaced repetition learning.",
  },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  // Animated Button Component
  const AnimatedButton = ({
    children,
    className = "",
    href = "#",
    delay = 0.5,
  }) => (
    <motion.a
      href={href}
      className={`px-10 py-4 font-extrabold text-lg rounded-full transition-all duration-300 transform inline-flex items-center justify-center space-x-3 ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 15px 30px rgba(79, 70, 229, 0.6)",
        y: -4,
      }}
      whileTap={{ scale: 0.95, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.a>
  );

  // Navigation Component
  const Nav = () => (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100"
    >
      <div className="w-full px-8 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <GraduationCap className="w-8 h-8 mr-2 text-indigo-700" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-500">
            <NavLink to="/">UniProfs AI</NavLink>
          </span>
        </div>

        {/* Desktop Menu */}
        {user?.role !== "admin" ? (
          <nav className="hidden md:flex space-x-10">
            <a
              href="/"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Home
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>

            <a
              href="/summarizePDF"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              AI Summary
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>

            {user && user.hasPaid && user.paidPlan === "Premium Pro" && (
              <a
                href="/chatAI"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                UniProfs Tutor
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </a>
            )}

            <a
              href="/profile"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Profile
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>

             {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                LogOut
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            ) : (
              <area
                href="/login"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Login
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </area>
            )}
          </nav>
        ) : (
          <nav className="hidden md:flex space-x-10">
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Dashboard
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                LogOut
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            ) : (
              <area
                href="/login"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Login
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </area>
            )}
          </nav>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: {
            height: "auto",
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 },
          },
          closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
        }}
      >
        {user?.role !== "admin" ? (
          <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
            <NavLink
              to="/"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/summarizePDF"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Summary
            </NavLink>
            {user && user.hasPaid && user.paidPlan === "Premium Pro" && (
              <NavLink
                to="/chatAI"
                className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                UniProfs Tutor
              </NavLink>
            )}
            <NavLink
              to="/profile"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </NavLink>

            <NavLink
              to="/contuct-us"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
            <NavLink
              to="/dashboard"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          </div>
        )}
      </motion.div>
    </motion.header>
  );

  // Hero Section - Ultra Enhanced, Split Layout
  const HeroSection = () => (
    <section
      id="home"
      className="relative pt-24 pb-40 bg-gray-950 text-white overflow-hidden flex items-center justify-center min-h-[85vh]"
    >
      {/* Dynamic Background Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #1f2937 1px, transparent 1px), linear-gradient(#1f2937 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>
      {/* Animated Glows */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-15"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-[150px] opacity-15"
        animate={{ scale: [1.1, 1, 1.1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      <div className="w-full px-8 sm:px-6 lg:px-8 relative z-10 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.p
              className="text-indigo-300 uppercase font-bold tracking-widest mb-4 flex justify-center lg:justify-start items-center text-sm md:text-base"
              variants={itemVariants}
            >
              <University className="w-5 h-5 mr-2 text-teal-400" />
              AI-Powered Learning Platform
            </motion.p>

            <motion.h1
              className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-white drop-shadow-lg"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-300 inline-block">
                Precision
              </span>{" "}
              Study Tools for Exams
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl lg:max-w-none mx-auto mb-10 leading-relaxed"
              variants={itemVariants}
            >
              The definitive AI system engineered for Tunisian university
              students to streamline preparation, conquer complex modules, and
              achieve academic excellence.
            </motion.p>

            <motion.div
              className="flex justify-center lg:justify-start space-x-4"
              variants={itemVariants}
            >
              {user && !user.hasPaid && (
                <AnimatedButton
                  className="bg-teal-400 text-gray-900 hover:bg-teal-500 shadow-teal-500/50"
                  href="#pricing"
                  delay={0.6}
                >
                  Start Your Plan
                </AnimatedButton>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Placeholder */}
          <motion.div
            className="hidden lg:flex justify-center p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
          >
            {/* Placeholder for a Dashboard Mockup / Illustration */}
            <div className="w-full max-w-lg h-96 bg-gray-800 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-indigo-700/50 p-4 relative overflow-hidden">
              <div className="h-full bg-gray-900 rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-indigo-300 border-b border-indigo-700 pb-3 mb-4">
                  <div className="font-semibold text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" /> AI Dashboard Preview
                  </div>
                  <div className="text-sm">Module: Java EE</div>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="h-4 bg-teal-400/30 rounded w-1/3 animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>
                <div className="mt-6 flex justify-end">
                  <div className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm">
                    Review Summary
                  </div>
                </div>
              </div>
              {/* Subtle screen reflection/glow */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  // Feature Card Component - Enhanced Design with 3D feel
  const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
      className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-start h-full transform-gpu overflow-hidden transition-shadow duration-300 hover:shadow-indigo-300/40 group"
      variants={itemVariants}
      whileHover={{
        y: -15,
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)",
        scale: 1.03,
        rotateY: [0, 1, -1, 0],
        transition: { duration: 0.6, ease: "easeInOut" }, // No spring here
      }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      <div className="relative z-10">
        <div className="p-4 mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white shadow-xl transform transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
      </div>
      {/* Background shape blur */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 rounded-full filter blur-3xl opacity-10 transition-opacity duration-500 group-hover:opacity-20"></div>
    </motion.div>
  );

  // Features Section
  const FeaturesSection = () => (
    <section
      id="features"
      className="py-32 bg-gradient-to-b from-white to-indigo-50 border-t border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            className="text-base text-indigo-700 font-semibold tracking-wide uppercase flex justify-center items-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Core Capabilities
          </motion.p>
          <motion.h2
            className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            The Future of Focused Academic Preparation
          </motion.h2>
        </div>

        {/* Outer container for the grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Row 1: The first 3 features are mapped directly into the 3-column grid */}
          {features.slice(0, 3).map((feature, index) => (
            <div key={feature.title}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            </div>
          ))}

          {/* Row 2: Contains a flex container spanning all columns to center the remaining 2 cards */}
          <div className="lg:col-span-3">
            <motion.div
              // This is the fix: use flexbox on the wrapper to center the remaining items
              className="flex justify-center flex-wrap gap-12 pt-0 lg:pt-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.slice(3, 5).map((feature, index) => (
                <div
                  key={feature.title}
                  className="w-full md:w-1/2 lg:w-96 max-w-sm"
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    // Adjust delay based on the index in the original array (3 and 4)
                    delay={(index + 3) * 0.1}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // --- NEW: Video Showcase Section ---
  const VideoShowcaseSection = () => {
    // Placeholder video data (replace src with actual embedded URLs or video links)
    const videos = [
  {
    title: "AI Summaries in Action",
    description:
      "See how UniProfs AI instantly converts long PDFs into concise, test-ready summaries. Save hours of study time.",
    src: "https://res.cloudinary.com/dgl9rp1vu/video/upload/v1763812698/AI-Summary_eezzx4.mp4",
  },
  {
    title: "UniProfs AI Tutor in Action",
    description:
      "Watch a live demo of our custom Questions generator, tailored precisely to your uploaded course materials.",
    src: "https://res.cloudinary.com/dgl9rp1vu/video/upload/v1763812648/tutor-version3_wnmlmv.mp4",
  },
];


    const VideoCard = ({ title, description, src, delay }) => (
      <motion.div
        className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col h-full overflow-hidden"
        variants={itemVariants}
        whileHover={{
          y: -8,
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 70, 229, 0.3)",
        }}
        transition={{ delay: delay, duration: 0.5 }}
      >
        {/* Video Embed Container */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative group">
          <iframe
            className="w-full h-full transform transition-transform duration-500 group-hover:scale-[1.03]"
            src={src}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          {/* Play Icon Overlay (Optional visual cue) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-lg" />
          </div>
        </div>

        <h3 className="text-3xl font-extrabold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
      </motion.div>
    );

    return (
      <section
        id="video-showcase"
        className="py-24 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.p
              className="text-base text-teal-700 font-semibold tracking-wide uppercase flex justify-center items-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <PlayCircle className="w-5 h-5 mr-2 text-teal-600" />
              See It To Believe It
            </motion.p>
            <motion.h2
              className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              A Quick Look at Our Core Services
            </motion.h2>
          </div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {videos.map((video, index) => (
              <VideoCard
                key={video.title}
                title={video.title}
                description={video.description}
                src={video.src}
                delay={index * 0.15}
              />
            ))}
          </motion.div>
          <div className="text-center mt-8 mb-15">
            <motion.p
              className="text-base text-teal-700 font-semibold tracking-wide uppercase flex justify-center items-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              Both Videos Were Taken By a Premium Pro Account !
            </motion.p>
          </div>
        </div>
      </section>
    );
  };
  // --- END NEW: Video Showcase Section ---

  // Testimonial / Trust Section
  const TestimonialSection = () => (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
        <motion.div
          className="p-8 md:p-12 bg-gray-50 rounded-2xl shadow-xl border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <Quote className="w-12 h-12 text-indigo-500 mx-auto mb-6 transform -rotate-180" />
          <p className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-snug mb-8">
            "Before using UniProfs AI , I felt overwhelmed. Now I can summarize
            a 100-page course in minutes and get perfect practice quizzes. My
            average grade jumped from 12 to 16!"
          </p>
          <div className="font-semibold text-lg text-gray-900">
            Aya B., <span className="text-indigo-600">Engineering Student</span>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Pricing Section - Ultra Enhanced
  const PricingCard = ({
    title,
    price,
    features,
    isPro,
    ctaText,
    ctaClass,
    delay,
  }) => (
    <motion.div
      className={`p-10 rounded-3xl shadow-3xl border-4 h-full flex flex-col transform-gpu transition-all duration-300 relative overflow-hidden group ${
        isPro
          ? "bg-gradient-to-br from-gray-900 to-indigo-900 text-white border-teal-400 scale-[1.07] z-10"
          : "bg-white text-gray-900 border-gray-200"
      }`}
      variants={itemVariants}
      whileHover={{
        y: isPro ? -15 : -8,
        boxShadow: isPro
          ? "0 40px 80px rgba(79, 70, 229, 0.5)"
          : "0 20px 40px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      {isPro && (
        <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-teal-400 text-gray-900 text-sm font-extrabold uppercase py-2 px-6 rounded-bl-lg shadow-md rotate-3 translate-x-3 translate-y-3">
          TOP VALUE
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-4xl font-extrabold ${
            isPro ? "text-teal-400" : "text-indigo-700"
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="text-7xl font-extrabold mb-8 flex items-baseline">
        {price}
        <span
          className={`text-xl font-medium ml-2 ${
            isPro ? "text-indigo-300" : "text-gray-500"
          }`}
        >
          /month
        </span>
      </div>

      <ul className="space-y-4 mb-12 flex-grow">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            className="flex items-start space-x-3"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.1, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <CheckCircle
              className={`flex-shrink-0 w-6 h-6 ${
                isPro ? "text-teal-400" : "text-green-500"
              }`}
            />
            <span className={isPro ? "text-indigo-100" : "text-gray-700"}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>

      <a
        href="/plans"
        className={`mt-auto text-center py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-2xl transform group-hover:scale-[1.01] ${ctaClass}`}
      >
        {ctaText}
      </a>
    </motion.div>
  );

  const PricingSection = () => (
    <section id="pricing" className="py-32 bg-gray-950 text-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            className="text-base text-teal-400 font-semibold tracking-wide uppercase flex justify-center items-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* <DollarSign className="w-5 h-5 mr-2 text-teal-400" /> */}
            Unlock Unlimited Access
          </motion.p>
          <motion.h2
            className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Free Tier */}
          <PricingCard
            title="Starter"
            price="0 $"
            features={[
              "Limited summary generation",
              "Access to public quiz repository",
              "Basic concept explanations",
              "Ad-supported experience",
              "Community forum support",
            ]}
            isPro={false}
            ctaText="Get Started Free"
            ctaClass="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            delay={0}
          />

          {/* Subscription Tier (7 TND) */}
          <PricingCard
            title="Premium"
            price="10 $"
            features={[
              "Unlimited AI-powered summaries",
              "Personalized quiz and exam generator",
              "Priority access to new features",
              "Ad-free, focused study environment",
              "Direct concept explanation",
            ]}
            isPro={true}
            ctaText="Go Pro Now"
            ctaClass="bg-teal-400 text-gray-900 hover:bg-teal-500 shadow-xl shadow-teal-500/40"
            delay={0.2}
          />

          {/* Paid Bundles Tier (Per Module) */}
          <PricingCard
            title="Premium Pro"
            price="20 $"
            features={[
              "Specific AI-summaries for one module",
              "Module-specific flashcard packs",
              "Curated practice test questions",
              "AI tutor focused on your module",
              "Improve your CV with AI-assistance",
              "PDF CV's generation",
            ]}
            isPro={false}
            ctaText="Buy Now !"
            ctaClass="bg-purple-100 text-purple-700 hover:bg-purple-200"
            delay={0.4}
          />
        </motion.div>

        <motion.p
          className="text-center text-gray-400 mt-20 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Prices are billed monthly in Dollars ($).
        </motion.p>
      </div>
    </section>
  );

  // CTA Section (Repurposed for Login)
  const CTASection = () => (
    <section className="py-28 bg-indigo-600 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Ready to Start Scoring Higher?
        </motion.h2>
        <motion.p
          className="text-xl text-indigo-200 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Sign up now. No credit card required for the 7-day trial.
        </motion.p>
        <AnimatedButton
          className="bg-white text-indigo-700 hover:bg-gray-100 shadow-lg shadow-indigo-900/50"
          href="#"
          delay={0.4}
        >
          Secure Your Free Trial
        </AnimatedButton>
      </div>
    </section>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-950 text-white py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-800 pb-10 mb-10">
          {/* Brand + Description */}
          <div className="space-y-4">
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-center">
              <GraduationCap className="w-7 h-7 mr-2 text-teal-400" />
              UniProfs AI
            </div>
            <p className="text-gray-400 text-sm">
              Intelligent tools for smarter studying. Conquer your modules with
              confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "AI Summary", path: "/summarizePDF" },
                { label: "Pricing", path: "/plans" },
                // { label: "Testimonials", path: "/testimonials" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {[
                // { label: "Help Center", path: "/help" },
                { label: "Contact Us", path: "/contuct-us" },
                { label: "FAQ", path: "/FAQ" },
                // { label: "Sitemap", path: "/sitemap" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {[
                // { label: "Terms of Service", path: "/terms" },
                { label: "Privacy Policy", path: "/Privacy-Policy" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AI Study Helper. All rights
          reserved.
        </p>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800">
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 70, 229, 0.3);
        }
      `}</style>
      <Nav />
      <main>
        <HeroSection />
        <FeaturesSection />
        {/* The new Video Showcase Section is placed here! */}
        <VideoShowcaseSection />
        <TestimonialSection />
        {user && !user.hasPaid && <PricingSection />}
        {user && user.hasPaid && user.paidPlan === "Premium" && (
          <PricingSection />
        )}
        {!user && <PricingSection />}
        {!user && <CTASection />}
      </main>
      <Footer />
    </div>
  );
};
export default HomePage;
