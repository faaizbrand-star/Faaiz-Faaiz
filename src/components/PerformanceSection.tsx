import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Search, CheckCircle, Award, Calendar, AlertTriangle } from 'lucide-react';
import { SiteContent, PerformanceAsset } from '../types';

interface PerformanceSectionProps {
  performanceData: SiteContent['performance'];
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  performanceData
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<PerformanceAsset | null>(null);

  const assets = performanceData.assets || [];

  // Top 3 ranked assets
  const topRanked = assets.filter(a => a.isRankedTop3).sort((a, b) => (a.rank || 99) - (b.rank || 99));

  // Chips list for runner-ups
  const chips = assets.filter(a => !a.isRankedTop3);

  // Filtered for the comprehensive verification table
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.thesis.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedTimeframe === 'all') return matchesSearch;
    if (selectedTimeframe === 'high') return matchesSearch && asset.returnPct >= 40;
    if (selectedTimeframe === 'macro') return matchesSearch && asset.timeframe.toLowerCase().includes('macro');
    return matchesSearch;
  });

  return (
    <section id="results" className="py-24 bg-[#123D32] relative overflow-hidden border-t border-[#1E5747]">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1E5747]/40 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold">
            <span className="edot" />
            <span>{performanceData.badge || "Real Results, No Leverage"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold text-[#EFFAF5] tracking-tight">
            {performanceData.summaryHeadline || "My Last 30 Days — Spot Returns"}
          </h2>

          <p className="text-sm sm:text-base text-[#BFE5D5] max-w-xl mx-auto font-sans">
            {performanceData.summaryDescription || "Spot returns only — no leverage used. Past performance doesn't guarantee future results."}
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-spacemono font-bold bg-[#5FC98A]/20 text-[#5FC98A] border border-[#5FC98A]/40 shadow-[0_0_15px_rgba(95,201,138,0.2)]">
              <CheckCircle className="w-3.5 h-3.5" />
              {performanceData.winRateEstimate || "✓ 12/12 Assets Green"}
            </span>
          </div>
        </div>

        {/* Top 3 Performers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {topRanked.map((asset, index) => {
            const medal = index === 0 ? "🥇 Top Performer" : index === 1 ? "🥈 Runner Up" : "🥉 Third";
            return (
              <div
                key={asset.id || asset.symbol}
                className="relative rounded-2xl bg-gradient-to-b from-[#F2D231]/10 to-[#1E5747]/90 border border-[#F2D231]/40 p-6 text-center hover:-translate-y-1.5 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_36px_rgba(242,210,49,0.2)] group"
              >
                <div className="text-xs font-spacemono uppercase tracking-wider text-[#D4B22A] font-bold mb-2">
                  {medal}
                </div>
                <div className="text-3xl font-mono font-bold text-white group-hover:text-[#F2D231] transition-colors">
                  {asset.symbol}
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-[#5FC98A] my-3">
                  +{asset.returnPct.toFixed(2)}%
                </div>
                <div className="text-xs text-[#BFE5D5] font-spacemono">
                  Holding Period: {asset.holdingPeriod} &bull; Spot
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E5747] text-[11px] text-[#D6F0E5] line-clamp-2">
                  {asset.thesis}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chips Grid for Other Assets */}
        <div className="mb-10">
          <div className="text-xs font-spacemono uppercase tracking-wider text-[#D4B22A] font-bold text-center mb-4">
            ADDITIONAL VERIFIED SPOT MOVES
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {chips.map((chip) => (
              <div
                key={chip.symbol}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#194C3D] border border-[#F2D231]/25 hover:border-[#5FC98A] text-xs font-mono transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(95,201,138,0.25)]"
              >
                <span className="text-[#BFE5D5] font-semibold">{chip.symbol}</span>
                <span className="text-[#5FC98A] font-bold">+{chip.returnPct.toFixed(2)}%</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#BFE5D5]/80 font-spacemono mt-4">
            Spot returns only — no leverage used. Past performance doesn't guarantee future results.
          </p>
        </div>

        {/* Prominent Disclaimer Banner */}
        <div className="mb-14 p-5 rounded-2xl bg-[#194C3D]/70 border border-[#F2D231]/30 flex items-start gap-4 text-xs sm:text-sm text-[#D6F0E5] leading-relaxed shadow-lg">
          <AlertTriangle className="w-5 h-5 text-[#F2D231] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#F2D231]">⚠️ Disclaimer:</strong> We cannot make you a millionaire. Trading involves serious financial risk. This platform provides education and analytical commentary only — not financial advice. Trade at your own risk.
          </div>
        </div>

        {/* Comprehensive Audit Table */}
        <div className="rounded-2xl bg-[#194C3D]/80 border border-[#F2D231]/30 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Table Header Controls */}
          <div className="p-5 bg-[#123D32] border-b border-[#1E5747] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-serif-italic font-bold text-white">
                Detailed Spot Performance Ledger
              </h3>
              <p className="text-xs text-[#BFE5D5] font-spacemono">
                Audited spot calls with documented thesis and timestamps
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#BFE5D5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by symbol or thesis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#194C3D] border border-[#F2D231]/20 text-xs text-white placeholder-[#BFE5D5]/60 focus:outline-none focus:border-[#F2D231]"
                />
              </div>

              <div className="flex rounded-xl bg-[#194C3D] p-1 border border-[#F2D231]/20 text-xs font-spacemono">
                <button
                  onClick={() => setSelectedTimeframe('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedTimeframe === 'all' ? 'bg-[#1E5747] text-[#F2D231] font-bold' : 'text-[#BFE5D5]'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setSelectedTimeframe('high')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedTimeframe === 'high' ? 'bg-[#1E5747] text-[#F2D231] font-bold' : 'text-[#BFE5D5]'
                  }`}
                >
                  &gt;40%
                </button>
              </div>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#123D32]/80 text-[#D4B22A] uppercase tracking-wider text-[10px] font-spacemono border-b border-[#1E5747]">
                <tr>
                  <th className="py-3 px-4">Asset / Coin</th>
                  <th className="py-3 px-4">Entry</th>
                  <th className="py-3 px-4">Exit</th>
                  <th className="py-3 px-4">Gain %</th>
                  <th className="py-3 px-4">Hold Period</th>
                  <th className="py-3 px-4 hidden md:table-cell">Core Analytical Thesis</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E5747]">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id || asset.symbol}
                    className="hover:bg-[#1E5747]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{asset.symbol}</div>
                      <div className="text-[10px] text-[#BFE5D5] font-spacemono">{asset.timeframe}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#D6F0E5]">
                      ${asset.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      ${asset.exitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#5FC98A]/20 text-[#5FC98A] font-bold text-xs">
                        +{asset.returnPct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#BFE5D5] font-spacemono">
                      {asset.holdingPeriod}
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-[#D6F0E5] font-sans max-w-md">
                      {asset.thesis}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] uppercase font-spacemono font-semibold px-2 py-0.5 rounded bg-[#1E5747] text-[#5FC98A] border border-[#5FC98A]/30">
                        VERIFIED SPOT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
