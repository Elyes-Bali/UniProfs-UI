import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, UserCheck } from 'lucide-react';
import NavBar from '../components/NavBar';

// The content of the Privacy Policy document is placed directly into a constant for rendering.
const PRIVACY_POLICY_CONTENT = {
  title: "Privacy Policy",
  lastUpdated: "November 21, 2025",
  sections: [
    {
      id: "info-collect",
      icon: FileText,
      title: "1. Information We Collect",
      items: [
        {
          title: "1.1 Information You Provide",
          text: "When you register, we collect information such as your email address, password (hashed), and display name. Crucially, we collect the documents, notes, and transcripts you upload (e.g., PDFs, TXT files) and any text you input for processing. This is the core data processed by our Large Language Models (LLMs) to deliver the Services.",
          color: "text-blue-500"
        },
        {
          title: "1.2 Information Collected Automatically",
          text: "This includes Usage Data (features accessed, time spent on tasks, documents processed) and Technical Data (IP address, browser type, operating system, and unique device identifiers).",
          color: "text-blue-500"
        }
      ]
    },
    {
      id: "info-use",
      icon: UserCheck,
      title: "2. How We Use Your Information",
      items: [
        {
          title: "To Provide Services",
          text: "To generate summaries, create custom quizzes, develop flashcards, and explain complex concepts based on your uploaded User Content.",
          color: "text-green-500"
        },
        {
          title: "Service Improvement",
          text: "To analyze usage patterns and improve the accuracy, relevance, and performance of our AI models and platform features.",
          color: "text-green-500"
        },
        {
          title: "Security and Communication",
          text: "To protect our Services against security threats and to send you service announcements, security alerts, and administrative messages.",
          color: "text-green-500"
        }
      ]
    },
    {
      id: "data-processing",
      icon: Shield,
      title: "3. Data Processing of User Content",
      items: [
        {
          title: "Non-Sharing & Isolation",
          text: "Your User Content (uploaded documents) is **not shared with or sold to third parties**. User Content is processed solely by our LLMs and internal systems, employing data isolation techniques.",
          color: "text-purple-500"
        },
        {
          title: "De-identification for Training",
          text: "For the purpose of continuously training and improving the underlying LLMs, we may use de-identified or anonymized components of your usage data or outputs (e.g., abstract data patterns).",
          color: "text-purple-500"
        }
      ]
    },
    {
      id: "data-sharing",
      icon: Lock,
      title: "4. Data Sharing and Disclosure",
      items: [
        {
          title: "Service Providers",
          text: "We engage third-party companies (e.g., cloud hosting and database providers) who are bound by strict confidentiality obligations to perform services on our behalf.",
          color: "text-red-500"
        },
        {
          title: "Legal Compliance",
          text: "We may disclose your information if required to do so by law or in response to valid requests by public authorities.",
          color: "text-red-500"
        },
        {
          title: "Business Transfers",
          text: "In the event of a merger, acquisition, or asset sale, your personal information may be transferred to the new owners.",
          color: "text-red-500"
        }
      ]
    },
    // Sections 5, 6, and 7 are summarized into a final summary section for brevity and visual appeal.
    {
      id: "retention-rights",
      icon: Lock,
      title: "5. Data Security, Retention, and Your Rights",
      items: [
        {
          title: "Data Security and Retention",
          text: "We implement robust technical and organizational measures, including encryption, to protect your data. We retain data only as long as necessary to provide the Services or until you request deletion.",
          color: "text-yellow-500"
        },
        {
          title: "Your Rights & Changes",
          text: "You have the right to access, update, correct, or request the deletion of your personal data. We will notify you of any material changes to this Policy by updating the 'Last Updated' date.",
          color: "text-yellow-500"
        }
      ]
    }
  ]
};

/**
 * Renders the content of a single section.
 */
const PolicySection = ({ section, index }) => {
  const SectionIcon = section.icon;

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 + index * 0.1 } }
  };

  return (
    <motion.div
      variants={sectionVariants}
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="flex items-center mb-6">
        <SectionIcon className="w-8 h-8 text-purple-600 mr-4" />
        <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
      </div>
      
      <div className="space-y-6 border-l-4 border-purple-200 pl-6">
        {section.items.map((item, itemIndex) => (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + itemIndex * 0.05 }}
            className="relative"
          >
            {/* Visual indicator dot */}
            <div className={`absolute -left-9 top-1 w-4 h-4 rounded-full ${item.color.replace('text-', 'bg-')} ring-4 ring-white`}></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed text-base">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <>
        <NavBar />
   
    <div className="min-h-screen p-4 sm:p-10 font-sans bg-gray-50">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 mb-12 bg-white rounded-xl shadow-xl border-t-4 border-purple-600"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {PRIVACY_POLICY_CONTENT.title}
          </h1>
          <p className="text-md text-gray-500 font-medium">
            Last Updated: {PRIVACY_POLICY_CONTENT.lastUpdated}
          </p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-gray-700 max-w-3xl mx-auto px-4"
          >
            This policy describes how we collect, use, and share information in connection with your use of our AI-powered academic preparation tools. Your privacy and security are our top priority.
          </motion.p>
        </motion.header>

        {/* Policy Sections */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {PRIVACY_POLICY_CONTENT.sections.map((section, index) => (
            <PolicySection 
              key={section.id} 
              section={section} 
              index={index} 
            />
          ))}
        </motion.div>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} UniProfs AI. All rights reserved.
        </footer>
      </div>
    </div>
     </>
  );
}

export default PrivacyPolicyPage
