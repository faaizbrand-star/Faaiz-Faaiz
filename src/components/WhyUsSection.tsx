import React from 'react';
import { Ban, ShieldAlert, Layers, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { SiteContent } from '../types';

interface WhyUsSectionProps {
  whyUsData: SiteContent['whyUs'];
  onOpenApplication: (planTier?: string) => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  whyUsData,
  onOpenApplication
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ban':
        return <Ban className="w-6 h-6 text-[#F2D231]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-[#F2D231]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#F2D231]" />;
      case 'Compass':
      default:
        return <Compass className="w-6 h-6 text-[#F2D231]" />;
    }
  };

  return (
    <section id="why-us" className="py-24 bg-[#123D32] relative overflow-hidden border-t border-[#1E5747]">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#F2D231]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold">
            <span className="edot" />
            <span>{whyUsData.badge || "The Difference"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold text-[#EFFAF5] tracking-tight">
            {whyUsData.headline || "Why Choose This?"}
          </h2>

          <p className="text-sm sm:text-base text-[#BFE5D5] max-w-xl mx-auto font-sans">
            {whyUsData.subheadline || "Join hundreds of traders who choose real education over hype."}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whyUsData.cards.map((card) => (
            <div
              key={card.id}
              className="p-8 rounded-2xl bg-[#194C3D]/70 border border-[#F2D231]/25 hover:border-[#F2D231]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)] group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E5747] border border-[#F2D231]/30 flex items-center justify-center group-hover:border-[#F2D231] transition-colors shadow-[0_0_15px_rgba(242,210,49,0.15)]">
                  {getIcon(card.iconName)}
                </div>
                <span className="text-[10px] font-spacemono uppercase tracking-widest text-[#D4B22A] font-bold">
                  {card.keyPillar}
                </span>
              </div>

              <h3 className="text-2xl font-serif-italic font-bold text-white mb-3 group-hover:text-[#F2D231] transition-colors">
                {card.title}
              </h3>

              <p className="text-sm text-[#D6F0E5] leading-relaxed font-sans">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#194C3D] via-[#1E5747] to-[#194C3D] border border-[#F2D231]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-xl font-serif-italic font-bold text-white">
              Ready to learn how markets actually move?
            </h4>
            <p className="text-xs text-[#BFE5D5] font-spacemono mt-1">
              Stop following blind calls. Master spot accumulation and risk math.
            </p>
          </div>

          <button
            onClick={() => onOpenApplication('Yearly VIP')}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#123D32] bg-[#F2D231] hover:bg-[#FFE873] transition-all shadow-[0_0_20px_rgba(242,210,49,0.3)] flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Join FaaizDurrani VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
