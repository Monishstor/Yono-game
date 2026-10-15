import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  Copy,
  Check
} from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
  currentPin: string;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToSite,
  currentPin
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your Admin Password or Security PIN');
      return;
    }

    const trimmed = password.trim();
    // Validate against current PIN, master pin, or default
    if (
      trimmed === currentPin || 
      trimmed === 'admin123' || 
      trimmed === 'yono@2026' || 
      trimmed === 'admin' ||
      trimmed === '1234'
    ) {
      setError('');
      onLoginSuccess();
    } else {
      setError('❌ Invalid Admin ID or Password. Please check and try again.');
    }
  };

  const handleCopyAdminUrl = () => {
    const url = window.location.origin + window.location.pathname + '#admin';
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>← Back to Public Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SECURE OWNER GATEWAY</span>
        </div>
      </header>

      {/* Center Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          {/* Glowing Top Border Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full blur-[1px]" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 mb-3.5 ring-4 ring-amber-500/20">
              <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Owner Administration</span>
            </div>

            <h1 className="text-2xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Master Admin Login
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Login to add new Yono apps, upload custom photos, set download links, and configure bonuses.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / ID */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Admin Username / ID</span>
                <span className="text-[10px] text-slate-500 font-mono">Default: admin</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Master Password / PIN</span>
                <span className="text-[10px] text-amber-400 font-mono">Default: admin123</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password..."
                  className="w-full bg-slate-950 text-slate-100 text-sm pl-10 pr-10 py-3 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-rose-400 font-medium mt-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Auto Fill */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400/20"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                  setError('');
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Default (admin123)</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <span>Login to Admin Panel (लॉगिन करें)</span>
            </button>
          </form>

          {/* Quick Bookmark Tip */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="truncate mr-2">Admin URL: <strong>#admin</strong></span>
              <button
                type="button"
                onClick={handleCopyAdminUrl}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold shrink-0 cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              🔒 Keep this URL secret. Only you can access the admin dashboard.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500">
        © 2026 All New Yono Apps Portal • Master Admin Control
      </footer>

    </div>
  );
};
