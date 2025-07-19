import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import OurServices from "./components/OurService";
import WhoWeAre from "./components/WhoWeAre";
import ScrollToTop from "./pages/ScrollToTop";
import Footer from "./components/Footer";
import Faq from "./pages/Faq";
import ContactUs from "./components/Contact";
import BookingModal from "./components/BookingModal";
import OrderForm from "./pages/OrderForm";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import { Navigate } from "react-router-dom";
import AdminLogin from "./pages/adminPages/AdminLogin";
import AdminProtectedRoute from "./pages/adminPages/AdminProtectedRoute";
import AllOrders from "./pages/adminPages/AllOrders";
import Legal from "./pages/Legal";
import Privacy from "./pages/legal/Privacy";
import LegalNotices from "./pages/legal/legalNotices";
import Conditions from "./pages/legal/Conditions";
import Cookies from "./pages/legal/Cookies";
import Accessibility from "./pages/legal/Accessibility";
import Choices from "./pages/legal/Choices";
import TeamMember from "./pages/TeamMember";
import NotFound from "./pages/NotFound";
import GenerateInvite from "./components/admin/GenerateInvite";
import Contacts from "./pages/adminPages/Contacts";
import PartnerSignup from "./components/auth/PartnerSignup";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ScrollToTop />
        <TopBar />
        <Navbar />

        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<OurServices />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/faq" element={<Faq />} />
          <Route
            path="/booking-section"
            id="booking-section"
            element={<BookingModal />}
          />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/order-form" element={<OrderForm />} />
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/payment-cancelled" element={<CancelPage />} />

          {/* No fonud route  */}
          <Route path="*" element={<NotFound />} />

          {/* Partner sign up  */}
          <Route path="/partner-signup" element={<PartnerSignup />} />


          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/orders" element={<AllOrders />} />
          <Route path="/admin/create-partner" element={<GenerateInvite />} />
          <Route path="/admin/contacts" element={<Contacts />} />




          {/* Legal Routes */}
          <Route path="/legal" element={<Legal />}>
            <Route index element={<Navigate to="/legal" replace />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="notices" element={<LegalNotices />} />

            <Route path="conditions" element={<Conditions />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="choices" element={<Choices />} />
          </Route>
          <Route path="/team" element={<TeamMember />} />

          {/* Admindashboard  */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
