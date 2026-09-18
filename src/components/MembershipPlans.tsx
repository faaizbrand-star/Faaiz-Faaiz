import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { SiteContent, PlanItem } from '../types';

interface MembershipPlansProps {
  plansData: SiteContent['plans'];
  onSelectPlan: (planName: string) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({
  plansData,
  onSelectPlan
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('quarterly');

  return (
    <section id="membership" className="py-24 bg-[#123D32] relative overflow-hidden border-t border-[#1E5747]">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#1E5747]/50 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold">
            <span className="edot" />
            <span>{plansData.badge || "Choose Your Plan"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold text-[#EFFAF5] tracking-tight">
            {plansData.headline || "Membership Plans"}
          </h2>

          <p className="text-sm sm:text-base text-[#BFE5D5] max-w-xl mx-auto font-sans">
            {plansData.subheadline || "Three ways to join. Pick the level that fits your trading journey."}
          </p>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plansData.items.map((plan) => {
            const isYearly = plan.id === 'yearly';
            const isLifetime = plan.id === 'lifetime';
            const price = plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 p-8 ${
                  isYearly
                    ? 'bg-gradient-to-b from-[#F2D231]/15 to-[#194C3D]/95 border-2 border-[#F2D231] shadow-[0_0_40px_rgba(242,210,49,0.25)] lg:-translate-y-2'
                    : isLifetime
                    ? 'bg-[#194C3D]/90 border border-[#F2D231]/50 hover:border-[#F2D231] shadow-xl'
                    : 'bg-[#194C3D]/70 border border-[#F2D231]/25 hover:border-[#F2D231]/50 shadow-lg'
                }`}
              >
                {/* Top Badge / Pill */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-spacemono uppercase font-bold tracking-wider bg-[#F2D231] text-[#123D32] shadow-[0_0_15px_rgba(242,210,49,0.4)]">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-spacemono uppercase tracking-widest text-[#D4B22A] font-bold">
                      {plan.tag || 'MEMBERSHIP TIER'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif-italic font-bold text-white mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-xs text-[#D6F0E5] mb-6 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#1E5747]">
                    <span className="text-2xl font-serif-italic text-[#F2D231]">$</span>
                    <span className="text-5xl font-mono font-bold text-white tracking-tight">
                      {price}
                    </span>
                    <span className="text-xs font-spacemono text-[#BFE5D5] ml-2">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-[#D6F0E5]">
                        <div className="w-4 h-4 rounded-full bg-[#1E5747] border border-[#F2D231]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#F2D231]" />
                        </div>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      isYearly
                        ? 'bg-[#F2D231] text-[#123D32] hover:bg-[#FFE873] active:bg-[#D4B22A] shadow-[0_0_25px_rgba(242,210,49,0.35)]'
                        : isLifetime
                        ? 'bg-[#1E5747] text-white border border-[#F2D231] hover:bg-[#F2D231] hover:text-[#123D32]'
                        : 'bg-[#1E5747]/80 text-[#EFFAF5] border border-[#F2D231]/30 hover:border-[#F2D231] hover:text-[#F2D231]'
                    }`}
                  >
                    <span>Join {plan.name.replace(' VIP', '')} &mdash; ${price}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-[10px] text-[#BFE5D5] font-spacemono">
                      Instant VIP Telegram Onboarding
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Disclaimer */}
        <p className="text-center text-xs text-[#BFE5D5]/80 font-spacemono mt-12 max-w-2xl mx-auto">
          {plansData.disclaimer || "All payments are non-refundable. Education and analysis room access only."}
        </p>
      </div>
    </section>
  );
};
