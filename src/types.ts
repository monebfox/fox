export type Language = 'ar' | 'fr' | 'en';

export type TabType = 
  | 'dashboard' 
  | 'invoice' 
  | 'invoices' 
  | 'ticket' 
  | 'clients' 
  | 'prices' 
  | 'reports' 
  | 'employees'
  | 'visas';

export interface LocalizedString {
  ar: string;
  fr: string;
  en: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  nat: string;
  passport: string;
  createdAt?: number;
}

export interface InvoiceItem {
  id: string;
  serviceIdx?: string;
  label: LocalizedString | string;
  qty: number;
  fcfa: number;
  customLabel?: LocalizedString | string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  createdAt: number;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  subFcfa: number;
  discFcfa: number;
  grandFcfa: number;
  status?: 'paid' | 'pending' | 'partial';
}

export type VisaStatus = 'available' | 'soon' | 'unavailable' | 'paused';

export interface VisaCatalogItem {
  id: string;
  country: LocalizedString;
  flag: string;
  type: LocalizedString;
  validity: LocalizedString;
  stay: LocalizedString;
  embassyFee: number;
  agencyFee: number;
  totalFcfa: number;
  processingTime: LocalizedString;
  status: VisaStatus;
  docs: LocalizedString;
  notes?: LocalizedString;
}

export type VisaAppStatus = 
  | 'new' 
  | 'review' 
  | 'processing' 
  | 'ready' 
  | 'approved' 
  | 'rejected' 
  | 'completed';

export interface VisaApplication {
  id: string;
  clientName: string;
  phone: string;
  passport: string;
  nat: string;
  dob?: string;
  visaId: string;
  country: string;
  type: string;
  travelDate: string;
  totalFcfa: number;
  paidFcfa: number;
  remainingFcfa: number;
  status: VisaAppStatus;
  notes: string;
  createdAt: string;
}

export interface ServiceItem {
  id?: string;
  cat: LocalizedString;
  name: LocalizedString;
  fcfa: number | null;
  neg?: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'staff';
  permissions: TabType[];
}

export interface AgencyInfo {
  nameAr: string;
  nameFr: string;
  nameEn: string;
  subAr: string;
  subFr: string;
  subEn: string;
  addr1Ar: string;
  addr1Fr: string;
  addr2Ar: string;
  addr2Fr: string;
  phone: string;
  whatsapp: string;
  email: string;
}
