import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Icons from lucide-react
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import NavBar from '../components/NavBar';

/**
 * Data structure for the FAQ items, covering the core capabilities
 */
const faqData = [
  {
    id: 1,
    question: "What types of files can I upload for summarization?",
    answer: "You can upload PDF documents, lecture notes, course transcripts, and various text-based documents. The AI processes the content to provide concise, digestible, and focused summaries."
  },
  {
    id: 2,
    question: "How are the custom quizzes generated and are they personalized?",
    answer: "Our system uses advanced LLMs to analyze your specific uploaded material (PDFs, notes, etc.) and generate multiple-choice, true/false, or short-answer questions specifically tailored to test your retention and identify knowledge gaps in that content."
  },
  {
    id: 3,
    question: "Is the practice exam simulation timed and realistic?",
    answer: "Yes, the simulation feature generates full-length, randomized exams designed to mimic real university or certification conditions, including strict time limits, varied difficulty, and detailed performance reports."
  },
  {
    id: 4,
    question: "Can I edit the flashcards after they are generated?",
    answer: "Absolutely. Once your course content is converted into a flashcard deck, you have full control to edit, rearrange, delete, or add new cards to fully personalize your spaced repetition learning flow."
  },
  {
    id: 5,
    question: "How does the 'Explain Difficult Concepts' feature work?",
    answer: "Simply input the complex theory, formula, or term, and the feature provides step-by-step, plain-language explanations, often incorporating real-world analogies and examples to ensure immediate understanding and deeper conceptual clarity."
  },
  {
    id: 6,
    question: "Is my uploaded study material kept private?",
    answer: "Privacy is paramount. All uploaded documents are encrypted and only used by our AI models to generate your requested academic tools (summaries, quizzes, flashcards). We do not share or distribute your content."
  }
];

/**
 * Individual Accordion Item component with Framer Motion animations.
 */
const AccordionItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants for the whole item (staggered initial load)
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.08 } }
  };

  // Animation variants for the content (open/close)
  const contentVariants = {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 }
  };

  // Dynamic classes for the button based on its state
  const buttonClasses = `flex justify-between items-center w-full text-left font-semibold py-2 transition-colors duration-200 ${
    isOpen ? 'text-purple-700 text-xl' : 'text-gray-800 text-lg'
  }`;

  // Dynamic classes for the container based on its state
  const containerClasses = `bg-white p-6 mb-4 rounded-2xl shadow-xl transition duration-300 transform hover:scale-[1.01] cursor-pointer 
    ${isOpen 
      ? 'shadow-purple-300/50 ring-4 ring-purple-300 border-purple-300' 
      : 'hover:shadow-2xl border border-indigo-100'
    }`;

  return (
    <motion.div
      layout 
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className={containerClasses}
    >
      {/* Question Header */}
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <span className="flex items-center">
          <HelpCircle className={`w-6 h-6 mr-4 transition-colors duration-200 ${isOpen ? 'text-purple-600' : 'text-indigo-400'}`} />
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-7 h-7 transition-colors duration-200 ${isOpen ? 'text-purple-600' : 'text-indigo-400'}`} />
        </motion.div>
      </motion.button>

      {/* Answer Content - Animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={contentVariants}
            // Use a specific ease for a premium, slightly bouncier feel
            transition={{ duration: 0.4, ease: "easeInOut" }} 
            className="overflow-hidden pt-2"
          >
            <p className="pt-4 text-gray-700 border-t border-purple-200 mt-4 leading-relaxed text-base pl-10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Faq = () => {
 return (
        <>
      <NavBar />
    <div className="min-h-screen p-4 sm:p-8 font-sans bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 mb-8"
        >
          <Sparkles className="w-8 h-8 mx-auto text-purple-600 mb-2 transform hover:rotate-180 transition duration-500" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our Focused Academic Preparation tool.
          </p>
        </motion.header>

        {/* FAQ Accordion List */}
        <motion.div
          layout
          className="space-y-4"
        >
          {faqData.map((item, index) => (
            <AccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              index={index}
            />
          ))}
        </motion.div>

        {/* Removed the Call to Action/Support Footer as requested */}

      </div>
    </div>
    </>
  );
};

export default Faq
