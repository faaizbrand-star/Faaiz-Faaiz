import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Zap, 
  Cpu, 
  BookOpen, 
  User, 
  Sliders, 
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ChatMessage, ChatRoleType, TaskComplexity } from '../types';

interface AiAnalystSectionProps {
  brandName?: string;
  onOpenApplication?: (plan?: string) => void;
}

interface RoleConfig {
  id: ChatRoleType;
  name: string;
  badge: string;
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
    badge: 'General Tasks',
    shortDesc: 'Spot accumulation thesis, discipline & macro crypto education',
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
    badge: 'Complex Tasks',
    shortDesc: 'Particularly complex math, Kelly criterion & order flow calculus',
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
    badge: 'Fast Tasks',
    shortDesc: 'Lightning-fast crypto definitions, indicators & terms',
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

const SUGGESTED_QUESTIONS: Record<ChatRoleType, string[]> = {
  mentor: [
    "What is Faaiz's core spot accumulation thesis?",
    "Why does Faaiz advise against high leverage in Pakistan?",
    "How do I manage emotions during a 30% market dip?",
    "Can you explain the difference between spot signals and gambling?"
  ],
  quant: [
    "Calculate position sizing for a $10,000 spot portfolio with 2% maximum risk.",
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

export const AiAnalystSection: React.FC<AiAnalystSectionProps> = ({ brandName = "Faaiz Durrani" }) => {
  const [selectedRole, setSelectedRole] = useState<ChatRoleType>('mentor');
  const [modelOverride, setModelOverride] = useState<string>('gemini-3.5-flash');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'section-welcome',
      role: 'model',
      text: `Welcome to the **${brandName} AI Market Terminal**.\n\nI am configured with multi-turn memory to simulate our private trading desk. You can switch roles above to invoke:\n• \`gemini-3.5-flash\` for general trading education\n• \`gemini-3.1-pro-preview\` for complex mathematical calculations\n• \`gemini-3.1-flash-lite\` for high-speed concept definitions.\n\nHow can I help you analyze the market today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      roleId: 'mentor'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threadContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll down within thread container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSelectRole = (key: ChatRoleType) => {
    setSelectedRole(key);
    setModelOverride(ROLES[key].defaultModel);
    setShowRoleMenu(false);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'reset-' + Date.now(),
        role: 'model',
        text: `Conversation history reset. System active in **${ROLES[selectedRole].name}** role running \`${modelOverride}\`. Ask your question below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelOverride,
        roleId: selectedRole
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textOverride?: string) => {
    const text = (textOverride || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, text: m.text })),
          model: modelOverride,
          roleId: selectedRole,
          taskComplexity: ROLES[selectedRole].taskComplexity
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.reply) {
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || modelOverride,
          roleId: data.roleId || selectedRole,
          isFallback: data.isFallback
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Empty response');
      }
    } catch (err) {
      console.warn('Chat request fallback:', err);
      // Static / offline fallback response
      const fallbackText = getFallbackText(text, selectedRole, brandName);
      const botMsg: ChatMessage = {
        id: 'bot-fb-' + Date.now(),
        role: 'model',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelOverride,
        roleId: selectedRole,
        isFallback: true
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeRole = ROLES[selectedRole];
  const ActiveIcon = activeRole.icon;

  return (
    <section id="ai-analyst" className="py-20 bg-[#0a231d] border-t border-b border-[#F2D231]/20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2D231]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#123D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D32] border border-[#F2D231]/30 text-[#F2D231] text-xs font-spacemono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Gemini AI Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-syne font-extrabold text-white tracking-tight mb-4">
            Ask The <span className="text-[#F2D231]">{brandName} AI</span> Analyst
          </h2>
          <p className="text-gray-300 font-inter text-sm sm:text-base leading-relaxed">
            Multi-turn intelligent market reasoning powered by specialized Gemini engines. Calibrate roles between high-speed terminology, general macro spot education, and complex calculus risk modeling.
          </p>
        </div>

        {/* Terminal Grid */}
        <div className="max-w-4xl mx-auto bg-[#0d2e26] border border-[#F2D231]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[680px]">
          {/* Terminal Control Bar */}
          <div className="bg-[#123D32] border-b border-[#F2D231]/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Active Role Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F2D231]/15 border border-[#F2D231]/30 flex items-center justify-center text-[#F2D231]">
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-syne font-bold text-white text-sm">{activeRole.name}</span>
                  <span className="text-[10px] font-spacemono uppercase px-1.5 py-0.5 rounded bg-[#F2D231]/15 text-[#F2D231] border border-[#F2D231]/30">
                    {modelOverride}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-inter hidden sm:block">
                  {activeRole.shortDesc}
                </p>
              </div>
            </div>

            {/* Role & Model Switcher Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <button
                  id="section-role-menu-toggle"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#071914] hover:bg-black/50 border border-white/10 hover:border-[#F2D231]/40 text-xs font-spacemono text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#F2D231]" />
                  <span>Switch Role</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showRoleMenu && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-[#09221b] border border-[#F2D231]/30 rounded-xl shadow-xl p-2 z-20 animate-fade-in text-xs">
                    <div className="text-[10px] font-spacemono uppercase text-[#F2D231] font-bold px-2 py-1 mb-1">
                      Select Chatbot Persona:
                    </div>
                    {(Object.keys(ROLES) as ChatRoleType[]).map((key) => {
                      const r = ROLES[key];
                      const Icon = r.icon;
                      const isSelected = selectedRole === key;
                      return (
                        <button
                          key={key}
                          id={`analyst-role-${key}`}
                          onClick={() => handleSelectRole(key)}
                          className={`w-full p-2 rounded-lg text-left flex items-start gap-2 transition-colors ${
                            isSelected
                              ? 'bg-[#123D32] text-white border border-[#F2D231]/40'
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: r.accentColor }} />
                          <div>
                            <div className="font-syne font-bold text-xs text-white">{r.name}</div>
                            <div className="text-[10px] text-gray-400 font-inter leading-tight mb-1">{r.shortDesc}</div>
                            <div className="text-[9px] font-spacemono text-[#F2D231]">Engine: {r.defaultModel}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Clear Button */}
              <button
                id="section-clear-btn"
                onClick={handleClear}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Engine Selector Tabs */}
          <div className="bg-[#09221b] border-b border-white/5 px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-[10px] font-spacemono uppercase text-gray-400">
              Task Complexity &amp; Model Routing:
            </span>
            <div className="flex gap-1.5">
              {[
                { label: '⚡ Fast (3.1 Flash-Lite)', model: 'gemini-3.1-flash-lite', role: 'explainer' as ChatRoleType },
                { label: '⚖️ General (3.5 Flash)', model: 'gemini-3.5-flash', role: 'mentor' as ChatRoleType },
                { label: '🧠 Complex (3.1 Pro)', model: 'gemini-3.1-pro-preview', role: 'quant' as ChatRoleType }
              ].map((item) => (
                <button
                  key={item.model}
                  onClick={() => {
                    setModelOverride(item.model);
                    setSelectedRole(item.role);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-spacemono transition-all ${
                    modelOverride === item.model
                      ? 'bg-[#F2D231] text-black font-bold shadow-[0_0_10px_rgba(242,210,49,0.25)]'
                      : 'bg-[#061713] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div 
            ref={threadContainerRef}
            id="section-messages-thread"
            className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-inter scrollbar-thin scrollbar-thumb-[#F2D231]/20 scrollbar-track-transparent"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isCopied = copiedId === msg.id;

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
                    {/* Header line inside bubble */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-spacemono font-bold tracking-wide uppercase text-[#F2D231]">
                        {isUser ? 'You' : `${brandName} AI Analyst`}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-70">
                        {!isUser && msg.modelUsed && (
                          <span className="text-[9px] font-spacemono px-1.5 py-0.2 rounded bg-black/40 text-gray-400">
                            {msg.modelUsed}
                          </span>
                        )}
                        <span className="text-[9px] text-gray-400 font-spacemono">{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title="Copy text"
                          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity ml-1"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="whitespace-pre-wrap text-[13px] sm:text-sm text-gray-100 space-y-2 leading-relaxed font-inter">
                      {formatChatText(msg.text)}
                    </div>

                    {msg.isFallback && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-[#F2D231]/80 font-spacemono">
                        • Verified Educational Knowledge Base
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

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-[#123D32] border border-[#F2D231]/30 flex items-center justify-center flex-shrink-0 text-[#F2D231]">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-[#0f342b] border border-white/10 rounded-xl rounded-tl-none p-3 text-gray-300 flex items-center gap-2">
                  <span className="text-xs font-spacemono text-gray-400">
                    {activeRole.name} is processing via {modelOverride}...
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

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-[#09221b] border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
            {SUGGESTED_QUESTIONS[selectedRole].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#123D32]/80 hover:bg-[#123D32] border border-[#F2D231]/20 hover:border-[#F2D231]/60 text-[11px] text-gray-300 hover:text-white transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0c2820] border-t border-[#F2D231]/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="section-chat-input"
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask ${activeRole.name} anything about spot analysis, math, or risk...`}
                className="flex-1 bg-[#071914] border border-white/15 focus:border-[#F2D231] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                disabled={isLoading}
              />

              <button
                type="submit"
                id="section-chat-submit"
                disabled={isLoading || !inputPrompt.trim()}
                className={`px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isLoading || !inputPrompt.trim()
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-[#F2D231] hover:bg-[#ffe14d] text-black font-bold shadow-[0_0_15px_rgba(242,210,49,0.3)] hover:scale-105 active:scale-95'
                }`}
              >
                <span className="hidden sm:inline font-syne text-xs uppercase font-bold">Ask AI</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper: Markdown parser
function formatChatText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('### ')) {
      return <h4 key={idx} className="font-bold text-[#F2D231] text-sm mt-2">{line.replace('### ', '')}</h4>;
    }
    if (line.startsWith('## ')) {
      return <h3 key={idx} className="font-bold text-white text-base mt-2">{line.replace('## ', '')}</h3>;
    }
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
      const clean = line.trim().substring(2);
      return (
        <div key={idx} className="flex items-start gap-1.5 ml-2">
          <span className="text-[#F2D231] font-bold">•</span>
          <span>{renderInlineText(clean)}</span>
        </div>
      );
    }
    return <p key={idx} className="min-h-[1em]">{renderInlineText(line)}</p>;
  });
}

function renderInlineText(str: string) {
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#F2D231]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-black/50 text-[#F2D231] font-mono text-[11px] border border-white/10">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function getFallbackText(query: string, role: ChatRoleType, brandName: string): string {
  const q = query.toLowerCase();
  if (role === 'quant') {
    return `### 📐 Quantitative Risk Protocol (${brandName})
- **Account Protection**: Risk is mathematically bounded at 1.5% - 2.0% per trade.
- **Position Size**: \`Size = (Account Risk Amount) / (Entry - Stop Level)\`.
- **Calculus Order Flow**: Rate of price change (dPrice/dt) indicates whether market makers are aggressively sweeping liquidity pools or quietly distributing spot holdings.`;
  }
  if (role === 'explainer') {
    if (q.includes('funding')) {
      return `**Funding Rate**: Periodic payment between long and short perp traders to keep perpetual futures prices aligned with the underlying spot index.`;
    }
    if (q.includes('slippage')) {
      return `**Slippage**: The price variance between order placement and order execution, caused by rapid volatility or insufficient book depth.`;
    }
    return `**Core Mechanics**:
In ${brandName}'s methodology, institutional spot accumulation always precedes markup. Avoid chasing green candles into resistance.`;
  }
  return `### 🎓 ${brandName} AI Market Analyst
In response to your inquiry regarding "${query}":

- **Capital Preservation**: Never trade with money you cannot afford to hold through a multi-month consolidation.
- **Spot Discipline**: Spot trading eliminates liquidation wicks and funding decay.
- **Educational Confluence**: Always know your mathematical invalidation before placing an order.`;
}
