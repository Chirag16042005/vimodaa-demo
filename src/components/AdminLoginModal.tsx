import React, { useState } from 'react';
import { Lock, UserCheck, KeyRound, X, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate demo credentials: admin / 1234
    if (username.trim() === 'admin' && password.trim() === '1234') {
      onLoginSuccess();
      onClose();
    } else {
      setErrorMessage('Invalid credentials. Please use username: admin and password: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#f9f7f2] border border-[#ebdcc9] rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#1b4d3e] text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#d97706]" />
            <h2 className="font-serif-display text-xl font-bold text-amber-100">
              Vimodaa Admin Portal Authentication
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-900 rounded text-emerald-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-[#1b4d3e]/10 text-[#1b4d3e] rounded-full flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6 text-[#1b4d3e]" />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Authorized Vimodaa Agro management personnel access only.
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300/80 rounded-xl text-xs space-y-1 text-amber-950 font-mono">
            <div className="font-bold text-[#1b4d3e] font-sans flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-[#d97706]" /> Demo Access Credentials:
            </div>
            <div className="flex justify-between pt-0.5">
              <span>Username: <strong className="text-[#1b4d3e]">admin</strong></span>
              <span>Password: <strong className="text-[#1b4d3e]">1234</strong></span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1b4d3e]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1b4d3e]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Authenticate & Access Portal <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
