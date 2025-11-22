import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import NavBar from "../components/NavBar";
// Import Recharts components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
// Import icons (you might need to install a library like react-icons)
import {
  FiHome,
  FiSettings,
  FiBarChart2,
  FiUsers,
  FiLogOut,
  FiBriefcase,
} from "react-icons/fi";

// --- 1. Dummy Data for Charts ---
const salesData = [
  { name: "Jan", Sales: 4000, Revenue: 2400 },
  { name: "Feb", Sales: 3000, Revenue: 1398 },
  { name: "Mar", Sales: 2000, Revenue: 9800 },
  { name: "Apr", Sales: 2780, Revenue: 3908 },
  { name: "May", Sales: 1890, Revenue: 4800 },
  { name: "Jun", Sales: 2390, Revenue: 3800 },
];

const activityData = [
  { name: "Mobile", value: 400 },
  { name: "Desktop", value: 300 },
  { name: "Tablet", value: 300 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

// --- 2. New Sidebar Component ---
const Sidebar = ({ handleLogout, userRole }) => {
  // Define links based on user role (example of conditional rendering)
  const navItems = [
    { name: "Overview", icon: FiHome, path: "/dashboard" },
    { name: "Analytics", icon: FiBarChart2, path: "/analytics" },
    {
      name: "Team",
      icon: FiUsers,
      path: "/team",
      hidden: userRole !== "admin",
    },
    { name: "Projects", icon: FiBriefcase, path: "/projects" },
    { name: "Settings", icon: FiSettings, path: "/settings" },
  ].filter((item) => !item.hidden);

  return (
    <nav className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-4 min-h-screen fixed top-0 left-0 pt-20 ">
      <h3 className="text-xl font-bold text-green-400 mb-6 px-2">Navigation</h3>
      <ul className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.path} // Use actual routing here (e.g., react-router-dom Link)
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-green-400 transition duration-150"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-gray-800">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition duration-150"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </nav>
  );
};

// --- 3. Placeholder Chart Components ---
const LineChartCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-96"
  >
    <h3 className="text-xl font-semibold mb-4 text-green-400">
      Sales & Revenue Trends
    </h3>
    <ResponsiveContainer width="100%" height="85%">
      <LineChart
        data={salesData}
        margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #4B5563",
          }}
          labelStyle={{ color: "#F3F4F6" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Revenue"
          stroke="#047857"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Sales"
          stroke="#60A5FA"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </motion.div>
);

const PieChartCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-96"
  >
    <h3 className="text-xl font-semibold mb-4 text-green-400">
      User Activity by Device
    </h3>
    <ResponsiveContainer width="100%" height="85%">
      <PieChart>
        <Pie
          data={activityData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {activityData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #4B5563",
          }}
          labelStyle={{ color: "#F3F4F6" }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </motion.div>
);

// --- 4. The Main Dashboard Component ---
const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  // Card component for reusability (optional but good practice)
  const ProfileCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-96"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        User Profile
      </h2>
      <div className="space-y-4 text-gray-300">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p>
          <strong>Last Login:</strong> {formatDate(user.lastLogin)}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* NavBar: Wrap with high z-index (z-50) for layering */}
      <div className="fixed top-0 left-0 w-full ">
        <NavBar />
      </div>

      {/* Sidebar: Fixed with high z-index (z-40) */}
      <Sidebar handleLogout={handleLogout} userRole={user.role} />

      {/* 💡 NEW WRAPPER FOR CENTERING 💡 */}
      {/* This div handles the centering, but only AFTER the sidebar's width is cleared. */}
      <div className="**md:ml-64**">
        <main className="p-4 md:p-8 mt-20 **w-full** ">
          <h1 className="text-4xl font-extrabold mb-8 text-black">
            Dashboard Overview
          </h1>

          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Full-width chart on large screens, or 2/3 and 1/3 columns */}
            <div className="lg:col-span-2">
              <LineChartCard />
            </div>

            {/* Profile Card and other widgets in the remaining space */}
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            {/* Add more charts/widgets below */}
            <div className="lg:col-span-1">
              <PieChartCard />
            </div>
            <div className="lg:col-span-2">
              {/* Example: Bar Chart - You can define a BarChartCard similar to the others */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-96 flex items-center justify-center"
              >
                <span className="text-lg text-gray-400">
                  Placeholder for another chart (e.g., Bar Chart)
                </span>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
