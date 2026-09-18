import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SiteContent } from '../types';

interface FAQSectionProps {
  faqData: SiteContent['faq'];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const items = faqData.items || [];
  const categories = ['All', 'General', 'Curriculum', 'Risk & Philosophy', 'Membership'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#123D32] relative overflow-hidden border-t border-[#1E5747]">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold">
            <span className="edot" />
            <span>{faqData.badge || 'TRANSPARENT CLARITY'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold text-[#EFFAF5] tracking-tight">
            {faqData.headline || 'Frequently Asked Questions'}
          </h2>

          <p className="text-sm sm:text-base text-[#BFE5D5] max-w-xl mx-auto font-sans">
            {faqData.subheadline}
          </p>

          {/* Categories */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-spacemono uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1E5747] text-[#F2D231] border border-[#F2D231]/50 font-bold shadow-sm'
                    : 'bg-[#194C3D] text-[#BFE5D5] hover:text-white border border-[#F2D231]/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#194C3D] border-[#F2D231]/50 shadow-lg'
                    : 'bg-[#194C3D]/60 border-[#F2D231]/20 hover:border-[#F2D231]/40'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-serif-italic font-bold text-white pr-4">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#1E5747] text-[#F2D231] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#D6F0E5] leading-relaxed border-t border-[#1E5747] font-sans">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
