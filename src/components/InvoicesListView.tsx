import React, { useState } from 'react';
import { Invoice, Language, User } from '../types';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { Search, FileText, Eye, Trash2, Printer, AlertTriangle } from 'lucide-react';

interface InvoicesListViewProps {
  lang: Language;
  currentUser?: User | null;
  invoices: Invoice[];
  onViewInvoice: (id: string) => void;
  onDeleteInvoice: (id: string) => void;
}

export const InvoicesListView: React.FC<InvoicesListViewProps> = ({
  lang,
  currentUser,
  invoices,
  onViewInvoice,
  onDeleteInvoice
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [search, setSearch] = useState<string>('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredInvoices = invoices
    .filter(inv => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        inv.number.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.date.includes(q)
      );
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleDeleteConfirm = () => {
    if (pendingDeleteId) {
      onDeleteInvoice(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DFD5BE]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0B1E3F]/10 text-[#0B1E3F] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0B1E3F]">
                {getTranslation(lang, 'tabInvoices')}
              </h2>
              <p className="text-xs text-[#5B6B74]">
                {filteredInvoices.length} {getTranslation(lang, 'thNumber')}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#5B6B74] absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث برقم الفاتورة أو اسم العميل..."
              className="w-full ps-9 pe-4 py-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
            />
          </div>
        </div>

        {/* Table */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 text-[#5B6B74]">
            <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-sm">{getTranslation(lang, 'emptyRecentInvoices')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#DFD5BE] text-[11px] font-extrabold uppercase text-[#5B6B74]">
                  <th className="pb-3 text-start">{getTranslation(lang, 'thNumber')}</th>
                  <th className="pb-3 text-start">{getTranslation(lang, 'thClient')}</th>
                  <th className="pb-3 text-start">{getTranslation(lang, 'thDate')}</th>
                  <th className="pb-3 text-start">{getTranslation(lang, 'thTotalFcfa')}</th>
                  <th className="pb-3 text-end">{getTranslation(lang, 'thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5BE]/60">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#C99A3E]/5 transition-colors">
                    <td className="py-3.5 font-bold text-[#0B1E3F] mono">{inv.number}</td>
                    <td className="py-3.5 font-bold text-[#22303A]">{inv.clientName}</td>
                    <td className="py-3.5 text-xs text-[#5B6B74]">{inv.date}</td>
                    <td className="py-3.5 font-bold text-[#0B1E3F] mono">
                      {formatCurrency(inv.grandFcfa)} <span className="text-xs text-[#5B6B74]">FCFA</span>
                    </td>
                    <td className="py-3.5 text-end">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onViewInvoice(inv.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1E3F] text-white hover:bg-[#061022] text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C99A3E]" />
                          <span>{getTranslation(lang, 'viewBtn')}</span>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setPendingDeleteId(inv.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all cursor-pointer"
                            title={getTranslation(lang, 'deleteBtn')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#0B1E3F] mb-1">
              {getTranslation(lang, 'confirmDeleteTitle')}
            </h3>
            <p className="text-xs text-[#5B6B74] mb-5">
              {getTranslation(lang, 'confirmDeleteInvoiceMsg')}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                {getTranslation(lang, 'cancelBtn')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                {getTranslation(lang, 'deleteBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
