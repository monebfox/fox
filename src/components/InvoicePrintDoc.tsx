import React from 'react';
import { Client, Invoice, Language } from '../types';
import { AGENCY_CONFIG } from '../data/initialData';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { Printer, ArrowLeft, ArrowRight, Shield, CheckCircle, MapPin, Phone, Mail, Building } from 'lucide-react';

interface InvoicePrintDocProps {
  lang: Language;
  invoice: Invoice | null;
  client: Client | null;
  onBack: () => void;
  onToggleDocLang?: (lang: Language) => void;
}

export const InvoicePrintDoc: React.FC<InvoicePrintDocProps> = ({
  lang,
  invoice,
  client,
  onBack,
  onToggleDocLang
}) => {
  if (!invoice) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#DFD5BE] p-8">
        <p className="text-gray-500 font-bold">لم يتم العثور على الفاتورة</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#0B1E3F] text-white rounded-xl text-sm font-bold"
        >
          {getTranslation(lang, 'backBtn')}
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF8] border border-[#DFD5BE] p-4 rounded-2xl shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DFD5BE] hover:border-[#0B1E3F] text-[#0B1E3F] font-bold text-xs transition-all cursor-pointer shadow-sm"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{getTranslation(lang, 'backBtn')}</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleDocLang && (
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => onToggleDocLang('ar')}
                className={`px-2.5 py-1 rounded-lg ${lang === 'ar' ? 'bg-[#0B1E3F] text-white' : 'text-slate-600'}`}
              >
                عربي
              </button>
              <button
                onClick={() => onToggleDocLang('fr')}
                className={`px-2.5 py-1 rounded-lg ${lang === 'fr' ? 'bg-[#0B1E3F] text-white' : 'text-slate-600'}`}
              >
                Français
              </button>
              <button
                onClick={() => onToggleDocLang('en')}
                className={`px-2.5 py-1 rounded-lg ${lang === 'en' ? 'bg-[#0B1E3F] text-white' : 'text-slate-600'}`}
              >
                English
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C99A3E] hover:bg-[#A87C25] text-[#0B1E3F] hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{getTranslation(lang, 'printActionBtn')}</span>
          </button>
        </div>
      </div>

      {/* Official A4 Document Paper */}
      <div className="flex justify-center pb-12">
        <div className="invoice-sheet w-full max-w-[840px] bg-white border border-[#DFD5BE] rounded-2xl shadow-xl p-8 sm:p-12 text-[#22303A] relative overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-[#0B1E3F]">
            
            {/* Agency Brand & Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#0B1E3F] border-2 border-[#C99A3E] flex items-center justify-center font-black text-[#C99A3E] text-xl shadow-md">
                  ST
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0B1E3F] leading-tight">
                    {AGENCY_CONFIG.nameAr}
                  </h2>
                  <p className="text-xs font-bold text-[#C99A3E] tracking-wide">
                    {AGENCY_CONFIG.nameFr}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-[#5B6B74] space-y-1 font-medium pt-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C99A3E]" />
                  <span>{AGENCY_CONFIG.addr1Ar} / {AGENCY_CONFIG.addr1Fr}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#C99A3E]" />
                  <span>{AGENCY_CONFIG.addr2Ar} / {AGENCY_CONFIG.addr2Fr}</span>
                </p>
                <p className="flex items-center gap-1.5 mono">
                  <Phone className="w-3.5 h-3.5 text-[#C99A3E]" />
                  <span>{AGENCY_CONFIG.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C99A3E]" />
                  <span>{AGENCY_CONFIG.email}</span>
                </p>
              </div>
            </div>

            {/* Invoice Meta Box */}
            <div className="w-full sm:w-auto text-start sm:text-end bg-[#FAF6EE] border-2 border-[#C99A3E] rounded-xl p-4 shadow-sm min-w-[220px]">
              <div className="text-xs font-black text-[#A87C25] uppercase tracking-wider">
                {getTranslation(lang, 'docTitle')}
              </div>
              <div className="text-xl font-black text-[#0B1E3F] mono mt-1">
                {invoice.number}
              </div>
              <div className="text-xs text-[#5B6B74] mt-1 font-semibold">
                {getTranslation(lang, 'thDate')}: <span className="mono text-[#0B1E3F] font-bold">{invoice.date}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#DFD5BE]/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>سند رسمي معتمد</span>
                </span>
              </div>
            </div>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 bg-[#FAF6EE]/80 border border-[#DFD5BE] rounded-xl p-4">
            <div>
              <span className="text-[11px] font-bold text-[#5B6B74] block">
                {getTranslation(lang, 'clientNameLabel')}
              </span>
              <span className="text-xs font-extrabold text-[#0B1E3F] mt-0.5 block">
                {invoice.clientName}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5B6B74] block">
                {getTranslation(lang, 'clientPhoneLabel')}
              </span>
              <span className="text-xs font-bold text-[#22303A] mono mt-0.5 block">
                {client?.phone || '—'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5B6B74] block">
                {getTranslation(lang, 'clientNatLabel')}
              </span>
              <span className="text-xs font-bold text-[#22303A] mt-0.5 block">
                {client?.nat || 'تشادي'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5B6B74] block">
                {getTranslation(lang, 'clientPassportLabel')}
              </span>
              <span className="text-xs font-bold text-[#22303A] mono mt-0.5 block">
                {client?.passport || '—'}
              </span>
            </div>
          </div>

          {/* Invoiced Items Table */}
          <div className="border border-[#DFD5BE] rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0B1E3F] text-white">
                  <th className="py-2.5 px-3 text-start w-10">#</th>
                  <th className="py-2.5 px-3 text-start">{getTranslation(lang, 'colService')}</th>
                  <th className="py-2.5 px-3 text-center w-16">{getTranslation(lang, 'colQty')}</th>
                  <th className="py-2.5 px-3 text-end w-32">{getTranslation(lang, 'colPrice')}</th>
                  <th className="py-2.5 px-3 text-end w-32">{getTranslation(lang, 'colTotal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5BE]/60">
                {invoice.items.map((it, idx) => {
                  const labelStr = typeof it.label === 'string' ? it.label : (it.label[lang] || it.label.ar);
                  return (
                    <tr key={it.id || idx} className={idx % 2 === 1 ? 'bg-[#FAF6EE]/40' : 'bg-white'}>
                      <td className="py-3 px-3 mono text-[#5B6B74] font-bold">{idx + 1}</td>
                      <td className="py-3 px-3 font-extrabold text-[#0B1E3F]">{labelStr}</td>
                      <td className="py-3 px-3 text-center mono font-bold">{it.qty}</td>
                      <td className="py-3 px-3 text-end mono">{formatCurrency(it.fcfa)}</td>
                      <td className="py-3 px-3 text-end mono font-extrabold text-[#0B1E3F]">
                        {formatCurrency(it.fcfa * it.qty)} FCFA
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            {/* Notes & Terms Box */}
            <div className="flex-1 bg-[#FAF6EE] border border-dashed border-[#DFD5BE] rounded-xl p-4 text-[11px] text-[#5B6B74] space-y-1 leading-relaxed">
              <strong className="text-[#0B1E3F] block text-xs">
                {getTranslation(lang, 'docTermsTitle')}
              </strong>
              <p>{getTranslation(lang, 'docTermsText')}</p>
            </div>

            {/* Right Totals Box */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#DFD5BE]">
                <span className="text-[#5B6B74] font-bold">{getTranslation(lang, 'subtotalFcfa')}</span>
                <span className="mono font-bold text-[#0B1E3F]">{formatCurrency(invoice.subFcfa)} FCFA</span>
              </div>

              {invoice.discFcfa > 0 && (
                <div className="flex justify-between py-1 border-b border-[#DFD5BE] text-rose-600 font-bold">
                  <span>{getTranslation(lang, 'discountFcfa')}</span>
                  <span className="mono">-{formatCurrency(invoice.discFcfa)} FCFA</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t-2 border-[#0B1E3F] text-sm font-black text-[#0B1E3F]">
                <span>{getTranslation(lang, 'grandTotalFcfa')}</span>
                <span className="mono text-base text-[#A87C25] font-black">
                  {formatCurrency(invoice.grandFcfa)} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Official Signatures & Stamp Footer */}
          <div className="flex justify-between items-end pt-14 mt-10 border-t border-dashed border-[#DFD5BE] text-center text-xs text-[#5B6B74]">
            <div className="w-44 space-y-12">
              <div className="font-bold text-[#0B1E3F]">{getTranslation(lang, 'docClientSign')}</div>
              <div className="border-b-2 border-slate-400 w-full" />
            </div>

            <div className="w-44 space-y-12">
              <div className="font-bold text-[#0B1E3F]">{getTranslation(lang, 'docAgencyStamp')}</div>
              <div className="border-b-2 border-slate-400 w-full" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
