import { AgencyInfo, Client, Invoice, ServiceItem, User, VisaApplication, VisaCatalogItem } from '../types';

export const AGENCY_CONFIG: AgencyInfo = {
  nameAr: "وكالة سيرتر للسفر والسياحة",
  nameFr: "SIRITER Agence de Voyage & Tourisme",
  nameEn: "SIRITER Travel & Tourism Agency",
  subAr: "أنجمينا - جمهورية تشاد | خدمات السفر والتأشيرات المعتمدة",
  subFr: "N'Djaména - Tchad | Services de voyage et visas agréés",
  subEn: "N'Djamena - Chad | Certified Travel and Visa Services",
  addr1Ar: "مرجان دفاك – عمارة البنك الزراعي",
  addr1Fr: "Mardjan Daffack – Immeuble Banque Agricole",
  addr2Ar: "التجاري مبنى BCC القديم – الطابق الأول",
  addr2Fr: "Commercial ancien BCC – 1er étage",
  phone: "+235 68 56 77 77 / +235 96 56 77 77",
  whatsapp: "+23568567777",
  email: "agencesiriter@gmail.com"
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    cat: { ar: "خدمات السفر والحجوزات", fr: "Voyage et réservations", en: "Travel & Bookings" },
    name: { ar: "حجز وإصدار تذاكر الطيران الدولية", fr: "Émission de billets d'avion internationaux", en: "International Flight Ticket Issuance" },
    fcfa: null,
    neg: true
  },
  {
    cat: { ar: "الإقامة والعمل في تشاد", fr: "Résidence et travail au Tchad", en: "Chadian Residence & Work" },
    name: { ar: "بطاقة العمل وحل الإقامة (ONAPE)", fr: "Carte de travail et régularisation (ONAPE)", en: "Work permit & ONAPE card" },
    fcfa: 600000
  },
  {
    cat: { ar: "الإقامة والعمل في تشاد", fr: "Résidence et travail au Tchad", en: "Chadian Residence & Work" },
    name: { ar: "معاملات الهجرة وتجديد الإقامة السنوية", fr: "Immigration et renouvellement de résidence", en: "Immigration & Annual Residence Renewal" },
    fcfa: 230000
  },
  {
    cat: { ar: "الفيزا الإلكترونية التشادية", fr: "E-Visa Tchad", en: "Chadian E-Visa" },
    name: { ar: "تأشيرة دخول تشاد (أسبوعين)", fr: "Visa d'entrée Tchad (2 semaines)", en: "Chad Entry Visa (2 weeks)" },
    fcfa: 110000
  },
  {
    cat: { ar: "الفيزا الإلكترونية التشادية", fr: "E-Visa Tchad", en: "Chadian E-Visa" },
    name: { ar: "تأشيرة دخول تشاد (شهر كامل)", fr: "Visa d'entrée Tchad (1 mois)", en: "Chad Entry Visa (1 month)" },
    fcfa: 150000
  },
  {
    cat: { ar: "الفيزا الإلكترونية التشادية", fr: "E-Visa Tchad", en: "Chadian E-Visa" },
    name: { ar: "تأشيرة دخول تشاد (3 أشهر متعددة)", fr: "Visa d'entrée Tchad (3 mois multiples)", en: "Chad Entry Visa (3 months multiple)" },
    fcfa: 200000
  },
  {
    cat: { ar: "التأشيرات الدولية", fr: "Visas internationaux", en: "International Visas" },
    name: { ar: "تأشيرة فرنسا وأوروبا (شنغن)", fr: "Visa France et Europe (Schengen)", en: "France & Europe Schengen Visa" },
    fcfa: 150000
  },
  {
    cat: { ar: "التأشيرات الدولية", fr: "Visas internationaux", en: "International Visas" },
    name: { ar: "تأشيرة دبي والإمارات (شهر / شهرين)", fr: "Visa Dubaï & E.A.U (1 à 2 mois)", en: "Dubai & UAE Visa (1-2 months)" },
    fcfa: 80000
  },
  {
    cat: { ar: "التأشيرات الدولية", fr: "Visas internationaux", en: "International Visas" },
    name: { ar: "تأشيرة السعودية (عمرة وزيارة وسياحة)", fr: "Visa Arabie Saoudite (Omra & Tourisme)", en: "Saudi Arabia Visa (Umrah & Tourism)" },
    fcfa: 110000
  },
  {
    cat: { ar: "التأشيرات الدولية", fr: "Visas internationaux", en: "International Visas" },
    name: { ar: "تأشيرة مصر السياحية والعلاجية", fr: "Visa Égypte (Tourisme & Soins)", en: "Egypt Visa (Tourism & Medical)" },
    fcfa: 55000
  },
  {
    cat: { ar: "خدمات الضيافة والفنادق", fr: "Hôtels et hébergement", en: "Hotels & Accommodation" },
    name: { ar: "حجز فندق معتمد ومؤكد للسفارة", fr: "Réservation d'hôtel confirmée pour ambassade", en: "Confirmed Hotel Booking for Embassy" },
    fcfa: 15000
  },
  {
    cat: { ar: "خدمات الضيافة والفنادق", fr: "Hôtels et hébergement", en: "Hotels & Accommodation" },
    name: { ar: "دعوات واستقبال كبار الشخصيات من المطار", fr: "Lettres d'invitation et accueil aéroport VIP", en: "Invitations & VIP Airport Reception" },
    fcfa: 25000
  }
];

