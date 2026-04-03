import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/FogotPassword";
import UserManagment from "./pages/usermanagment/UserManagment";
import Verification from "./pages/verification/Verification";
import Dashboard from "./pages/dashboard/Dashboard";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import UserDetail from "./pages/usermanagment/UserDetail";
import RequestsManagement from "./pages/requests-management/RequestsManagement";
import RequestsDetails from "./pages/requests-management/RequestsDetails";
import CustomerRequests from "./pages/requests-management/CustomerRequests";
import BusinessRequests from "./pages/requests-management/BusinessRequests";
import PaymentManagement from "./pages/payment-management/PaymentManagement";
import NotFound from "./pages/NotFound";
import PublicRoute from "./route/PublicRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      {" "}
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute />}>
            <Route index element={<Login />} />
            {/* <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="reset-password" element={<ResetPassword />} /> */}
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-management/*" element={<UserManagment />} />

            <Route path="/user-management/:userType">
              <Route index element={<UserManagment />} />
              <Route
                path="/user-management/:userType/:id"
                element={<UserDetail />}
              />
            </Route>

            <Route path="/user-management/:userType">
              <Route index element={<UserManagment />} />
              <Route
                path="/user-management/:userType/:id"
                element={<UserDetail />}
              />
            </Route>
            <Route path="/verification" element={<Verification />} />
            <Route
              path="/requests-management"
              element={<RequestsManagement />}
            />
            <Route path="/requests/customer" element={<CustomerRequests />} />
            <Route path="/requests/business" element={<BusinessRequests />} />
            <Route path="/requests/:id" element={<RequestsDetails />} />
            <Route path="/payment-management" element={<PaymentManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
