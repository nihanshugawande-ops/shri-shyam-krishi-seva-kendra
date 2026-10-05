import React, { useState } from 'react';
import { X, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('कृपया पासवर्ड दर्ज करें');
      return;
    }

    setLoading(true);
    setError('');

    const res = await api.login(password.trim());
    setLoading(false);

    if (res.success) {
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'अमान्य पासवर्ड! कृपया सही पासवर्ड दर्ज करें।');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#181a20] border border-zinc-700 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/90 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">व्यवस्थापक लॉगिन</h3>
            <p className="text-xs text-zinc-400">श्री श्याम कृषि सेवा केंद्र - एडमिन पोर्टल</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 flex items-center gap-2 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              एडमिन पासवर्ड
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें (उदा. kartik123)"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                autoFocus
              />
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>डिफ़ॉल्ट पासवर्ड: <code className="text-emerald-400 font-mono">kartik123</code> या <code className="text-emerald-400 font-mono">admin</code></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>{loading ? 'सत्यापित हो रहा है...' : 'लॉगिन करें'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
