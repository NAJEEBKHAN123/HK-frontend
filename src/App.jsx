import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import OrderForm from "./pages/OrderForm";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import AdminDashboard from "./pages/adminPages/AdminDashboard";
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
import PartnerSignup from "./components/auth/PartnerSignup";
import SignupWithReferral from "./pages/SignupWithReferral ";
import Cards from "./components/Cards";
import PartnersList from "./pages/adminPages/PartnersList";
import PartnerDetail from "./pages/adminPages/PartnerDetails";
import ClientDetail from "./pages/adminPages/ClientDetail";
import ClientList from "./pages/adminPages/ClientList";
import PartnerLogin from "./pages/PartnerPages/PartnerLogin";
import PartnerDashboard from "./pages/PartnerPages/PartnerDashboard";
import PartnerProtectedRoute from "./pages/PartnerPages/PartnerProtectedRoute";
import ClientCompDetail from "./pages/PartnerPages/ClientsCompDetails";
import ServicePricing from "./components/ServicePricing";
import AdminOrderDetails from "./pages/adminPages/AdminOrderDetails";

 
// Admin Layout Wrapper
const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Add admin-specific headers/sidebars here if needed */}
      {children}
    </div>
  );
};

// Partner Layout Wrapper
const PartnerLayout = ({ children }) => {
  return (
    <div className="partner-layout">
      {/* Add partner-specific headers/sidebars here if needed */}
      {children}
    </div>
  );
};

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
          <Route path="/pricingCards" element={<Cards />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/order-form" element={<OrderForm />} />
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/payment-cancelled" element={<CancelPage />} />
          <Route path="/partner-signup" element={<PartnerSignup />} />
          <Route path="/serviceCards" element={<ServicePricing />} />

          <Route path="*" element={<NotFound />} />

          {/* Legal Routes */}
          <Route path="/legal" element={<Legal />}>
            <Route index element={<Navigate to="privacy" replace />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="notices" element={<LegalNotices />} />
            <Route path="conditions" element={<Conditions />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="choices" element={<Choices />} />
          </Route>

          <Route path="/team" element={<TeamMember />} />
          <Route path="/signup" element={<SignupWithReferral />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  <Route element={<AdminProtectedRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="orders" element={<AllOrders />} />
                    <Route path="create-partner" element={<GenerateInvite />} />
                    <Route path="partners" element={<PartnersList />} />
                    <Route path="partners/:id" element={<PartnerDetail />} />
                    <Route path="client/:id" element={<ClientDetail />} />
                    <Route path="client" element={<ClientList />} />
                    <Route path="orders/:orderId" element={<AdminOrderDetails />} />
                  </Route>
                </Routes>
              </AdminLayout>
            }
          />

          {/* Partner Routes */}
          <Route
            path="/partner/*"
            element={
              <PartnerLayout>
                <Routes>
                  <Route path="login" element={<PartnerLogin />} />
                  <Route element={<PartnerProtectedRoute />}>
                    <Route path="dashboard" element={<PartnerDashboard />} />
                    <Route path="client/:id" element={<ClientCompDetail />} />
                  </Route>
                </Routes>
              </PartnerLayout>
            }
          />
        </Routes>

        <Footer />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;