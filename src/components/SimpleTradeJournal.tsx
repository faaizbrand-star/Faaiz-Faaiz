import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PlusCircle, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Smile, 
  Meh, 
  Frown, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Filter,
  Download,
  ShieldAlert
} from 'lucide-react';
import { TradeJournalEntry, TradeOutcome, EmotionalState } from '../types';

interface SimpleTradeJournalProps {
  onReviewWithAi?: (prompt: string) => void;
  brandName?: string;
}

const STORAGE_KEY = 'faaiz_trade_journal_v1';

const INITIAL_SAMPLE_ENTRIES: TradeJournalEntry[] = [
  {
    id: 'sample-1',
    symbol: 'BTC/USDT',
    direction: 'long',
    setupType: 'Liquidity Sweep',
    emotionalState: 'disciplined',
    outcome: 'win',
    entryPrice: 61800,
    exitPrice: 65200,
    pnl: 520,
    notes: 'Waited for the 4H range low sweep. Respected stop loss at $60,400. Took profit into daily resistance.',
    timestamp: 'Yesterday at 14:30'
  },
  {
    id: 'sample-2',
    symbol: 'ETH/USDT',
    direction: 'long',
    setupType: 'Key Level Retest',
    emotionalState: 'fomo',
    outcome: 'loss',
    entryPrice: 3520,
    exitPrice: 3410,
    pnl: -165,
    notes: 'Entered on a green candle impulse before confirmation. Need to wait for hourly close before entering.',
    timestamp: '2 days ago'
  }
];

