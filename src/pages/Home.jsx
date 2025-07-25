import React from "react";
import Hero from "../components/HeroSec";
import Cards from "../components/Cards";
import OurServices from "../components/OurService";
import WhoWeAre from "../components/WhoWeAre";
import ContactUs from "../components/Contact";
import Faq from "../pages/Faq";
import BookingModal from "../components/BookingModal";
import CookieConsent from "./legal/Choices";
import ServicePricing from "../components/ServicePricing";

const Home = () => {
  return (
    <div>
      <Hero />
      <Cards />
      <OurServices />
      <ServicePricing />
      <Faq />
      <WhoWeAre />
      <BookingModal id="booking-section" />
      <ContactUs />
      <CookieConsent onlyShowOnHomePage={true} />
    </div>
  );
};

export default Home;
