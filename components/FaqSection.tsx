
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ } from '../types';

interface FaqSectionProps {
    faqs: FAQ[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Only show published FAQs
  const displayFaqs = faqs.filter(f => f.status !== 'draft');

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">FAQ</h2>
          <p className="text-xs font-bold text-gray-500 mt-2 tracking-widest">
            よくある質問
          </p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-sm md:text-base text-gray-900 pr-8">
                  <span className="text-blue-600 mr-3 font-black">Q.</span>
                  {faq.q}
                </span>
                <span className="flex-shrink-0 text-gray-400">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-0 text-sm text-gray-600 font-medium leading-relaxed bg-white">
                  <span className="text-gray-900 mr-3 font-black">A.</span>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
