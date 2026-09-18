import React, { useState } from 'react';
import { Radio, RefreshCw, BarChart2, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { MarketTickerData, SiteContent } from '../types';

interface LiveMarketSectionProps {
  liveChartData: SiteContent['liveChart'];
  tickerData?: MarketTickerData | null;
  onRefreshTicker?: () => void;
}

export const LiveMarketSection: React.FC<LiveMarketSectionProps> = ({
  liveChartData,
  tickerData,
  onRefreshTicker
}) => {
  const [timeframe, setTimeframe] = useState<string>('4H');
  const [chartMode, setChartMode] = useState<'candlesticks' | 'line'>('candlesticks');

  const price = tickerData?.price || 67482.50;
  const change24h = tickerData?.change24h ?? 3.42;
  const high24h = tickerData?.high24h || 68920.00;
  const low24h = tickerData?.low24h || 65110.00;
  const volume24h = tickerData?.volume24h || '$2.84B';

  const candles = [
    { time: '08:00', open: 65800, high: 66400, low: 65650, close: 66320 },
    { time: '12:00', open: 66320, high: 66950, low: 66100, close: 66800 },
    { time: '16:00', open: 66800, high: 67200, low: 66500, close: 66950 },
    { time: '20:00', open: 66950, high: 67450, low: 66720, close: 67100 },
    { time: '00:00', open: 67100, high: 67800, low: 66900, close: 67650 },
    { time: '04:00', open: 67650, high: 68100, low: 67400, close: 67520 },
    { time: '08:00', open: 67520, high: 67900, low: 67200, close: 67410 },
    { time: '12:00', open: 67410, high: 68400, low: 67350, close: 68150 },
    { time: '16:00', open: 68150, high: 68920, low: 67900, close: 68600 },
    { time: '20:00', open: 68600, high: 68850, low: 67200, close: 67482 },
  ];

  const minPrice = 65000;
  const maxPrice = 69500;
  const priceRange = maxPrice - minPrice;

  const getY = (val: number) => {
    return 240 - ((val - minPrice) / priceRange) * 200;
  };

  return (
    <section id="live-chart" className="py-24 bg-[#123D32] relative overflow-hidden border-t border-[#1E5747]">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold mb-3">
              <span className="edot" />
              <span>{liveChartData.badge || 'QUANTITATIVE MARKET FEED'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold text-white tracking-tight">
              {liveChartData.headline || 'Live BTC/USDT Terminal'}
            </h2>

            <p className="text-sm text-[#BFE5D5] mt-2 max-w-xl">
              {liveChartData.subheadline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-[#194C3D] p-1 border border-[#F2D231]/20 text-xs font-spacemono">
              {['1H', '4H', '1D', '1W'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#1E5747] text-[#F2D231] font-bold shadow-sm'
                      : 'text-[#BFE5D5] hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {onRefreshTicker && (
              <button
                onClick={onRefreshTicker}
                className="p-2 rounded-xl bg-[#194C3D] border border-[#F2D231]/20 text-[#D6F0E5] hover:text-[#F2D231] transition-colors"
                title="Refresh live oracle"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Chart Window Frame */}
        <div className="rounded-2xl bg-[#194C3D]/80 border border-[#F2D231]/30 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Top Bar of Chart */}
          <div className="p-4 bg-[#123D32] border-b border-[#1E5747] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-white">BTC / USDT</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1E5747] text-[#5FC98A] font-spacemono font-semibold">
                  BINANCE SPOT
                </span>
              </div>

              <div className="text-xl font-mono font-bold text-[#F2D231]">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>

              <div className={`text-xs font-mono font-bold ${change24h >= 0 ? 'text-[#5FC98A]' : 'text-[#E08888]'}`}>
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24H)
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono text-[#BFE5D5]">
              <div>
                <span className="text-[10px] text-[#BFE5D5]/60 block font-spacemono">24H HIGH</span>
                <span className="text-white">${high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#BFE5D5]/60 block font-spacemono">24H LOW</span>
                <span className="text-white">${low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#BFE5D5]/60 block font-spacemono">24H VOLUME</span>
                <span className="text-white">{volume24h}</span>
              </div>
            </div>
          </div>

          {/* SVG Chart Display */}
          <div className="relative p-6 h-80 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 800 260" preserveAspectRatio="none">
              {/* Horizontal Price Grid Lines */}
              {[65000, 66000, 67000, 68000, 69000].map((level) => {
                const y = getY(level);
                return (
                  <g key={level}>
                    <line x1="0" y1={y} x2="800" y2={y} stroke="#1E5747" strokeDasharray="3 3" />
                    <text x="790" y={y - 4} textAnchor="end" fill="#BFE5D5" fontSize="9" fontFamily="monospace">
                      ${level.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Candles */}
              {candles.map((c, i) => {
                const x = 50 + i * 72;
                const isGreen = c.close >= c.open;
                const bodyTop = getY(Math.max(c.open, c.close));
                const bodyHeight = Math.max(3, Math.abs(getY(c.open) - getY(c.close)));
                const wickTop = getY(c.high);
                const wickBottom = getY(c.low);
                const color = isGreen ? '#5FC98A' : '#E08888';

                return (
                  <g key={i} className="transition-all duration-200 hover:opacity-80">
                    <line x1={x + 12} y1={wickTop} x2={x + 12} y2={wickBottom} stroke={color} strokeWidth="1.5" />
                    <rect
                      x={x}
                      y={bodyTop}
                      width="24"
                      height={bodyHeight}
                      fill={color}
                      rx="2"
                      stroke={color}
                    />
                  </g>
                );
              })}

              {/* Macro Accumulation Order Block Zone */}
              <rect x="0" y={getY(66000)} width="800" height={getY(65000) - getY(66000)} fill="#F2D231" fillOpacity="0.06" />
              <text x="20" y={getY(65400)} fill="#F2D231" fontSize="10" fontFamily="Space Mono, monospace" fontWeight="bold">
                FAAIZ HIGH-TIMEFRAME ACCUMULATION ZONE
              </text>
            </svg>
          </div>

          {/* Chart Sub-footer */}
          <div className="p-4 bg-[#123D32] border-t border-[#1E5747] flex items-center justify-between text-xs font-spacemono text-[#BFE5D5]">
            <span className="flex items-center gap-1.5 text-[#5FC98A]">
              <span className="w-2 h-2 rounded-full bg-[#5FC98A] animate-ping" />
              Real-time WebSocket Live Feed
            </span>
            <span>All chart analysis conducted on Spot pair (No liquidation risk)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