export const SimpleTradeJournal: React.FC<SimpleTradeJournalProps> = ({
  onReviewWithAi,
  brandName = "Faaiz Durrani"
}) => {
  const symbolInputId = useId();
  const setupTypeInputId = useId();
  const emotionalStateInputId = useId();
  const outcomeInputId = useId();
  const entryPriceInputId = useId();
  const exitPriceInputId = useId();
  const pnlInputId = useId();
  const notesInputId = useId();

  // Persistent entries
  const [entries, setEntries] = useState<TradeJournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load trade journal from localStorage', e);
    }
    return INITIAL_SAMPLE_ENTRIES;
  });

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | TradeOutcome>('all');
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  // Form inputs
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [setupType, setSetupType] = useState('Liquidity Sweep');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('disciplined');
  const [outcome, setOutcome] = useState<TradeOutcome>('open');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [exitPrice, setExitPrice] = useState<string>('');
  const [pnl, setPnl] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('Failed to save trade journal to localStorage', e);
    }
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    const newId = 'entry-' + Date.now();
    const newEntry: TradeJournalEntry = {
      id: newId,
      symbol: symbol.trim().toUpperCase(),
      direction,
      setupType: setupType.trim(),
      emotionalState,
      outcome,
      entryPrice: entryPrice ? parseFloat(entryPrice) : undefined,
      exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
      pnl: pnl ? parseFloat(pnl) : undefined,
      notes: notes.trim() || undefined,
      timestamp: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setEntries(prev => [newEntry, ...prev]);
    setNewlyAddedId(newId);
    setTimeout(() => setNewlyAddedId(null), 3500);

    // Reset form
    setNotes('');
    setEntryPrice('');
    setExitPrice('');
    setPnl('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all journal entries from this session?')) {
      setEntries([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trade_journal_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAskAiToReview = (entry: TradeJournalEntry) => {
    if (!onReviewWithAi) return;

    const prompt = `Trade Journal Execution Review:
- Symbol: ${entry.symbol} (${entry.direction.toUpperCase()})
- Setup Type: ${entry.setupType}
- Emotional State: ${entry.emotionalState.toUpperCase()}
- Outcome: ${entry.outcome.toUpperCase()}
${entry.entryPrice ? `- Entry Price: $${entry.entryPrice.toLocaleString()}` : ''}
${entry.exitPrice ? `- Exit Price: $${entry.exitPrice.toLocaleString()}` : ''}
${entry.pnl !== undefined ? `- PnL: ${entry.pnl >= 0 ? '+' : ''}$${entry.pnl}` : ''}
${entry.notes ? `- Trader Reflections: "${entry.notes}"` : ''}

Please review this trade execution through ${brandName}'s trading psychology and market framework. What psychological or technical lesson should be reinforced?`;

    onReviewWithAi(prompt);
  };

  // Filtered entries
  const filteredEntries = entries.filter(e => {
    if (outcomeFilter === 'all') return true;
    return e.outcome === outcomeFilter;
  });

  // Calculate statistics
  const totalTrades = entries.length;
  const closedTrades = entries.filter(e => e.outcome === 'win' || e.outcome === 'loss');
  const wins = entries.filter(e => e.outcome === 'win').length;
  const losses = entries.filter(e => e.outcome === 'loss').length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;
  const disciplinedTrades = entries.filter(e => e.emotionalState === 'disciplined').length;
  const disciplineScore = totalTrades > 0 ? Math.round((disciplinedTrades / totalTrades) * 100) : 0;

  return (
    <div className="bg-[#0d2e26] border border-[#F2D231]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[680px]">
      {/* Header */}
      <div className="bg-[#123D32] border-b border-[#F2D231]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F2D231]/15 border border-[#F2D231]/30 flex items-center justify-center text-[#F2D231]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-bold text-white text-sm">Simple Trade Journal</span>
              <span className="text-[10px] font-spacemono uppercase px-1.5 py-0.5 rounded bg-[#F2D231]/15 text-[#F2D231] border border-[#F2D231]/30">
                Local Storage
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-inter">
              Log execution discipline, setup patterns &amp; mental state
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-spacemono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showForm 
                ? 'bg-[#071914] text-gray-300 border border-white/20' 
                : 'bg-[#F2D231] hover:bg-[#ffe14d] text-black shadow-[0_0_10px_rgba(242,210,49,0.2)]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{showForm ? 'View Logs' : 'New Log'}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="bg-[#09221b] border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-[11px] font-spacemono">
          <span className="text-gray-400">
            Total: <strong className="text-white">{totalTrades}</strong>
          </span>
          <span className="text-gray-400">
            Win Rate: <strong className={winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}>{winRate}%</strong>
          </span>
          <span className="text-gray-400 hidden sm:inline">
            Discipline: <strong className="text-[#F2D231]">{disciplineScore}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportJson}
                title="Export Journal as JSON"
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                title="Clear all session entries"
                className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Body: Toggle between New Log Form and Logs Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-inter text-xs scrollbar-thin scrollbar-thumb-[#F2D231]/20 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          {showForm ? (
            /* Entry Form */
            <motion.form
              key="journal-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="font-spacemono uppercase tracking-wider text-[#F2D231] font-bold text-[11px]">
                  Record Trade Execution
                </span>
                <span className="text-[10px] text-gray-400 font-spacemono">
                  Saved instantly to your browser
                </span>
              </div>

              {/* Symbol & Direction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor={symbolInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold">
                      Symbol / Pair
                    </label>
                    <div className="flex gap-1 text-[9px] font-spacemono text-[#F2D231]">
                      {['BTC', 'ETH', 'SOL'].map((token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => setSymbol(`${token}/USDT`)}
                          className="hover:underline"
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    id={symbolInputId}
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="BTC/USDT"
                    className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-sm font-spacemono text-white font-bold uppercase focus:outline-none"
                  />
                </div>

                <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
                  <span className="text-[11px] font-spacemono uppercase text-gray-300 font-bold block mb-1.5">
                    Direction
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirection('long')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-spacemono uppercase font-bold flex items-center justify-center gap-1 transition-all ${
                        direction === 'long'
                          ? 'bg-[#123D32] text-[#F2D231] border border-[#F2D231]/40'
                          : 'bg-black/30 text-gray-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Long</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirection('short')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-spacemono uppercase font-bold flex items-center justify-center gap-1 transition-all ${
                        direction === 'short'
                          ? 'bg-red-950/70 text-red-300 border border-red-500/40'
                          : 'bg-black/30 text-gray-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      <span>Short</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Setup Type */}
              <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
                <label htmlFor={setupTypeInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold block mb-1.5">
                  Setup Type / Methodology
                </label>
                <input
                  id={setupTypeInputId}
                  type="text"
                  required
                  value={setupType}
                  onChange={(e) => setSetupType(e.target.value)}
                  placeholder="e.g. Liquidity Sweep, Key Level Retest, Macro Spot"
                  className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  {['Liquidity Sweep', 'Key Level Retest', 'Macro Spot Accumulation', 'Range Reversal', 'Order Block'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSetupType(item)}
                      className={`px-2 py-0.5 rounded text-[9px] font-spacemono transition-colors ${
                        setupType === item
                          ? 'bg-[#F2D231] text-black font-bold'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emotional State & Outcome Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Emotional State */}
                <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
                  <label htmlFor={emotionalStateInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold block mb-1.5">
                    Emotional State
                  </label>
                  <select
                    id={emotionalStateInputId}
                    value={emotionalState}
                    onChange={(e) => setEmotionalState(e.target.value as EmotionalState)}
                    className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="disciplined">🧘 Calm &amp; Disciplined</option>
                    <option value="confident">⚡ Confident / Flow State</option>
                    <option value="hesitant">🧐 Slightly Hesitant</option>
                    <option value="fomo">🔥 FOMO / Impatient</option>
                    <option value="anxious">🚨 Revenge / Anxious</option>
                  </select>
                </div>

                {/* Outcome */}
                <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
                  <label htmlFor={outcomeInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold block mb-1.5">
                    Trade Outcome
                  </label>
                  <select
                    id={outcomeInputId}
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as TradeOutcome)}
                    className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="open">⏳ Open / In Play</option>
                    <option value="win">🎯 Target Hit (Win)</option>
                    <option value="loss">🛑 Stopped Out (Loss)</option>
                    <option value="breakeven">⚖️ Breakeven</option>
                  </select>
                </div>
              </div>

              {/* Optional Prices & PnL */}
              <div className="grid grid-cols-3 gap-2 bg-[#071914] border border-white/10 rounded-xl p-3">
                <div>
                  <label htmlFor={entryPriceInputId} className="text-[10px] font-spacemono uppercase text-gray-400 block mb-1">
                    Entry ($)
                  </label>
                  <input
                    id={entryPriceInputId}
                    type="number"
                    step="any"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="64000"
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white font-spacemono focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={exitPriceInputId} className="text-[10px] font-spacemono uppercase text-gray-400 block mb-1">
                    Exit ($)
                  </label>
                  <input
                    id={exitPriceInputId}
                    type="number"
                    step="any"
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    placeholder="67500"
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white font-spacemono focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={pnlInputId} className="text-[10px] font-spacemono uppercase text-gray-400 block mb-1">
                    PnL ($)
                  </label>
                  <input
                    id={pnlInputId}
                    type="number"
                    step="any"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="+350"
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white font-spacemono focus:outline-none"
                  />
                </div>
              </div>

              {/* Reflection Notes */}
              <div className="bg-[#071914] border border-white/10 rounded-xl p-3">
                <label htmlFor={notesInputId} className="text-[11px] font-spacemono uppercase text-gray-300 font-bold block mb-1.5">
                  Psychology &amp; Lessons Learned
                </label>
                <textarea
                  id={notesInputId}
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Did you respect your invalidation stop? Were you patient with the entry? Note key observations..."
                  className="w-full bg-black/40 border border-white/15 focus:border-[#F2D231] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#F2D231] hover:bg-[#ffe14d] text-black font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(242,210,49,0.3)] cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Journal Entry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-spacemono text-xs cursor-pointer border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            /* Logs Feed */
            <motion.div
              key="journal-feed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Filter Tabs */}
              <div className="flex items-center justify-between gap-1 pb-1">
                <div className="flex items-center gap-1 bg-[#071914] p-0.5 rounded-lg border border-white/10">
                  {(['all', 'win', 'loss', 'open'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setOutcomeFilter(filter)}
                      className={`px-2 py-1 rounded text-[10px] font-spacemono uppercase transition-colors ${
                        outcomeFilter === filter
                          ? 'bg-[#F2D231] text-black font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-spacemono">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'trade' : 'trades'}
                </span>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-3 border border-dashed border-white/10 rounded-xl bg-black/20">
                  <BookOpen className="w-8 h-8 mx-auto text-[#F2D231]/40" />
                  <p className="text-xs">No trade journal entries found in this category.</p>
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#123D32] hover:bg-[#1a5244] border border-[#F2D231]/30 text-[#F2D231] text-xs font-spacemono inline-flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Record First Trade</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {filteredEntries.map((entry) => {
                      const isNew = entry.id === newlyAddedId;
                      const isWin = entry.outcome === 'win';
                      const isLoss = entry.outcome === 'loss';
                      const isOpen = entry.outcome === 'open';

                      return (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, y: -20, scale: 0.96 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 380,
                              damping: 24,
                              mass: 0.8
                            }
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.92, 
                            y: -12,
                            transition: { duration: 0.2 } 
                          }}
                          className={`bg-[#071914] rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm ${
                            isNew
                              ? 'border-2 border-[#F2D231] shadow-[0_0_22px_rgba(242,210,49,0.35)] ring-1 ring-[#F2D231]/50'
                              : 'border border-white/10 hover:border-[#F2D231]/30'
                          }`}
                        >
                          {/* New Entry Indicator Banner */}
                          {isNew && (
                            <div className="flex items-center justify-between pb-1 border-b border-[#F2D231]/20">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-spacemono text-[#F2D231] font-bold">
                                <Sparkles className="w-3 h-3 text-[#F2D231]" />
                                <span>Newly Saved Trade</span>
                              </span>
                              <span className="text-[9px] font-spacemono text-[#F2D231]/70">
                                Stored in session
                              </span>
                            </div>
                          )}

                          {/* Top Row: Symbol, Direction, Outcome, Time */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-syne font-bold text-white text-sm tracking-tight">
                                {entry.symbol}
                              </span>
                              <span className={`text-[9px] font-spacemono uppercase px-1.5 py-0.5 rounded font-bold border ${
                                entry.direction === 'long'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                  : 'bg-red-950/60 text-red-300 border-red-500/30'
                              }`}>
                                {entry.direction}
                              </span>
                              <span className={`text-[9px] font-spacemono uppercase px-1.5 py-0.5 rounded font-bold border ${
                                isWin
                                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-400/40'
                                  : isLoss
                                    ? 'bg-red-900/60 text-red-300 border-red-400/40'
                                    : isOpen
                                      ? 'bg-amber-900/60 text-amber-300 border-amber-400/40'
                                      : 'bg-gray-800 text-gray-300 border-gray-600'
                              }`}>
                                {entry.outcome === 'win' && 'Target Hit'}
                                {entry.outcome === 'loss' && 'Stopped Out'}
                                {entry.outcome === 'open' && 'In Play'}
                                {entry.outcome === 'breakeven' && 'Breakeven'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-spacemono">
                                {entry.timestamp}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDelete(entry.id)}
                                title="Delete entry"
                                className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Meta: Setup Type & Emotional State */}
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-spacemono">
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                              Setup: <strong className="text-white">{entry.setupType}</strong>
                            </span>

                            {/* Emotional State Pill */}
                            <span className={`px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                              entry.emotionalState === 'disciplined'
                                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                                : entry.emotionalState === 'confident'
                                  ? 'bg-blue-950/40 text-blue-300 border-blue-500/30'
                                  : entry.emotionalState === 'hesitant'
                                    ? 'bg-yellow-950/40 text-yellow-300 border-yellow-500/30'
                                    : entry.emotionalState === 'fomo'
                                      ? 'bg-orange-950/40 text-orange-300 border-orange-500/30'
                                      : 'bg-red-950/40 text-red-300 border-red-500/30'
                            }`}>
                              {entry.emotionalState === 'disciplined' && <Smile className="w-3 h-3" />}
                              {entry.emotionalState === 'confident' && <Flame className="w-3 h-3" />}
                              {entry.emotionalState === 'hesitant' && <HelpCircle className="w-3 h-3" />}
                              {entry.emotionalState === 'fomo' && <AlertCircle className="w-3 h-3" />}
                              {entry.emotionalState === 'anxious' && <Frown className="w-3 h-3" />}
                              <span className="capitalize">{entry.emotionalState}</span>
                            </span>

                            {/* PnL if present */}
                            {entry.pnl !== undefined && (
                              <span className={`px-2 py-0.5 rounded border font-bold ${
                                entry.pnl >= 0
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                  : 'bg-red-950/60 text-red-400 border-red-500/30'
                              }`}>
                                {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Reflection Note */}
                          {entry.notes && (
                            <div className="bg-black/30 rounded-lg p-2 text-[11px] text-gray-300 border-l-2 border-[#F2D231]/60 leading-relaxed font-inter italic">
                              "{entry.notes}"
                            </div>
                          )}

                          {/* AI Feedback Action Button */}
                          {onReviewWithAi && (
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleAskAiToReview(entry)}
                                className="text-[10px] font-spacemono text-[#F2D231] hover:text-[#ffe14d] flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-[#F2D231]/30 transition-all cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-[#F2D231]" />
                                <span>Review Psychology with AI Mentor</span>
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
