import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  id?: string;
  variant?: 'nav' | 'terminal' | 'pill';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  id = 'theme-toggle-btn',
  variant = 'nav',
  className = ''
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'terminal') {
    return (
      <button
        id={id}
        type="button"
        onClick={toggleTheme}
        className={`group inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-[#1E5747] hover:bg-[#256B57] text-[#D6F0E5] hover:text-[#F2D231] border border-[#F2D231]/30'
            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 font-semibold'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light (Daylight High-Contrast)' : 'Dark (Deep Emerald)'} Mode`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-3 h-3 text-[#F2D231] group-hover:rotate-45 transition-transform duration-200" />
            <span>DAY LIGHT</span>
          </>
        ) : (
          <>
            <Moon className="w-3 h-3 text-emerald-800 group-hover:-rotate-12 transition-transform duration-200" />
            <span>DARK EMERALD</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        id={id}
        type="button"
        onClick={toggleTheme}
        className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl text-xs font-spacemono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-[#194C3D] hover:bg-[#1E5747] text-[#D6F0E5] border border-[#F2D231]/30'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#F2D231]" />
          ) : (
            <Sun className="w-4 h-4 text-amber-600" />
          )}
          <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
          isDark ? 'bg-[#123D32] text-[#F2D231]' : 'bg-white text-slate-800 border border-slate-200'
        }`}>
          {isDark ? 'NIGHT' : 'DAY'}
        </span>
      </button>
    );
  }

  // Default 'nav' variant: compact, sleek button for navbar
  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center group ${
        isDark
          ? 'bg-[#194C3D]/90 hover:bg-[#1E5747] text-[#F2D231] border-[#F2D231]/30 hover:border-[#F2D231] shadow-[0_0_15px_rgba(242,210,49,0.15)]'
          : 'bg-white/90 hover:bg-slate-100 text-slate-800 hover:text-amber-600 border-slate-300 hover:border-slate-400 shadow-sm'
      } ${className}`}
      title={`Switch to ${isDark ? 'Daylight (High-Contrast Light)' : 'Deep Emerald (Dark)'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#F2D231] group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-800 group-hover:-rotate-12 transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle {isDark ? 'light' : 'dark'} mode</span>
    </button>
  );
};
