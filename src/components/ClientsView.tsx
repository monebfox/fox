import React, { useState } from 'react';
import { Client, Invoice, Language, User } from '../types';
import { getTranslation } from '../i18n/translations';
import { Users, UserPlus, Search, Trash2, Phone, CreditCard, Globe, AlertTriangle } from 'lucide-react';

interface ClientsViewProps {
  lang: Language;
  currentUser?: User | null;
  clients: Client[];
  invoices: Invoice[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  lang,
  currentUser,
  clients,
  invoices,
  onAddClient,
  onDeleteClient
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [search, setSearch] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [nat, setNat] = useState<string>('تشادي');
  const [passport, setPassport] = useState<string>('');
  const [pendingDeleteClient, setPendingDeleteClient] = useState<Client | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClient: Client = {
      id: `cl-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      nat: nat.trim() || 'تشادي',
      passport: passport.trim(),
      createdAt: Date.now()
    };

    onAddClient(newClient);
    setName('');
    setPhone('');
    setNat('تشادي');
    setPassport('');
  };

  const filteredClients = clients.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.passport && c.passport.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Quick Add Client Card */}
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#0B1E3F] mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#C99A3E]" />
          <span>{getTranslation(lang, 'addClientTitle')}</span>
        </h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-[#5B6B74] mb-1">
              {getTranslation(lang, 'clientNameLabel')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="الاسم الكامل"
              required
              className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6B74] mb-1">
              {getTranslation(lang, 'clientPhoneLabel')}
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+235 68..."
              className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-xs mono outline-none focus:border-[#C99A3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6B74] mb-1">
              {getTranslation(lang, 'clientNatLabel')}
            </label>
            <input
              type="text"
              value={nat}
              onChange={e => setNat(e.target.value)}
              placeholder="تشادي"
              className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6B74] mb-1">
              {getTranslation(lang, 'clientPassportLabel')}
            </label>
            <input
              type="text"
              value={passport}
              onChange={e => setPassport(e.target.value)}
              placeholder="K1234567"
              className="w-full p-2.5 bg-white border border-[#DFD5BE] rounded-xl text-xs mono outline-none focus:border-[#C99A3E]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0B1E3F] hover:bg-[#061022] text-[#C99A3E] hover:text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{getTranslation(lang, 'addClientBtn')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Clients Database Table */}
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#DFD5BE]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C99A3E]" />
            <h2 className="text-lg font-black text-[#0B1E3F]">{getTranslation(lang, 'clientsTitle')}</h2>
            <span className="text-xs bg-slate-100 text-[#5B6B74] px-2 py-0.5 rounded-full font-bold">
              {filteredClients.length}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#5B6B74] absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={getTranslation(lang, 'searchClientsPlaceholder')}
              className="w-full ps-9 pe-4 py-2 bg-white border border-[#DFD5BE] rounded-xl text-xs outline-none focus:border-[#C99A3E]"
            />
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12 text-[#5B6B74]">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-xs">{getTranslation(lang, 'noClientsFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-[#DFD5BE] text-[11px] font-extrabold uppercase text-[#5B6B74]">
                  <th className="pb-3 text-start">{getTranslation(lang, 'clientNameLabel')}</th>
                  <th className="pb-3 text-start">{getTranslation(lang, 'clientPhoneLabel')}</th>
                  <th className="pb-3 text-start">{getTranslation(lang, 'clientNatLabel')}</th>
                  <th className="pb-3 text-start">{getTranslation(lang, 'clientPassportLabel')}</th>
                  <th className="pb-3 text-center">{getTranslation(lang, 'colInvoiceCount')}</th>
                  <th className="pb-3 text-end">{getTranslation(lang, 'thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5BE]/60">
                {filteredClients.map(c => {
                  const invCount = invoices.filter(i => i.clientId === c.id).length;
                  return (
                    <tr key={c.id} className="hover:bg-[#C99A3E]/5 transition-colors">
                      <td className="py-3 font-extrabold text-[#0B1E3F] text-sm">{c.name}</td>
                      <td className="py-3 mono font-semibold text-[#22303A]">{c.phone || '—'}</td>
                      <td className="py-3 font-medium text-[#5B6B74]">{c.nat || '—'}</td>
                      <td className="py-3 mono text-[#5B6B74] font-semibold">{c.passport || '—'}</td>
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-[#C99A3E]/20 text-[#0B1E3F] mono">
                          {invCount}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        {isAdmin && (
                          <button
                            onClick={() => setPendingDeleteClient(c)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all cursor-pointer"
                            title={getTranslation(lang, 'deleteBtn')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Client Confirm */}
      {pendingDeleteClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="text-base font-black text-[#0B1E3F] mb-1">
              {getTranslation(lang, 'confirmDeleteTitle')}
            </h3>
            <p className="text-xs text-[#5B6B74] mb-4">
              {getTranslation(lang, 'confirmDeleteClientMsg')} ({pendingDeleteClient.name})
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPendingDeleteClient(null)}
                className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-[#5B6B74] font-bold text-xs"
              >
                {getTranslation(lang, 'cancelBtn')}
              </button>
              <button
                onClick={() => {
                  onDeleteClient(pendingDeleteClient.id);
                  setPendingDeleteClient(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
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
