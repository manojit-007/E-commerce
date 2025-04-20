import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQItem = ({ question, answer }) => (
  <AccordionItem
    value={question}
    className="bg-transparent 
    px-4 py-2 mb-2 transition-shadow duration-300 border"
  >
    <AccordionTrigger className="text-lg font-semibold text-blue-800 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200">
      {question}
    </AccordionTrigger>
    <AccordionContent className="text-gray-700 dark:text-gray-400  leading-relaxed">
      {answer}
    </AccordionContent>
  </AccordionItem>
);

export default FAQItem;
