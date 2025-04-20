import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { faqs, features } from "@/data/data";
import FAQItem from "@/components/reusableComponents/faqItems";
import FeatureCard from "@/components/reusableComponents/featureCard";
import Title from "@/components/reusableComponents/title";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full min-h-screen dark:bg-[#111]">
      {/* Set Page Title */}
      <Title title="Home - WanderShop" />

      {/* Hero Section */}
      <header
        className="flex flex-col items-center justify-center text-center bg-cover bg-center min-h-[60vh] max-w-[1280px] mx-auto py-20 px-6"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      >
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Discover Amazing Deals on WanderShop
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Shop from a wide range of products with secure payment options and fast delivery.
        </p>
        <div className="flex space-x-4">
          <Button
            onClick={() => navigate("/allProducts")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition shadow-lg"
            aria-label="Shop Now"
          >
            Shop Now
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition shadow-lg"
            aria-label="Profile"
          >
            Profile
          </Button>
        </div>
      </header>

      {/* Website Features */}
      <section className="py-16 px-6 max-w-[1280px] mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Why Choose Us?
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          We provide top-notch services to ensure a seamless shopping experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-[1280px] mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default Home;
