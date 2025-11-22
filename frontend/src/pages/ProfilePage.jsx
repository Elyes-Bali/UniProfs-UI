import React, { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Users,
  Settings,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  User,
  Edit, // Added Edit icon for the button (was missing in the original imports)
  DollarSign, // Added DollarSign for Billing section
  Calendar, // Added Calendar for subscription timer
  Zap, // Added Zap for plan status
  ChevronLeft, // Added for pagination
  ChevronRight, // Added for pagination
  Upload,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import NavBar from "../components/NavBar";

import Sidebar from "../components/Sidebar";

/**
 * Professional and beautiful user information card with Framer Motion animations.
 */
const UserProfileCard = () => {
  const { user, logout, updateProfile, isLoading, daysRemaining } =
    useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone ? String(user.phone) : "",
    profileImage: null, // Added for file handling
  });

  // Custom Handle File Change function to match the complex input design
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Mock User Data (Retained for displaying static info like department/stats)
  const userData = {
    name: "Alex Johnson",
    title: "Lead UI/UX Designer",
    department: "Product Development",
    avatarUrl: "https://placehold.co/100x100/4F46E5/ffffff?text=AJ",
    stats: [
      { label: "Projects Completed", value: 18 },
      { label: "Tasks Pending", value: 4 },
      { label: "Team Rating", value: "4.9/5" },
    ],
    contact: {
      email: "alex.j@comp.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Preparing to save changes...");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    console.log("FormData ready to send:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    await updateProfile(data); // calls authStore method
    setIsEditing(false);
  };

  // Helper Components for design consistency
  const PlanStatusBadge = () => (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <Zap className="text-yellow-500 h-4 w-4" />
      <span className="text-gray-700">Plan Status:</span>
      <span
        className={`px-3 py-1 rounded-full text-white font-bold text-xs ${
          user?.hasPaid ? "bg-indigo-600" : "bg-red-500"
        }`}
      >
        {user?.hasPaid ? user.paidPlan : "Free Plan"}
      </span>
    </div>
  );

  const SubscriptionTimer = () =>
    user?.hasPaid && (
      <motion.div
        className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center shadow-inner"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Calendar className="h-5 w-5 text-green-600 mr-2" />
        <p className="text-sm text-green-800">
          <span className="font-bold">{daysRemaining} days left</span> on your{" "}
          <b className="text-green-700">{user.paidPlan}</b> plan.
        </p>
      </motion.div>
    );

  return (
    <>
      <motion.div
        className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl shadow-indigo-200/50 w-full  mx-auto border-t-4 border-indigo-500/80"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{
          translateY: -3,
          boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
        }}
        transition={{ duration: 0.3 }}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Profile Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-b border-gray-100">
          {/* Column 1: Avatar and Basic Info */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <img
                className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-500 shadow-xl"
                src={
                  user.profileImage ||
                  "https://placehold.co/112x112/4F46E5/ffffff?text=User"
                }
                alt={`Profile of ${user.name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/112x112/4F46E5/ffffff?text=User";
                }}
              />
              {/* Status Dot */}
              <span className="absolute bottom-1 right-1 h-5 w-5 bg-green-400 rounded-full ring-4 ring-white shadow-md"></span>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left pt-2 flex-grow">
              <h2 className="text-4xl font-extrabold text-gray-900 leading-snug">
                {user.name}
              </h2>
              <p className="text-xl font-medium text-indigo-600 mt-1">
                {user.role}
              </p>
              {/* <p className="text-md text-gray-500 mt-1">{userData.department}</p> */}
            </div>
          </div>

          {/* Column 2: Status and Actions */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-end justify-center space-y-4 pt-4 lg:pt-0">
            <PlanStatusBadge />
            <SubscriptionTimer />

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-[1.02]"
            >
              <Edit size={18} className="inline mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Contact and Payment Section (Original Payment logic is now included in a separate section below the main card on your original code) */}
        <div className="mt-10 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center border-b pb-2">
              <Briefcase className="h-6 w-6 text-purple-500 mr-2" />
              Professional Details
            </h3>
            <div className="space-y-4 text-gray-700 text-lg">
              <div className="flex items-center space-x-4">
                <Mail className="flex-shrink-0 h-6 w-6 text-indigo-500" />
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-indigo-600 font-medium transition break-words"
                >
                  {user.email}
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="flex-shrink-0 h-6 w-6 text-indigo-500" />
                <span className="font-medium">
                  {user.phone || userData.contact.phone}
                </span>
              </div>
              {/* <div className="flex items-center space-x-4">
                <MapPin className="flex-shrink-0 h-6 w-6 text-indigo-500" />
                <span className="font-medium">{userData.contact.location}</span>
              </div> */}
            </div>
          </div>

          {/* This spot is left empty as the billing history was moved to the main content area in your original code */}
          {/* A placeholder can be used here if required to fill the grid, or the layout can be changed to single column */}
          <div className="hidden md:block"></div>
        </div>
      </motion.div>

      {/* Edit Modal (Redesigned) */}
      {isEditing && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-indigo-100"
            initial={{ scale: 0.8, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              Update Profile
            </h2>

            {/* Display status for debugging/context */}
            {isLoading && (
              <p className="text-indigo-500 mb-4">Saving changes...</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full Name"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email Address"
                />
              </div>

              {/* Phone Input - Changed type back to text for consistent styling/handling of non-number characters */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone Number (e.g., 555-123-4567)"
                />
              </div>

              {/* Profile Image Input */}
              {/* <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  // Styled with file pseudo-elements for the professional look
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 p-3 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer"
                  onChange={handleFileChange}
                />
              </div> */}
              <div className="space-y-2">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg transition duration-300 ease-in-out hover:border-indigo-400 hover:bg-indigo-50/50">
                  <div className="space-y-1 text-center">
                    {/* Icon for visual appeal */}
                    <label
                      htmlFor="profile-image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <Upload
                        className="mx-auto h-12 w-12 text-gray-400"
                        aria-hidden="true"
                      />
                    </label>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="profile-image-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        {/* Hidden default file input */}
                        <span>Upload a file</span>
                        <input
                          id="profile-image-upload" // Link label and input
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          className="sr-only" // Hide the native input for custom styling
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">from you storage</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, or JPG (max 10MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-150 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-150 font-medium disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, daysRemaining } = useAuthStore();

  // -------------------------------------------------------------------
  // NEW PAGINATION STATE AND LOGIC
  // -------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set number of payments per page

  // Calculate total number of items and pages
  const totalPayments = user?.paymentHistory?.length || 0;
  const totalPages = Math.ceil(totalPayments / itemsPerPage);

  // Calculate payments to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = user?.paymentHistory
    ? user.paymentHistory.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Pagination Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to close sidebar on screen resize (for better UX when transitioning from mobile to desktop)
  useEffect(() => {
    const handleResize = () => {
      // If screen is lg or wider (1024px), ensure mobile overlay is closed
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the class for the main content area
  // On desktop (lg:), shift the content margin to the right by the sidebar width (w-64)
  const mainContentClass = `flex-1 transition-all duration-300 ease-in-out p-6 pt-4 lg:ml-64`;

  // Pagination UI Component (internal to ProfilePage for convenience)
  const Pagination = ({ totalPages, currentPage, paginate }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full text-gray-700 bg-gray-100 hover:bg-indigo-100 disabled:opacity-50 transition duration-150"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Display only a few page numbers for simplicity */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition duration-150 ${
              currentPage === index + 1
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full text-gray-700 bg-gray-100 hover:bg-indigo-100 disabled:opacity-50 transition duration-150"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };
  // -------------------------------------------------------------------
  // END PAGINATION LOGIC
  // -------------------------------------------------------------------

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* The Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="z-20">
        <NavBar />
      </div>
      {/* Main Header (for mobile menu button) - Simpler but still animated */}
      <header className="lg:ml-64 sticky top-0 bg-white shadow-lg p-4 flex items-center h-16 z-10">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 lg:hidden text-gray-600 hover:text-gray-900 transition duration-150 rounded-full hover:bg-gray-100"
          aria-label="Open sidebar menu"
        >
          <Menu size={24} />
        </button>
        {/* Simple fade-in instead of the complex sparkle/underline animation */}
        <motion.div className="relative inline-block">
          <motion.h1
            className="text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            PROFILE
          </motion.h1>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className={mainContentClass}>
        <div className="flex flex-col items-center space-y-8">
          {/* The new animated User Profile Card */}
          <UserProfileCard />

          {/* Additional content section for layout context (Payment History) */}
          <div className="w-full ">
            <div className="mt-8 bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center border-b pb-2">
                <DollarSign className="h-6 w-6 text-purple-500 mr-2" />
                Billing History
              </h3>

              {/* Payment History List - NOW USES PAGINATED DATA */}
              {user?.paymentHistory?.length > 0 ? (
                <>
                  <ul className="space-y-3">
                    {currentPayments.map((payment, index) => (
                      <li
                        key={index}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center text-sm transition hover:bg-indigo-50"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {payment.plan} Plan
                          </span>
                          <span className="text-xs text-gray-500">
                            Paid on{" "}
                            {new Date(payment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          ${payment.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* Pagination Controls */}
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    paginate={paginate}
                  />
                </>
              ) : (
                <p className="text-gray-500 mt-4 italic">
                  No payment history found.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
