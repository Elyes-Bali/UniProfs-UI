import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Home } from 'lucide-react';
const NotFound = () => {
   const textVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: 0.2
      }
    }
  };

  // Variants for the message
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.0,
        duration: 0.6,
        type: "spring",
        stiffness: 150,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 16px rgba(168, 85, 247, 0.7)", // Purple glow
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  // Variants for the rocket icon
  const rocketVariants = {
    initial: { x: -100, y: 100, rotate: -45, opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
        duration: 1.5,
        delay: 0.4
      }
    },
    float: {
      y: ["0%", "5%", "-5%", "0%"], // Floating effect
      x: ["0%", "2%", "-2%", "0%"],
      transition: {
        y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
        x: { repeat: Infinity, duration: 4, ease: "easeInOut" }
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Animated Particles/Stars (Simplified for CSS) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center text-white"
      >
        {/* Animated Rocket Icon */}
        <motion.div
          variants={rocketVariants}
          initial="initial"
          animate={["animate", "float"]}
          className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2"
        >
          <Rocket className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400 rotate-45 transform" />
        </motion.div>

        {/* Main 404 Text */}
        <motion.h1
          variants={textVariants}
          className="text-9xl sm:text-[180px] font-extrabold text-purple-600 drop-shadow-lg leading-none"
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.p
          variants={messageVariants}
          className="text-2xl sm:text-3xl font-semibold text-gray-200 mt-6 mb-8 max-w-xl mx-auto"
        >
          Lost in the digital cosmos? This page couldn't be found.
        </motion.p>

        {/* Go Home Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => window.location.href = '/'} // Redirect to home
          className="inline-flex items-center px-8 py-4 bg-purple-700 text-white text-lg font-semibold rounded-full shadow-xl hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300"
        >
          <Home className="w-6 h-6 mr-3" />
          Go to Homepage
        </motion.button>
      </motion.div>

      {/* Tailwind CSS for the stars */}
      <style jsx>{`
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 5s infinite ease-in-out alternate;
        }
        .star-1 { top: 10%; left: 15%; width: 3px; height: 3px; animation-delay: 0s; }
        .star-2 { top: 25%; left: 80%; width: 2px; height: 2px; animation-delay: 1.5s; }
        .star-3 { top: 50%; left: 40%; width: 4px; height: 4px; animation-delay: 2.5s; }
        .star-4 { top: 70%; left: 60%; width: 2px; height: 2px; animation-delay: 0.8s; }
        .star-5 { top: 85%; left: 25%; width: 3px; height: 3px; animation-delay: 3.2s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default NotFound
