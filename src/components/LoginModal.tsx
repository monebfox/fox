import React, { useState } from 'react';
import { Language, User } from '../types';
import { getTranslation } from '../i18n/translations';
import { LogIn, ShieldCheck, Key, UserCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  lang,
  onLanguageChange,
  users,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const found = users.find(
      u => u.username.toLowerCase() === cleanUser && u.password === password.trim()
    );

    if (found) {
      setErrorMsg('');
      onLoginSuccess(found);
    } else {
      setErrorMsg(getTranslation(lang, 'loginError'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1E3F] via-[#0D244D] to-[#061022] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C99A3E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2A7B9B]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Login Box */}
      <div className="bg-[#FFFDF8] border-2 border-[#C99A3E]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10">
        
        {/* Language Switcher on Login */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-3 py-1 rounded-lg transition-all ${lang === 'ar' ? 'bg-[#0B1E3F] text-white shadow-sm' : 'text-slate-600 hover:text-black'}`}
            >
              العربية 🇸🇦
            </button>
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-3 py-1 rounded-lg transition-all ${lang === 'fr' ? 'bg-[#0B1E3F] text-white shadow-sm' : 'text-slate-600 hover:text-black'}`}
            >
              Français 🇫🇷
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-lg transition-all ${lang === 'en' ? 'bg-[#0B1E3F] text-white shadow-sm' : 'text-slate-600 hover:text-black'}`}
            >
              English 🇬🇧
            </button>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1E3F] border-2 border-[#C99A3E] flex items-center justify-center font-black text-[#C99A3E] text-2xl shadow-lg mx-auto mb-3">
            ST
          </div>
          <h2 className="text-xl font-black text-[#0B1E3F] leading-tight">
            {getTranslation(lang, 'brandTitle')}
          </h2>
          <p className="text-xs font-bold text-[#A87C25] mt-1">
            {getTranslation(lang, 'brandSub')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5B6B74] mb-1">
              {getTranslation(lang, 'loginUserLabel')}
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={getTranslation(lang, 'loginUserPlaceholder')}
              required
              className="w-full p-3 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6B74] mb-1">
              {getTranslation(lang, 'loginPassLabel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 pe-11 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#5B6B74] hover:text-[#0B1E3F] p-1 cursor-pointer"
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C99A3E] to-[#A87C25] hover:from-[#A87C25] hover:to-[#845E13] text-[#0B1E3F] font-black text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{getTranslation(lang, 'loginBtn')}</span>
          </button>
        </form>

        {/* Credentials hint */}
        <div className="mt-6 pt-4 border-t border-[#DFD5BE]/60 text-center text-xs text-[#5B6B74]">
          <p className="font-semibold">{getTranslation(lang, 'loginHint')}</p>
        </div>
      </div>
    </div>
  );
};
