import React, { useState, useId, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Percent, 
  DollarSign,
  Info,
  X
} from 'lucide-react';

interface PositionSizeCalculatorProps {
  onAnalyzeWithAi?: (prompt: string) => void;
  brandName?: string;
}

interface TooltipBadgeProps {
  title: string;
  description: string;
  formula?: string;
  impact: string;
  align?: 'left' | 'right';
}

const TooltipBadge: React.FC<TooltipBadgeProps> = ({
  title,
  description,
  formula,
  impact,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        aria-label={`Learn about ${title}`}
        className={`p-0.5 rounded transition-colors cursor-pointer flex items-center justify-center ${
          isOpen ? 'text-[#F2D231] bg-[#F2D231]/15' : 'text-gray-400 hover:text-[#F2D231]'
        }`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-1.5 z-50 w-72 sm:w-80 bg-[#0a241e] border border-[#F2D231]/50 rounded-xl p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.85)] text-left backdrop-blur-md ${
              align === 'right' ? 'right-0 sm:right-0' : 'left-0 sm:left-0'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-white/10 mb-2">
              <div className="flex items-center gap-1.5 font-spacemono font-bold text-[#F2D231] text-xs">
                <Info className="w-3.5 h-3.5 text-[#F2D231] shrink-0" />
                <span>{title}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-gray-400 hover:text-white p-0.5 transition-colors sm:hidden cursor-pointer"
                aria-label="Close tooltip"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-[11px] leading-relaxed font-inter mb-2.5">
              {description}
            </p>

            {/* Formula */}
            {formula && (
              <div className="bg-black/50 px-2.5 py-1.5 rounded-lg border border-white/10 font-mono text-[10px] text-[#F2D231] mb-2.5 flex items-center justify-between gap-2">
                <span className="text-gray-400 text-[9px] uppercase font-spacemono shrink-0">Formula</span>
                <code className="text-right truncate">{formula}</code>
              </div>
            )}

            {/* Output Impact */}
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-lg p-2 text-[10px] text-emerald-200 font-spacemono leading-normal">
              <span className="font-bold text-[#F2D231] uppercase block mb-0.5 text-[9px]">
                Impact on Final Output
              </span>
              {impact}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PositionSizeCalculator: React.FC<PositionSizeCalculatorProps> = ({
  onAnalyzeWithAi,
  brandName = "Faaiz Durrani"
}) => {
  const accountSizeInputId = useId();
  const riskPercentInputId = useId();
  const entryPriceInputId = useId();
  const stopLossPriceInputId = useId();
  const takeProfitPriceInputId = useId();
  const stopLossDistanceInputId = useId();

  // Core Inputs
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2.0);
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [entryPrice, setEntryPrice] = useState<number>(64000);
  const [calcMode, setCalcMode] = useState<'price' | 'distance'>('price');
  const [stopLossPrice, setStopLossPrice] = useState<number>(61440);
  const [stopLossDistance, setStopLossDistance] = useState<number>(4.0);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(71680);
  const [includeTp, setIncludeTp] = useState<boolean>(true);

  // Quick Preset Handlers
  const handleAccountPreset = (val: number) => {
    setAccountSize(val);
  };

  const handleRiskPreset = (pct: number) => {
    setRiskPercent(pct);
  };

  const handleEntryPreset = (asset: string, price: number) => {
    setEntryPrice(price);
    if (direction === 'long') {
      const sl = Math.round(price * 0.96 * 100) / 100;
      setStopLossPrice(sl);
      setStopLossDistance(4.0);
      setTakeProfitPrice(Math.round(price * 1.12 * 100) / 100);
    } else {
      const sl = Math.round(price * 1.04 * 100) / 100;
      setStopLossPrice(sl);
      setStopLossDistance(4.0);
      setTakeProfitPrice(Math.round(price * 0.88 * 100) / 100);
    }
  };

  // Synchronize Stop Loss changes
  const handleStopPriceChange = (val: number) => {
    setStopLossPrice(val);
    if (entryPrice > 0 && val > 0) {
      const distPct = Math.abs((entryPrice - val) / entryPrice) * 100;
      setStopLossDistance(Math.round(distPct * 100) / 100);
    }
  };

  const handleDistanceChange = (distPct: number) => {
    setStopLossDistance(distPct);
    if (entryPrice > 0) {
      if (direction === 'long') {
        const sl = entryPrice * (1 - distPct / 100);
        setStopLossPrice(Math.round(sl * 100) / 100);
      } else {
        const sl = entryPrice * (1 + distPct / 100);
        setStopLossPrice(Math.round(sl * 100) / 100);
      }
    }
  };

  const handleDirectionToggle = (dir: 'long' | 'short') => {
    setDirection(dir);
    if (entryPrice > 0) {
      if (dir === 'long') {
        const sl = entryPrice * (1 - stopLossDistance / 100);
        setStopLossPrice(Math.round(sl * 100) / 100);
        setTakeProfitPrice(Math.round(entryPrice * 1.12 * 100) / 100);
      } else {
        const sl = entryPrice * (1 + stopLossDistance / 100);
        setStopLossPrice(Math.round(sl * 100) / 100);
        setTakeProfitPrice(Math.round(entryPrice * 0.88 * 100) / 100);
      }
    }
  };

  // Math Calculations
  const safeAccountSize = Math.max(0, accountSize || 0);
  const safeRiskPercent = Math.max(0, riskPercent || 0);
  const safeEntry = Math.max(0.00001, entryPrice || 0);

  // Dollar amount at risk
  const maxRiskDollar = safeAccountSize * (safeRiskPercent / 100);

  // Effective stop-loss distance %
  let effectiveDistancePct = stopLossDistance;
  if (calcMode === 'price' && safeEntry > 0 && stopLossPrice > 0) {
    effectiveDistancePct = Math.abs((safeEntry - stopLossPrice) / safeEntry) * 100;
  }
  const safeDistancePct = Math.max(0.01, effectiveDistancePct);

  // Position Size in USD
  const positionSizeUsd = maxRiskDollar / (safeDistancePct / 100);

  // Position Size in Asset Units (Coins)
  const positionUnits = positionSizeUsd / safeEntry;

  // Portfolio Cash Allocation %
  const portfolioAllocationPct = safeAccountSize > 0 ? (positionSizeUsd / safeAccountSize) * 100 : 0;

  // Risk to Reward Ratio
  let rewardDollar = 0;
  let riskRewardRatio = 0;
  if (includeTp && takeProfitPrice > 0 && safeEntry > 0) {
    const tpDistPct = Math.abs((takeProfitPrice - safeEntry) / safeEntry) * 100;
    rewardDollar = positionSizeUsd * (tpDistPct / 100);
    if (maxRiskDollar > 0) {
      riskRewardRatio = Math.round((rewardDollar / maxRiskDollar) * 10) / 10;
    }
  }

  // Safety status evaluation
  let safetyStatus: 'safe' | 'moderate' | 'high' = 'safe';
  if (safeRiskPercent > 3.0) {
    safetyStatus = 'high';
  } else if (safeRiskPercent > 2.0 || portfolioAllocationPct > 100) {
    safetyStatus = 'moderate';
  }

  // Prepare prompt for AI Analyst
  const handleTriggerAiAnalysis = () => {
    if (!onAnalyzeWithAi) return;
    const prompt = `Quantitative Trade Analysis Request:
- Account Equity: $${safeAccountSize.toLocaleString()}
- Risk Parameter: ${safeRiskPercent}% ($${maxRiskDollar.toFixed(2)} at risk)
- Trade Direction: ${direction.toUpperCase()}
- Entry Price: $${safeEntry.toLocaleString()}
- Stop Loss: $${stopLossPrice.toLocaleString()} (${safeDistancePct.toFixed(2)}% distance)
- Calculated Position Size: $${positionSizeUsd.toFixed(2)} (${positionUnits.toFixed(4)} units)
- Portfolio Allocation: ${portfolioAllocationPct.toFixed(1)}% of account capital
${includeTp && takeProfitPrice > 0 ? `- Target: $${takeProfitPrice.toLocaleString()} (Est. R:R 1:${riskRewardRatio})` : ''}

Please evaluate the mathematical safety, liquidity invalidation zone, and spot capital preservation of this setup according to Faaiz Durrani's rules.`;

    onAnalyzeWithAi(prompt);
  };

  return (
    <div className="bg-[#0d2e26] border border-[#F2D231]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[680px]">
      {/* Header */}
      <div className="bg-[#123D32] border-b border-[#F2D231]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F2D231]/15 border border-[#F2D231]/30 flex items-center justify-center text-[#F2D231]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-bold text-white text-sm">Position Size Calculator</span>
              <span className="text-[10px] font-spacemono uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                Risk Engine
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-inter">
              Calculate exact spot lot size &amp; capital at risk
            </p>
          </div>
        </div>

        {/* Direction Toggle */}
        <div className="flex bg-[#071914] p-0.5 rounded-lg border border-white/10">
          <button
            id="calc-dir-long"
            type="button"
            onClick={() => handleDirectionToggle('long')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-spacemono uppercase font-bold flex items-center gap-1 transition-all ${
              direction === 'long' 
                ? 'bg-[#123D32] text-[#F2D231] border border-[#F2D231]/40 shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Spot / Long</span>
          </button>
          <button
            id="calc-dir-short"
            type="button"
            onClick={() => handleDirectionToggle('short')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-spacemono uppercase font-bold flex items-center gap-1 transition-all ${
              direction === 'short' 
                ? 'bg-red-950/70 text-red-300 border border-red-500/40 shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingDown className="w-3 h-3 text-red-400" />
            <span>Hedge / Short</span>
          </button>
        </div>
      </div>

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-inter text-xs scrollbar-thin scrollbar-thumb-[#F2D231]/20 scrollbar-track-transparent">
        {/* Account Size & Risk % Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Account Equity */}
          <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <label htmlFor={accountSizeInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#F2D231]" />
                  Account Size
                </label>
                <TooltipBadge
                  title="Account Capital / Equity"
                  description="Your total portfolio equity or cash balance allocated for trading. Combined with your chosen Risk %, it determines the absolute ceiling on dollar loss ($) you can take on this trade."
                  formula="Risk ($) = Account Size × (Risk % ÷ 100)"
                  impact="Directly scales max dollar risk. A larger account increases your dollar allocation while keeping percentage drawdown strictly controlled."
                  align="left"
                />
              </div>
              <span className="text-[10px] text-gray-400 font-spacemono">USD</span>
            </div>
            <input
              id={accountSizeInputId}
              type="number"
              min="10"
              step="100"
              value={accountSize || ''}
              onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
              className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-white font-bold focus:outline-none"
              placeholder="10000"
            />
            {/* Quick account presets */}
            <div className="flex gap-1 mt-2">
              {[1000, 5000, 10000, 25000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAccountPreset(val)}
                  className={`flex-1 py-0.5 rounded text-[9px] font-spacemono border transition-colors ${
                    accountSize === val 
                      ? 'bg-[#F2D231] text-black font-bold border-[#F2D231]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  ${val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Percentage */}
          <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <label htmlFor={riskPercentInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold flex items-center gap-1">
                  <Percent className="w-3 h-3 text-[#F2D231]" />
                  Risk Per Trade
                </label>
                <TooltipBadge
                  title="Risk Percentage (%)"
                  description="The exact percentage of total equity you are willing to lose if the trade fails. Disciplined swing/spot traders risk 1.0%–2.0% per setup to safeguard long-term capital."
                  formula="Allowed Loss ($) = Capital × (Risk % ÷ 100)"
                  impact="Linear multiplier: Doubling risk from 1% to 2% doubles your dollar risk and doubles your recommended position size. Keep ≤2% to avoid drawdowns."
                  align="right"
                />
              </div>
              <span className="text-[10px] font-spacemono text-[#F2D231] font-bold">
                ${maxRiskDollar.toFixed(2)} at risk
              </span>
            </div>
            <input
              id={riskPercentInputId}
              type="number"
              min="0.1"
              max="20"
              step="0.1"
              value={riskPercent || ''}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
              className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-white font-bold focus:outline-none"
              placeholder="2.0"
            />
            {/* Quick risk presets */}
            <div className="flex gap-1 mt-2">
              {[1.0, 1.5, 2.0, 3.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleRiskPreset(pct)}
                  className={`flex-1 py-0.5 rounded text-[9px] font-spacemono border transition-colors ${
                    riskPercent === pct 
                      ? 'bg-[#F2D231] text-black font-bold border-[#F2D231]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Entry Price & Asset Presets */}
        <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <label htmlFor={entryPriceInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold">
                Entry Price ($)
              </label>
              <TooltipBadge
                title="Trade Entry Price"
                description="Your expected buy price. Used to calculate the percentage distance to your stop-loss and convert total USD position size into exact coin/asset units."
                formula="Units = Position Size ($) ÷ Entry Price"
                impact="Determines exact coin quantity. Does not change total dollar risk, only unit volume."
                align="left"
              />
            </div>
            <div className="flex items-center gap-1 text-[9px] font-spacemono text-gray-400">
              <span>Quick Assets:</span>
              <button 
                type="button" 
                onClick={() => handleEntryPreset('BTC', 64000)}
                className="text-[#F2D231] hover:underline"
              >
                BTC
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleEntryPreset('ETH', 3450)}
                className="text-[#F2D231] hover:underline"
              >
                ETH
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleEntryPreset('SOL', 145)}
                className="text-[#F2D231] hover:underline"
              >
                SOL
              </button>
            </div>
          </div>
          <input
            id={entryPriceInputId}
            type="number"
            min="0.0001"
            step="any"
            value={entryPrice || ''}
            onChange={(e) => {
              const p = parseFloat(e.target.value) || 0;
              setEntryPrice(p);
              if (p > 0) {
                if (direction === 'long') {
                  setStopLossPrice(Math.round(p * (1 - stopLossDistance / 100) * 100) / 100);
                } else {
                  setStopLossPrice(Math.round(p * (1 + stopLossDistance / 100) * 100) / 100);
                }
              }
            }}
            className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-white font-bold focus:outline-none"
            placeholder="64000"
          />
        </div>

        {/* Stop Loss Input (Toggle between Price and Distance %) */}
        <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-spacemono uppercase text-gray-300 font-bold">
                Stop-Loss Invalidation
              </span>
              <TooltipBadge
                title="Stop-Loss Invalidation Distance"
                description="The price level or percentage drop where your setup thesis is invalidated. In position sizing, this distance acts as the divisor for your risk capital."
                formula="Position Size ($) = Dollar Risk ÷ Stop Distance %"
                impact="Inverse relationship: A tighter stop loss enables a larger dollar position while keeping your max loss constant; a wider stop requires a smaller position."
                align="left"
              />
            </div>
            <div className="flex bg-black/40 p-0.5 rounded border border-white/10">
              <button
                type="button"
                onClick={() => setCalcMode('price')}
                className={`px-2 py-0.5 rounded text-[9px] font-spacemono transition-colors ${
                  calcMode === 'price' ? 'bg-[#F2D231] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                By Price ($)
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('distance')}
                className={`px-2 py-0.5 rounded text-[9px] font-spacemono transition-colors ${
                  calcMode === 'distance' ? 'bg-[#F2D231] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                By Distance (%)
              </button>
            </div>
          </div>

          {calcMode === 'price' ? (
            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-spacemono mb-1">
                <label htmlFor={stopLossPriceInputId}>Stop-Loss Price ($):</label>
                <span className="text-red-400 font-bold">
                  -{safeDistancePct.toFixed(2)}% distance (${Math.abs(safeEntry - stopLossPrice).toFixed(2)})
                </span>
              </div>
              <input
                id={stopLossPriceInputId}
                type="number"
                min="0.0001"
                step="any"
                value={stopLossPrice || ''}
                onChange={(e) => handleStopPriceChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-red-300 font-bold focus:outline-none"
                placeholder="61440"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-spacemono mb-1">
                <label htmlFor={stopLossDistanceInputId}>Stop Distance (%):</label>
                <span className="text-red-400 font-bold">
                  Stop Price: ${stopLossPrice.toLocaleString()}
                </span>
              </div>
              <input
                id={stopLossDistanceInputId}
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={stopLossDistance || ''}
                onChange={(e) => handleDistanceChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-red-300 font-bold focus:outline-none"
                placeholder="4.0"
              />
              <div className="flex gap-1 mt-1.5">
                {[2.0, 3.5, 5.0, 7.5].map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => handleDistanceChange(dist)}
                    className={`flex-1 py-0.5 rounded text-[9px] font-spacemono border transition-colors ${
                      stopLossDistance === dist 
                        ? 'bg-red-900/60 text-white border-red-500/50' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {dist}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Optional Take Profit */}
        <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <label htmlFor={takeProfitPriceInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold flex items-center gap-1.5">
                <span>Target / Take-Profit ($)</span>
                <input
                  type="checkbox"
                  checked={includeTp}
                  onChange={(e) => setIncludeTp(e.target.checked)}
                  className="rounded accent-[#F2D231] cursor-pointer"
                />
              </label>
              <TooltipBadge
                title="Target / Take-Profit"
                description="Your planned exit target price. Used to calculate the trade's Risk-to-Reward Ratio (R:R) and projected USD profit."
                formula="R:R = Potential Reward ($) ÷ Dollar Risk ($)"
                impact="Determines trade efficiency. Targeting at least 1:2 R:R ensures you stay net profitable even with a conservative win rate."
                align="left"
              />
            </div>
            {includeTp && riskRewardRatio > 0 && (
              <span className="text-[10px] font-spacemono text-emerald-400 font-bold">
                R:R 1:{riskRewardRatio}
              </span>
            )}
          </div>
          {includeTp && (
            <input
              id={takeProfitPriceInputId}
              type="number"
              min="0.0001"
              step="any"
              value={takeProfitPrice || ''}
              onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-emerald-300 font-bold focus:outline-none"
              placeholder="71680"
            />
          )}
        </div>

        {/* Calculated Results Summary Panel */}
        <div className="bg-[#123D32]/90 border border-[#F2D231]/30 rounded-xl p-3.5 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-spacemono uppercase tracking-wider text-[#F2D231] font-bold text-[11px]">
              CALCULATED LOT &amp; RISK METRICS
            </span>
            {safetyStatus === 'safe' && (
              <span className="inline-flex items-center gap-1 text-[9px] font-spacemono font-bold px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3" /> Safe Spot
              </span>
            )}
            {safetyStatus === 'moderate' && (
              <span className="inline-flex items-center gap-1 text-[9px] font-spacemono font-bold px-1.5 py-0.5 rounded bg-yellow-900/80 text-yellow-300 border border-yellow-500/40">
                <AlertTriangle className="w-3 h-3" /> Moderate
              </span>
            )}
            {safetyStatus === 'high' && (
              <span className="inline-flex items-center gap-1 text-[9px] font-spacemono font-bold px-1.5 py-0.5 rounded bg-red-900/80 text-red-300 border border-red-500/40">
                <AlertTriangle className="w-3 h-3" /> High Risk
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Position Size USD */}
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <span className="text-[10px] text-gray-400 font-spacemono block">Recommended Position</span>
              <span className="text-base sm:text-lg font-spacemono font-bold text-[#F2D231]">
                ${positionSizeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Position in Units */}
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <span className="text-[10px] text-gray-400 font-spacemono block">Asset Quantity</span>
              <span className="text-base sm:text-lg font-spacemono font-bold text-white">
                {positionUnits.toFixed(4)} <span className="text-[10px] text-gray-400 font-normal">units</span>
              </span>
            </div>

            {/* Max Capital Loss */}
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <span className="text-[10px] text-gray-400 font-spacemono block">Max Risk If Stopped Out</span>
              <span className="text-sm sm:text-base font-spacemono font-bold text-red-400">
                -${maxRiskDollar.toFixed(2)} ({safeRiskPercent}%)
              </span>
            </div>

            {/* Portfolio Allocation */}
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <span className="text-[10px] text-gray-400 font-spacemono block">Portfolio Allocation</span>
              <span className={`text-sm sm:text-base font-spacemono font-bold ${
                portfolioAllocationPct <= 100 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {portfolioAllocationPct.toFixed(1)}% {portfolioAllocationPct <= 100 ? '(1x Spot)' : '(Exceeds Spot)'}
              </span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-black/40 rounded-lg p-2 text-[10px] text-gray-300 font-inter leading-relaxed flex items-start gap-1.5 border border-white/5">
            <Info className="w-3.5 h-3.5 text-[#F2D231] flex-shrink-0 mt-0.5" />
            <span>
              {portfolioAllocationPct > 100 
                ? `${brandName} Rule: This position size requires more than your total account capital. Either tighten your stop-loss distance or reduce risk % to keep the trade 100% spot cash funded without leverage.`
                : `${brandName} Rule: Risk is capped strictly at $${maxRiskDollar.toFixed(2)}. If invalidated at $${stopLossPrice.toLocaleString()}, you lose only ${safeRiskPercent}% of your account.`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Footer Action: Send to AI Analyst */}
      {onAnalyzeWithAi && (
        <div className="p-3 bg-[#0c2820] border-t border-[#F2D231]/20">
          <button
            id="calc-send-to-ai-btn"
            type="button"
            onClick={handleTriggerAiAnalysis}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F2D231] hover:bg-[#ffe14d] text-black font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(242,210,49,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Validate Setup with Quant AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
