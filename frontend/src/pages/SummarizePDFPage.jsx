import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Settings,
  Zap,
  ArrowRight,
  User,
} from "lucide-react";
import NavBar from "../components/NavBar";
import { useAuthStore } from "../store/authStore";
import { useSummarizeStore } from "../store/summarizeStore"; // 🔥 Import the new store
import { useNavigate } from "react-router-dom";

// === CONSTANTS & UTILS ===
const usePageLogic = () => {
  const { user } = useAuthStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const hasPaid = user?.hasPaid || false;
  const currentUsage = user?.serviceUsageCount || 0;
  const MAX_FREE_USAGE = 3;
  const userTier = isSubscribed ? "Premium" : "Free";
  // 🔥 NEW: Extract paidPlan from user
  const paidPlan = user?.paidPlan || null;
  const summariesRemaining = hasPaid
    ? "Unlimited"
    : Math.max(0, MAX_FREE_USAGE - currentUsage); // Calculate remaining

  // 💡 Use state from useSummarizeStore for showUpgradePopup
  const showUpgradePopup = useSummarizeStore((state) => state.showUpgradePopup);
  const setShowUpgradePopup = useSummarizeStore((state) => state.setShowUpgradePopup);


  const handleSubscribe = () => {
    console.log("Navigating to Subscription/Payment Page...");
    setIsSubscribed(true);
  };

  return {
    userTier,
    summariesRemaining,
    handleSubscribe,
    hasPaid,
    paidPlan,
    currentUsage,
    MAX_FREE_USAGE,
    showUpgradePopup,
    setShowUpgradePopup,
    isSubscribed, // Added this return for PDFUploadCard
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
const hoverScale = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

// === COMPONENTS ===
const AppHeader = ({ userTier }) => {
  const { user, logout, updateProfile, isLoading, daysRemaining } = useAuthStore();

  return (
    <motion.header
      variants={itemVariants}
      className="flex justify-between items-center p-4 border-b border-indigo-100 bg-white sticky top-0 z-10 shadow-sm rounded-t-xl"
    >
      <div className="flex items-center space-x-2">
        <Zap className="text-indigo-600" size={24} />
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
          UniProfs AI
        </h1>
      </div>
      <div className="flex items-center space-x-3 text-sm font-medium">
        <User className="text-gray-500" size={16} />
        <span className="text-gray-700">User Status: </span>
        <span className="px-3 py-1 rounded-full bg-yellow-100">
          {user?.hasPaid ? (
            <p style={{ marginTop: "1px", color: "#31922EFF" }}>
              <b> {user.paidPlan} plan</b>
            </p>
          ) : (
            <p style={{ marginTop: "1px", color: "#AF0202FF" }}>Free Plan</p>
          )}
        </span>
      </div>
    </motion.header>
  );
};


const PDFUploadCard = ({ summariesRemaining, onFileSelect, isSubscribed }) => {
  const [fileName, setFileName] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName("Invalid file. Please drop a PDF.");
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 h-full flex flex-col"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Upload className="mr-2 text-indigo-500" /> Upload Document
      </h2>
      <motion.div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        whileHover={{ scale: 1.005, backgroundColor: "#eef2ff" }}
        className="flex-grow flex flex-col justify-center items-center border-2 border-dashed border-indigo-400 p-8 rounded-xl transition duration-200 cursor-pointer text-center bg-indigo-50/50"
      >
        <FileText className="text-indigo-600 mb-3" size={48} />
        <p className="text-lg font-semibold text-gray-700">
          Drag & Drop Your PDF Here
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or click to browse (Max 10MB)
        </p>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="pdf-upload"
          onChange={(e) =>
            e.target.files[0] &&
            (setFileName(e.target.files[0].name),
            onFileSelect(e.target.files[0]))
          }
        />
        <label
          htmlFor="pdf-upload"
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
        >
          Select PDF
        </label>
      </motion.div>

      {fileName && (
        <p className="mt-4 text-sm text-center text-green-600 font-medium truncate">
          File ready: {fileName}
        </p>
      )}
      <p className="mt-4 text-sm text-gray-500 text-center">
        <span className="font-semibold text-indigo-600">
          {summariesRemaining === 0 && !isSubscribed
            ? "0 (Limit Reached)"
            : summariesRemaining}{" "}
          Handle case
        </span>{" "}
        summaries remaining this month.🔥
      </p>
    </motion.div>
  );
};

const SettingsCard = ({ settings, setSettings }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 h-full flex flex-col"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <Settings className="mr-2 text-indigo-500" /> Summarization Settings
    </h2>
    <div className="space-y-4 flex-grow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Focus Area (for students)
        </label>
        <select
          value={settings.focus}
          onChange={(e) => setSettings({ ...settings, focus: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        >
          <option>Key Concepts & Definitions</option>
          <option>Exam Practice Questions</option>
          <option>Formulas and Equations</option>
          <option>Historical/Contextual Background</option>
          <option>Answer Questions</option>
          <option>Convert courses into flashcards</option>
          <option>Check and improve assignment</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Output Language
        </label>
        <select
          value={settings.language}
          onChange={(e) =>
            setSettings({ ...settings, language: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        >
          <option>French (Français)</option>
          <option>Arabic (العربية)</option>
          <option>English</option>
        </select>
      </div>
    </div>
  </motion.div>
);

// === NEW: Loading Animation Component ===

const LoadingAnimation = () => {
  // Defines the transition properties for the continuous loop
  const dotTransition = {
    // Use a keyframes transition for infinite repetition
    repeat: Infinity, // This is the key to ensuring it never stops
    duration: 0.6,
    ease: "easeInOut",
    repeatType: "reverse", // Ensures a smooth up-and-down bounce
  };

  return (
    <div className="flex flex-col justify-center items-center text-center p-12 bg-indigo-50/50 rounded-xl flex-grow h-64">
      <div className="flex space-x-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            // Use keyframes array [initial, low point] for Y-axis movement
            animate={{ y: ["0px", "15px"] }}
            // The delay is applied to the entire repeating sequence
            transition={{
              ...dotTransition,
              delay: i * 0.15,
            }}
            className="block h-5 w-5 rounded-full bg-indigo-600 shadow-md"
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-xl font-bold text-indigo-800 mt-2"
      >
        Processing PDF...
      </motion.p>
      <p className="text-sm text-gray-600 mt-1">
        Analyzing document and generating AI insights.
      </p>
    </div>
  );
};
// === PAGINATED RESULTS COMPONENT ===
const ResultsAndMonetization = ({
  userTier,
  summary, // Summary now comes from the main component's state (which is the store's state)
  loading, // Loading now comes from the main component's state (which is the store's state)
  handleSubscribe,
  hasPaid,
}) => {
  const PAGE_SIZE = 5000; // characters per page
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleNav = () => {
    navigate("/plans"); // ✅ Navigate to /plans
  };
  useEffect(() => {
    if (summary) {
      const splitPages = [];
      for (let i = 0; i < summary.length; i += PAGE_SIZE) {
        splitPages.push(summary.slice(i, i + PAGE_SIZE));
      }
      setPages(splitPages);
      setCurrentPage(0);
    }
  }, [summary]);

  return (
    <motion.div
      variants={itemVariants}
      className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-indigo-200 flex flex-col"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FileText className="mr-2 text-indigo-500" /> AI Summary Output
      </h2>

      <style>
        {`
.ai-summary-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
  box-sizing: border-box;
}

/* Each section as a card, stacked vertically */


/* Nested sections */


/* Hover effect for cards */


/* Headings */
.ai-summary-container h2 {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.ai-summary-container h3 {
  color: #4338ca;
  font-size: 1.2rem;
  margin: 16px 0 8px 0;
}

/* Lists */
.ai-summary-container ul {
  padding-left: 20px;
  list-style: none;
}

.ai-summary-container li {
  margin-bottom: 10px;
  position: relative;
  padding-left: 20px;
}

.ai-summary-container li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #4f46e5;
  font-weight: bold;
}

/* Labels */


/* Pagination */
.ai-summary-container .pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.ai-summary-container .pagination button {
  background: #4f46e5;
  color: #fff;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.ai-summary-container .pagination button:hover {
  background: #3730a3;
  transform: scale(1.05);
}

.ai-summary-container .pagination button:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ai-summary-container section {
    padding: 16px;
  }
  .ai-summary-container h2 {
    font-size: 1.3rem;
  }
  .ai-summary-container h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .ai-summary-container {
    padding: 8px;
    font-size: 14px;
  }
  .ai-summary-container section {
    padding: 12px;
  }
}

`}
      </style>

      {loading ? (
        <LoadingAnimation />
      ) : pages.length > 0 ? (
        <div className="ai-summary-container">
          <div dangerouslySetInnerHTML={{ __html: pages[currentPage] }} />
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))
              }
              disabled={currentPage === pages.length - 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center p-10 bg-gray-50 rounded-xl flex-grow">
          <Zap className="text-indigo-400 mb-4" size={32} />
          <p className="text-xl font-semibold text-gray-700">
            Your summary will appear here after processing.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The AI process typically takes 1-3 minutes.
          </p>
        </div>
      )}

     {!hasPaid && ( // The box should only show if the user has NOT paid
        <motion.div className="mt-6 p-4 bg-indigo-200 rounded-lg text-indigo-800 border border-indigo-400 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Zap className="mr-3 text-indigo-700" />
            <p className="font-semibold text-center md:text-left">
              Unlock <span className="underline">unlimited summaries</span> and
              all features for just
              <span className="text-xl font-extrabold ml-2">10 $/month!</span>
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={hoverScale}
            onClick={handleNav}
            className="mt-3 md:mt-0 px-6 py-2 bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-800 transition duration-150"
          >
            Go Premium
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

// ... (before SummarizePDFPage)

// === PROGRESS BAR COMPONENT ===
const ProgressBar = ({ progress }) => {
  let statusText = "";
  if (progress < 50) {
    statusText = `Extracting Text... (${progress}%)`;
  } else if (progress < 100) {
    statusText = `AI Summarizing Chunks... (${progress}%)`;
  } else {
    statusText = "Finalizing Summary... (100%)";
  }

  // Ensure progress is between 0 and 100
  const displayProgress = Math.min(100, Math.max(0, progress));

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-4 rounded-xl shadow-inner border border-indigo-200"
    >
      <p className="text-sm font-semibold text-indigo-700 mb-2">{statusText}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-indigo-500 h-2.5 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// ... (rest of the file)
// summarizePDFPage.jsx - NEW COMPONENT

const UpgradePopup = ({ isVisible, onClose, onUpgrade, maxUsage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
      >
        <Zap className="text-red-500 mx-auto mb-4" size={32} />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Upgrade Required
        </h3>
        <p className="text-gray-600 mb-6">
          You've reached your limit of **{maxUsage}** free usages for Document
          Summaries and CV Improvements.
        </p>
        <a
          href="/plans"
          className="w-full px-4 py-2  bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md mb-3"
        >
          Upgrade to Premium Plan
        </a>
        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition duration-150"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};
// === PAGE COMPONENT ===
const SummarizePDFPage = () => {
  const {
    userTier,
    summariesRemaining,
    handleSubscribe,
    hasPaid,
    paidPlan,
    currentUsage,
    MAX_FREE_USAGE,
    showUpgradePopup,
    isSubscribed,
    setShowUpgradePopup,
  } = usePageLogic();

  // 🔥 1. Get the new store actions/state
  const {
    summary,
    loading,
    progress,
    handleSummarize: storeHandleSummarize, // Rename to avoid conflict
    handleImproveCV: storeHandleImproveCV,   // Rename to avoid conflict
  } = useSummarizeStore();


  // 2. Only keep file and settings local state
  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState({
    length: "Concise",
    focus: "Key Concepts & Definitions",
    language: "English",
  });

  // 3. Define checkLimit to use local context but trigger store action
  const checkLimit = () => {
    if (!hasPaid && currentUsage >= MAX_FREE_USAGE) {
      setShowUpgradePopup(true);
      return true;
    }
    return false;
  };
  
  // 4. Define local wrapper functions to call the store actions
  const onSummarizeClick = () => {
    // Pass the required parameters to the store action
    storeHandleSummarize(file, settings, checkLimit, hasPaid);
  };

  const onImproveCVClick = () => {
    // Pass the required parameters to the store action
    storeHandleImproveCV(file, settings, checkLimit, hasPaid);
  };

  // 🔥 5. Remove the obsolete local handleSummarize and handleImproveCV functions

  return (
    <>
      <NavBar />{" "}
      <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
        {" "}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full rounded-3xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-sm"
        >
          <AppHeader userTier={userTier} />{" "}
          <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {" "}
            <div className="lg:col-span-1 flex flex-col space-y-6">
              {" "}
              <PDFUploadCard
                summariesRemaining={summariesRemaining}
                onFileSelect={setFile}
                isSubscribed={isSubscribed}
              />{" "}
              <SettingsCard settings={settings} setSettings={setSettings} />
              <div className="lg:col-span-1 flex flex-col space-y-6">
                {/* ... other components ... */}
                <motion.button
                  onClick={onSummarizeClick} 
                  disabled={loading || !file}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-2 w-full px-6 py-3 font-bold rounded-xl shadow-md transition duration-150 flex justify-center items-center ${
                    loading || !file
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {loading
                    ? `Processing... ${progress}%`
                    : "Summarize Document"}
                  <ArrowRight className="ml-2" size={20} />
                </motion.button>
                {/* 💡 Display the progress bar conditionally */}
                {loading && <ProgressBar progress={progress} />}
              </div>
{hasPaid && paidPlan === "Premium Pro" && (
                <div className="lg:col-span-1 flex flex-col space-y-6">
                  <motion.button
                    onClick={onImproveCVClick} 
                    whileTap={{ scale: 0.95 }}
                    disabled={loading || !file}
                    className={`mt-4 w-full px-6 py-3 font-bold rounded-xl shadow-md transition duration-150 flex justify-center items-center ${
                        loading || !file
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                  >
                    Improve My CV
                  </motion.button>
                </div>
              )}
              {/* 💡 Progress Bar here (moved inside the main section block for flow) */}
              {/* Removed redundant progress bar here, one is above the improve CV button */}
            </div>{" "}
            <ResultsAndMonetization
              userTier={userTier}
              summary={summary} // 🔥 Pass store state
              loading={loading} // 🔥 Pass store state
              handleSubscribe={handleSubscribe}
              hasPaid={hasPaid}
            />{" "}
            <UpgradePopup
              isVisible={showUpgradePopup}
              onClose={() => setShowUpgradePopup(false)}
              onUpgrade={handleSubscribe}
              maxUsage={MAX_FREE_USAGE}
            />
          </div>{" "}
        </motion.div>{" "}
      </div>{" "}
    </>
  );
};

export default SummarizePDFPage;