import React, { useState } from 'react';
import { Lock, Shield, Terminal, ArrowRight, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
  onReturnToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onReturnToSite
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setError('Connection to security oracle failed. Ensure server is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <button
          onClick={onReturnToSite}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Login Card */}
        <div className="rounded-2xl bg-[#060b18] border border-cyan-500/30 p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-mono uppercase tracking-wide">
                Terminal Admin
              </h2>
              <p className="text-xs text-slate-400">
                VALENCE CONTENT & PORTAL ENGINE
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block uppercase text-slate-400 mb-1.5 font-bold">
                Operator Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#030611] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm font-sans"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1.5 font-bold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#030611] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating Hash...</span>
              ) : (
                <>
                  <span>Authorize Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Default Credentials Helper Box */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>DEFAULT DEMO CREDENTIALS:</span>
            </div>
            <div>Username: <strong className="text-slate-200">admin</strong></div>
            <div>Password: <strong className="text-slate-200">adminpassword123</strong></div>
            <div className="text-[10px] text-slate-500 pt-1">
              * Override anytime in .env via ADMIN_USERNAME & ADMIN_PASSWORD.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
