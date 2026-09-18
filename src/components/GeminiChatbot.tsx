import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Bot, 
  User, 
  ChevronDown, 
  Sliders, 
  Copy, 
  Check, 
  Zap, 
  Cpu, 
  BookOpen, 
  Minimize2, 
  Maximize2,
  AlertTriangle,
  Volume2,
  VolumeX,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { ChatMessage, ChatRoleType, TaskComplexity } from '../types';
import { chatSound } from '../utils/audio';
import { MarkdownRenderer } from './MarkdownRenderer';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  isSoundEnabled?: boolean;
  onToggleSound?: () => void;
}

interface RoleConfig {
  id: ChatRoleType;
  name: string;
  shortDesc: string;
  defaultModel: string;
  taskComplexity: TaskComplexity;
  icon: typeof Bot;
  accentColor: string;
  systemInstruction: string;
}

const ROLES: Record<ChatRoleType, RoleConfig> = {
  mentor: {
    id: 'mentor',
    name: 'Faaiz AI Mentor',
    shortDesc: 'General market perspective & spot education',
    defaultModel: 'gemini-3.5-flash',
    taskComplexity: 'general',
    icon: BookOpen,
    accentColor: '#F2D231',
    systemInstruction: `You are Faaiz Durrani's official AI Market Analyst & Mentor for the FaaizDurrani Crypto & Trading Education platform.
Your mission is to provide realistic, math-grounded crypto education, spot accumulation tactics, order flow insights, and strict capital preservation protocols.
Key guidelines:
- Emphasize spot accumulation and risk math over 100x high-leverage gambling.
- Teach students WHY a trade setup occurs (liquidity zones, rate-of-change confluence, macro order books).
- If users ask about signals, remind them that signals without educational reasoning are gambling.
- Speak with confidence, honesty, composure, and humility. You can communicate in English or Urdu/Roman Urdu if the user writes in that language.
- Format responses cleanly with bold key terms, concise bullet points, and clear actionable takeaways.
- Disclaimer: Remind users that all commentary is for informational and educational purposes only and does not constitute financial advice.`
  },
  quant: {
    id: 'quant',
    name: 'Calculus & Risk Engine',
    shortDesc: 'Particularly complex math & order block calculus',
    defaultModel: 'gemini-3.1-pro-preview',
    taskComplexity: 'complex',
    icon: Cpu,
    accentColor: '#60A5FA',
    systemInstruction: `You are an advanced quantitative crypto strategist and mathematical market analyst for FaaizDurrani.
You handle particularly complex analytical tasks:
- Deep portfolio risk modeling, Kelly criterion approximations, and position sizing formulas (risk per trade, max drawdown probability).
- Calculus-based order flow dynamics: mathematical rate of price change (dPrice/dt), volume delta divergence, and liquidity confluence zones.
- Multi-timeframe confluence frameworks (Weekly macro structure -> Daily liquidity sweeps -> 4H order blocks).
- Break down trade setups with rigorous, step-by-step mathematical reasoning, exact invalidation levels, and risk-to-reward ratios.`
  },
  explainer: {
    id: 'explainer',
    name: 'Rapid Explainer',
    shortDesc: 'Fast definitions, terms & lightning Q&A',
    defaultModel: 'gemini-3.1-flash-lite',
    taskComplexity: 'fast',
    icon: Zap,
    accentColor: '#34D399',
    systemInstruction: `You are a lightning-fast crypto terms and concept explainer for FaaizDurrani.
You handle fast, high-speed queries:
- Provide instant, punchy, crystal-clear definitions of crypto terms (e.g., funding rates, slippage, liquidity pools, order books, spot vs perpetuals).
- Keep explanations concise, accurate, and easy to understand in 2 to 4 sentences.
- Zero fluff, zero hype, direct and to the point.`
  }
};

