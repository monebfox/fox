import React, { useState } from 'react';
import { Client, Language, User, VisaAppStatus, VisaApplication, VisaCatalogItem, VisaStatus } from '../types';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { 
  Globe, 
  Search, 
  Plus, 
  Send, 
  Receipt, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  MessageCircle,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface VisasViewProps {
  lang: Language;
  currentUser: User | null;
  visaCatalog: VisaCatalogItem[];
  visaApplications: VisaApplication[];
  clients: Client[];
  onSaveCatalogItem: (item: VisaCatalogItem) => void;
  onDeleteCatalogItem: (id: string) => void;
  onSubmitApplication: (app: VisaApplication) => void;
  onUpdateAppStatus: (id: string, status: VisaAppStatus, notes: string) => void;
  onDeleteApplication: (id: string) => void;
  onConvertToInvoice: (app: VisaApplication) => void;
}

export const VisasView: React.FC<VisasViewProps> = ({
  lang,
  currentUser,
  visaCatalog,
  visaApplications,
  clients,
  onSaveCatalogItem,
  onDeleteCatalogItem,
  onSubmitApplication,
  onUpdateAppStatus,
  onDeleteApplication,
  onConvertToInvoice
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'applications'>('catalog');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState<VisaCatalogItem | null>(null);

  const [showNewAppModal, setShowNewAppModal] = useState<boolean>(false);
  const [preselectedVisaId, setPreselectedVisaId] = useState<string>('');

  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [selectedAppForStatus, setSelectedAppForStatus] = useState<VisaApplication | null>(null);
  const [newStatus, setNewStatus] = useState<VisaAppStatus>('processing');
  const [statusNotes, setStatusNotes] = useState<string>('');

  // Delete Confirmation modals
  const [catalogItemToDelete, setCatalogItemToDelete] = useState<VisaCatalogItem | null>(null);
  const [appToDelete, setAppToDelete] = useState<VisaApplication | null>(null);

  // Extract unique countries for catalog filters
  const uniqueCountries = ['all', ...Array.from(new Set(visaCatalog.map(v => v.country[lang] || v.country.ar)))];

  const filteredCatalog = visaCatalog.filter(v => {
    const countryName = v.country[lang] || v.country.ar;
    const matchesCountry = selectedCountryFilter === 'all' || countryName === selectedCountryFilter;
    const matchesSearch = !searchQuery || 
      countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.type[lang] || v.type.ar).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const filteredApps = visaApplications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return app.id.toLowerCase().includes(q) ||
      app.clientName.toLowerCase().includes(q) ||
      app.passport.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);
  });

  const getStatusBadge = (status: VisaStatus) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">🟢 {getTranslation(lang, 'statusAvailable')}</span>;
      case 'soon':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">🟡 {getTranslation(lang, 'statusSoon')}</span>;
      case 'unavailable':
        return <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 text-xs px-2.5 py-1 rounded-full font-bold">🔴 {getTranslation(lang, 'statusUnavailable')}</span>;
      case 'paused':
        return <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 border border-slate-300 text-xs px-2.5 py-1 rounded-full font-bold">⚫ {getTranslation(lang, 'statusPaused')}</span>;
    }
  };

  const getPipelineBadge = (status: VisaAppStatus) => {
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
    }
  };

  const handleOpenNewApp = (visaId?: string) => {
    setPreselectedVisaId(visaId || (visaCatalog[0]?.id || ''));
    setShowNewAppModal(true);
  };

  const handleOpenStatusModal = (app: VisaApplication) => {
    setSelectedAppForStatus(app);
    setNewStatus(app.status);
    setStatusNotes(app.notes || '');
    setShowStatusModal(true);
  };

  const handleSaveStatus = () => {
    if (selectedAppForStatus) {
      onUpdateAppStatus(selectedAppForStatus.id, newStatus, statusNotes);
      setShowStatusModal(false);
      setSelectedAppForStatus(null);
    }
  };

  const sendWhatsAppUpdate = (app: VisaApplication) => {
    const cleanPhone = (app.phone || '').replace(/\D/g, '');
    const statusText = getTranslation(lang, 
      app.status === 'approved' ? 'appStatusApproved' :
      app.status === 'ready' ? 'appStatusReady' :
      app.status === 'processing' ? 'appStatusProcessing' :
      app.status === 'review' ? 'appStatusReview' :
      app.status === 'rejected' ? 'appStatusRejected' :
      app.status === 'completed' ? 'appStatusCompleted' : 'appStatusNew'
    );

    let message = '';
    if (lang === 'fr') {
      message = `Bonjour ${app.clientName} 🛂\n` +
        `SIRITER Agence de Voyage vous informe du suivi de votre demande de visa (${app.country} - ${app.type}) :\n` +
        `----------------------------\n` +
        `📌 N° Dossier : ${app.id}\n` +
        `📌 Statut : ${statusText}\n` +
        `💰 Montant Total : ${formatCurrency(app.totalFcfa)} FCFA\n` +
        `✅ Payé : ${formatCurrency(app.paidFcfa)} FCFA | Reste : ${formatCurrency(app.remainingFcfa)} FCFA\n` +
        (app.notes ? `📝 Note : ${app.notes}\n` : '') +
        `----------------------------\n` +
        `📍 N'Djaména - Mardjan Daffack (Banque Agricole)\n` +
        `📞 Tél/WhatsApp : +235 68 56 77 77\n` +
        `Merci de votre confiance ! ✨`;
    } else {
      message = `مرحباً بك ${app.clientName} 🛂\n` +
        `يسر وكالة سيرتر للسفر والسياحة إعلامكم بمستجدات طلب التأشيرة (${app.country} - ${app.type}):\n` +
        `----------------------------\n` +
        `📌 رقم الطلب: ${app.id}\n` +
        `📌 الحالة الحالية: ${statusText}\n` +
        `💰 الإجمالي: ${formatCurrency(app.totalFcfa)} FCFA\n` +
        `✅ المدفوع: ${formatCurrency(app.paidFcfa)} FCFA | المتبقي: ${formatCurrency(app.remainingFcfa)} FCFA\n` +
        (app.notes ? `📝 ملاحظة: ${app.notes}\n` : '') +
        `----------------------------\n` +
        `📍 أنجمينا - مرجان دفاك (عمارة البنك الزراعي)\n` +
        `📞 هاتف/واتساب: 68567777 / 96567777\n` +
        `شكراً لاختياركم وكالة سيرتر للسفر والسياحة! ✨`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Subtabs */}
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-[#0B1E3F] flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#C99A3E]" />
              <span>{getTranslation(lang, 'visasSectionTitle')}</span>
            </h2>
            <p className="text-xs text-[#5B6B74] mt-1 font-medium">
              {getTranslation(lang, 'brandSubtitleFull')}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <button
                id="btn-admin-add-visa-catalog"
                onClick={() => {
                  setEditingCatalogItem(null);
                  setShowCatalogModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1E3F] text-white font-bold text-xs hover:bg-[#061022] transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C99A3E]" />
                <span>{getTranslation(lang, 'addNewVisaBtn')}</span>
              </button>
            )}

            <button
              id="btn-new-visa-app"
              onClick={() => handleOpenNewApp()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C99A3E] text-[#0B1E3F] font-extrabold text-xs hover:bg-[#A87C25] hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(lang, 'newVisaAppBtn')}</span>
            </button>
          </div>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-2 mt-5 border-b border-[#DFD5BE] pb-2">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeSubTab === 'catalog'
                ? 'bg-[#0B1E3F] text-white shadow-sm'
                : 'text-[#5B6B74] hover:bg-[#C99A3E]/10 hover:text-[#0B1E3F]'
            }`}
          >
            {getTranslation(lang, 'visaCatalogTab')} ({visaCatalog.length})
          </button>
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-[#0B1E3F] text-white shadow-sm'
                : 'text-[#5B6B74] hover:bg-[#C99A3E]/10 hover:text-[#0B1E3F]'
            }`}
          >
            {getTranslation(lang, 'visaAppsTab')} ({visaApplications.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: VISA CATALOG */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          {/* Country Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {uniqueCountries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountryFilter(country)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCountryFilter === country
                    ? 'bg-[#0B1E3F] text-white border-[#0B1E3F] shadow-sm'
                    : 'bg-white text-[#22303A] border-[#DFD5BE] hover:border-[#C99A3E]'
                }`}
              >
                {country === 'all' ? getTranslation(lang, 'filterAllCountries') : country}
              </button>
            ))}
          </div>

          {/* Visa Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalog.map(visa => (
              <div 
                key={visa.id} 
                className="bg-[#FFFDF8] border-2 border-[#DFD5BE] hover:border-[#C99A3E] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#DFD5BE]/60">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{visa.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-[#0B1E3F] text-base leading-tight">
                          {visa.country[lang] || visa.country.ar}
                        </h3>
                        <p className="text-xs font-bold text-[#A87C25]">
                          {visa.type[lang] || visa.type.ar}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(visa.status)}
                  </div>

                  {/* Details List */}
                  <div className="py-3 text-xs text-[#5B6B74] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="font-semibold">{getTranslation(lang, 'visaValidity')}</span>
                      <span className="font-bold text-[#22303A]">{visa.validity[lang] || visa.validity.ar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{getTranslation(lang, 'visaStay')}</span>
                      <span className="font-bold text-[#22303A]">{visa.stay[lang] || visa.stay.ar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{getTranslation(lang, 'visaProcessingTime')}</span>
                      <span className="font-bold text-[#22303A]">{visa.processingTime[lang] || visa.processingTime.ar}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-[#DFD5BE]/40">
                      <span className="font-bold text-[#0B1E3F] block mb-1">{getTranslation(lang, 'visaRequiredDocs')}</span>
                      <p className="text-[11px] text-[#5B6B74] leading-relaxed bg-[#FAF6EE] p-2 rounded-lg border border-[#DFD5BE]/50 line-clamp-3">
                        {visa.docs[lang] || visa.docs.ar}
                      </p>
                    </div>

                    {visa.notes && (
                      <p className="text-[11px] text-[#A87C25] font-medium italic mt-1">
                        💡 {visa.notes[lang] || visa.notes.ar}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Price & Action */}
                <div className="pt-3 border-t border-[#DFD5BE] mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#5B6B74]">{getTranslation(lang, 'visaTotalFee')}</span>
                    <span className="text-lg font-black text-[#0B1E3F] mono">
                      {formatCurrency(visa.totalFcfa)} <span className="text-xs font-bold text-[#C99A3E]">FCFA</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenNewApp(visa.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0B1E3F] hover:bg-[#061022] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{getTranslation(lang, 'visaApplyNowBtn')}</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCatalogItem(visa);
                            setShowCatalogModal(true);
                          }}
                          className="p-2 rounded-xl bg-white border border-[#DFD5BE] text-[#0B1E3F] hover:border-[#C99A3E] transition-all cursor-pointer"
                          title={getTranslation(lang, 'editBtn')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCatalogItemToDelete(visa)}
                          className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          title={getTranslation(lang, 'deleteBtn')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: VISA APPLICATIONS REGISTRY */}
      {activeSubTab === 'applications' && (
        <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-5 shadow-sm space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#5B6B74] absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={getTranslation(lang, 'visaSearchPlaceholder')}
              className="w-full ps-10 pe-4 py-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm focus:border-[#C99A3E] outline-none transition-all"
            />
          </div>

          {/* Applications Table */}
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-[#5B6B74]">
              <Globe className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-sm">{getTranslation(lang, 'emptyRecentVisas')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#DFD5BE] text-[11px] font-extrabold uppercase text-[#5B6B74]">
                    <th className="pb-3 text-start">{getTranslation(lang, 'thAppId')}</th>
                    <th className="pb-3 text-start">{getTranslation(lang, 'thPassenger')}</th>
                    <th className="pb-3 text-start">{getTranslation(lang, 'thCountryType')}</th>
                    <th className="pb-3 text-start">{getTranslation(lang, 'thPassport')}</th>
                    <th className="pb-3 text-start">{getTranslation(lang, 'thTotalFcfa')}</th>
                    <th className="pb-3 text-start">{getTranslation(lang, 'thStatus')}</th>
                    <th className="pb-3 text-end">{getTranslation(lang, 'thActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5BE]/60">
                  {filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-[#C99A3E]/5 transition-colors">
                      <td className="py-3.5 font-bold text-[#0B1E3F] mono">{app.id}</td>
                      <td className="py-3.5">
                        <div className="font-bold text-[#22303A]">{app.clientName}</div>
                        <div className="text-xs text-[#5B6B74] mono">{app.phone}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-[#0B1E3F]">{app.country}</div>
                        <div className="text-xs text-[#A87C25]">{app.type}</div>
                      </td>
                      <td className="py-3.5 mono text-xs font-semibold text-[#5B6B74]">{app.passport}</td>
                      <td className="py-3.5">
                        <div className="font-bold text-[#0B1E3F] mono">{formatCurrency(app.totalFcfa)} FCFA</div>
                        {app.remainingFcfa > 0 ? (
                          <div className="text-[11px] font-bold text-rose-600">
                            {getTranslation(lang, 'thRemainingFcfa')}: {formatCurrency(app.remainingFcfa)}
                          </div>
                        ) : (
                          <div className="text-[11px] font-bold text-emerald-600">
                            ✓ {getTranslation(lang, 'thPaidFcfa')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5">{getPipelineBadge(app.status)}</td>
                      <td className="py-3.5 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Status Update Button */}
                          <button
                            onClick={() => handleOpenStatusModal(app)}
                            className="p-1.5 rounded-lg bg-[#0B1E3F]/10 hover:bg-[#0B1E3F] text-[#0B1E3F] hover:text-white transition-all cursor-pointer"
                            title={getTranslation(lang, 'modalUpdateVisaStatus')}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Button */}
                          <button
                            onClick={() => sendWhatsAppUpdate(app)}
                            className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-all cursor-pointer"
                            title={getTranslation(lang, 'whatsappBtn')}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Convert to Invoice */}
                          <button
                            onClick={() => onConvertToInvoice(app)}
                            className="p-1.5 rounded-lg bg-[#C99A3E]/20 hover:bg-[#C99A3E] text-[#0B1E3F] transition-all cursor-pointer"
                            title={getTranslation(lang, 'convertToInvoiceBtn')}
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Application (Admin Only) */}
                          {isAdmin && (
                            <button
                              onClick={() => setAppToDelete(app)}
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
      )}

      {/* MODAL 1: NEW VISA APPLICATION */}
      {showNewAppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-[#0B1E3F] pb-3 border-b border-[#DFD5BE] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C99A3E]" />
              <span>{getTranslation(lang, 'modalNewVisaApp')}</span>
            </h3>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const vId = (form.elements.namedItem('visaCatalogId') as HTMLSelectElement).value;
                const selectedCat = visaCatalog.find(v => v.id === vId);

                const totalFcfa = Number((form.elements.namedItem('totalFcfa') as HTMLInputElement).value) || (selectedCat?.totalFcfa || 0);
                const paidFcfa = Number((form.elements.namedItem('paidFcfa') as HTMLInputElement).value) || 0;
                const remainingFcfa = Math.max(0, totalFcfa - paidFcfa);

                const newApp: VisaApplication = {
                  id: `VISA-${Math.floor(1000 + Math.random() * 9000)}`,
                  clientName: (form.elements.namedItem('clientName') as HTMLInputElement).value.trim(),
                  phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
                  passport: (form.elements.namedItem('passport') as HTMLInputElement).value.trim(),
                  nat: (form.elements.namedItem('nat') as HTMLInputElement).value.trim() || 'تشادي',
                  dob: (form.elements.namedItem('dob') as HTMLInputElement).value,
                  visaId: vId,
                  country: selectedCat ? (selectedCat.country[lang] || selectedCat.country.ar) : '',
                  type: selectedCat ? (selectedCat.type[lang] || selectedCat.type.ar) : '',
                  travelDate: (form.elements.namedItem('travelDate') as HTMLInputElement).value,
                  totalFcfa,
                  paidFcfa,
                  remainingFcfa,
                  status: 'new',
                  notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value.trim(),
                  createdAt: new Date().toISOString().split('T')[0]
                };

                onSubmitApplication(newApp);
                setShowNewAppModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'visaCatalogTab')}
                </label>
                <select
                  name="visaCatalogId"
                  defaultValue={preselectedVisaId}
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E]"
                  required
                >
                  {visaCatalog.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.flag} {v.country[lang] || v.country.ar} - {v.type[lang] || v.type.ar} ({formatCurrency(v.totalFcfa)} FCFA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'clientNameLabel')} *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    placeholder="مثال: أحمد محمد علي"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'clientPhoneLabel')} *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="+235 68 56 77 77"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm mono outline-none focus:border-[#C99A3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'clientPassportLabel')} *
                  </label>
                  <input
                    type="text"
                    name="passport"
                    required
                    placeholder="K12345678"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm mono outline-none focus:border-[#C99A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'clientNatLabel')}
                  </label>
                  <input
                    type="text"
                    name="nat"
                    defaultValue="تشادي"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'thTravelDate')} *
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    required
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    تاريخ الميلاد
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'thTotalFcfa')}
                  </label>
                  <input
                    type="number"
                    name="totalFcfa"
                    defaultValue={visaCatalog.find(v => v.id === preselectedVisaId)?.totalFcfa || 150000}
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm mono font-bold outline-none focus:border-[#C99A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'thPaidFcfa')}
                  </label>
                  <input
                    type="number"
                    name="paidFcfa"
                    defaultValue={0}
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm mono font-bold outline-none focus:border-[#C99A3E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'statusNotesPlaceholder')}
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFD5BE]">
                <button
                  type="button"
                  onClick={() => setShowNewAppModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  {getTranslation(lang, 'cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C99A3E] hover:bg-[#A87C25] text-[#0B1E3F] hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm"
                >
                  {getTranslation(lang, 'saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE VISA APPLICATION STATUS */}
      {showStatusModal && selectedAppForStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-[#0B1E3F] pb-3 border-b border-[#DFD5BE] mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#C99A3E]" />
              <span>{getTranslation(lang, 'modalUpdateVisaStatus')}</span>
            </h3>

            <div className="space-y-4">
              <div className="p-3 bg-white rounded-xl border border-[#DFD5BE] text-xs">
                <div className="font-bold text-[#0B1E3F]">{selectedAppForStatus.clientName}</div>
                <div className="text-[#5B6B74]">{selectedAppForStatus.country} ({selectedAppForStatus.type})</div>
                <div className="text-[#5B6B74] mono mt-1">N° {selectedAppForStatus.id}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'thStatus')}
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as VisaAppStatus)}
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm font-bold text-[#0B1E3F] outline-none focus:border-[#C99A3E]"
                >
                  <option value="new">🆕 {getTranslation(lang, 'appStatusNew')}</option>
                  <option value="review">🔍 {getTranslation(lang, 'appStatusReview')}</option>
                  <option value="processing">⏳ {getTranslation(lang, 'appStatusProcessing')}</option>
                  <option value="ready">📬 {getTranslation(lang, 'appStatusReady')}</option>
                  <option value="approved">✅ {getTranslation(lang, 'appStatusApproved')}</option>
                  <option value="rejected">❌ {getTranslation(lang, 'appStatusRejected')}</option>
                  <option value="completed">🏁 {getTranslation(lang, 'appStatusCompleted')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'statusNotesPlaceholder')}
                </label>
                <textarea
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                  placeholder="ملاحظات المستجدات أو سبب القرار..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFD5BE]">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  {getTranslation(lang, 'cancelBtn')}
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="px-5 py-2 rounded-xl bg-[#0B1E3F] hover:bg-[#061022] text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  {getTranslation(lang, 'saveBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD/EDIT VISA IN CATALOG (ADMIN) */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-[#0B1E3F] pb-3 border-b border-[#DFD5BE] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C99A3E]" />
              <span>{editingCatalogItem ? getTranslation(lang, 'modalEditVisaCatalog') : getTranslation(lang, 'modalAddVisaCatalog')}</span>
            </h3>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const emb = Number((form.elements.namedItem('embassyFee') as HTMLInputElement).value) || 0;
                const agy = Number((form.elements.namedItem('agencyFee') as HTMLInputElement).value) || 0;
                const total = emb + agy;

                const item: VisaCatalogItem = {
                  id: editingCatalogItem?.id || `v-${Date.now()}`,
                  flag: (form.elements.namedItem('flag') as HTMLInputElement).value.trim() || '🌍',
                  country: {
                    ar: (form.elements.namedItem('countryAr') as HTMLInputElement).value.trim(),
                    fr: (form.elements.namedItem('countryFr') as HTMLInputElement).value.trim(),
                    en: (form.elements.namedItem('countryEn') as HTMLInputElement).value.trim()
                  },
                  type: {
                    ar: (form.elements.namedItem('typeAr') as HTMLInputElement).value.trim(),
                    fr: (form.elements.namedItem('typeFr') as HTMLInputElement).value.trim(),
                    en: (form.elements.namedItem('typeEn') as HTMLInputElement).value.trim()
                  },
                  validity: {
                    ar: (form.elements.namedItem('validityAr') as HTMLInputElement).value.trim(),
                    fr: (form.elements.namedItem('validityFr') as HTMLInputElement).value.trim(),
                    en: (form.elements.namedItem('validityEn') as HTMLInputElement).value.trim()
                  },
                  stay: {
                    ar: (form.elements.namedItem('stayAr') as HTMLInputElement).value.trim(),
                    fr: (form.elements.namedItem('stayFr') as HTMLInputElement).value.trim(),
                    en: (form.elements.namedItem('stayEn') as HTMLInputElement).value.trim()
                  },
                  embassyFee: emb,
                  agencyFee: agy,
                  totalFcfa: total,
                  processingTime: {
                    ar: (form.elements.namedItem('procAr') as HTMLInputElement).value.trim(),
                    fr: (form.elements.namedItem('procFr') as HTMLInputElement).value.trim(),
                    en: (form.elements.namedItem('procEn') as HTMLInputElement).value.trim()
                  },
                  status: (form.elements.namedItem('status') as HTMLSelectElement).value as VisaStatus,
                  docs: {
                    ar: (form.elements.namedItem('docsAr') as HTMLTextAreaElement).value.trim(),
                    fr: (form.elements.namedItem('docsFr') as HTMLTextAreaElement).value.trim(),
                    en: (form.elements.namedItem('docsEn') as HTMLTextAreaElement).value.trim()
                  },
                  notes: {
                    ar: (form.elements.namedItem('notesAr') as HTMLInputElement).value.trim(),
                    fr: (form.elements.namedItem('notesFr') as HTMLInputElement).value.trim(),
                    en: (form.elements.namedItem('notesEn') as HTMLInputElement).value.trim()
                  }
                };

                onSaveCatalogItem(item);
                setShowCatalogModal(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">العلم (Flag)</label>
                  <input
                    type="text"
                    name="flag"
                    defaultValue={editingCatalogItem?.flag || '🇫🇷'}
                    className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-center text-lg outline-none"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">اسم الدولة (Country - AR / FR / EN)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" name="countryAr" defaultValue={editingCatalogItem?.country.ar || ''} placeholder="عربي" className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" required />
                    <input type="text" name="countryFr" defaultValue={editingCatalogItem?.country.fr || ''} placeholder="Français" className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" required />
                    <input type="text" name="countryEn" defaultValue={editingCatalogItem?.country.en || ''} placeholder="English" className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">نوع التأشيرة (Visa Type - AR / FR / EN)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" name="typeAr" defaultValue={editingCatalogItem?.type.ar || 'سياحية'} placeholder="سياحية" className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" required />
                  <input type="text" name="typeFr" defaultValue={editingCatalogItem?.type.fr || 'Touristique'} placeholder="Touristique" className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" required />
                  <input type="text" name="typeEn" defaultValue={editingCatalogItem?.type.en || 'Tourist'} placeholder="Tourist" className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">{getTranslation(lang, 'visaEmbassyFee')} (FCFA)</label>
                  <input type="number" name="embassyFee" defaultValue={editingCatalogItem?.embassyFee || 65000} className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-sm mono font-bold outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">{getTranslation(lang, 'visaAgencyFee')} (FCFA)</label>
                  <input type="number" name="agencyFee" defaultValue={editingCatalogItem?.agencyFee || 85000} className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-sm mono font-bold outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">{getTranslation(lang, 'thStatus')}</label>
                  <select name="status" defaultValue={editingCatalogItem?.status || 'available'} className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-sm font-bold outline-none">
                    <option value="available">🟢 {getTranslation(lang, 'statusAvailable')}</option>
                    <option value="soon">🟡 {getTranslation(lang, 'statusSoon')}</option>
                    <option value="unavailable">🔴 {getTranslation(lang, 'statusUnavailable')}</option>
                    <option value="paused">⚫ {getTranslation(lang, 'statusPaused')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">مدة المعالجة (AR / FR / EN)</label>
                  <div className="grid grid-cols-3 gap-1">
                    <input type="text" name="procAr" defaultValue={editingCatalogItem?.processingTime.ar || '10 أيام'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                    <input type="text" name="procFr" defaultValue={editingCatalogItem?.processingTime.fr || '10 jours'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                    <input type="text" name="procEn" defaultValue={editingCatalogItem?.processingTime.en || '10 days'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">الصلاحية (Validity AR/FR/EN)</label>
                  <div className="grid grid-cols-3 gap-1">
                    <input type="text" name="validityAr" defaultValue={editingCatalogItem?.validity.ar || '90 يوماً'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                    <input type="text" name="validityFr" defaultValue={editingCatalogItem?.validity.fr || '90 jours'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                    <input type="text" name="validityEn" defaultValue={editingCatalogItem?.validity.en || '90 days'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">مدة الإقامة (Stay AR/FR/EN)</label>
                  <div className="grid grid-cols-3 gap-1">
                    <input type="text" name="stayAr" defaultValue={editingCatalogItem?.stay.ar || '30 يوماً'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                    <input type="text" name="stayFr" defaultValue={editingCatalogItem?.stay.fr || '30 jours'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                    <input type="text" name="stayEn" defaultValue={editingCatalogItem?.stay.en || '30 days'} className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-[11px] outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">{getTranslation(lang, 'visaRequiredDocs')} (AR / FR)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <textarea name="docsAr" defaultValue={editingCatalogItem?.docs.ar || 'جواز سفر ساري، صورتين، كشف حساب'} rows={2} className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" placeholder="عربي" />
                  <textarea name="docsFr" defaultValue={editingCatalogItem?.docs.fr || 'Passeport valide, photos, relevé bancaire'} rows={2} className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" placeholder="Français" />
                  <input type="hidden" name="docsEn" defaultValue={editingCatalogItem?.docs.en || 'Valid passport, photos, bank statement'} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">ملاحظات وشروط (AR / FR)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" name="notesAr" defaultValue={editingCatalogItem?.notes?.ar || ''} placeholder="ملاحظة بالعربية" className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" />
                  <input type="text" name="notesFr" defaultValue={editingCatalogItem?.notes?.fr || ''} placeholder="Note en Français" className="w-full p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none" />
                  <input type="hidden" name="notesEn" defaultValue={editingCatalogItem?.notes?.en || ''} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFD5BE]">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  {getTranslation(lang, 'cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C99A3E] hover:bg-[#A87C25] text-[#0B1E3F] hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm"
                >
                  {getTranslation(lang, 'saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Catalog Item Modal */}
      {catalogItemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DFD5BE] mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#0B1E3F] text-base">
                  {lang === 'ar' ? 'تأكيد حذف التأشيرة' : 'Confirmer la suppression du visa'}
                </h3>
                <p className="text-xs text-[#5B6B74]">
                  {lang === 'ar' ? 'سيتم حذف هذا النوع من دليل التأشيرات المتاحة' : 'Cet élément sera retiré du catalogue'}
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5 text-xs text-[#0B1E3F]">
              <p className="font-bold mb-1">
                {lang === 'ar' ? 'هل أنت متأكد من حذف:' : 'Voulez-vous supprimer :'}
              </p>
              <div className="font-extrabold text-sm text-rose-700 mt-1 flex items-center gap-2">
                <span>{catalogItemToDelete.flag}</span>
                <span>{catalogItemToDelete.country[lang] || catalogItemToDelete.country.ar}</span>
                <span>-</span>
                <span>{catalogItemToDelete.type[lang] || catalogItemToDelete.type.ar}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCatalogItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                {getTranslation(lang, 'cancelBtn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCatalogItem(catalogItemToDelete.id);
                  setCatalogItemToDelete(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نعم، حذف' : 'Supprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Visa Application Modal */}
      {appToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DFD5BE] mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#0B1E3F] text-base">
                  {lang === 'ar' ? 'تأكيد حذف طلب التأشيرة' : 'Confirmer la suppression de la demande'}
                </h3>
                <p className="text-xs text-[#5B6B74]">
                  {lang === 'ar' ? 'سيتم حذف هذا الطلب نهائياً من سجل المعاملات' : 'Cette demande sera définitivement supprimée'}
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5 text-xs text-[#0B1E3F]">
              <p className="font-bold mb-1">
                {lang === 'ar' ? 'بيانات الطلب المراد حذفه:' : 'Détails de la demande :'}
              </p>
              <div className="font-extrabold text-sm text-rose-700 mt-1 flex items-center justify-between">
                <span>{appToDelete.clientName}</span>
                <span className="mono text-xs text-rose-500 font-semibold">{appToDelete.id}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {appToDelete.country} - {appToDelete.type}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                {getTranslation(lang, 'cancelBtn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteApplication(appToDelete.id);
                  setAppToDelete(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نعم، حذف الطلب' : 'Supprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
