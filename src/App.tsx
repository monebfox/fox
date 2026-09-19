import React, { useState, useEffect } from 'react';
import { 
  Client, 
  Invoice, 
  InvoiceItem, 
  Language, 
  ServiceItem, 
  TabType, 
  User, 
  VisaAppStatus, 
  VisaApplication, 
  VisaCatalogItem 
} from './types';
import { 
  AGENCY_CONFIG, 
  INITIAL_CLIENTS, 
  INITIAL_INVOICES, 
  INITIAL_SERVICES, 
  INITIAL_USERS, 
  INITIAL_VISA_APPLICATIONS, 
  INITIAL_VISA_CATALOG 
} from './data/initialData';
import { formatCurrency, getTranslation } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { VisasView } from './components/VisasView';
import { InvoiceCreateView } from './components/InvoiceCreateView';
import { InvoicesListView } from './components/InvoicesListView';
import { InvoicePrintDoc } from './components/InvoicePrintDoc';
import { ClientsView } from './components/ClientsView';
import { PricesView } from './components/PricesView';
import { ReportsView } from './components/ReportsView';
import { EmployeesView } from './components/EmployeesView';
import { LoginModal } from './components/LoginModal';

const STORAGE_KEYS = {
  LANG: 'siriter_lang_v3',
  AUTH: 'siriter_auth_v3',
  INVOICES: 'siriter_invoices_v3',
  VISAS: 'siriter_visa_apps_v3',
  VISA_CATALOG: 'siriter_visa_catalog_v3',
  CLIENTS: 'siriter_clients_v3',
  SERVICES: 'siriter_services_v3',
  USERS: 'siriter_users_v3',
};

