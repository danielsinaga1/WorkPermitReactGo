import { useState } from "react";
import { ChevronDown } from "lucide-react";

type AccordionProps = { title: string; items: string[] };

export const Accordion = ({ title, items }: AccordionProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-xl shadow-md overflow-hidden border border-gray-200 bg-white transition-all duration-300">
      <button onClick={() => setOpen(!open)} className={`px-6 py-4 flex justify-between items-center w-full text-left transition-colors duration-300 ${open ? "bg-blue-50" : "hover:bg-gray-50"}`}>
        <h3 className="text-sm md:text-[15px]  font-semibold text-gray-800 font-poppins">{title}</h3>
        <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${open ? "rotate-180 text-blue-600" : "rotate-0"}`} />
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="bg-gray-50 px-6 py-4">
            <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm md:text-base font-inter">
              {items.map((item, index) => (
                <li key={index} className="text-[13px] md:text-md leading-relaxed hover:text-blue-600 transition">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
