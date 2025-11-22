import React, { useState, useEffect } from "react";
import {
 Menu,
 Users,
 DollarSign,
 User,
 Loader2,
 ArrowLeft, // New icon for pagination
 ArrowRight, // New icon for pagination
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore"; 
import NavBar from "../components/NavBar";
import AdminSideBar from "./AdminSideBar";

const AdminFinance = () => {
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [usersList, setUsersList] = useState([]);
 const [allPayments, setAllPayments] = useState([]);
 const [isLoading, setIsLoading] = useState(true);

 // 1. PAGINATION STATE
 const [currentPage, setCurrentPage] = useState(1);
 const paymentsPerPage = 15; // Number of payments to show per page

 const { fetchAllUsers } = useAuthStore(); 

 const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
 };

 // Effect to fetch all users and process payment data (Unchanged)
 useEffect(() => {
  const handleResize = () => {
   if (window.innerWidth >= 1024) {
    setIsSidebarOpen(false);
   }
  };

  const loadUsers = async () => {
   setIsLoading(true);
   try {
    const users = await fetchAllUsers(); 
    setUsersList(users);
    
    const flattenedPayments = users.flatMap(user => 
     user.paymentHistory?.map(payment => ({
      ...payment,
      userName: user.name,
      userId: user._id, 
      id: payment.id || `${user._id}-${payment.date}`, 
     })) || [] 
    );

    // Sort by date (newest first)
    flattenedPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

    setAllPayments(flattenedPayments);
   } catch (err) {
    console.error("Error fetching users and payments:", err);
    setAllPayments([]);
   } finally {
    setIsLoading(false);
   }
  };
  
  loadUsers();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
 }, [fetchAllUsers]);

 // 2. PAGINATION LOGIC
 const indexOfLastPayment = currentPage * paymentsPerPage;
 const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
 const currentPayments = allPayments.slice(indexOfFirstPayment, indexOfLastPayment);

 const totalPages = Math.ceil(allPayments.length / paymentsPerPage);

 const paginate = (pageNumber) => {
  if (pageNumber > 0 && pageNumber <= totalPages) {
   setCurrentPage(pageNumber);
  }
 };
 
 const mainContentClass = `flex-1 transition-all duration-300 ease-in-out p-6 pt-4 lg:ml-64`;

 return (
  <div className="min-h-screen bg-gray-100 flex flex-col">
   {/* Sidebar and Header (unchanged) */}
   <AdminSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
   <div className="z-20">
    <NavBar />
   </div>
   <header className="lg:ml-64 sticky top-0 bg-white shadow-md p-4 flex items-center h-16 z-20">
    <button
     onClick={toggleSidebar}
     className="p-2 mr-4 lg:hidden text-gray-600 hover:text-gray-900 transition duration-150 rounded-full hover:bg-gray-200"
     aria-label="Open sidebar menu"
    >
     <Menu size={24} />
    </button>
    <motion.div className="relative inline-block">
     <motion.h1
      className="text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
     >
      Admin Dashboard
     </motion.h1>
    </motion.div>
   </header>

   {/* Main Content Area */}
   <main className={mainContentClass}>
    <div className="mt-8 bg-white p-6 rounded-xl shadow-2xl">
     <h3 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
      <DollarSign className="w-8 h-8 mr-3 text-green-500" />
      All Users Payment History
     </h3>
     
     {isLoading ? (
      <div className="flex justify-center items-center py-12">
       <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
       <p className="text-lg text-gray-600">Gathering payment data...</p>
      </div>
     ) : (
      <div className="overflow-x-auto mt-4">
       {allPayments.length > 0 ? (
        <>
         <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
           <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"><User className="inline w-4 h-4 mr-1"/> User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
           </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
           {/* 3. MAPPING THE PAGINATED DATA */}
           {currentPayments.map((payment) => (
            <tr key={payment.id} className="hover:bg-green-50 transition-colors">
             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.userName}</td>
             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
               {payment.plan || <span className="text-gray-400">N/A</span>}
             </td>
             <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
              <span className="text-green-600">${payment.amount ? payment.amount.toFixed(2) : '0.00'}</span>
             </td>
             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {new Date(payment.date).toLocaleDateString()}
             </td>
            </tr>
           ))}
          </tbody>
         </table>
         
         {/* 4. PAGINATION CONTROLS */}
         {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center p-4 border-t border-gray-200">
{/*            <span className="text-sm text-gray-700">
            Showing **{indexOfFirstPayment + 1}** to **
            {Math.min(indexOfLastPayment, allPayments.length)}** of **
            {allPayments.length}** entries
           </span> */}
           <div className="flex space-x-2">
            <button
             onClick={() => paginate(currentPage - 1)}
             disabled={currentPage === 1}
             className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors flex items-center"
             aria-label="Previous page"
            >
             <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </button>
            <span className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-lg">
             {currentPage} / {totalPages}
            </span>
            <button
             onClick={() => paginate(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors flex items-center"
             aria-label="Next page"
            >
             Next <ArrowRight className="w-4 h-4 ml-1" />
            </button>
           </div>
          </div>
         )}
        </>
       ) : (
        <p className="text-gray-500 mt-4 text-center p-6 bg-gray-50 rounded-lg">
         No payment history found across all users.
        </p>
       )}
      </div>
     )}
    </div>
   </main>
  </div>
 );
};

export default AdminFinance;