export const INITIAL_VISA_CATALOG: VisaCatalogItem[] = [
  {
    id: "v-france",
    country: { ar: "فرنسا وأوروبا", fr: "France & Schengen", en: "France & Schengen" },
    flag: "🇫🇷",
    type: { ar: "سياحية شنغن (C)", fr: "Touristique Schengen (C)", en: "Tourist Schengen (C)" },
    validity: { ar: "90 يوماً / سنة", fr: "90 jours / 1 an", en: "90 days / 1 year" },
    stay: { ar: "30 إلى 90 يوماً", fr: "30 à 90 jours", en: "30 to 90 days" },
    embassyFee: 65000,
    agencyFee: 85000,
    totalFcfa: 150000,
    processingTime: { ar: "10 - 15 يوم عمل", fr: "10 - 15 jours ouvrables", en: "10 - 15 working days" },
    status: "available",
    docs: {
      ar: "جواز سفر ساري لأكثر من 6 أشهر، صورتين شخصيتين خلفية بيضاء، كشف حساب بنكي لآخر 3 أشهر، حجز طيران وفندق مبدئي، تأمين سفر دولي.",
      fr: "Passeport valide > 6 mois, 2 photos fond blanc, relevé bancaire des 3 derniers mois, réservation vol/hôtel, assurance voyage internationale.",
      en: "Passport valid > 6 months, 2 white background photos, 3 months bank statement, flight & hotel booking, travel insurance."
    },
    notes: {
      ar: "تشمل حجز الموعد وتعبئة الاستمارة وتجهيز الملف بالكامل",
      fr: "Comprend la prise de rendez-vous, le formulaire et le dossier complet",
      en: "Includes appointment booking, form completion and file preparation"
    }
  },
  {
    id: "v-canada",
    country: { ar: "كندا", fr: "Canada", en: "Canada" },
    flag: "🇨🇦",
    type: { ar: "سياحية / زيارة (V-1)", fr: "Visiteur / Tourisme (V-1)", en: "Visitor / Tourist (V-1)" },
    validity: { ar: "حتى نهاية صلاحية الجواز", fr: "Jusqu'à expiration du passeport", en: "Up to passport expiry" },
    stay: { ar: "حتى 6 أشهر لكل دخول", fr: "Jusqu'à 6 mois par séjour", en: "Up to 6 months per entry" },
    embassyFee: 95000,
    agencyFee: 125000,
    totalFcfa: 220000,
    processingTime: { ar: "30 - 45 يوم عمل", fr: "30 - 45 jours ouvrables", en: "30 - 45 working days" },
    status: "available",
    docs: {
      ar: "جواز سفر ساري، كشف حساب قوي، إثبات وظيفة أو سجل تجاري، أوراق الروابط الأسرية والمالية، بصمة بيومترية.",
      fr: "Passeport valide, relevé bancaire solide, attestation d'emploi ou registre de commerce, justificatifs d'attaches, biométrie.",
      en: "Valid passport, solid bank statement, employment or commercial registry, ties proof, biometrics."
    },
    notes: {
      ar: "تقديم إلكتروني رسمي عبر بوابة الهجرة الكندية IRCC",
      fr: "Soumission officielle en ligne via le portail IRCC Canada",
      en: "Official online submission via Canada IRCC portal"
    }
  },
  {
    id: "v-uk",
    country: { ar: "بريطانيا والمملكة المتحدة", fr: "Royaume-Uni (UK)", en: "United Kingdom (UK)" },
    flag: "🇬🇧",
    type: { ar: "سياحة وزيارة عائلية", fr: "Tourisme & Visite", en: "Standard Visitor" },
    validity: { ar: "6 أشهر متعددة", fr: "6 mois multiples", en: "6 months multiple" },
    stay: { ar: "حتى 180 يوماً", fr: "Jusqu'à 180 jours", en: "Up to 180 days" },
    embassyFee: 85000,
    agencyFee: 95000,
    totalFcfa: 180000,
    processingTime: { ar: "15 - 20 يوم عمل", fr: "15 - 20 jours ouvrables", en: "15 - 20 working days" },
    status: "available",
    docs: {
      ar: "جواز سفر ساري، إثبات مالي ودخل شهري، تعريف راتب مترجم للإنجليزية، حجز فندقي مبدئي ومسار الرحلة.",
      fr: "Passeport valide, justificatifs financiers, attestation de salaire traduite en anglais, réservation hôtel et itinéraire.",
      en: "Valid passport, financial proof, salary slip in English, hotel reservation and itinerary."
    }
  },
  {
    id: "v-usa",
    country: { ar: "الولايات المتحدة الأمريكية", fr: "États-Unis (USA)", en: "United States (USA)" },
    flag: "🇺🇸",
    type: { ar: "سياحة وعلاج وتجارة (B1/B2)", fr: "Tourisme / Affaires (B1/B2)", en: "Tourism / Business (B1/B2)" },
    validity: { ar: "سنة إلى 5 سنوات", fr: "1 à 5 ans", en: "1 to 5 years" },
    stay: { ar: "6 أشهر لكل رحلة", fr: "6 mois par séjour", en: "6 months per trip" },
    embassyFee: 120000,
    agencyFee: 100000,
    totalFcfa: 220000,
    processingTime: { ar: "حسب موعد السفارة المتاح", fr: "Selon disponibilité rendez-vous", en: "Based on interview slot" },
    status: "available",
    docs: {
      ar: "تعبئة نموذج DS-160، سداد الرسوم وحجز الموعد بالسفارة، جواز سفر، مستندات الدعم المالي والوظيفي.",
      fr: "Formulaire DS-160, paiement frais et rendez-vous ambassade, passeport, justificatifs d'emploi et finances.",
      en: "DS-160 form, fee payment and interview appointment, passport, financial and employment proofs."
    }
  },
  {
    id: "v-uae",
    country: { ar: "الإمارات ودبي", fr: "Émirats Arabes Unis (Dubaï)", en: "United Arab Emirates (Dubai)" },
    flag: "🇦🇪",
    type: { ar: "سياحية إلكترونية فورية", fr: "E-Visa Touristique", en: "Instant E-Tourist Visa" },
    validity: { ar: "60 يوماً لدخول الدولة", fr: "60 jours pour entrer", en: "60 days to enter" },
    stay: { ar: "30 يوماً أو 60 يوماً", fr: "30 ou 60 jours", en: "30 or 60 days" },
    embassyFee: 45000,
    agencyFee: 35000,
    totalFcfa: 80000,
    processingTime: { ar: "24 - 72 ساعة", fr: "24 - 72 heures", en: "24 - 72 hours" },
    status: "available",
    docs: {
      ar: "صورة واضحة ملونة من جواز السفر (ساري 6 أشهر)، صورة شخصية بخلفية بيضاء.",
      fr: "Copie couleur passeport (valide > 6 mois), photo d'identité fond blanc.",
      en: "Clear passport color copy (> 6 months validity), white background photo."
    },
    notes: {
      ar: "إصدار إلكتروني مباشر وتأكيد فوري",
      fr: "Émission électronique rapide et directe",
      en: "Direct electronic issue with immediate confirmation"
    }
  },
  {
    id: "v-saudi",
    country: { ar: "المملكة العربية السعودية", fr: "Arabie Saoudite", en: "Saudi Arabia" },
    flag: "🇸🇦",
    type: { ar: "تأشيرة عمرة وزيارة وسياحة", fr: "Omra, Visite et Tourisme", en: "Umrah, Visit & Tourism" },
    validity: { ar: "سنة كاملة (متعددة الدخول)", fr: "1 an (entrées multiples)", en: "1 full year (multiple entries)" },
    stay: { ar: "90 يوماً في المملكة", fr: "90 jours sur place", en: "90 days stay" },
    embassyFee: 65000,
    agencyFee: 45000,
    totalFcfa: 110000,
    processingTime: { ar: "24 - 48 ساعة", fr: "24 - 48 heures", en: "24 - 48 hours" },
    status: "available",
    docs: {
      ar: "جواز سفر ساري المفعول، صورة شخصية، تأمين صحي إلكتروني شامل.",
      fr: "Passeport valide, photo d'identité, assurance santé électronique incluse.",
      en: "Valid passport, personal photo, comprehensive health insurance included."
    }
  },
  {
    id: "v-turkey",
    country: { ar: "تركيا", fr: "Turquie", en: "Turkey" },
    flag: "🇹🇷",
    type: { ar: "سياحة وتجارة وعلاج", fr: "Tourisme & Affaires", en: "Tourism & Business" },
    validity: { ar: "180 يوماً", fr: "180 jours", en: "180 days" },
    stay: { ar: "30 إلى 90 يوماً", fr: "30 à 90 jours", en: "30 to 90 days" },
    embassyFee: 55000,
    agencyFee: 45000,
    totalFcfa: 100000,
    processingTime: { ar: "7 - 10 أيام عمل", fr: "7 - 10 jours ouvrables", en: "7 - 10 working days" },
    status: "available",
    docs: {
      ar: "جواز سفر، كشف حساب بنكي، حجز طيران وفندق، تأمين سفر، أو تأشيرة إلكترونية لحاملي الشنغن/أمريكا.",
      fr: "Passeport, relevé bancaire, réservation vol et hôtel, assurance voyage ou e-visa si visa Schengen/USA valide.",
      en: "Passport, bank statement, flight and hotel reservation, travel insurance or e-visa if holding Schengen/US visa."
    }
  },
  {
    id: "v-egypt",
    country: { ar: "جمهورية مصر العربية", fr: "Égypte", en: "Egypt" },
    flag: "🇪🇬",
    type: { ar: "سياحية وموافقة أمنية سريعة", fr: "Tourisme & Approbation rapide", en: "Tourist & Fast Clearance" },
    validity: { ar: "3 أشهر", fr: "3 mois", en: "3 months" },
    stay: { ar: "30 يوماً", fr: "30 jours", en: "30 days" },
    embassyFee: 30000,
    agencyFee: 25000,
    totalFcfa: 55000,
    processingTime: { ar: "3 - 5 أيام عمل", fr: "3 - 5 jours ouvrables", en: "3 - 5 working days" },
    status: "available",
    docs: {
      ar: "جواز سفر ساري، صورة شخصية، إدراج ضمن الموافقة الأمنية السريعة لوكالة سيرتر.",
      fr: "Passeport valide, photo d'identité, enregistrement approbation sécuritaire express.",
      en: "Valid passport, personal photo, registration under fast clearance approval."
    }
  },
  {
    id: "v-chad",
    country: { ar: "تشاد (الإقامة وبطاقة العمل)", fr: "Tchad (Résidence & ONAPE)", en: "Chad (Residence & ONAPE)" },
    flag: "🇹🇩",
    type: { ar: "إقامة نظامية وبطاقة حل عمل", fr: "Carte ONAPE & Résidence officielle", en: "ONAPE Work Permit & Official Residence" },
    validity: { ar: "سنة كاملة قابلة للتجديد", fr: "1 an renouvelable", en: "1 year renewable" },
    stay: { ar: "سنة كاملة", fr: "1 an complet", en: "1 full year" },
    embassyFee: 450000,
    agencyFee: 150000,
    totalFcfa: 600000,
    processingTime: { ar: "7 - 14 يوم عمل", fr: "7 - 14 jours ouvrables", en: "7 - 14 working days" },
    status: "available",
    docs: {
      ar: "عقد عمل رسمي، جواز سفر ساري، فحص طبي، صور شخصية، سجل سوابق عدلية.",
      fr: "Contrat de travail, passeport valide, visite médicale, photos d'identité, casier judiciaire.",
      en: "Official work contract, valid passport, medical check, ID photos, criminal record certificate."
    }
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cl-1",
    name: "أحمد عبد الله المنصور",
    phone: "+235 68 56 77 77",
    nat: "تشادي",
    passport: "K98765432",
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: "cl-2",
    name: "سليمان يوسف حسن",
    phone: "+235 96 56 77 77",
    nat: "تشادي",
    passport: "T12345678",
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: "cl-3",
    name: "مريم إبراهيم داود",
    phone: "+235 62 15 08 12",
    nat: "تشادية",
    passport: "P45678912",
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: "cl-4",
    name: "عمر فاروق البشير",
    phone: "+235 66 52 50 65",
    nat: "سوداني",
    passport: "S99887766",
    createdAt: Date.now() - 86400000 * 3
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1001",
    number: "INV-0001",
    date: "10/09/2026",
    createdAt: Date.now() - 86400000 * 8,
    clientId: "cl-1",
    clientName: "أحمد عبد الله المنصور",
    items: [
      {
        id: "item-1",
        label: {
          ar: "تأشيرة فرنسا وأوروبا (شنغن) - شاملة الحجز والتأمين",
          fr: "Visa France et Europe (Schengen) - avec réservation et assurance",
          en: "France & Europe Schengen Visa - including booking and insurance"
        },
        qty: 1,
        fcfa: 150000
      }
    ],
    subFcfa: 150000,
    discFcfa: 5000,
    grandFcfa: 145000,
    status: "paid"
  },
  {
    id: "inv-1002",
    number: "INV-0002",
    date: "14/09/2026",
    createdAt: Date.now() - 86400000 * 4,
    clientId: "cl-2",
    clientName: "سليمان يوسف حسن",
    items: [
      {
        id: "item-2",
        label: {
          ar: "تأشيرة دبي والإمارات (شهرين) للمسافر سليمان يوسف",
          fr: "Visa Dubaï & E.A.U (2 mois) pour Souleymane Youssouf",
          en: "Dubai & UAE Visa (2 months) for Souleymane Youssouf"
        },
        qty: 1,
        fcfa: 80000
      },
      {
        id: "item-3",
        label: {
          ar: "حجز فندق معتمد في دبي (5 ليالي)",
          fr: "Réservation hôtel agréé à Dubaï (5 nuits)",
          en: "Approved hotel reservation in Dubai (5 nights)"
        },
        qty: 1,
        fcfa: 15000
      }
    ],
    subFcfa: 95000,
    discFcfa: 0,
    grandFcfa: 95000,
    status: "paid"
  },
  {
    id: "inv-1003",
    number: "INV-0003",
    date: "16/09/2026",
    createdAt: Date.now() - 86400000 * 2,
    clientId: "cl-3",
    clientName: "مريم إبراهيم داود",
    items: [
      {
        id: "item-4",
        label: {
          ar: "تأشيرة المملكة العربية السعودية (عمرة وسياحة لمدة سنة)",
          fr: "Visa Arabie Saoudite (Omra & Tourisme 1 an)",
          en: "Saudi Arabia Visa (Umrah & Tourism 1 year)"
        },
        qty: 1,
        fcfa: 110000
      }
    ],
    subFcfa: 110000,
    discFcfa: 10000,
    grandFcfa: 100000,
    status: "paid"
  }
];

