import React from "react";
import { Button } from "@/components/ui/button";

const CallToAction = ({ title, description, buttonText, onClick }) => (
  <section className="py-12 bg-blue-600 text-white text-center">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="mb-6 text-lg">{description}</p>
    <Button
      className="px-6 py-3 bg-white text-blue-600 rounded-lg text-lg hover:bg-gray-200 transition shadow-lg"
      aria-label={buttonText}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  </section>
);

export default CallToAction;
