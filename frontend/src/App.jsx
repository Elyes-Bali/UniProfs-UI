import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import DashboardPage from "./pages/DashboardPage";
import { useAuthStore } from "./store/authStore";
import HomePage from "./pages/HomePage";
import SummarizePDFPage from "./pages/SummarizePDFPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import TestPage from "./components/TestPage";
import PlansPage from "./pages/PlansPage";
import AdminFinance from "./Admin/AdminFinance";
import AdminUsers from "./Admin/AdminUsers";
import Faq from "./pages/Faq";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/NotFound";
import ContactUsPage from "./pages/ContactUsPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. Check for Authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check for Email Verification
  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // 3. Check for Admin Role
  if (user && user.role !== "admin") {
    // Show an error and redirect unauthorized users to the home page
    toast.error("Access Denied: Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child component
  return children;
};

const PremiumProRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const requiredPlan = "Premium Pro";

  // First, apply general protection checks (Authentication & Verification)
  if (!isAuthenticated) {
    toast.error("Please log in to access this feature.");
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Second, check for the specific plan requirement
  // Check if user exists and if the paidPlan is NOT the required plan
  if (!user || user.paidPlan !== requiredPlan) {
    // Use toast to notify the user why they were redirected
    toast.error(`Access restricted. Requires the "${requiredPlan}" plan.`);
    // Redirect to the plans page where they can upgrade
    return <Navigate to="/plans" replace />;
  }

  // If all checks pass, render the child component
  return children;
};
// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <>
      <Routes>
        {/* FULL SCREEN PAGES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summarizePDF"
          element={
            <ProtectedRoute>
              <SummarizePDFPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatAI"
          element={
            <PremiumProRoute>
              <ChatPage />
            </PremiumProRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          }
        />
        {/* 🔥 ADMIN ROUTES using AdminRoute */}
        <Route
          path="/finance"
          element={
            <AdminRoute>
              <AdminFinance />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        {/* END ADMIN ROUTES */}
        <Route
          path="/FAQ"
          element={
            <ProtectedRoute>
              <Faq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Privacy-Policy"
          element={
            <ProtectedRoute>
              <PrivacyPolicyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contuct-us"
          element={
            <ProtectedRoute>
              <ContactUsPage />
            </ProtectedRoute>
          }
        />
        {/* AUTH PAGES (with background + floating shapes) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <DashboardPage />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <SignUpPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <ResetPasswordPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <EmailVerificationPage />
            </AuthLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
}

/* ------------------ AUTH PAGE LAYOUT ------------------ */
function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br 
      from-gray-900 via-green-900 to-emerald-900
      flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {children}
    </div>
  );
}

export default App;
