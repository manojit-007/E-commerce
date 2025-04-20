import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";

const Note = ({ note }) => {
  return (
    <section className="w-[350px] px-2 bg-red-50 border border-red-300">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="note"
          className="bg-transparent transition-shadow duration-300"
        >
          <AccordionTrigger className="text-lg font-semibold m-0 p-1 text-red-700 hover:text-red-800 transition-colors duration-200">
            Imported Note
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed">
            <p>
              {note}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Note;
