import React, { useState, useMemo } from 'react';
import { Invoice, Language, User } from '../types';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { BarChart3, Calendar, Coins, Percent, FileText, Eye, AlertTriangle } from 'lucide-react';

interface ReportsViewProps {
  lang: Language;
  currentUser?: User | null;
  invoices: Invoice[];
  onViewInvoice: (id: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  lang,
  currentUser,
  invoices,
  onViewInvoice
}) => {
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="bg-[#FFFDF8] border border-rose-200 rounded-2xl p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
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
  // Helper to extract YYYY-MM
  const getInvoiceMonthKey = (inv: Invoice): string => {
    if (inv.createdAt) {
      const d = new Date(inv.createdAt);
      if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
    }
    const match = String(inv.date || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) return `${match[3]}-${match[2]}`;
    return '';
  };

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    const now = new Date();
    set.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    invoices.forEach(i => {
      const k = getInvoiceMonthKey(i);
      if (k) set.add(k);
    });
    return Array.from(set).sort().reverse();
  }, [invoices]);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => availableMonths[0] || '');

  const filteredInvoices = invoices.filter(i => getInvoiceMonthKey(i) === selectedMonth);

  const totalRevenue = filteredInvoices.reduce((sum, i) => sum + (i.grandFcfa || 0), 0);
  const totalDiscounts = filteredInvoices.reduce((sum, i) => sum + (i.discFcfa || 0), 0);
  const avgInvoice = filteredInvoices.length > 0 ? Math.round(totalRevenue / filteredInvoices.length) : 0;

  const formatMonthLabel = (key: string) => {
    if (!key) return '';
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const locale = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#DFD5BE]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0B1E3F]">
                {getTranslation(lang, 'reportsTitle')}
              </h2>
              <p className="text-xs text-[#5B6B74]">
                المؤشرات المالية والحسابية الشهرية لوكالة سيرتر
              </p>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C99A3E]" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-xs font-bold text-[#0B1E3F] outline-none focus:border-[#C99A3E] shadow-sm min-w-[200px]"
            >
              {availableMonths.map(mKey => (
                <option key={mKey} value={mKey}>
                  {formatMonthLabel(mKey)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#DFD5BE] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6B74]">{getTranslation(lang, 'reportInvoiceCount')}</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-[#0B1E3F] mt-2 mono">{filteredInvoices.length}</div>
          </div>

          <div className="bg-white border border-[#DFD5BE] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6B74]">{getTranslation(lang, 'reportRevenue')}</span>
              <Coins className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black text-emerald-700 mt-2 mono">
              {formatCurrency(totalRevenue)} <span className="text-xs">FCFA</span>
            </div>
          </div>

          <div className="bg-white border border-[#DFD5BE] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6B74]">{getTranslation(lang, 'reportDiscount')}</span>
              <Percent className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-black text-rose-600 mt-2 mono">
              {formatCurrency(totalDiscounts)} <span className="text-xs">FCFA</span>
            </div>
          </div>

          <div className="bg-white border border-[#DFD5BE] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6B74]">{getTranslation(lang, 'reportAverage')}</span>
              <BarChart3 className="w-4 h-4 text-[#C99A3E]" />
            </div>
            <div className="text-xl font-black text-[#0B1E3F] mt-2 mono">
              {formatCurrency(avgInvoice)} <span className="text-xs">FCFA</span>
            </div>
          </div>
        </div>

        {/* Invoices of Month Table */}
        <div>
          <h3 className="text-xs font-extrabold text-[#0B1E3F] uppercase tracking-wider mb-3">
            فواتير شهر {formatMonthLabel(selectedMonth)}
          </h3>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10 text-[#5B6B74] text-xs">
              {getTranslation(lang, 'noInvoicesThisMonth')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#DFD5BE] text-[11px] font-extrabold text-[#5B6B74]">
                    <th className="pb-2 text-start">{getTranslation(lang, 'thNumber')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thClient')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thDate')}</th>
                    <th className="pb-2 text-start">{getTranslation(lang, 'thTotalFcfa')}</th>
                    <th className="pb-2 text-end">{getTranslation(lang, 'thActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5BE]/60">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-[#C99A3E]/5">
                      <td className="py-2.5 font-bold text-[#0B1E3F] mono">{inv.number}</td>
                      <td className="py-2.5 font-semibold text-[#22303A]">{inv.clientName}</td>
                      <td className="py-2.5 text-[#5B6B74]">{inv.date}</td>
                      <td className="py-2.5 font-bold text-[#0B1E3F] mono">{formatCurrency(inv.grandFcfa)} FCFA</td>
                      <td className="py-2.5 text-end">
                        <button
                          onClick={() => onViewInvoice(inv.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#0B1E3F] hover:bg-[#0B1E3F] hover:text-white rounded-lg transition-all"
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
