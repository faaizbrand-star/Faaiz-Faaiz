import React from 'react';
import { VIPContentFeed } from './VIPContentFeed';

interface VipSignalsSectionProps {
  onOpenMembership: (tier?: string) => void;
}

export const VipSignalsSection: React.FC<VipSignalsSectionProps> = ({ onOpenMembership }) => {
  return (
    <section
      id="vip-signals"
      className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0c2620] text-slate-900 dark:text-[#D6F0E5] transition-colors border-t border-b border-slate-200 dark:border-[#1E5747] relative overflow-hidden"
    >
      {/* Subtle ambient lighting glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F2D231]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <VIPContentFeed onOpenMembership={onOpenMembership} showTitleHeader={true} />
      </div>
    </section>
  );
};

export { VIPContentFeed } from './VIPContentFeed';
export default VipSignalsSection;