export default function App() {
  // Language State
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      if (saved === 'ar' || saved === 'fr' || saved === 'en') return saved;
    } catch {}
    return 'ar';
  });

  // Authentication State
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        const updated = parsed.map(u => 
          u.username.toLowerCase() === 'moneb' ? { ...u, name: 'moneb', password: '249', role: 'admin' as const } : u
        );
        if (!updated.some(u => u.username.toLowerCase() === 'moneb')) {
          updated.unshift(INITIAL_USERS[0]);
        }
        if (!updated.some(u => u.username.toLowerCase() === 'fox')) {
          updated.push(INITIAL_USERS[1]);
        }
        return updated;
      }
    } catch {}
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.username.toLowerCase() === 'moneb') {
          return { ...INITIAL_USERS[0], name: 'moneb', password: '249', role: 'admin' as const };
        }
        if (parsed.username && parsed.username.toLowerCase() === 'fox') {
          return { ...INITIAL_USERS[1] };
        }
        const match = INITIAL_USERS.find(u => u.username.toLowerCase() === parsed.username?.toLowerCase());
        if (match) return match;
      }
    } catch {}
    return INITIAL_USERS[0];
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return currentUser?.role === 'admin' ? 'dashboard' : 'invoice';
  });

  // Central access control helper
  const canAccessTab = (tab: TabType, user: User | null): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (tab === 'ticket') return true;
    if (tab === 'dashboard' || tab === 'reports' || tab === 'employees') return false;
    return user.permissions?.includes(tab) ?? false;
  };

  // Enforce security boundaries whenever activeTab or currentUser changes
  useEffect(() => {
    if (currentUser && !canAccessTab(activeTab, currentUser)) {
      const candidateTabs: TabType[] = ['invoice', 'invoices', 'visas', 'clients', 'prices'];
      const fallback = candidateTabs.find(t => currentUser.permissions?.includes(t)) || 'invoice';
      setActiveTab(fallback);
    }
  }, [currentUser, activeTab]);

  // Database States
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CLIENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INVOICES;
  });

  const [visaCatalog, setVisaCatalog] = useState<VisaCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISA_CATALOG);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VISA_CATALOG;
  });

  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISAS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VISA_APPLICATIONS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SERVICES;
  });

  // Temporary item pre-fill for InvoiceCreateView
  const [stagedInvoiceItems, setStagedInvoiceItems] = useState<InvoiceItem[]>([]);
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Synchronize HTML attributes when language changes
  useEffect(() => {
    const isRtl = lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  }, [lang]);

  // Persist Data States to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch {}
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VISA_CATALOG, JSON.stringify(visaCatalog));
    } catch {}
  }, [visaCatalog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VISAS, JSON.stringify(visaApplications));
    } catch {}
  }, [visaApplications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  // Next Invoice Sequence
  const nextInvoiceSeq = invoices.length + 1;

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ username: user.username, password: user.password }));
    } catch {}

    if (user.role === 'admin') {
      setActiveTab('dashboard');
    } else {
      const candidateTabs: TabType[] = ['invoice', 'invoices', 'visas', 'clients', 'prices'];
      const fallback = candidateTabs.find(t => user.permissions?.includes(t)) || 'invoice';
      setActiveTab(fallback);
    }

    showToast(`${getTranslation(lang, 'loginTitle')}: ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Déconnexion réussie');
  };

  const handleSaveInvoice = (newInv: Invoice, newClient?: Client) => {
    setInvoices(prev => [newInv, ...prev]);
    if (newClient) {
      setClients(prev => [newClient, ...prev]);
    }
    setStagedInvoiceItems([]);
    setViewingInvoiceId(newInv.id);
    setActiveTab('ticket');
    showToast(getTranslation(lang, 'toastSaved'));
  };

  const handleViewInvoice = (invId: string) => {
    setViewingInvoiceId(invId);
    setActiveTab('ticket');
  };

  const handleDeleteInvoice = (invId: string) => {
    setInvoices(prev => prev.filter(i => i.id !== invId));
    showToast(getTranslation(lang, 'toastDeleted'));
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
    showToast(getTranslation(lang, 'toastSaved'));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    showToast(getTranslation(lang, 'toastDeleted'));
  };

  const handleSaveCatalogItem = (item: VisaCatalogItem) => {
    setVisaCatalog(prev => {
      const idx = prev.findIndex(v => v.id === item.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
    showToast(getTranslation(lang, 'toastSaved'));
  };

  const handleDeleteCatalogItem = (id: string) => {
    setVisaCatalog(prev => prev.filter(v => v.id !== id));
    showToast(getTranslation(lang, 'toastDeleted'));
  };

  const handleSubmitVisaApplication = (newApp: VisaApplication) => {
    setVisaApplications(prev => [newApp, ...prev]);

    // Check if client is already in CRM; if not, add automatically
    const existingClient = clients.find(c => c.passport === newApp.passport || c.name === newApp.clientName);
    if (!existingClient) {
      const autoClient: Client = {
        id: `cl-${Date.now()}`,
        name: newApp.clientName,
        phone: newApp.phone,
        nat: newApp.nat,
        passport: newApp.passport,
        createdAt: Date.now()
      };
      setClients(prev => [autoClient, ...prev]);
    }

    showToast(getTranslation(lang, 'toastSaved') + ` (${newApp.id})`);
  };

  const handleUpdateAppStatus = (appId: string, status: VisaAppStatus, notes: string) => {
    setVisaApplications(prev => prev.map(a => {
      if (a.id !== appId) return a;
      return { ...a, status, notes };
    }));
    showToast(getTranslation(lang, 'toastUpdated'));
  };

  const handleDeleteApplication = (id: string) => {
    setVisaApplications(prev => prev.filter(a => a.id !== id));
    showToast(getTranslation(lang, 'toastDeleted'));
  };

  const handleConvertVisaToInvoice = (app: VisaApplication) => {
    setStagedInvoiceItems([{
      id: `it-${Date.now()}`,
      label: {
        ar: `طلب تأشيرة ${app.country} (${app.type}) - للمسافر: ${app.clientName} [الجواز: ${app.passport}]`,
        fr: `Demande de Visa ${app.country} (${app.type}) - Passager : ${app.clientName} [Passeport: ${app.passport}]`,
        en: `Visa Application ${app.country} (${app.type}) - Passenger: ${app.clientName} [Passport: ${app.passport}]`
      },
      qty: 1,
      fcfa: app.totalFcfa
    }]);
    setActiveTab('invoice');
    showToast(getTranslation(lang, 'convertToInvoiceBtn'));
  };

  const handleSaveService = (index: number | null, service: ServiceItem) => {
    setServices(prev => {
      if (index !== null && prev[index]) {
        const next = [...prev];
        next[index] = service;
        return next;
      }
      return [...prev, service];
    });
    showToast(getTranslation(lang, 'toastSaved'));
  };

  const handleDeleteService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
    showToast(getTranslation(lang, 'toastDeleted'));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    showToast(getTranslation(lang, 'toastSaved'));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(getTranslation(lang, 'toastUpdated'));
  };

  const handleUpdatePassword = (userId: string, newPass: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPass } : null);
    }
    showToast(getTranslation(lang, 'toastSaved'));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      } catch {}
    }
    showToast(getTranslation(lang, 'toastDeleted'));
  };

  const handleExportBackup = () => {
    const backupData = {
      agency: AGENCY_CONFIG,
      clients,
      invoices,
      visaCatalog,
      visaApplications,
      services,
      users,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `siriter_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(getTranslation(lang, 'toastBackupExported'));
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.invoices && Array.isArray(parsed.invoices)) {
          setInvoices(parsed.invoices);
        }
        if (parsed.clients && Array.isArray(parsed.clients)) {
          setClients(parsed.clients);
        }
        if (parsed.visaCatalog && Array.isArray(parsed.visaCatalog)) {
          setVisaCatalog(parsed.visaCatalog);
        }
        if (parsed.visaApplications && Array.isArray(parsed.visaApplications)) {
          setVisaApplications(parsed.visaApplications);
        }
        if (parsed.services && Array.isArray(parsed.services)) {
          setServices(parsed.services);
        }
        if (parsed.users && Array.isArray(parsed.users)) {
          setUsers(parsed.users);
        }
        showToast(getTranslation(lang, 'toastBackupImported'));
      } catch (err) {
        showToast(lang === 'ar' ? 'ملف النسخة الاحتياطية غير صالح' : 'Fichier de sauvegarde non valide');
      }
    };
    reader.readAsText(file);
  };

  // If user is not logged in, show Login Screen
  if (!currentUser) {
    return (
      <LoginModal
        lang={lang}
        onLanguageChange={setLang}
        users={users}
        onLoginSuccess={handleLogin}
      />
    );
  }

  const selectedInvoice = viewingInvoiceId ? invoices.find(i => i.id === viewingInvoiceId) || null : null;
  const selectedInvoiceClient = selectedInvoice ? clients.find(c => c.id === selectedInvoice.clientId) || null : null;

  return (
    <div className="min-h-screen bg-[#F6F1E6] text-[#22303A] flex flex-col selection:bg-[#C99A3E] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onChangeOwnPassword={(newPass) => handleUpdatePassword(currentUser.id, newPass)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            lang={lang}
            currentUser={currentUser}
            invoices={invoices}
            visas={visaApplications}
            clients={clients}
            nextInvoiceSeq={nextInvoiceSeq}
            onNavigate={setActiveTab}
            onViewInvoice={handleViewInvoice}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {activeTab === 'visas' && (
          <VisasView
            lang={lang}
            currentUser={currentUser}
            visaCatalog={visaCatalog}
            visaApplications={visaApplications}
            clients={clients}
            onSaveCatalogItem={handleSaveCatalogItem}
            onDeleteCatalogItem={handleDeleteCatalogItem}
            onSubmitApplication={handleSubmitVisaApplication}
            onUpdateAppStatus={handleUpdateAppStatus}
            onDeleteApplication={handleDeleteApplication}
            onConvertToInvoice={handleConvertVisaToInvoice}
          />
        )}

        {activeTab === 'invoice' && (
          <InvoiceCreateView
            lang={lang}
            clients={clients}
            services={services}
            visaCatalog={visaCatalog}
            nextInvoiceSeq={nextInvoiceSeq}
            initialItems={stagedInvoiceItems}
            onSaveInvoice={handleSaveInvoice}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesListView
            lang={lang}
            currentUser={currentUser}
            invoices={invoices}
            onViewInvoice={handleViewInvoice}
            onDeleteInvoice={handleDeleteInvoice}
          />
        )}

        {activeTab === 'ticket' && (
          <InvoicePrintDoc
            lang={lang}
            invoice={selectedInvoice}
            client={selectedInvoiceClient}
            onBack={() => setActiveTab('invoices')}
            onToggleDocLang={setLang}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView
            lang={lang}
            currentUser={currentUser}
            clients={clients}
            invoices={invoices}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
          />
        )}

        {activeTab === 'prices' && (
          <PricesView
            lang={lang}
            currentUser={currentUser}
            services={services}
            onSaveService={handleSaveService}
            onDeleteService={handleDeleteService}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            lang={lang}
            currentUser={currentUser}
            invoices={invoices}
            onViewInvoice={handleViewInvoice}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            lang={lang}
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onUpdatePassword={handleUpdatePassword}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 bg-[#0B1E3F] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl border border-[#C99A3E]/40 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#C99A3E] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