const SUGGESTED_PROMPTS: Record<ChatRoleType, string[]> = {
  mentor: [
    "What is Faaiz's core spot accumulation thesis?",
    "Why does Faaiz advise against high leverage in Pakistan?",
    "How do I manage emotions during a 30% market dip?",
    "Can you explain the difference between spot signals and gambling?"
  ],
  quant: [
    "Calculate safe position sizing for a $10,000 spot portfolio risking 2% per trade.",
    "Explain calculus-based order flow dynamics and liquidity sweeps.",
    "How do you mathematically determine a trade's invalidation point?",
    "Formulate an optimal Risk-to-Reward ratio scenario for BTC support."
  ],
  explainer: [
    "Define funding rate in 2 sentences.",
    "What is slippage and why does it occur?",
    "What is an order book liquidity pool?",
    "Spot vs Futures: What's the main risk difference?"
  ]
};

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ 
  isOpen, 
  onClose, 
  brandName = "Faaiz Durrani",
  isSoundEnabled = true,
  onToggleSound
}) => {
  const [selectedRole, setSelectedRole] = useState<ChatRoleType>('mentor');
  const [modelOverride, setModelOverride] = useState<string>('gemini-3.5-flash');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Close confirmation modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showClearConfirm) {
        setShowClearConfirm(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showClearConfirm]);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello! I am ${brandName}'s AI Market Assistant. I can assist you with spot market education, mathematical risk protocols, or fast crypto definitions.\n\nChoose an analyst role above to calibrate my speed and depth, or ask any trading question below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      roleId: 'mentor'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Sync default model when role changes
  const handleSelectRole = (roleKey: ChatRoleType) => {
    setSelectedRole(roleKey);
    setModelOverride(ROLES[roleKey].defaultModel);
    setShowRoleSelector(false);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        role: 'model',
        text: `Conversation cleared. I am ready in **${ROLES[selectedRole].name}** mode powered by \`${modelOverride}\`. How can I assist your trading education today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelOverride,
        roleId: selectedRole
      }
    ]);
    setShowClearConfirm(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    if (isSoundEnabled) {
      chatSound.playPing('send');
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, text: m.text })),
          model: modelOverride,
          roleId: selectedRole,
          taskComplexity: ROLES[selectedRole].taskComplexity,
          customSystemInstruction: customInstruction.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.reply) {
        const botMessage: ChatMessage = {
          id: 'bot-' + Date.now(),
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || modelOverride,
          roleId: data.roleId || selectedRole,
          isFallback: data.isFallback
        };
        setMessages(prev => [...prev, botMessage]);
        if (isSoundEnabled) {
          chatSound.playPing('receive');
        }
      } else {
        throw new Error(data.error || 'Empty response received from AI');
      }
    } catch (err: any) {
      console.warn('Gemini chat request fallback:', err);
      // Static / Offline Fallback Response
      const fallbackReply = generateStaticFallback(promptText, selectedRole, brandName);
      const fallbackMessage: ChatMessage = {
        id: 'bot-fallback-' + Date.now(),
        role: 'model',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelOverride,
        roleId: selectedRole,
        isFallback: true
      };
      setMessages(prev => [...prev, fallbackMessage]);
      if (isSoundEnabled) {
        chatSound.playPing('receive');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const currentRole = ROLES[selectedRole];
  const CurrentRoleIcon = currentRole.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full bg-[#0d2e26] border border-[#F2D231]/30 flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-200 overflow-hidden ${
          isExpanded 
            ? 'h-[95vh] sm:h-[90vh] max-w-4xl sm:rounded-2xl' 
            : 'h-[85vh] sm:h-[650px] max-w-xl sm:rounded-2xl'
        }`}
      >
        {/* Clear Chat Confirmation Modal */}
        {showClearConfirm && (
          <div 
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowClearConfirm(false);
            }}
          >
            <div 
              role="alertdialog"
              aria-labelledby="clear-chat-title"
              aria-describedby="clear-chat-description"
              className="bg-[#0a231d] border border-red-500/40 rounded-2xl p-5 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4 text-center ring-1 ring-red-500/20"
            >
              <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h4 id="clear-chat-title" className="font-syne font-bold text-white text-base tracking-tight">
                  Clear Conversation?
                </h4>
                <p id="clear-chat-description" className="text-gray-300 text-xs leading-relaxed font-inter">
                  Are you sure you want to wipe the active conversation history with{' '}
                  <strong className="text-[#F2D231]">{currentRole.name}</strong>?
                  {messages.length > 1 ? (
                    <span className="block text-gray-400 text-[11px] mt-1.5 font-spacemono">
                      {messages.length} messages in this active thread will be wiped.
                    </span>
                  ) : (
                    <span className="block text-gray-400 text-[11px] mt-1.5 font-spacemono">
                      This will reset the chat session to its initial state.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  id="cancel-clear-chat-btn"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-spacemono transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-clear-chat-btn"
                  onClick={handleClearHistory}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-spacemono font-bold text-xs transition-all shadow-lg shadow-red-950/50 hover:shadow-red-600/40 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Clear Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#123D32] border-b border-[#F2D231]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F2D231]/10 border border-[#F2D231]/30 flex items-center justify-center text-[#F2D231]">
              <CurrentRoleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne font-bold text-white text-sm tracking-tight">{currentRole.name}</span>
                <span className="text-[10px] font-spacemono uppercase px-1.5 py-0.5 rounded bg-[#F2D231]/15 text-[#F2D231] border border-[#F2D231]/30">
                  {modelOverride}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-inter truncate max-w-[240px] sm:max-w-xs">
                {currentRole.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="chat-toggle-roles"
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              title="Switch role or Gemini model"
              className={`p-1.5 rounded-lg text-xs font-spacemono flex items-center gap-1 border transition-colors ${
                showRoleSelector 
                  ? 'bg-[#F2D231] text-black border-[#F2D231]' 
                  : 'text-gray-300 hover:text-white bg-[#0a231d] border-white/10 hover:border-[#F2D231]/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Role</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <button
              id="chat-clear-history"
              type="button"
              onClick={() => setShowClearConfirm(true)}
              title="Clear conversation history"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-spacemono flex items-center gap-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400/80" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>

            {onToggleSound && (
              <button
                id="chat-header-sound-toggle"
                type="button"
                onClick={onToggleSound}
                title={isSoundEnabled ? "Mute notification sounds" : "Unmute notification sounds"}
                aria-label={isSoundEnabled ? "Mute chat sounds" : "Unmute chat sounds"}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSoundEnabled 
                    ? 'text-[#F2D231] hover:text-[#FFE873] hover:bg-white/5' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              id="chat-expand-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
              className="hidden sm:block p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              id="chat-close-btn"
              onClick={onClose}
              title="Close chat"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role / Model Drawer Selector */}
        {showRoleSelector && (
          <div className="bg-[#0b241e] border-b border-[#F2D231]/20 p-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-spacemono uppercase tracking-wider text-[#F2D231] font-bold text-[11px]">
                SELECT ASSISTANT ROLE & MODEL
              </span>
              <button
                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                className="text-[11px] text-gray-300 hover:text-[#F2D231] underline"
              >
                {showCustomPrompt ? 'Hide Custom Prompt' : 'Edit System Instruction'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              {(Object.keys(ROLES) as ChatRoleType[]).map((key) => {
                const r = ROLES[key];
                const Icon = r.icon;
                const isSelected = selectedRole === key;
                return (
                  <button
                    key={key}
                    id={`select-role-${key}`}
                    onClick={() => handleSelectRole(key)}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#123D32] border-[#F2D231] text-white shadow-[0_0_10px_rgba(242,210,49,0.15)]'
                        : 'bg-[#081b16] border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5" style={{ color: r.accentColor }} />
                      <span className="font-bold font-syne text-[11px] text-white">{r.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-inter mb-1 leading-tight line-clamp-2">
                      {r.shortDesc}
                    </div>
                    <span className="text-[9px] font-spacemono text-[#F2D231]/80 mt-auto">
                      Model: {r.defaultModel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Model override toggle */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[10px] text-gray-400 font-spacemono uppercase">Engine:</span>
              <div className="flex gap-1.5">
                {[
                  { label: '⚡ Fast (3.1 Lite)', model: 'gemini-3.1-flash-lite' },
                  { label: '⚖️ General (3.5 Flash)', model: 'gemini-3.5-flash' },
                  { label: '🧠 Complex (3.1 Pro)', model: 'gemini-3.1-pro-preview' }
                ].map((item) => (
                  <button
                    key={item.model}
                    onClick={() => setModelOverride(item.model)}
                    className={`px-2 py-0.5 rounded text-[10px] font-spacemono transition-colors ${
                      modelOverride === item.model
                        ? 'bg-[#F2D231] text-black font-bold'
                        : 'bg-black/30 text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instruction Box */}
            {showCustomPrompt && (
              <div className="mt-2 pt-2 border-t border-white/5">
                <label className="block text-[10px] font-spacemono text-gray-300 mb-1">
                  Active System Instruction (Role Prompt):
                </label>
                <textarea
                  rows={3}
                  value={customInstruction || currentRole.systemInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded p-2 text-[11px] text-gray-200 font-mono focus:outline-none focus:border-[#F2D231]"
                  placeholder="Define custom persona, risk boundaries, or tone..."
                />
              </div>
            )}
          </div>
        )}

        {/* Scrollable Message Thread */}
        <div 
          id="chat-messages-thread"
          className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-inter scrollbar-thin scrollbar-thumb-[#F2D231]/20 scrollbar-track-transparent"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedId === msg.id;
            const sentiment = !isUser ? detectMarketSentiment(msg.text) : null;

            return (
              <div 
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#123D32] border border-[#F2D231]/30 flex items-center justify-center flex-shrink-0 text-[#F2D231] mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div 
                  className={`relative group max-w-[85%] sm:max-w-[78%] rounded-xl p-3.5 leading-relaxed ${
                    isUser
                      ? 'bg-[#1b4b3e] text-white border border-[#F2D231]/30 rounded-tr-none'
                      : 'bg-[#0f342b] text-gray-200 border border-white/10 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Message Meta / Role Tag */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-spacemono font-bold tracking-wide uppercase text-[#F2D231]">
                        {isUser ? 'You' : `${brandName} AI`}
                      </span>
                      {!isUser && sentiment && (
                        <span
                          id={`sentiment-badge-${msg.id}`}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-spacemono font-bold tracking-wide border transition-all ${
                            sentiment === 'Bullish'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                              : sentiment === 'Bearish'
                              ? 'bg-red-950/80 text-red-400 border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                              : 'bg-zinc-800/80 text-zinc-300 border-zinc-500/30'
                          }`}
                          title={`Market Sentiment: ${sentiment}`}
                        >
                          {sentiment === 'Bullish' && <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />}
                          {sentiment === 'Bearish' && <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
                          {sentiment === 'Neutral' && <Minus className="w-2.5 h-2.5 text-zinc-400" />}
                          <span>{sentiment}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 opacity-70">
                      {!isUser && msg.modelUsed && (
                        <span className="text-[9px] font-spacemono px-1 rounded bg-black/40 text-gray-400">
                          {msg.modelUsed}
                        </span>
                      )}
                      <span className="text-[9px] text-gray-400 font-spacemono">{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy message"
                        className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity ml-1"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="text-[13px] sm:text-sm text-gray-100 leading-relaxed font-inter">
                    <MarkdownRenderer content={msg.text} />
                  </div>

                  {msg.isFallback && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-[#F2D231]/80 font-spacemono flex items-center gap-1">
                      <span>• Static Fallback Mode</span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#1b4b3e] border border-[#F2D231]/30 flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[#123D32] border border-[#F2D231]/30 flex items-center justify-center flex-shrink-0 text-[#F2D231]">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-[#0f342b] border border-white/10 rounded-xl rounded-tl-none p-3 text-gray-300 flex items-center gap-2">
                <span className="text-xs font-spacemono text-gray-400">
                  {currentRole.name} is reasoning with {modelOverride}...
                </span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2D231] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2D231] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2D231] animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-[#09221b] border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
          {SUGGESTED_PROMPTS[selectedRole].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#123D32]/80 hover:bg-[#123D32] border border-[#F2D231]/20 hover:border-[#F2D231]/60 text-[11px] text-gray-300 hover:text-white transition-all whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#0c2820] border-t border-[#F2D231]/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                id="chat-input-textarea"
                rows={2}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${currentRole.name}... (Press Enter to send)`}
                className="w-full bg-[#071914] border border-white/15 focus:border-[#F2D231] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none resize-none transition-colors"
                disabled={isLoading}
              />
              <span className="absolute right-2 bottom-1.5 text-[9px] font-spacemono text-gray-500 hidden sm:inline">
                Shift + Enter for newline
              </span>
            </div>

            <button
              type="submit"
              id="chat-send-btn"
              disabled={isLoading || !inputPrompt.trim()}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                isLoading || !inputPrompt.trim()
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                  : 'bg-[#F2D231] hover:bg-[#ffe14d] text-black font-bold shadow-[0_0_15px_rgba(242,210,49,0.3)] hover:scale-105 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-gray-500 font-spacemono">
            <span>Role: {currentRole.name}</span>
            <span>Educational guidance only. Not financial advice.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fallback generator for static environments (GitHub Pages)
function generateStaticFallback(query: string, role: ChatRoleType, brandName: string): string {
  const lower = query.toLowerCase();

  if (role === 'quant') {
    return `### 📐 Quantitative Risk Analysis (${brandName})
For a disciplined spot trading framework:
- **Maximum Capital at Risk (per trade)**: Never exceed 1.5% - 2.0% of total portfolio equity.
- **Position Sizing Formula**: \`Position Size = (Account Capital × Risk %) / (Entry Price - Invalidation Stop Price)\`.
- **Calculus Confluence**: Measure the rate of price change (dPrice/dt) against volume delta. If volume diminishes as price tests resistance, institutional distribution is active.
- **Invalidation Rule**: A structural breakdown below the macro liquidity wick invalidates the trade setup.`;
  }

  if (role === 'explainer') {
    if (lower.includes('funding')) {
      return `**Funding Rate**: A recurring fee exchanged directly between perpetual long and short traders to keep contract prices pegged to the spot index price. When positive, longs pay shorts; when negative, shorts pay longs.`;
    }
    if (lower.includes('slippage')) {
      return `**Slippage**: The difference between the expected price of a trade and the executed price. It happens during high volatility or in thin order books when market orders sweep through multiple price levels.`;
    }
    return `**Core Terminology Breakdown**:
In ${brandName}'s methodology, crypto movements are governed by order book liquidity and market maker rebalancing. Avoid chasing impulsive green candles; wait for liquidity accumulation tests before entering.`;
  }

  return `### 🎓 ${brandName} AI Market Analyst
Thank you for your question regarding "${query}".

**Key Educational Principles**:
- **Spot Accumulation First**: Spot holding protects you from liquidation wicks and funding drains that ruin 95% of leverage traders.
- **Patience over Action**: Wait for the market to sweep historical liquidity levels before placing bids.
- **Zero Hype**: No overnight millionaire schemes. Consistent 2-5% monthly compounding on real capital beats gambling every single time.`;
}

export type MarketSentiment = 'Bullish' | 'Bearish' | 'Neutral';

const BULLISH_KEYWORDS = [
  'bullish',
  'uptrend',
  'breakout',
  'rally',
  'long position',
  'accumulation',
  'higher high',
  'surge',
  'gains',
  'gain',
  'support holds',
  'rebound',
  'upside',
  'bull run',
  'outperform',
  'green candle',
  'pumping',
  'positive momentum',
  'bulls in control',
  'buying pressure',
  'accumulate',
  'higher low'
];

const BEARISH_KEYWORDS = [
  'bearish',
  'downtrend',
  'breakdown',
  'drop',
  'dump',
  'short position',
  'distribution',
  'lower low',
  'crash',
  'plunge',
  'resistance rejects',
  'downside',
  'liquidation',
  'bear market',
  'bleed',
  'red candle',
  'negative momentum',
  'bears in control',
  'selling pressure',
  'invalidation',
  'lower high'
];

export function detectMarketSentiment(text: string): MarketSentiment {
  if (!text) return 'Neutral';
  const lower = text.toLowerCase();

  let bullScore = 0;
  let bearScore = 0;

  for (const word of BULLISH_KEYWORDS) {
    let index = 0;
    while ((index = lower.indexOf(word, index)) !== -1) {
      bullScore++;
      index += word.length;
    }
  }

  for (const word of BEARISH_KEYWORDS) {
    let index = 0;
    while ((index = lower.indexOf(word, index)) !== -1) {
      bearScore++;
      index += word.length;
    }
  }

  if (bullScore > bearScore && bullScore > 0) return 'Bullish';
  if (bearScore > bullScore && bearScore > 0) return 'Bearish';
  return 'Neutral';
}

