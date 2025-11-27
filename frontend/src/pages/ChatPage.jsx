import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Upload,
  FileText,
  User,
  Bot,
  Loader2,
  MessageSquare,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useChatStore } from "../store/chatStore";
import NavBar from "../components/NavBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// --- CONFIGURATION & MOCK DATA ---
const BOT_NAME = "Insight Tutor";
const USER_ID = "You";

// --- Message Bubble Component ---
const MessageBubble = ({ message }) => {
  const isBot = message.sender === "bot";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const detectLanguage = (text) => {
    // Basic language detection based on Unicode ranges
    if (/[\u0621-\u064A]/.test(text)) return "ar-SA"; // Arabic
    if (/[éèêàçùâôîï]/i.test(text)) return "fr-FR"; // French
    return "en-US"; // Default English
  };

  const speakMessage = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.pitch = 1;
    utterance.rate = 1;

    const selectedLang = detectLanguage(message.content);
    utterance.lang = selectedLang;

    // Try to match a voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) => voice.lang === selectedLang);

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);

    window.speechSynthesis.speak(utterance);
  };

  const avatar = isBot ? (
    <div className="bg-indigo-500 text-white p-2 rounded-full shadow-lg">
      <Bot size={18} />
    </div>
  ) : (
    <div className="bg-teal-500 text-white p-2 rounded-full shadow-lg">
      <User size={18} />
    </div>
  );

  const bubbleClasses = isBot
    ? "bg-gray-100 text-gray-800 rounded-br-2xl rounded-tr-2xl rounded-tl-sm self-start shadow-md"
    : "bg-teal-500 text-white rounded-bl-2xl rounded-tl-2xl rounded-tr-sm self-end shadow-lg";

  const content =
    message.type === "file" ? (
      <div className="flex items-center space-x-3 p-3 bg-white/70 text-gray-800 rounded-xl border border-gray-300">
        <FileText className="text-indigo-600" size={24} />
        <div>
          <p className="font-semibold">
            {message.content.includes("Uploaded file:")
              ? message.content.replace("Uploaded file: ", "")
              : message.content}
          </p>
          <p className="text-sm text-gray-500">Document ready.</p>
        </div>
      </div>
    ) : (
      <div className="flex justify-between items-start">
        <p className="flex-1">{message.content}</p>
        {isBot && (
          <button
            onClick={speakMessage}
            className="ml-3 mt-1 text-gray-500 hover:text-indigo-600 transition"
          >
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className={`flex items-start max-w-3/4 mb-6 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && avatar}
      <div className={`p-4 mx-3 transition duration-300 ${bubbleClasses}`}>
        <div className="text-xs font-semibold mb-1 opacity-70">
          {isBot ? BOT_NAME : USER_ID}
        </div>
        {content}
        <div className="text-right text-xs mt-1 opacity-50">
          {message.timestamp}
        </div>
      </div>
      {!isBot && avatar}
    </motion.div>
  );
};

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const {
    messages,
    isLoading,
    handleSendMessage,
    handleAnswerQuestion,
    error,
  } = useChatStore();

  const chatEndRef = useRef(null);
  const isWaiting = messages.some((msg) => msg.isWaitingForResponse);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading || (!input.trim() && !file)) return;

    if (isWaiting) {
      handleAnswerQuestion(input);
    } else {
      handleSendMessage(input, file);
      setFile(null);
    }

    if (!file) {
      setInput("");
    } else if (file && isWaiting) {
      setInput("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInput(`Ready to process: ${selectedFile.name}`);
    }
  };

  const downloadChatAsPDF = async () => {
    const input = document.getElementById("chat-area");
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("chat_conversation.pdf");
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col flex-grow w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
         <header className="p-4 sm:p-6 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-md">
  <div className="flex items-center w-full">
    
    {/* Left Side - Icon + Title */}
    <div className="flex items-center space-x-3">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          type: "tween",
          ease: "easeInOut",
        }}
        className="bg-indigo-600 p-2 rounded-full text-white"
      >
        <MessageSquare size={24} />
      </motion.div>

      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        Insight AI Study Assistant
      </h1>
    </div>

    {/* Center - Status Message */}
    <span className="mx-auto text-sm text-gray-500 hidden sm:block">
      {isWaiting ? "Awaiting your response..." : "Ready for a new task."}
    </span>

    {/* Right Side - PDF Button + Label */}
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 font-medium hidden sm:block">
        Download PDF
      </span>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadChatAsPDF}
        className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:shadow-xl"
      >
        <FileText size={24} />
      </motion.button>
    </div>
  </div>
</header>


          {/* Chat Area */}
          <main
            id="chat-area"
            className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 md:space-y-6 bg-gray-50"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start my-4"
                >
                  <div className="bg-gray-200 text-gray-600 p-3 rounded-full shadow-inner">
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                  <p className="ml-3 text-sm text-gray-500 self-center">
                    {file ? "Processing file..." : "Thinking..."}
                  </p>
                </motion.div>
              )}

              {error && (
                <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-xl">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </main>

          {/* Footer */}
          <motion.footer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "tween" }}
            className="p-4 sm:p-6 bg-white border-t border-gray-200 sticky bottom-0 z-10"
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-3"
            >
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className={`p-3 rounded-full transition-all duration-300 ${
                  isWaiting || isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600 cursor-pointer shadow-lg hover:shadow-xl"
                }`}
              >
                <Upload size={24} className="text-white" />
              </label>

              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isWaiting
                    ? "Type your answer here..."
                    : "Type your prompt or see file name after selecting..."
                }
                disabled={isLoading}
                className={`flex-grow p-3 sm:p-4 border rounded-full text-gray-800 focus:ring-4 focus:ring-teal-200 transition-all duration-300 focus:border-teal-400 focus:outline-none 
                  ${
                    isWaiting
                      ? "bg-teal-50 border-teal-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading || (!input.trim() && !file)}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg 
                  ${
                    isLoading || (!input.trim() && !file)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600 text-white hover:shadow-xl"
                  }`}
              >
                <Send size={24} />
              </motion.button>
            </form>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 flex items-center space-x-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-sm"
                >
                  <FileText size={18} />
                  <span className="font-medium truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setInput("");
                    }}
                    className="ml-auto text-indigo-500 hover:text-indigo-700 font-bold"
                  >
                    X
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.footer>
        </motion.div>
      </div>
    </>
  );
};

export default ChatPage;
