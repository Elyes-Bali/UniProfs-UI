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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

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

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

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
  const Nav = () => (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 w-screen bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100"
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
  return (
    <div>
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
    </div>
  );
};

export default NavBar;
