import React from "react";
import Hero from "../components/HeroSec";
import Cards from "../components/Cards";
import OurServices from "../components/OurService";
import WhoWeAre from "../components/WhoWeAre";
import ContactUs from "../components/Contact";
import Faq from "../pages/Faq";
import CookieConsent from "./legal/Choices";
import ServicePricing from "../components/ServicePricing";
import SEO from "../components/SEO";

const Home = () => {
  return (
    <div>
       <SEO
        title="Créer une Société à Hong Kong en 2024 | Expert Incorporation & Avantages Fiscaux"
        description="✅ Ouvrir une société offshore à Hong Kong avec 0% impôt..."
      />
      <Hero />
      <Cards />
      <OurServices />
      <ServicePricing />
      <Faq />
      <WhoWeAre />
      <ContactUs />
      <CookieConsent onlyShowOnHomePage={true} />
    </div>
  );
};

export default Home;
