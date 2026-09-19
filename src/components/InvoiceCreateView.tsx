import React, { useState, useEffect } from 'react';
import { Client, Invoice, InvoiceItem, Language, ServiceItem, VisaCatalogItem } from '../types';
import { formatCurrency, getTranslation } from '../i18n/translations';
import { FileText, Plus, Trash2, Save, RotateCcw, UserPlus, Receipt, AlertTriangle } from 'lucide-react';

interface InvoiceCreateViewProps {
  lang: Language;
  clients: Client[];
  services: ServiceItem[];
  visaCatalog: VisaCatalogItem[];
  nextInvoiceSeq: number;
  initialItems?: InvoiceItem[];
  onSaveInvoice: (invoice: Invoice, newClient?: Client) => void;
}

export const InvoiceCreateView: React.FC<InvoiceCreateViewProps> = ({
  lang,
  clients,
  services,
  visaCatalog,
  nextInvoiceSeq,
  initialItems,
  onSaveInvoice
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNat, setClientNat] = useState<string>('تشادي');
  const [clientPassport, setClientPassport] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const [discountFcfa, setDiscountFcfa] = useState<number>(0);

  const [items, setItems] = useState<InvoiceItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }
    return [{
      id: `item-${Date.now()}`,
      label: '',
      qty: 1,
      fcfa: 0
    }];
  });

  // Whenever initialItems changes from outside (e.g. from flight or visa conversion)
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const handleClientSelectChange = (clientId: string) => {
    setSelectedClientId(clientId);
    if (clientId) {
      const found = clients.find(c => c.id === clientId);
      if (found) {
        setClientName(found.name);
        setClientPhone(found.phone || '');
        setClientNat(found.nat || '');
        setClientPassport(found.passport || '');
      }
    } else {
      setClientName('');
      setClientPhone('');
      setClientNat('تشادي');
      setClientPassport('');
    }
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        label: '',
        qty: 1,
        fcfa: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => {
      const filtered = prev.filter(it => it.id !== id);
      if (filtered.length === 0) {
        return [{ id: `item-${Date.now()}`, label: '', qty: 1, fcfa: 0 }];
      }
      return filtered;
    });
  };

  const handleServiceSelect = (id: string, selectValue: string) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;

      if (selectValue.startsWith('srv-')) {
        const sIndex = parseInt(selectValue.replace('srv-', ''), 10);
        const srv = services[sIndex];
        if (srv) {
          return {
            ...it,
            serviceIdx: selectValue,
            label: srv.name,
            fcfa: srv.fcfa || 0
          };
        }
      } else if (selectValue.startsWith('visa-')) {
        const vId = selectValue.replace('visa-', '');
        const visa = visaCatalog.find(v => v.id === vId);
        if (visa) {
          return {
            ...it,
            serviceIdx: selectValue,
            label: {
              ar: `تأشيرة ${visa.country.ar} (${visa.type.ar})`,
              fr: `Visa ${visa.country.fr} (${visa.type.fr})`,
              en: `Visa ${visa.country.en} (${visa.type.en})`
            },
            fcfa: visa.totalFcfa
          };
        }
      } else if (selectValue === 'custom') {
        return {
          ...it,
          serviceIdx: 'custom',
          label: '',
          fcfa: it.fcfa || 0
        };
      }

      return it;
    }));
  };

  const handleCustomLabelChange = (id: string, text: string) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      return {
        ...it,
        label: text
      };
    }));
  };

  const handleQtyChange = (id: string, qty: number) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      return { ...it, qty: Math.max(1, qty) };
    }));
  };

  const handlePriceChange = (id: string, price: number) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      return { ...it, fcfa: Math.max(0, price) };
    }));
  };

  const subtotalFcfa = items.reduce((sum, it) => sum + (it.qty * it.fcfa), 0);
  const grandTotalFcfa = Math.max(0, subtotalFcfa - discountFcfa);

  const handleReset = () => {
    setSelectedClientId('');
    setClientName('');
    setClientPhone('');
    setClientNat('تشادي');
    setClientPassport('');
    setDiscountFcfa(0);
    setItems([{ id: `item-${Date.now()}`, label: '', qty: 1, fcfa: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      setFormError(getTranslation(lang, 'toastErrorFillFields') + ' (' + getTranslation(lang, 'clientNameLabel') + ')');
      return;
    }

    const validItems = items.filter(it => {
      const labelStr = typeof it.label === 'string' ? it.label : (it.label[lang] || it.label.ar);
      return labelStr && labelStr.trim().length > 0;
    });

    if (validItems.length === 0) {
      setFormError(lang === 'ar' ? 'يرجى اختيار أو كتابة بند واحد على الأقل في الفاتورة' : 'Veuillez saisir au moins une ligne de facture');
      return;
    }

    setFormError(null);

    let finalClientId = selectedClientId;
    let newClientObj: Client | undefined = undefined;

    if (!finalClientId) {
      finalClientId = `cl-${Date.now()}`;
      newClientObj = {
        id: finalClientId,
        name: clientName.trim(),
        phone: clientPhone.trim(),
        nat: clientNat.trim(),
        passport: clientPassport.trim(),
        createdAt: Date.now()
      };
    }

    const invoiceNumber = `INV-${String(nextInvoiceSeq).padStart(4, '0')}`;
    const todayStr = new Date().toLocaleDateString('en-GB');

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: invoiceNumber,
      date: todayStr,
      createdAt: Date.now(),
      clientId: finalClientId,
      clientName: clientName.trim(),
      items: validItems,
      subFcfa: subtotalFcfa,
      discFcfa: discountFcfa,
      grandFcfa: grandTotalFcfa,
      status: 'paid'
    };

    onSaveInvoice(newInvoice, newClientObj);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#DFD5BE] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#C99A3E]/20 text-[#0B1E3F] flex items-center justify-center font-black">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0B1E3F]">
                {getTranslation(lang, 'newInvoiceTitle')}
              </h2>
              <p className="text-xs text-[#5B6B74]">
                {getTranslation(lang, 'docSubtitle')}
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="text-xs font-bold text-[#5B6B74] block">{getTranslation(lang, 'invNumberLabel')}</span>
            <span className="text-lg font-black text-[#0B1E3F] mono">
              INV-{String(nextInvoiceSeq).padStart(4, '0')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Client Information Section */}
          <div className="bg-white border border-[#DFD5BE] rounded-xl p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0B1E3F] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#C99A3E]" />
                <span>بيانات العميل المستلم (Client Information)</span>
              </h3>
            </div>

            {/* Select existing or new client */}
            <div>
              <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                {getTranslation(lang, 'selectExistingClient')}
              </label>
              <select
                value={selectedClientId}
                onChange={e => handleClientSelectChange(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6EE] border border-[#DFD5BE] rounded-xl text-sm font-bold text-[#0B1E3F] outline-none focus:border-[#C99A3E]"
              >
                <option value="">{getTranslation(lang, 'newClientOption')}</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} {c.passport ? `[${c.passport}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'clientNameLabel')} *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="الاسم الكامل"
                  required
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'clientPhoneLabel')}
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="+235 68 56 77 77"
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm mono outline-none focus:border-[#C99A3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'clientNatLabel')}
                </label>
                <input
                  type="text"
                  value={clientNat}
                  onChange={e => setClientNat(e.target.value)}
                  placeholder="تشادي"
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm outline-none focus:border-[#C99A3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'clientPassportLabel')}
                </label>
                <input
                  type="text"
                  value={clientPassport}
                  onChange={e => setClientPassport(e.target.value)}
                  placeholder="K98765432"
                  className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-sm mono outline-none focus:border-[#C99A3E]"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white border border-[#DFD5BE] rounded-xl p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DFD5BE]">
              <h3 className="text-sm font-extrabold text-[#0B1E3F] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C99A3E]" />
                <span>{getTranslation(lang, 'itemsTitle')}</span>
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-bold text-[#0B1E3F] bg-[#FAF6EE] hover:bg-[#C99A3E]/20 px-3 py-1.5 rounded-lg border border-[#DFD5BE] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{getTranslation(lang, 'addItemBtn')}</span>
              </button>
            </div>

            {/* Items Rows */}
            <div className="space-y-3">
              {items.map((it, idx) => {
                const labelValue = typeof it.label === 'string' ? it.label : (it.label[lang] || it.label.ar);
                const isCustom = it.serviceIdx === 'custom' || !it.serviceIdx;

                return (
                  <div 
                    key={it.id} 
                    className="grid grid-cols-12 gap-2.5 items-center p-2.5 rounded-xl bg-[#FAF6EE]/70 border border-[#DFD5BE]/60 hover:border-[#C99A3E] transition-all"
                  >
                    {/* Item number */}
                    <div className="col-span-1 text-center font-bold text-xs text-[#5B6B74] mono">
                      #{idx + 1}
                    </div>

                    {/* Service Selection or Custom Description */}
                    <div className="col-span-11 sm:col-span-5 space-y-1.5">
                      <select
                        value={it.serviceIdx || (isCustom ? 'custom' : '')}
                        onChange={e => handleServiceSelect(it.id, e.target.value)}
                        className="w-full p-2 bg-white border border-[#DFD5BE] rounded-lg text-xs font-semibold outline-none focus:border-[#C99A3E]"
                      >
                        <option value="">{getTranslation(lang, 'selectServiceOption')}</option>
                        
                        <optgroup label="📋 دليل التأشيرات (Visas)">
                          {visaCatalog.map(v => (
                            <option key={v.id} value={`visa-${v.id}`}>
                              🛂 {v.country[lang] || v.country.ar} - {v.type[lang] || v.type.ar} ({formatCurrency(v.totalFcfa)} FCFA)
                            </option>
                          ))}
                        </optgroup>

                        <optgroup label="✈️ خدمات الوكالة وتذاكر الطيران (Services)">
                          {services.map((s, sIdx) => (
                            <option key={sIdx} value={`srv-${sIdx}`}>
                              {s.name[lang] || s.name.ar} {s.fcfa ? `(${formatCurrency(s.fcfa)} FCFA)` : ''}
                            </option>
                          ))}
                        </optgroup>

                        <option value="custom">✏️ {getTranslation(lang, 'customServiceOption')}</option>
                      </select>

                      {/* If custom or edit mode, show text input */}
                      <input
                        type="text"
                        value={labelValue}
                        onChange={e => handleCustomLabelChange(it.id, e.target.value)}
                        placeholder={getTranslation(lang, 'customItemPlaceholder')}
                        className="w-full p-1.5 bg-white border border-[#DFD5BE] rounded-lg text-xs font-medium outline-none focus:border-[#C99A3E]"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#5B6B74] block mb-0.5 sm:hidden">
                        {getTranslation(lang, 'colQty')}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={e => handleQtyChange(it.id, parseInt(e.target.value) || 1)}
                        className="w-full p-2 bg-white border border-[#DFD5BE] rounded-lg text-xs font-bold mono text-center outline-none focus:border-[#C99A3E]"
                      />
                    </div>

                    {/* Price FCFA */}
                    <div className="col-span-6 sm:col-span-3">
                      <label className="text-[10px] font-bold text-[#5B6B74] block mb-0.5 sm:hidden">
                        {getTranslation(lang, 'colPrice')}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={it.fcfa}
                        onChange={e => handlePriceChange(it.id, parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-white border border-[#DFD5BE] rounded-lg text-xs font-bold mono outline-none focus:border-[#C99A3E]"
                      />
                    </div>

                    {/* Delete Item */}
                    <div className="col-span-2 sm:col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title={getTranslation(lang, 'deleteBtn')}
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Box */}
            <div className="pt-4 border-t border-[#DFD5BE] flex flex-col items-end gap-2.5">
              <div className="flex items-center justify-between w-72 text-sm font-semibold text-[#5B6B74]">
                <span>{getTranslation(lang, 'subtotalFcfa')}</span>
                <span className="mono font-bold text-[#0B1E3F]">{formatCurrency(subtotalFcfa)} FCFA</span>
              </div>

              <div className="flex items-center justify-between w-72 text-sm font-semibold text-[#5B6B74]">
                <span>{getTranslation(lang, 'discountFcfa')}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    value={discountFcfa}
                    onChange={e => setDiscountFcfa(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-24 p-1 text-xs font-bold mono bg-white border border-[#DFD5BE] rounded-lg text-end outline-none focus:border-[#C99A3E]"
                  />
                  <span className="text-xs">FCFA</span>
                </div>
              </div>

              <div className="flex items-center justify-between w-72 pt-2 border-t-2 border-[#0B1E3F] text-base font-black text-[#0B1E3F]">
                <span>{getTranslation(lang, 'grandTotalFcfa')}</span>
                <span className="mono text-xl text-[#C99A3E] font-black">{formatCurrency(grandTotalFcfa)} FCFA</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:bg-slate-100 font-bold text-xs cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{getTranslation(lang, 'resetFormBtn')}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1E3F] hover:bg-[#061022] text-[#C99A3E] hover:text-white font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{getTranslation(lang, 'saveInvoiceBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
