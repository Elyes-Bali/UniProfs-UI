import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import NavBar from '../components/NavBar';

const contactDetails = [
//   { icon: Mail, label: 'Email Address', value: 'heallinkteam@gmail.com', delay: 0.8 },
//   { icon: Phone, label: 'Phone Number', value: '+1 (555) 012-3456', delay: 0.9 },
  { icon: MapPin, label: 'Location', value: 'Tunisia', delay: 1.0 },
];

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMailto = (e) => {
    e.preventDefault();
    
    // Simple client-side validation
    if (!formData.name || !formData.email || !formData.message) {
        alert("Please fill out all fields before sending the message.");
        return;
    }

    const recipient = 'heallinkteam@gmail.com';
    // Encode components for a URL
    const subject = encodeURIComponent(`New Contact Message from ${formData.name}`);
    const body = encodeURIComponent(`Sender Name: ${formData.name}\nSender Email: ${formData.email}\n\n---\n\nMessage:\n${formData.message}`);

    // Construct the mailto link
    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Open the user's default email client
    window.location.href = mailtoLink;
  };

  // --- Framer Motion Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const formItemVariants = (delay) => ({
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { delay, duration: 0.7, ease: "easeOut" } }
  });

  const buttonHover = {
    scale: 1.02,
    boxShadow: "0px 0px 16px rgba(168, 85, 247, 0.9)",
    transition: { duration: 0.2 }
  };

  return (
    <>
    <NavBar/>
   
    <div className="min-h-screen bg-gray-900 p-4 sm:p-12 font-sans relative overflow-hidden">
      
      {/* Animated Subtle Background Glow (Pulse Effect) */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 z-0"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-10 z-0"
      />


      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        
        {/* Left Side: Contact Info & Header */}
        <div className="lg:pr-8">
          <motion.h1 
            variants={itemVariants} 
            className="text-6xl font-black text-white mb-4 tracking-tighter"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-purple-300 mb-12 max-w-md"
          >
            We're here to help you conquer your studies. Click "Send Message" to open your email client with the details pre-filled.
          </motion.p>

          {/* Contact Details */}
          <div className="space-y-6">
            {contactDetails.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={formItemVariants(item.delay)}
                  className="flex items-start p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition duration-300"
                >
                  <Icon className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-400 uppercase">{item.label}</p>
                    <p className="text-lg text-white font-medium">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Right Side: Contact Form */}
        <motion.div 
          className="bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl border border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Send Us a Message</h2>

          <form onSubmit={handleMailto} className="space-y-6">
            {/* Name Field */}
            <motion.div variants={formItemVariants(0.6)}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
                placeholder="Jane Doe"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div variants={formItemVariants(0.7)}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
                placeholder="jane@example.com"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div variants={formItemVariants(0.8)}>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300 resize-none"
                placeholder="I need help with..."
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={formItemVariants(0.9)}
              whileHover={buttonHover}
              whileTap={{ scale: 0.98 }}
              className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg transition duration-300 
                bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50`}
            >
              <Send className="w-5 h-5 mr-3" />
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
     </>
  );
};

export default ContactUsPage;