import React from 'react';
import { Client, Invoice, Language, TabType, User, VisaApplication } from '../types';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { 
  FileText, 
  Globe, 
  Coins, 
  Users, 
  PlusCircle, 
  Download, 
  Upload, 
  ArrowRight,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface DashboardViewProps {
  lang: Language;
  currentUser: User | null;
  invoices: Invoice[];
  visas: VisaApplication[];
  clients: Client[];
  nextInvoiceSeq: number;
  onNavigate: (tab: TabType) => void;
  onViewInvoice: (invoiceId: string) => void;
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  currentUser,
  invoices,
  visas,
  clients,
  nextInvoiceSeq,
  onNavigate,
  onViewInvoice,
  onExportBackup,
  onImportBackup
}) => {
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="bg-[#FFFDF8] border border-rose-200 rounded-2xl p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#0B1E3F]">
          {getTranslation(lang, 'accessDeniedTitle')}
        </h2>
        <p className="text-sm font-medium text-[#5B6B74]">
          {getTranslation(lang, 'accessDeniedMsg')}
        </p>
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandFcfa || 0), 0);
  const activeVisasCount = visas.filter(v => v.status === 'processing' || v.status === 'review' || v.status === 'ready').length;
  const recentInvoices = [...invoices].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const recentVisas = [...visas].sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0)).slice(0, 5);

  const getVisaStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-sky-100 text-sky-800 border border-sky-300 text-xs px-2.5 py-1 rounded-full font-bold">{getTranslation(lang, 'appStatusNew')}</span>;
      case 'review':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">{getTranslation(lang, 'appStatusReview')}</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs px-2.5 py-1 rounded-full font-bold">{getTranslation(lang, 'appStatusProcessing')}</span>;
      case 'ready':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-2.5 py-1 rounded-full font-bold">{getTranslation(lang, 'appStatusReady')}</span>;
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">{getTranslation(lang, 'appStatusApproved')}</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs px-2.5 py-1 rounded-full font-bold">{getTranslation(lang, 'appStatusRejected')}</span>;
      case 'completed':
        return <span className="bg-teal-100 text-teal-800 border border-teal-300 text-xs px-2.5 py-1 rounded-full font-black">{getTranslation(lang, 'appStatusCompleted')}</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoices */}
        <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[#C99A3E] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#5B6B74] uppercase tracking-wider">
                {getTranslation(lang, 'statInvoices')}
              </p>
              <h3 className="text-3xl font-black text-[#0B1E3F] mt-1">
                {invoices.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#C99A3E] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C99A3E] to-transparent" />
        </div>

        {/* Visa Requests */}
        <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[#C99A3E] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#5B6B74] uppercase tracking-wider">
                {getTranslation(lang, 'statVisas')}
              </p>
              <h3 className="text-3xl font-black text-[#0B1E3F] mt-1">
                {visas.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-transparent" />
        </div>

        {/* Stat 3: Total Revenue FCFA (Admin only) or Active Visas in Progress (Staff) */}
        {isAdmin ? (
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[#C99A3E] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#5B6B74] uppercase tracking-wider">
                  {getTranslation(lang, 'statRevenue')}
                </p>
                <h3 className="text-2xl font-black text-[#0B1E3F] mt-1 mono">
                  {formatCurrency(totalRevenue)} <span className="text-xs font-bold text-[#C99A3E]">FCFA</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
          </div>
        ) : (
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[#C99A3E] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#5B6B74] uppercase tracking-wider">
                  {getTranslation(lang, 'statStaffActiveVisas')}
                </p>
                <h3 className="text-3xl font-black text-[#0B1E3F] mt-1">
                  {activeVisasCount}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-transparent" />
          </div>
        )}

        {/* Next Invoice # */}
        <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[#C99A3E] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#5B6B74] uppercase tracking-wider">
                {getTranslation(lang, 'statNextInv')}
              </p>
              <h3 className="text-2xl font-black text-[#0B1E3F] mt-1 mono">
                INV-{String(nextInvoiceSeq).padStart(4, '0')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-transparent" />
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-4 md:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0B1E3F] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C99A3E]" />
          {getTranslation(lang, 'quickActionsTitle')}
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Admin Employees & Password Management Button - STRICTLY ADMIN ONLY */}
          {isAdmin && (
            <button
              id="quick-action-employees"
              onClick={() => onNavigate('employees')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1E3F] text-[#C99A3E] hover:text-white font-bold text-sm hover:bg-[#061022] transition-all shadow-sm cursor-pointer border border-[#C99A3E]/40"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{getTranslation(lang, 'tabEmployees')}</span>
            </button>
          )}

          <button
            id="quick-action-new-visa"
            onClick={() => onNavigate('visas')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C99A3E] text-[#0B1E3F] font-bold text-sm hover:bg-[#A87C25] hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{getTranslation(lang, 'quickVisas')}</span>
          </button>

          <button
            id="quick-action-new-invoice"
            onClick={() => onNavigate('invoice')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1E3F] text-white font-bold text-sm hover:bg-[#061022] transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{getTranslation(lang, 'quickInvoice')}</span>
          </button>

          <button
            id="quick-action-clients"
            onClick={() => onNavigate('clients')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DFD5BE] text-[#0B1E3F] font-bold text-sm hover:border-[#C99A3E] transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>{getTranslation(lang, 'quickClients')}</span>
          </button>

          <button
            id="quick-action-prices"
            onClick={() => onNavigate('prices')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DFD5BE] text-[#0B1E3F] font-bold text-sm hover:border-[#C99A3E] transition-all cursor-pointer"
          >
            <Tag className="w-4 h-4" />
            <span>{getTranslation(lang, 'tabPrices')}</span>
          </button>

          {/* Backup Export/Import - STRICTLY ADMIN ONLY */}
          {isAdmin && (
            <>
              <button
                id="quick-action-export"
                onClick={onExportBackup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DFD5BE] text-[#5B6B74] hover:text-[#0B1E3F] font-bold text-sm hover:border-[#C99A3E] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{getTranslation(lang, 'quickExport')}</span>
              </button>

              <label
                id="quick-action-import-label"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DFD5BE] text-[#5B6B74] hover:text-[#0B1E3F] font-bold text-sm hover:border-[#C99A3E] transition-all cursor-pointer m-0"
              >
                <Upload className="w-4 h-4" />
                <span>{getTranslation(lang, 'quickImport')}</span>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={onImportBackup} 
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Grid of Two Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Visas Applications */}
        <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFD5BE] mb-4">
            <h3 className="font-extrabold text-[#0B1E3F] text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C99A3E]" />
              <span>{getTranslation(lang, 'recentVisasTitle')}</span>
            </h3>
            <button
              onClick={() => onNavigate('visas')}
              className="text-xs font-bold text-[#C99A3E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{getTranslation(lang, 'viewAllBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentVisas.length === 0 ? (
            <div className="text-center py-10 text-[#5B6B74] text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>{getTranslation(lang, 'emptyRecentVisas')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DFD5BE] text-[11px] font-extrabold uppercase text-[#5B6B74]">
                    <th className="pb-2 text-start">{getTranslation(lang, 'thAppId')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thPassenger')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thCountryType')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thStatus')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5BE]/60">
                  {recentVisas.map(visa => (
                    <tr key={visa.id} className="hover:bg-[#C99A3E]/5 transition-colors">
                      <td className="py-3 font-bold text-[#0B1E3F] mono">{visa.id}</td>
                      <td className="py-3 font-medium text-[#22303A]">{visa.clientName}</td>
                      <td className="py-3 text-xs text-[#5B6B74]">{visa.country} ({visa.type})</td>
                      <td className="py-3">{getVisaStatusBadge(visa.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFD5BE] mb-4">
            <h3 className="font-extrabold text-[#0B1E3F] text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0B1E3F]" />
              <span>{getTranslation(lang, 'recentInvoicesTitle')}</span>
            </h3>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-xs font-bold text-[#0B1E3F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{getTranslation(lang, 'viewAllBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentInvoices.length === 0 ? (
            <div className="text-center py-10 text-[#5B6B74] text-sm">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>{getTranslation(lang, 'emptyRecentInvoices')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DFD5BE] text-[11px] font-extrabold uppercase text-[#5B6B74]">
                    <th className="pb-2 text-start">{getTranslation(lang, 'thNumber')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thClient')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thDate')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thTotalFcfa')}</th>
                    <th className="pb-2 text-end"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5BE]/60">
                  {recentInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-[#C99A3E]/5 transition-colors">
                      <td className="py-3 font-bold text-[#0B1E3F] mono">{inv.number}</td>
                      <td className="py-3 font-semibold text-[#22303A]">{inv.clientName}</td>
                      <td className="py-3 text-xs text-[#5B6B74]">{inv.date}</td>
                      <td className="py-3 font-bold text-[#0B1E3F] mono">{formatCurrency(inv.grandFcfa)}</td>
                      <td className="py-3 text-end">
                        <button
                          onClick={() => onViewInvoice(inv.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#0B1E3F]/10 hover:bg-[#0B1E3F] text-[#0B1E3F] hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{getTranslation(lang, 'viewBtn')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
