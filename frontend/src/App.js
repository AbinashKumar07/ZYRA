import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { CatalogProvider } from "@/context/CatalogContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileStickyCta } from "@/components/Shared";
import Home from "@/pages/Home";
import Pairs, { PairDetail } from "@/pages/Pairs";
import { Looks, Themes, ProductDetail, SearchPage } from "@/pages/Catalogue";
import { About, HowItWorks, Tailoring, Faq, Contact } from "@/pages/Content";
import { Merchants, Investors, Founder } from "@/pages/Business";
import { Privacy, Terms, RefundPolicy, MerchantTerms } from "@/pages/LegalPages";
import Admin from "@/pages/Admin";
import Tailor from "@/pages/Tailor";
import NotFound from "@/pages/NotFound";

// <-- Added Import for our new Multi-Tenant Login Page -->
import AuthPage from "@/pages/AuthPage"; 

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
    <CatalogProvider>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pairs" element={<Pairs />} />
          <Route path="/pairs/:id" element={<PairDetail />} />
          <Route path="/looks" element={<Looks />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/tailoring" element={<Tailoring />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/merchant-terms" element={<MerchantTerms />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tailor" element={<Tailor />} />
          
          {/* <-- The new Dynamic Master Auth Route --> */}
          <Route path="/auth/:role" element={<AuthPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileStickyCta />
      <Toaster theme="dark" position="bottom-center" richColors />
    </CatalogProvider>
    </BrowserRouter>
  );
}