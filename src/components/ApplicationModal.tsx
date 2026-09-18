import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: string;
  brandName: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  brandName
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [tier, setTier] = useState(selectedTier || 'Yearly VIP');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and contact email.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, experience: telegram, tier, notes: `Telegram: ${telegram}` })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Submission error. Please retry.');
      }
    } catch (err: any) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#123D32] border border-[#F2D231]/40 shadow-[0_0_50px_rgba(242,210,49,0.25)] p-6 sm:p-8 text-[#D6F0E5] overflow-hidden">
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2D231] to-[#D4B22A]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#194C3D] text-[#BFE5D5] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1E5747] border-2 border-[#F2D231] mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#5FC98A]" />
            </div>

            <h3 className="text-2xl font-serif-italic font-bold text-white">
              Application Received
            </h3>

            <p className="text-xs sm:text-sm text-[#BFE5D5] max-w-md mx-auto leading-relaxed">
              Welcome to FaaizDurrani. Our onboarding team will send your private VIP Telegram invite link and payment invoice to <strong className="text-white">{email}</strong> within 15 minutes.
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F2D231] text-[#123D32] hover:bg-[#FFE873]"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-[10px] font-spacemono uppercase tracking-widest text-[#D4B22A] font-bold">
                INSTANT VIP ONBOARDING
              </div>
              <h3 className="text-2xl font-serif-italic font-bold text-white mt-1">
                Join FaaizDurrani Private Room
              </h3>
              <p className="text-xs text-[#BFE5D5]">
                Direct signals, daily video reasoning, and spot accumulation frameworks.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#E08888]/20 border border-[#E08888]/40 text-xs text-[#E08888]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-spacemono text-[#D4B22A] mb-1">
                FULL NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#194C3D] border border-[#F2D231]/30 text-xs text-white placeholder-[#BFE5D5]/50 focus:outline-none focus:border-[#F2D231]"
              />
            </div>

            <div>
              <label className="block text-xs font-spacemono text-[#D4B22A] mb-1">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#194C3D] border border-[#F2D231]/30 text-xs text-white placeholder-[#BFE5D5]/50 focus:outline-none focus:border-[#F2D231]"
              />
            </div>

            <div>
              <label className="block text-xs font-spacemono text-[#D4B22A] mb-1">
                TELEGRAM USERNAME OR PHONE
              </label>
              <input
                type="text"
                placeholder="@username (for instant invite)"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#194C3D] border border-[#F2D231]/30 text-xs text-white placeholder-[#BFE5D5]/50 focus:outline-none focus:border-[#F2D231]"
              />
            </div>

            <div>
              <label className="block text-xs font-spacemono text-[#D4B22A] mb-1">
                SELECTED MEMBERSHIP TIER
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#194C3D] border border-[#F2D231]/30 text-xs text-white focus:outline-none focus:border-[#F2D231]"
              >
                <option value="Monthly VIP">Monthly VIP &mdash; $99 / mo</option>
                <option value="Yearly VIP">Yearly VIP &mdash; $499 / yr (Save 40%)</option>
                <option value="Lifetime Access">Lifetime Access &mdash; $999 (One-time)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F2D231] text-[#123D32] hover:bg-[#FFE873] active:bg-[#D4B22A] shadow-[0_0_20px_rgba(242,210,49,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Processing Application...' : `Proceed to Join ${tier}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center text-[10px] text-[#BFE5D5]/80 font-spacemono">
              Education & private group access only &bull; No financial advice
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
