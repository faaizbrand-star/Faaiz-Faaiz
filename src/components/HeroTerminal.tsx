import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, TrendingUp, Radio, Cpu, Layers, Sparkles } from 'lucide-react';
import { MarketTickerData } from '../types';

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
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F2D231]/20 via-[#1E5747] to-[#F2D231]/20 rounded-2xl blur-xl opacity-60 pointer-events-none" />

      {/* Main Terminal Card Container */}
      <div className="relative rounded-2xl bg-[#194C3D]/95 border border-[#F2D231]/30 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-[#123D32] border-b border-[#1E5747] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E08888]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2D231]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#5FC98A]" />
            <span className="ml-2 text-[11px] font-spacemono font-semibold text-[#D6F0E5]">
              FAAIZ_LIVE_TELEMETRY // SPOT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1E5747] text-[#5FC98A] border border-[#5FC98A]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5FC98A] animate-ping" />
              LIVE
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-4 pt-3 flex items-center gap-2 border-b border-[#1E5747] text-xs font-spacemono">
          <button
            onClick={() => setActiveTab('signal')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer font-bold ${
              activeTab === 'signal'
                ? 'border-[#F2D231] text-[#F2D231]'
                : 'border-transparent text-[#BFE5D5] hover:text-white'
            }`}
          >
            ACTIVE SETUP
          </button>
          <button
            onClick={() => setActiveTab('orderflow')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer font-bold ${
              activeTab === 'orderflow'
                ? 'border-[#F2D231] text-[#F2D231]'
                : 'border-transparent text-[#BFE5D5] hover:text-white'
            }`}
          >
            WATCHLIST
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'signal' ? (
          <div className="p-5 space-y-4">
            {/* Top Bar of the Signal */}
            <div className="p-4 rounded-xl bg-[#123D32] border border-[#F2D231]/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-white">BTC / USDT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#5FC98A]/20 text-[#5FC98A] font-spacemono font-bold">
                    SPOT BUY
                  </span>
                </div>
                <div className="text-xs text-[#BFE5D5] font-spacemono mt-1">
                  Timeframe: Daily Macro Accumulation
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-mono font-bold text-white">
                  ${simulatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-[#5FC98A] font-mono font-semibold">
                  +3.42% 24h
                </div>
              </div>
            </div>

            {/* Signal Reasoning Card */}
            <div className="p-4 rounded-xl bg-[#1E5747]/70 border border-[#F2D231]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-spacemono text-[#F2D231] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRADE REASONING & THESIS</span>
              </div>
              <p className="text-xs text-[#D6F0E5] leading-relaxed">
                Reclaimed the $64,200 weekly value area high with severe exchange outflow volume. Institutional spot bids stepping in at support. Zero leverage required.
              </p>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#123D32] border border-[#1E5747]">
                <div className="text-[10px] text-[#BFE5D5]">ENTRY ZONE</div>
                <div className="text-[#EFFAF5] font-bold mt-1">$63,800 - $64,500</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#123D32] border border-[#1E5747]">
                <div className="text-[10px] text-[#E08888]">INVALIDATION</div>
                <div className="text-[#E08888] font-bold mt-1">$61,900 (-3.8%)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#123D32] border border-[#1E5747]">
                <div className="text-[10px] text-[#5FC98A]">TARGET 1</div>
                <div className="text-[#5FC98A] font-bold mt-1">$74,800 (+16.4%)</div>
              </div>
            </div>

            {/* Verified Footer */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#BFE5D5] font-spacemono border-t border-[#1E5747]">
              <span className="flex items-center gap-1.5 text-[#5FC98A]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified in VIP Telegram Room
              </span>
              <span className="text-[#F2D231]">Risk/Reward: 1:4.3</span>
            </div>
          </div>
        ) : (
          <div className="p-4 divide-y divide-[#1E5747]">
            {watchlist.map((item) => (
              <div key={item.symbol} className="py-3 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-white font-bold">{item.symbol}</div>
                  <div className="text-[10px] text-[#BFE5D5] font-spacemono">{item.state}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#EFFAF5] font-semibold">
                    ${typeof item.price === 'number' ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price}
                  </div>
                  <div className={item.change >= 0 ? 'text-[#5FC98A]' : 'text-[#E08888]'}>
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
