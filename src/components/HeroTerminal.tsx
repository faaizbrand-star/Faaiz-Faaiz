import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, TrendingUp, Radio, Cpu, Layers, Sparkles } from 'lucide-react';
import { MarketTickerData } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeroTerminalProps {
  tickerData?: MarketTickerData | null;
  terminalAsset?: string;
}

export const HeroTerminal: React.FC<HeroTerminalProps> = ({
  tickerData,
  terminalAsset = 'BTC/USDT'
}) => {
  const [activeTab, setActiveTab] = useState<'signal' | 'orderflow'>('signal');
  const [simulatedPrice, setSimulatedPrice] = useState(67490.50);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (tickerData?.price) {
      setSimulatedPrice(tickerData.price);
    }
  }, [tickerData?.price]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPrice(prev => {
        const delta = (Math.random() - 0.48) * 4.5;
        return parseFloat((prev + delta).toFixed(2));
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 250);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const watchlist = [
    { symbol: 'BTC/USDT', price: simulatedPrice, change: tickerData ? tickerData.change24h : 3.42, state: 'Expansion' },
    { symbol: 'ETH/USDT', price: 3480.20, change: 4.15, state: 'Accumulation' },
    { symbol: 'SOL/USDT', price: 184.60, change: 6.80, state: 'Breakout' },
    { symbol: 'SNDK/USDT', price: 0.40, change: 81.82, state: 'Take Profit Hit' }
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background glow layers */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/10 via-emerald-600/10 to-amber-500/10 dark:from-[#F2D231]/20 dark:via-[#1E5747] dark:to-[#F2D231]/20 rounded-2xl blur-xl opacity-70 pointer-events-none" />

      {/* Main Terminal Card Container */}
      <div className="relative rounded-2xl bg-white dark:bg-[#194C3D]/95 border border-slate-300 dark:border-[#F2D231]/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:shadow-2xl overflow-hidden transition-colors duration-200">
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-slate-900 dark:bg-[#123D32] border-b border-slate-800 dark:border-[#1E5747] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E08888]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2D231]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#5FC98A]" />
            <span className="ml-2 text-[11px] font-spacemono font-semibold text-slate-200 dark:text-[#D6F0E5]">
              FAAIZ_LIVE_TELEMETRY // SPOT
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Embedded Terminal Theme Switcher */}
            <ThemeToggle id="hero-terminal-theme-toggle" variant="terminal" />

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/70 dark:bg-[#1E5747] text-[#5FC98A] border border-[#5FC98A]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5FC98A] animate-ping" />
              LIVE
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-4 pt-3 flex items-center gap-2 border-b border-slate-200 dark:border-[#1E5747] text-xs font-spacemono bg-slate-50/80 dark:bg-transparent">
          <button
            onClick={() => setActiveTab('signal')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer font-bold ${
              activeTab === 'signal'
                ? 'border-emerald-800 text-emerald-950 dark:border-[#F2D231] dark:text-[#F2D231]'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-[#BFE5D5] dark:hover:text-white'
            }`}
          >
            ACTIVE SETUP
          </button>
          <button
            onClick={() => setActiveTab('orderflow')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer font-bold ${
              activeTab === 'orderflow'
                ? 'border-emerald-800 text-emerald-950 dark:border-[#F2D231] dark:text-[#F2D231]'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-[#BFE5D5] dark:hover:text-white'
            }`}
          >
            WATCHLIST
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'signal' ? (
          <div className="p-5 space-y-4">
            {/* Top Bar of the Signal */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 dark:bg-[#123D32] dark:border-[#F2D231]/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">BTC / USDT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-[#5FC98A]/20 dark:text-[#5FC98A] dark:border-transparent font-spacemono font-bold">
                    SPOT BUY
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-[#BFE5D5] font-spacemono mt-1">
                  Timeframe: Daily Macro Accumulation
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  ${simulatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-700 dark:text-[#5FC98A] font-mono font-bold">
                  +3.42% 24h
                </div>
              </div>
            </div>

            {/* Signal Reasoning Card */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300/80 dark:bg-[#1E5747]/70 dark:border-[#F2D231]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-spacemono text-amber-800 dark:text-[#F2D231] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRADE REASONING & THESIS</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-[#D6F0E5] font-medium leading-relaxed">
                Reclaimed the $64,200 weekly value area high with severe exchange outflow volume. Institutional spot bids stepping in at support. Zero leverage required.
              </p>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 dark:bg-[#123D32] dark:border-[#1E5747]">
                <div className="text-[10px] text-slate-600 dark:text-[#BFE5D5] font-semibold">ENTRY ZONE</div>
                <div className="text-slate-900 dark:text-[#EFFAF5] font-bold mt-1">$63,800 - $64,500</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-[#123D32] dark:border-[#1E5747]">
                <div className="text-[10px] text-rose-700 dark:text-[#E08888] font-semibold">INVALIDATION</div>
                <div className="text-rose-700 dark:text-[#E08888] font-bold mt-1">$61,900 (-3.8%)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 dark:bg-[#123D32] dark:border-[#1E5747]">
                <div className="text-[10px] text-emerald-800 dark:text-[#5FC98A] font-semibold">TARGET 1</div>
                <div className="text-emerald-800 dark:text-[#5FC98A] font-bold mt-1">$74,800 (+16.4%)</div>
              </div>
            </div>

            {/* Verified Footer */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-[#BFE5D5] font-spacemono border-t border-slate-200 dark:border-[#1E5747]">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-[#5FC98A] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified in VIP Telegram Room
              </span>
              <span className="text-amber-800 dark:text-[#F2D231] font-bold">Risk/Reward: 1:4.3</span>
            </div>
          </div>
        ) : (
          <div className="p-4 divide-y divide-slate-200 dark:divide-[#1E5747]">
            {watchlist.map((item) => (
              <div key={item.symbol} className="py-3 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-slate-900 dark:text-white font-bold">{item.symbol}</div>
                  <div className="text-[10px] text-slate-500 dark:text-[#BFE5D5] font-spacemono">{item.state}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-900 dark:text-[#EFFAF5] font-semibold">
                    ${typeof item.price === 'number' ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price}
                  </div>
                  <div className={item.change >= 0 ? 'text-emerald-700 dark:text-[#5FC98A] font-bold' : 'text-rose-600 dark:text-[#E08888] font-bold'}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

