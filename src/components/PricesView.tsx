import React, { useState } from 'react';
import { Language, ServiceItem, User } from '../types';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { Tag, Plus, Edit3, Trash2, Check, X, AlertTriangle } from 'lucide-react';

interface PricesViewProps {
  lang: Language;
  currentUser: User | null;
  services: ServiceItem[];
  onSaveService: (index: number | null, service: ServiceItem) => void;
  onDeleteService: (index: number) => void;
}

export const PricesView: React.FC<PricesViewProps> = ({
  lang,
  currentUser,
  services,
  onSaveService,
  onDeleteService
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const [formCatAr, setFormCatAr] = useState<string>('');
  const [formCatFr, setFormCatFr] = useState<string>('');
  const [formCatEn, setFormCatEn] = useState<string>('');

  const [formNameAr, setFormNameAr] = useState<string>('');
  const [formNameFr, setFormNameFr] = useState<string>('');
  const [formNameEn, setFormNameEn] = useState<string>('');

  const [formFcfa, setFormFcfa] = useState<number>(0);
  const [formNeg, setFormNeg] = useState<boolean>(false);

  const handleOpenAdd = () => {
    if (!isAdmin) return;
    setEditingIndex(null);
    setFormCatAr('خدمات عامة');
    setFormCatFr('Services généraux');
    setFormCatEn('General services');
    setFormNameAr('');
    setFormNameFr('');
    setFormNameEn('');
    setFormFcfa(0);
    setFormNeg(false);
    setShowModal(true);
  };

  const handleOpenEdit = (index: number) => {
    if (!isAdmin) return;
    const s = services[index];
    if (!s) return;
    setEditingIndex(index);
    setFormCatAr(s.cat.ar);
    setFormCatFr(s.cat.fr);
    setFormCatEn(s.cat.en);
    setFormNameAr(s.name.ar);
    setFormNameFr(s.name.fr);
    setFormNameEn(s.name.en);
    setFormFcfa(s.fcfa || 0);
    setFormNeg(!!s.neg);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formNameAr.trim()) return;

    const newService: ServiceItem = {
      cat: {
        ar: formCatAr.trim() || 'خدمات عامة',
        fr: formCatFr.trim() || 'Services généraux',
        en: formCatEn.trim() || 'General services'
      },
      name: {
        ar: formNameAr.trim(),
        fr: formNameFr.trim() || formNameAr.trim(),
        en: formNameEn.trim() || formNameAr.trim()
      },
      fcfa: formNeg ? null : formFcfa,
      neg: formNeg
    };

    onSaveService(editingIndex, newService);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#DFD5BE]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#C99A3E]/20 text-[#0B1E3F] flex items-center justify-center font-black">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0B1E3F]">
                {getTranslation(lang, 'pricesTitle')}
              </h2>
              <p className="text-xs text-[#5B6B74]">
                الأسعار الرسمية المعتمدة لخدمات وكالة سيرتر
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1E3F] hover:bg-[#061022] text-[#C99A3E] hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(lang, 'addPriceBtn')}</span>
            </button>
          )}
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-[#DFD5BE] text-[11px] font-extrabold uppercase text-[#5B6B74]">
                <th className="pb-3 text-start">{getTranslation(lang, 'colCategory')}</th>
                <th className="pb-3 text-start">{getTranslation(lang, 'colService')}</th>
                <th className="pb-3 text-start">{getTranslation(lang, 'colPrice')}</th>
                {isAdmin && <th className="pb-3 text-end">{getTranslation(lang, 'thActions')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD5BE]/60">
              {services.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#C99A3E]/5 transition-colors">
                  <td className="py-3.5 font-bold text-[#A87C25]">
                    {s.cat[lang] || s.cat.ar}
                  </td>
                  <td className="py-3.5 font-extrabold text-[#0B1E3F] text-sm">
                    {s.name[lang] || s.name.ar}
                  </td>
                  <td className="py-3.5">
                    {s.neg || s.fcfa === null ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        {getTranslation(lang, 'negotiablePrice')}
                      </span>
                    ) : (
                      <span className="font-extrabold text-sm text-[#0B1E3F] mono">
                        {formatCurrency(s.fcfa)} <span className="text-[11px] text-[#5B6B74]">FCFA</span>
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="py-3.5 text-end">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(idx)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0B1E3F] text-[#0B1E3F] hover:text-white transition-all cursor-pointer"
                          title={getTranslation(lang, 'editBtn')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPendingDeleteIndex(idx)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all cursor-pointer"
                          title={getTranslation(lang, 'deleteBtn')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-base font-black text-[#0B1E3F] pb-3 border-b border-[#DFD5BE] mb-4">
              {editingIndex !== null ? getTranslation(lang, 'priceEditModalTitle') : getTranslation(lang, 'addPriceBtn')}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'colCategory')} (AR / FR / EN)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formCatAr}
                    onChange={e => setFormCatAr(e.target.value)}
                    placeholder="عربي"
                    required
                    className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
                  />
                  <input
                    type="text"
                    value={formCatFr}
                    onChange={e => setFormCatFr(e.target.value)}
                    placeholder="Français"
                    className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
                  />
                  <input
                    type="text"
                    value={formCatEn}
                    onChange={e => setFormCatEn(e.target.value)}
                    placeholder="English"
                    className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'colService')} (AR / FR / EN)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formNameAr}
                    onChange={e => setFormNameAr(e.target.value)}
                    placeholder="عربي"
                    required
                    className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
                  />
                  <input
                    type="text"
                    value={formNameFr}
                    onChange={e => setFormNameFr(e.target.value)}
                    placeholder="Français"
                    className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
                  />
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={e => setFormNameEn(e.target.value)}
                    placeholder="English"
                    className="p-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#0B1E3F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formNeg}
                    onChange={e => setFormNeg(e.target.checked)}
                    className="rounded text-[#C99A3E]"
                  />
                  <span>{getTranslation(lang, 'negotiablePrice')}</span>
                </label>
              </div>

              {!formNeg && (
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {getTranslation(lang, 'colPrice')} (FCFA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formFcfa}
                    onChange={e => setFormFcfa(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm font-bold mono outline-none focus:border-[#C99A3E]"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFD5BE]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs"
                >
                  {getTranslation(lang, 'cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1E3F] hover:bg-[#061022] text-[#C99A3E] hover:text-white font-black text-xs shadow-sm"
                >
                  {getTranslation(lang, 'saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteIndex !== null && services[pendingDeleteIndex] && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DFD5BE] mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#0B1E3F] text-base">
                  {lang === 'ar' ? 'تأكيد حذف الخدمة' : 'Confirmer la suppression'}
                </h3>
                <p className="text-xs text-[#5B6B74]">
                  {lang === 'ar' ? 'سيتم إزالة هذا البند من قائمة الأسعار' : 'Cet élément sera retiré de la liste'}
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5 text-xs text-[#0B1E3F]">
              <p className="font-bold mb-1">
                {lang === 'ar' ? 'الخدمة المراد حذفها:' : 'Service à supprimer :'}
              </p>
              <div className="font-extrabold text-sm text-rose-700 mt-1">
                {services[pendingDeleteIndex].name[lang] || services[pendingDeleteIndex].name.ar}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteIndex(null)}
                className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                {getTranslation(lang, 'cancelBtn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAdmin && pendingDeleteIndex !== null) {
                    onDeleteService(pendingDeleteIndex);
                  }
                  setPendingDeleteIndex(null);
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
    </div>
  );
};
