import React, { useState } from 'react';
import { Language, TabType, User } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Users, 
  Tag, 
  BarChart3, 
  ShieldCheck, 
  LogOut,
  Globe,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User | null;
  onLogout: () => void;
  onChangeOwnPassword?: (newPassword: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  onChangeOwnPassword
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [showPwdModal, setShowPwdModal] = useState<boolean>(false);
  const [currentPwd, setCurrentPwd] = useState<string>('');
  const [newPwd, setNewPwd] = useState<string>('');
  const [confirmPwd, setConfirmPwd] = useState<string>('');
  const [showPwdText, setShowPwdText] = useState<boolean>(false);
  const [pwdError, setPwdError] = useState<string>('');
  const [pwdSuccess, setPwdSuccess] = useState<boolean>(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess(false);

    if (!currentUser) return;

    if (currentPwd !== currentUser.password) {
      setPwdError(getTranslation(lang, 'currentPasswordIncorrect'));
      return;
    }

    if (!newPwd || newPwd.trim().length < 3) {
      setPwdError(lang === 'ar' ? 'كلمة المرور يجب أن لا تقل عن 3 أحرف أو أرقام' : 'Le mot de passe doit comporter au moins 3 caractères');
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdError(getTranslation(lang, 'passwordsDoNotMatch'));
      return;
    }

    if (onChangeOwnPassword) {
      onChangeOwnPassword(newPwd.trim());
      setPwdSuccess(true);
      setTimeout(() => {
        setPwdSuccess(false);
        setShowPwdModal(false);
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      }, 1500);
    }
  };

  const navTabs: { id: TabType; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: getTranslation(lang, 'tabDashboard'), icon: <LayoutDashboard className="w-4 h-4" />, adminOnly: true },
    { id: 'invoice', label: getTranslation(lang, 'tabInvoice'), icon: <FileText className="w-4 h-4" /> },
    { id: 'invoices', label: getTranslation(lang, 'tabInvoices'), icon: <Receipt className="w-4 h-4" /> },
    { id: 'clients', label: getTranslation(lang, 'tabClients'), icon: <Users className="w-4 h-4" /> },
    { id: 'prices', label: getTranslation(lang, 'tabPrices'), icon: <Tag className="w-4 h-4" /> },
    { id: 'reports', label: getTranslation(lang, 'tabReports'), icon: <BarChart3 className="w-4 h-4" />, adminOnly: true },
    { id: 'employees', label: getTranslation(lang, 'tabEmployees'), icon: <ShieldCheck className="w-4 h-4" />, adminOnly: true },
    { id: 'visas', label: getTranslation(lang, 'tabVisas'), icon: <Globe className="w-4 h-4" /> }
  ];

  const visibleTabs = navTabs.filter(tab => {
    if (tab.adminOnly && !isAdmin) return false;
    if (!isAdmin && currentUser?.permissions && !currentUser.permissions.includes(tab.id)) {
      return false;
    }
    return true;
  });

  return (
    <header className="bg-gradient-to-r from-[#0B1E3F] via-[#0D244D] to-[#061022] text-[#F6F1E6] pt-5 px-4 md:px-8 border-b-2 border-[#C99A3E]/30 shadow-xl relative no-print">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-white/10">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#C99A3E] via-[#A87C25] to-[#7B5B1B] p-0.5 shadow-lg shadow-[#C99A3E]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center overflow-hidden border border-[#C99A3E]/40">
                <span className="font-black text-[#C99A3E] text-lg tracking-wider">ST</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0B1E3F]" title="Online" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#C99A3E] tracking-tight flex items-center gap-2">
              <span>{getTranslation(lang, 'brandTitle')}</span>
            </h1>
            <p className="text-xs md:text-sm text-[#C9D2D6] font-medium tracking-wide">
              {getTranslation(lang, 'brandSub')}
            </p>
          </div>
        </div>

        {/* Right Actions: Languages & User Profile */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Switcher */}
          <div className="flex bg-white/10 p-1 rounded-xl border border-white/15 backdrop-blur-sm">
            <button
              id="lang-btn-ar"
              onClick={() => onLanguageChange('ar')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                lang === 'ar'
                  ? 'bg-[#C99A3E] text-[#0B1E3F] shadow-md shadow-[#C99A3E]/30 scale-[1.02]'
                  : 'text-[#C9D2D6] hover:text-white hover:bg-white/5'
              }`}
            >
              العربية 🇸🇦
            </button>
            <button
              id="lang-btn-fr"
              onClick={() => onLanguageChange('fr')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                lang === 'fr'
                  ? 'bg-[#C99A3E] text-[#0B1E3F] shadow-md shadow-[#C99A3E]/30 scale-[1.02]'
                  : 'text-[#C9D2D6] hover:text-white hover:bg-white/5'
              }`}
            >
              Français 🇫🇷
            </button>
            <button
              id="lang-btn-en"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                lang === 'en'
                  ? 'bg-[#C99A3E] text-[#0B1E3F] shadow-md shadow-[#C99A3E]/30 scale-[1.02]'
                  : 'text-[#C9D2D6] hover:text-white hover:bg-white/5'
              }`}
            >
              English 🇬🇧
            </button>
          </div>

          {/* User Badge */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C99A3E] animate-pulse" />
              <span className="text-white font-bold">{currentUser.name}</span>
              <span className="bg-[#C99A3E] text-[#0B1E3F] text-[10px] font-black px-2 py-0.5 rounded-full">
                {currentUser.role === 'admin' ? getTranslation(lang, 'roleAdmin') : getTranslation(lang, 'roleStaff')}
              </span>
            </div>
          )}

          {/* Change Own Password Button */}
          {currentUser && (
            <button
              id="top-nav-change-pwd-btn"
              onClick={() => {
                setShowPwdModal(true);
                setPwdError('');
                setPwdSuccess(false);
                setCurrentPwd('');
                setNewPwd('');
                setConfirmPwd('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold bg-white/10 hover:bg-white/20 text-[#DFD5BE] hover:text-white border border-white/15 transition-all cursor-pointer shadow-sm"
              title={getTranslation(lang, 'changePasswordModalTitle')}
            >
              <Key className="w-3.5 h-3.5 text-[#C99A3E]" />
              <span className="hidden lg:inline">{getTranslation(lang, 'changePasswordModalTitle')}</span>
            </button>
          )}

          {/* Quick Admin Employee Button */}
          {isAdmin && (
            <button
              id="top-nav-employees-btn"
              onClick={() => onTabChange('employees')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                activeTab === 'employees'
                  ? 'bg-white text-[#0B1E3F] ring-2 ring-[#C99A3E]'
                  : 'bg-[#C99A3E] text-[#0B1E3F] hover:bg-[#A87C25] hover:text-white'
              }`}
              title={getTranslation(lang, 'tabEmployees')}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{getTranslation(lang, 'tabEmployees')}</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            id="nav-logout-btn"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold text-red-300 hover:text-white bg-red-500/15 hover:bg-red-600 border border-red-500/30 transition-all cursor-pointer"
            title={getTranslation(lang, 'logoutBtn')}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation(lang, 'logoutBtn')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 mt-3 min-w-max">
          {visibleTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-bold text-sm transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#F6F1E6] text-[#0B1E3F] border-[#C99A3E] shadow-sm'
                    : 'text-[#C9D2D6] hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Change Own Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#22303A]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFD5BE] mb-4">
              <h3 className="font-black text-[#0B1E3F] text-base flex items-center gap-2">
                <Key className="w-5 h-5 text-[#C99A3E]" />
                <span>{getTranslation(lang, 'changePasswordModalTitle')}</span>
              </h3>
              <button
                onClick={() => setShowPwdModal(false)}
                className="p-1 rounded-lg text-[#5B6B74] hover:text-black hover:bg-[#FAF6EE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-bold text-sm">{getTranslation(lang, 'passwordUpdatedSuccess')}</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {pwdError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{pwdError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'currentPasswordLabel')}
                  </label>
                  <input
                    type={showPwdText ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={e => setCurrentPwd(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'newPasswordLabel')}
                  </label>
                  <input
                    type={showPwdText ? 'text' : 'password'}
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'confirmPasswordLabel')}
                  </label>
                  <input
                    type={showPwdText ? 'text' : 'password'}
                    value={confirmPwd}
                    onChange={e => setConfirmPwd(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPwdText(!showPwdText)}
                    className="text-xs text-[#5B6B74] hover:text-[#0B1E3F] flex items-center gap-1 font-semibold"
                  >
                    {showPwdText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPwdText ? (lang === 'ar' ? 'إخفاء الرموز' : 'Masquer') : (lang === 'ar' ? 'إظهار الرموز' : 'Afficher')}</span>
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#DFD5BE]">
                  <button
                    type="button"
                    onClick={() => setShowPwdModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] font-bold text-xs hover:bg-[#FAF6EE]"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0B1E3F] text-[#C99A3E] hover:text-white font-extrabold text-xs shadow-sm hover:bg-[#061022]"
                  >
                    {lang === 'ar' ? 'حفظ كلمة المرور' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