export const INITIAL_VISA_APPLICATIONS: VisaApplication[] = [
  {
    id: "VISA-1001",
    clientName: "أحمد عبد الله المنصور",
    phone: "+235 68 56 77 77",
    passport: "K98765432",
    nat: "تشادي",
    dob: "1990-05-15",
    visaId: "v-france",
    country: "فرنسا وأوروبا",
    type: "سياحية شنغن (C)",
    travelDate: "2026-10-15",
    totalFcfa: 150000,
    paidFcfa: 150000,
    remainingFcfa: 0,
    status: "processing",
    notes: "تم تجهيز الملف وإيداعه في مركز التأشيرات وننتظر إشعار الاستلام",
    createdAt: "2026-09-10"
  },
  {
    id: "VISA-1002",
    clientName: "سليمان يوسف حسن",
    phone: "+235 96 56 77 77",
    passport: "T12345678",
    nat: "تشادي",
    dob: "1988-10-20",
    visaId: "v-uae",
    country: "الإمارات ودبي",
    type: "سياحية إلكترونية فورية",
    travelDate: "2026-09-28",
    totalFcfa: 80000,
    paidFcfa: 80000,
    remainingFcfa: 0,
    status: "approved",
    notes: "صدرت التأشيرة الإلكترونية وجاهزة للإرسال والتسليم للعميل",
    createdAt: "2026-09-12"
  },
  {
    id: "VISA-1003",
    clientName: "مريم إبراهيم داود",
    phone: "+235 62 15 08 12",
    passport: "P45678912",
    nat: "تشادية",
    dob: "1995-03-12",
    visaId: "v-saudi",
    country: "المملكة العربية السعودية",
    type: "تأشيرة عمرة وزيارة وسياحة",
    travelDate: "2026-10-01",
    totalFcfa: 110000,
    paidFcfa: 100000,
    remainingFcfa: 10000,
    status: "ready",
    notes: "تمت الموافقة وصدور وثيقة التأشيرة والتأمين الصحي، بانتظار استلام الجواز",
    createdAt: "2026-09-15"
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin",
    name: "moneb",
    username: "moneb",
    password: "249",
    role: "admin",
    permissions: [
      'dashboard', 'invoice', 'invoices',
      'ticket', 'clients', 'prices', 'reports', 'employees', 'visas'
    ]
  },
  {
    id: "usr-fox",
    name: "fox",
    username: "fox",
    password: "249",
    role: "staff",
    permissions: ['dashboard', 'invoice', 'invoices', 'clients', 'prices']
  },
  {
    id: "usr-staff-1",
    name: "أحمد",
    username: "ahmed",
    password: "123",
    role: "staff",
    permissions: ['dashboard', 'invoice', 'invoices', 'clients']
  }
];
