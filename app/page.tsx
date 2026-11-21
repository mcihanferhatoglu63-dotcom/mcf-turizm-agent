"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  Send,
  Plus,
  CheckCircle2,
  Calendar,
  X,
  Phone,
  User,
  Ticket,
  Sparkles,
  PackagePlus,
  LogOut,
  Lock,
  KeyRound,
  Trash2,
  UserPlus,
  Building,
  Network,
  Menu,
  Crown,
  AlertTriangle,
  ArrowUpRight,
  CornerDownRight,
  Copy,
  Check,
  Palmtree,
  Pencil,
  ImagePlus,
  Clock,
  Baby,
  Database,
  Printer,
  Download,
  Ban,
  CalendarCog,
  Wallet,
  RefreshCw,
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "SUB_AGENT";
type PlanType = "Trial" | "Basic" | "Pro";
type ActiveTab = "dashboard" | "tenants" | "hierarchy" | "bookings";
type PaymentStatus = "Ödendi" | "Kapora Alındı" | "Acente Cari";
type BookingStatus = "Onaylandı" | "İptal Edildi";

interface TenantAgency {
  id: string;
  name: string;
  plan: PlanType;
  revenue: string;
  status: "Aktif" | "Deneme";
  editCount: number;
  expiresAt: string;
  checkInTime: string;
  checkOutTime: string;
  currency: "₺" | "$" | "€";
}

interface UserAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  tenantId: string | null;
  tenantName: string;
  subAgentCode?: string;
}

interface InventoryItem {
  id: string;
  tenantId: string;
  tenantName: string;
  category: string;
  title: string;
  quota: number;
  netPrice: number;
  sellPrice: number;
  commission: number;
  imageSrc?: string;
  bookedDates?: string[];
}

interface BookingItem {
  pnr: string;
  tenantId: string;
  tenantName: string;
  agentUsername: string;
  agentName: string;
  customerName: string;
  guestNames: string[];
  freeChildCount: number;
  freeChildNames: string[];
  discountedChildCount: number;
  discountedChildNames: string[];
  customerPhone: string;
  itemTitle: string;
  pax: number;
  startDate: string;
  endDate: string;
  chargedDays: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  commissionEarned: number;
  status: BookingStatus;
  createdAt?: string;
}

interface PlanSpec {
  monthlyAmount: number;
  priceLabel: string;
  periodLabel: string;
  badgeClass: string;
  cardBorder: string;
  maxInventory: number;
  maxSubAgents: number;
  maxEdits: number;
  summary: string;
  features: string[];
}

interface CalendarDayItem {
  iso: string;
  dayNum: number;
  weekday: string;
  monthShort: string;
}

interface PersistedState {
  tenants: TenantAgency[];
  accounts: UserAccount[];
  inventory: InventoryItem[];
  bookings: BookingItem[];
  updatedAt?: string;
}

const STORAGE_KEY = "mcf_turizm_b2b_state_v1";
const DB_URL_STORAGE_KEY = "mcf_turizm_firebase_db_url";
const DEFAULT_ENV_DB_URL =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    ? process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL.trim()
    : "";

const PLAN_SPECS: Record<PlanType, PlanSpec> = {
  Trial: {
    monthlyAmount: 0,
    priceLabel: "14 Gün Ücretsiz",
    periodLabel: "Deneme",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    cardBorder: "border-amber-400/35",
    maxInventory: 2,
    maxSubAgents: 1,
    maxEdits: 14,
    summary: "14 günlük deneme • Resim ekleme, bilgi & fiyat düzenleme",
    features: [
      "14 gün ücretsiz kullanım süresi",
      "14 günlük deneme boyunca resim ekleme, bilgi ve fiyat düzenleme",
      "En fazla 2 aktif kontenjan ve 1 bağlı acente",
      "PNR üretimi ve WhatsApp voucher",
    ],
  },
  Basic: {
    monthlyAmount: 3000,
    priceLabel: "3.000 TL",
    periodLabel: "/ Aylık",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    cardBorder: "border-sky-400/40",
    maxInventory: 5,
    maxSubAgents: 3,
    maxEdits: 10,
    summary: "En fazla 10 düzenleme • Tur, otel, uçak resim & fiyat ayarı",
    features: [
      "En fazla 10 adet resim ekleme, bilgi ve fiyat düzenleme",
      "Tur, otel, uçak ve diğer hizmetlerde fiyat belirleme",
      "En fazla 5 aktif kontenjan ve 3 bağlı acente hesabı",
      "PNR kaydı ve dijital voucher gönderimi",
    ],
  },
  Pro: {
    monthlyAmount: 5000,
    priceLabel: "5.000 TL",
    periodLabel: "/ Aylık",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    cardBorder: "border-emerald-400/45",
    maxInventory: Infinity,
    maxSubAgents: Infinity,
    maxEdits: Infinity,
    summary: "Sınırsız düzenleme, resim ekleme ve fiyat belirleme",
    features: [
      "Sınırsız resim ekleme, bilgi ve fiyat düzenleme",
      "Tur, otel ve uçak ayarlarında tam kontrol",
      "Sınırsız kontenjan ve bağlı acente yönetimi",
      "Gelişmiş komisyon ve satış raporlama",
    ],
  },
};

const HOLIDAY_SHOWCASE = [
  {
    src: "/3.webp",
    title: "Turkuaz Koylar & Tekne Rotaları",
    accent: "from-cyan-950 via-sky-900 to-indigo-950",
  },
  {
    src: "/2.webp",
    title: "Kapadokya Balon & Bölge Turları",
    accent: "from-amber-950 via-orange-900 to-sky-950",
  },
  {
    src: "/1.webp",
    title: "Sonbahar Göl Kenarı Rotaları",
    accent: "from-orange-950 via-amber-900 to-stone-950",
  },
  {
    src: "/4.jpg",
    title: "Karlı Orman & Dağ Evi",
    accent: "from-slate-900 via-blue-950 to-indigo-950",
  },
  {
    src: "/5.png",
    title: "Taş Sokak Butik Konaklama",
    accent: "from-fuchsia-950 via-stone-900 to-amber-950",
  },
];

const IBAN_OWNER = "Mehmet Cihan Ferhatoğlu";
const IBAN_NUMBER = "TR11 0004 9044 8275 9750 06";

const FALLBACK_CALENDAR_DAYS: CalendarDayItem[] = Array.from({ length: 28 }, (_, idx) => {
  const dayNum = idx + 1;
  const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  return {
    iso: `2026-12-${String(dayNum).padStart(2, "0")}`,
    dayNum,
    weekday: weekdays[idx % 7],
    monthShort: "Ara",
  };
});

function formatIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysIso(daysFromNow: number, baseIso = "2026-11-21"): string {
  const dt = new Date(`${baseIso}T12:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + daysFromNow);
  return formatIsoDate(dt);
}

function calcRemainingDays(isoDate: string, refIso = "2026-11-21"): number {
  const target = new Date(`${isoDate}T12:00:00Z`).getTime();
  const now = new Date(`${refIso}T12:00:00Z`).getTime();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function buildUpcomingDays(count = 28, startIso = "2026-11-21"): CalendarDayItem[] {
  const base = new Date(`${startIso}T12:00:00Z`);
  const weekdays = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];

  const list: CalendarDayItem[] = [];
  for (let i = 0; i < count; i++) {
    const dt = new Date(base);
    dt.setUTCDate(base.getUTCDate() + i);
    list.push({
      iso: formatIsoDate(dt),
      dayNum: dt.getUTCDate(),
      weekday: weekdays[dt.getUTCDay()],
      monthShort: months[dt.getUTCMonth()],
    });
  }
  return list;
}

function normalizeFirebaseUrl(rawUrl: string): string {
  const cleaned = rawUrl.trim().replace(/\/+$/, "");
  if (!cleaned) return "";
  return `${cleaned}/turizm-b2b-saas.json`;
}

function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [imgError, setImgError] = useState(false);

  const dims =
    size === "lg"
      ? "w-20 h-14 sm:w-24 sm:h-16"
      : size === "sm"
      ? "w-11 h-7"
      : "w-14 h-10";

  if (imgError) {
    return (
      <div
        className={`${dims} rounded-xl bg-gradient-to-br from-purple-950 via-[#12162b] to-amber-950/60 border border-purple-400/40 flex flex-col items-center justify-center px-2 select-none shrink-0 shadow-inner`}
      >
        <span className="font-black tracking-tight text-xs sm:text-sm leading-none bg-gradient-to-r from-purple-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">
          MCF
        </span>
        {size !== "sm" && (
          <span className="text-[7px] font-bold tracking-widest text-amber-200/80 uppercase mt-0.5 leading-none">
            SOFTWARE
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="MCF Technology & Software Solutions"
      onError={() => setImgError(true)}
      className={`${dims} object-cover rounded-xl border border-purple-400/30 bg-[#080c16] select-none shrink-0`}
    />
  );
}

function ShowcaseImage({
  src,
  alt,
  fallbackGradient,
  className,
}: {
  src?: string;
  alt: string;
  fallbackGradient: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${
          className || ""
        }`}
      >
        <Palmtree className="w-7 h-7 text-white/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className || ""}`}
    />
  );
}

export default function TurizmSaaSPanel() {
  const [todayIso, setTodayIso] = useState<string>("2026-11-21");
  const [calendarDays, setCalendarDays] = useState<CalendarDayItem[]>(FALLBACK_CALENDAR_DAYS);

  const [firebaseDbUrl, setFirebaseDbUrl] = useState<string>(DEFAULT_ENV_DB_URL);
  const [dbUrlInput, setDbUrlInput] = useState<string>(DEFAULT_ENV_DB_URL);
  const [dbStatus, setDbStatus] = useState<"local" | "connected" | "syncing" | "error">("local");
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [hydrated, setHydrated] = useState<boolean>(false);

  const [tenants, setTenants] = useState<TenantAgency[]>([
    {
      id: "FIRM-AKDENIZ",
      name: "Akdeniz Turizm A.Ş.",
      plan: "Pro",
      revenue: "425.000 ₺",
      status: "Aktif",
      editCount: 0,
      expiresAt: addDaysIso(30),
      checkInTime: "12:00",
      checkOutTime: "10:00",
      currency: "₺",
    },
    {
      id: "FIRM-ERDEMLI",
      name: "Erdemli & Silifke Travel",
      plan: "Basic",
      revenue: "148.000 ₺",
      status: "Aktif",
      editCount: 2,
      expiresAt: addDaysIso(24),
      checkInTime: "12:00",
      checkOutTime: "10:00",
      currency: "₺",
    },
    {
      id: "FIRM-DEMO",
      name: "Mersin Demo Acente",
      plan: "Trial",
      revenue: "12.000 ₺",
      status: "Deneme",
      editCount: 0,
      expiresAt: addDaysIso(14),
      checkInTime: "12:00",
      checkOutTime: "10:00",
      currency: "₺",
    },
  ]);

  const [accounts, setAccounts] = useState<UserAccount[]>([
    {
      id: "usr-super",
      username: "superadmin",
      password: "123",
      fullName: "Mehmet Cihan",
      role: "SUPER_ADMIN",
      tenantId: null,
      tenantName: "MCF B2B Altyapı",
    },
    {
      id: "usr-akdeniz-owner",
      username: "akdeniz_ana",
      password: "123",
      fullName: "Hakan Kaya",
      role: "TENANT_ADMIN",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
    },
    {
      id: "usr-erdemli-owner",
      username: "erdemli_ana",
      password: "123",
      fullName: "Kemal Doğan",
      role: "TENANT_ADMIN",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
    },
    {
      id: "usr-demo-owner",
      username: "demo_ana",
      password: "123",
      fullName: "Ece Demir",
      role: "TENANT_ADMIN",
      tenantId: "FIRM-DEMO",
      tenantName: "Mersin Demo Acente",
    },
    {
      id: "usr-akdeniz-sub1",
      username: "akdeniz_alt1",
      password: "123",
      fullName: "Mert Arslan",
      role: "SUB_AGENT",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      subAgentCode: "ALT-01",
    },
    {
      id: "usr-akdeniz-sub2",
      username: "akdeniz_alt2",
      password: "123",
      fullName: "Selin Yıldız",
      role: "SUB_AGENT",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      subAgentCode: "ALT-02",
    },
    {
      id: "usr-erdemli-sub1",
      username: "erdemli_alt1",
      password: "123",
      fullName: "Deniz Koç",
      role: "SUB_AGENT",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
      subAgentCode: "ERD-01",
    },
    {
      id: "usr-demo-sub1",
      username: "demo_alt1",
      password: "123",
      fullName: "Burak Şahin",
      role: "SUB_AGENT",
      tenantId: "FIRM-DEMO",
      tenantName: "Mersin Demo Acente",
      subAgentCode: "DEM-01",
    },
  ]);

  const [introAccount, setIntroAccount] = useState<UserAccount | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [superPassword, setSuperPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [showNewPasswordScreen, setShowNewPasswordScreen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordScreenError, setPasswordScreenError] = useState("");

  const [showcasePlan, setShowcasePlan] = useState<PlanType>("Pro");
  const [copiedIban, setCopiedIban] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [limitNotice, setLimitNotice] = useState<string>("");

  const [newAgencyName, setNewAgencyName] = useState("");
  const [newAgencyOwnerName, setNewAgencyOwnerName] = useState("");
  const [newAgencyPassword, setNewAgencyPassword] = useState("123");
  const [newAgencyPlan, setNewAgencyPlan] = useState<PlanType>("Pro");

  const [newSubFullName, setNewSubFullName] = useState("");
  const [newSubPassword, setNewSubPassword] = useState("123");
  const [newSubTenantId, setNewSubTenantId] = useState("FIRM-AKDENIZ");

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "HTL-01",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      category: "OTEL",
      title: "Kızkalesi Panorama Butik Otel",
      quota: 6,
      netPrice: 1200,
      sellPrice: 1500,
      commission: 300,
      imageSrc: "/3.webp",
      bookedDates: ["2026-12-05", "2026-12-06", "2026-12-12"],
    },
    {
      id: "TUR-03",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      category: "TUR",
      title: "Kapadokya Balon & Konaklama Turu",
      quota: 12,
      netPrice: 3500,
      sellPrice: 4200,
      commission: 700,
      imageSrc: "/2.webp",
      bookedDates: ["2026-12-08", "2026-12-09"],
    },
    {
      id: "PNS-02",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
      category: "PANSİYON",
      title: "Silifke Sahil Aile Pansiyonu",
      quota: 9,
      netPrice: 800,
      sellPrice: 1000,
      commission: 200,
      imageSrc: "/5.png",
      bookedDates: ["2026-12-04"],
    },
    {
      id: "DEM-01",
      tenantId: "FIRM-DEMO",
      tenantName: "Mersin Demo Acente",
      category: "OTOBÜS",
      title: "Mersin - Adana Transfer Kontenjanı",
      quota: 8,
      netPrice: 250,
      sellPrice: 350,
      commission: 100,
      imageSrc: "/1.webp",
      bookedDates: ["2026-12-10"],
    },
  ]);

  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      pnr: "MCF-4821",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      agentUsername: "akdeniz_alt1",
      agentName: "Mert Arslan",
      customerName: "Ahmet Yılmaz",
      guestNames: ["Ahmet Yılmaz"],
      freeChildCount: 0,
      freeChildNames: [],
      discountedChildCount: 0,
      discountedChildNames: [],
      customerPhone: "905551112233",
      itemTitle: "Kızkalesi Panorama Butik Otel",
      pax: 1,
      startDate: "2026-11-22",
      endDate: "2026-11-24",
      chargedDays: 2,
      totalAmount: 3000,
      paidAmount: 3000,
      paymentStatus: "Ödendi",
      commissionEarned: 600,
      status: "Onaylandı",
    },
    {
      pnr: "MCF-4823",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
      agentUsername: "erdemli_alt1",
      agentName: "Deniz Koç",
      customerName: "Caner Özkan",
      guestNames: ["Caner Özkan"],
      freeChildCount: 1,
      freeChildNames: ["Efe Özkan"],
      discountedChildCount: 0,
      discountedChildNames: [],
      customerPhone: "905557778899",
      itemTitle: "Silifke Sahil Aile Pansiyonu",
      pax: 1,
      startDate: "2026-11-26",
      endDate: "2026-11-27",
      chargedDays: 1,
      totalAmount: 1000,
      paidAmount: 500,
      paymentStatus: "Kapora Alındı",
      commissionEarned: 200,
      status: "Onaylandı",
    },
  ]);

  useEffect(() => {
    const clientToday = formatIsoDate(new Date());
    setTodayIso(clientToday);
    const days = buildUpcomingDays(28, clientToday);
    setCalendarDays(days);

    const d4 = days[4]?.iso;
    const d5 = days[5]?.iso;
    const d11 = days[11]?.iso;

    let savedDbUrl = DEFAULT_ENV_DB_URL;
    if (typeof window !== "undefined") {
      const localUrl = window.localStorage.getItem(DB_URL_STORAGE_KEY);
      if (localUrl && localUrl.trim()) {
        savedDbUrl = localUrl.trim();
      }
      setFirebaseDbUrl(savedDbUrl);
      setDbUrlInput(savedDbUrl);

      const rawLocal = window.localStorage.getItem(STORAGE_KEY);
      if (rawLocal) {
        try {
          const parsed = JSON.parse(rawLocal) as PersistedState;
          if (parsed.tenants?.length) setTenants(parsed.tenants);
          if (parsed.accounts?.length) setAccounts(parsed.accounts);
          if (parsed.inventory?.length) setInventory(parsed.inventory);
          if (parsed.bookings?.length) setBookings(parsed.bookings);
          if (parsed.updatedAt) setLastSyncedAt(parsed.updatedAt);
        } catch {
          // bozuk local veri varsa varsayılanlarla devam et
        }
      } else if (d4 && d5 && d11) {
        setInventory((prev) =>
          prev.map((item, idx) => {
            if (idx === 0) return { ...item, bookedDates: [d4, d5, d11] };
            if (idx === 1) return { ...item, bookedDates: [d5, d11] };
            if (idx === 2) return { ...item, bookedDates: [d4] };
            if (idx === 3) return { ...item, bookedDates: [d11] };
            return item;
          })
        );
      }
    }

    const endpoint = normalizeFirebaseUrl(savedDbUrl);
    if (endpoint) {
      setDbStatus("syncing");
      fetch(endpoint)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: PersistedState | null) => {
          if (data && data.tenants?.length && data.accounts?.length && data.inventory?.length) {
            setTenants(data.tenants);
            setAccounts(data.accounts);
            setInventory(data.inventory);
            if (Array.isArray(data.bookings)) setBookings(data.bookings);
            if (data.updatedAt) setLastSyncedAt(data.updatedAt);
          }
          setDbStatus("connected");
        })
        .catch(() => {
          setDbStatus("error");
        })
        .finally(() => {
          setHydrated(true);
        });
    } else {
      setDbStatus("local");
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const nowLabel = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const payload: PersistedState = {
      tenants,
      accounts,
      inventory,
      bookings,
      updatedAt: nowLabel,
    };

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // kota aşımında sessiz geç
      }
    }

    const endpoint = normalizeFirebaseUrl(firebaseDbUrl);
    if (!endpoint) {
      setDbStatus("local");
      return;
    }

    const timer = setTimeout(() => {
      setDbStatus("syncing");
      fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("DB write error");
          setDbStatus("connected");
          setLastSyncedAt(nowLabel);
        })
        .catch(() => {
          setDbStatus("error");
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [hydrated, tenants, accounts, inventory, bookings, firebaseDbUrl]);

  const handleSaveFirebaseUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = dbUrlInput.trim();
    setFirebaseDbUrl(cleaned);
    if (typeof window !== "undefined") {
      if (cleaned) {
        window.localStorage.setItem(DB_URL_STORAGE_KEY, cleaned);
      } else {
        window.localStorage.removeItem(DB_URL_STORAGE_KEY);
      }
    }
    if (!cleaned) {
      setDbStatus("local");
      return;
    }
    const endpoint = normalizeFirebaseUrl(cleaned);
    setDbStatus("syncing");
    fetch(endpoint)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PersistedState | null) => {
        if (data && data.tenants?.length && data.accounts?.length && data.inventory?.length) {
          setTenants(data.tenants);
          setAccounts(data.accounts);
          setInventory(data.inventory);
          if (Array.isArray(data.bookings)) setBookings(data.bookings);
        }
        setDbStatus("connected");
        setLastSyncedAt(
          new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      })
      .catch(() => setDbStatus("error"));
  };

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [freeChildCount, setFreeChildCount] = useState<number>(0);
  const [freeChildNames, setFreeChildNames] = useState<string[]>([]);
  const [discountedChildCount, setDiscountedChildCount] = useState<number>(0);
  const [discountedChildNames, setDiscountedChildNames] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Ödendi");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [customerPhone, setCustomerPhone] = useState("");
  const [paxCount, setPaxCount] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [rangeWarning, setRangeWarning] = useState<string>("");
  const [lastCreatedBooking, setLastCreatedBooking] = useState<BookingItem | null>(null);

  const [rescheduleTarget, setRescheduleTarget] = useState<BookingItem | null>(null);
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [rescheduleEnd, setRescheduleEnd] = useState("");
  const [reschedulePayment, setReschedulePayment] = useState<PaymentStatus>("Ödendi");
  const [reschedulePaid, setReschedulePaid] = useState<number>(0);
  const [printVoucherBooking, setPrintVoucherBooking] = useState<BookingItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("TUR");
  const [newTitle, setNewTitle] = useState("");
  const [newQuota, setNewQuota] = useState(5);
  const [newNetPrice, setNewNetPrice] = useState(1000);
  const [newSellPrice, setNewSellPrice] = useState(1300);
  const [newImageSrc, setNewImageSrc] = useState("/2.webp");
  const [targetTenantId, setTargetTenantId] = useState("FIRM-AKDENIZ");

  const superAdminAcc = accounts.find((a) => a.role === "SUPER_ADMIN") || accounts[0];

  const getTenantObj = (tenantId: string | null) =>
    tenants.find((t) => t.id === tenantId) || null;

  const getTenantPlan = (tenantId: string | null): PlanType => {
    if (!tenantId) return "Pro";
    return tenants.find((t) => t.id === tenantId)?.plan || "Trial";
  };

  const currentPlan: PlanType = currentUser
    ? currentUser.role === "SUPER_ADMIN"
      ? "Pro"
      : getTenantPlan(currentUser.tenantId)
    : "Trial";

  const activeTenantObj = currentUser ? getTenantObj(currentUser.tenantId) : null;

  const getTenantRules = (tenantId: string | null) => {
    const t = getTenantObj(tenantId);
    const inTime = t?.checkInTime || "12:00";
    const outTime = t?.checkOutTime || "10:00";
    const currency = t?.currency || "₺";
    return {
      currency,
      checkInRule: `Giriş: ${inTime} sonrası`,
      checkOutRule: `Çıkış / Oda boşaltma: ${outTime} öncesi`,
      shortRule: `Giriş >${inTime} • Çıkış <${outTime}`,
    };
  };

  const activeRules = getTenantRules(currentUser?.tenantId || null);

  const handleCopyIban = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(IBAN_NUMBER).catch(() => {});
    }
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const openIntroForAccount = (acc: UserAccount) => {
    setIntroAccount(acc);
    setLoginPassword("");
    setLoginError("");
  };

  const completeLogin = (acc: UserAccount) => {
    setCurrentUser(acc);
    setIntroAccount(null);
    setLoginPassword("");
    setSuperPassword("");
    setLoginError("");
    setLimitNotice("");
    setActiveTab("dashboard");
    setMobileMenuOpen(false);
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setPasswordScreenError("");
    setShowNewPasswordScreen(true);

    if (acc.tenantId) {
      setNewSubTenantId(acc.tenantId);
      setTargetTenantId(acc.tenantId);
    } else if (tenants[0]) {
      setNewSubTenantId(tenants[0].id);
      setTargetTenantId(tenants[0].id);
    }
  };

  const handleIntroPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!introAccount) return;

    if (loginPassword !== introAccount.password) {
      setLoginError("Şifre hatalı.");
      return;
    }

    completeLogin(introAccount);
  };

  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!superAdminAcc) return;

    if (superPassword !== superAdminAcc.password) {
      setLoginError("superadmin şifresi hatalı.");
      setIntroAccount(superAdminAcc);
      return;
    }

    completeLogin(superAdminAcc);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newPasswordInput.length < 3) {
      setPasswordScreenError("Yeni şifre en az 3 karakter olmalı.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordScreenError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentUser.id ? { ...acc, password: newPasswordInput } : acc
      )
    );
    setCurrentUser({ ...currentUser, password: newPasswordInput });
    setShowNewPasswordScreen(false);
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setPasswordScreenError("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIntroAccount(null);
    setShowNewPasswordScreen(false);
    setLoginPassword("");
    setSuperPassword("");
    setLoginError("");
    setLimitNotice("");
    setSelectedItem(null);
    setIsAddModalOpen(false);
    setEditingItemId(null);
    setRescheduleTarget(null);
    setPrintVoucherBooking(null);
    setMobileMenuOpen(false);
  };

  const handleChangeTenantPlan = (tenantId: string, nextPlan: PlanType) => {
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") return;
    const daysByPlan = nextPlan === "Trial" ? 14 : 30;
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? {
              ...t,
              plan: nextPlan,
              status: nextPlan === "Trial" ? "Deneme" : "Aktif",
              editCount: 0,
              expiresAt: addDaysIso(daysByPlan, todayIso),
            }
          : t
      )
    );
    setLimitNotice("");
  };

  const handleUpdateTenantRules = (
    tenantId: string,
    patch: Partial<Pick<TenantAgency, "checkInTime" | "checkOutTime" | "currency" | "expiresAt">>
  ) => {
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    if (currentUser.role === "TENANT_ADMIN" && currentUser.tenantId !== tenantId) return;
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? { ...t, ...patch } : t)));
  };

  const handleAddTenantAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") return;
    if (!newAgencyName.trim() || !newAgencyOwnerName.trim()) return;

    const slug = newAgencyName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
    const tenantId = `FIRM-${slug || Math.floor(100 + Math.random() * 899)}`;
    const ownerUsername = `${(slug || "firma").toLowerCase()}_ana_${Math.floor(
      10 + Math.random() * 89
    )}`;

    const createdTenant: TenantAgency = {
      id: tenantId,
      name: newAgencyName.trim(),
      plan: newAgencyPlan,
      revenue: "0 ₺",
      status: newAgencyPlan === "Trial" ? "Deneme" : "Aktif",
      editCount: 0,
      expiresAt: addDaysIso(newAgencyPlan === "Trial" ? 14 : 30, todayIso),
      checkInTime: "12:00",
      checkOutTime: "10:00",
      currency: "₺",
    };

    const createdOwner: UserAccount = {
      id: `usr-${Date.now()}`,
      username: ownerUsername,
      password: newAgencyPassword || "123",
      fullName: newAgencyOwnerName.trim(),
      role: "TENANT_ADMIN",
      tenantId,
      tenantName: createdTenant.name,
    };

    setTenants([createdTenant, ...tenants]);
    setAccounts([...accounts, createdOwner]);
    setNewAgencyName("");
    setNewAgencyOwnerName("");
    setNewAgencyPassword("123");
    setNewSubTenantId(tenantId);
    setTargetTenantId(tenantId);
  };

  const handleRemoveTenantAgency = (tenantId: string) => {
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") return;
    setTenants((prev) => prev.filter((t) => t.id !== tenantId));
    setAccounts((prev) => prev.filter((a) => a.tenantId !== tenantId));
    setInventory((prev) => prev.filter((i) => i.tenantId !== tenantId));
  };

  const handleAddSubAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    if (!newSubFullName.trim()) return;

    const effectiveTenantId =
      currentUser.role === "SUPER_ADMIN" ? newSubTenantId : currentUser.tenantId;
    if (!effectiveTenantId) return;

    const parentTenant = tenants.find((t) => t.id === effectiveTenantId);
    if (!parentTenant) return;

    const existingSubsCount = accounts.filter(
      (a) => a.role === "SUB_AGENT" && a.tenantId === parentTenant.id
    ).length;
    const maxSubs = PLAN_SPECS[parentTenant.plan].maxSubAgents;

    if (currentUser.role !== "SUPER_ADMIN" && existingSubsCount >= maxSubs) {
      setLimitNotice(
        `${parentTenant.name} (${parentTenant.plan} paket) limitine (${maxSubs}) ulaştı. Sınırsız için Pro pakete geçin.`
      );
      return;
    }

    setLimitNotice("");
    const codeNum = Math.floor(10 + Math.random() * 89);
    const newSub: UserAccount = {
      id: `sub-${Date.now()}`,
      username: `alt_${codeNum}`,
      password: newSubPassword || "123",
      fullName: newSubFullName.trim(),
      role: "SUB_AGENT",
      tenantId: parentTenant.id,
      tenantName: parentTenant.name,
      subAgentCode: `ALT-${codeNum}`,
    };

    setAccounts([...accounts, newSub]);
    setNewSubFullName("");
    setNewSubPassword("123");
  };

  const handleRemoveSubAgent = (subId: string) => {
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    const target = accounts.find((a) => a.id === subId);
    if (!target || target.role !== "SUB_AGENT") return;

    if (currentUser.role === "TENANT_ADMIN" && target.tenantId !== currentUser.tenantId) {
      return;
    }

    setAccounts((prev) => prev.filter((a) => a.id !== subId));
    setLimitNotice("");
  };

  const visibleInventory = currentUser
    ? currentUser.role === "SUPER_ADMIN"
      ? inventory
      : inventory.filter((item) => item.tenantId === currentUser.tenantId)
    : [];

  const visibleBookings = currentUser
    ? currentUser.role === "SUPER_ADMIN"
      ? bookings
      : currentUser.role === "TENANT_ADMIN"
      ? bookings.filter((b) => b.tenantId === currentUser.tenantId)
      : bookings.filter((b) => b.agentUsername === currentUser.username)
    : [];

  const visibleSubAgents = currentUser
    ? currentUser.role === "SUPER_ADMIN"
      ? accounts.filter((a) => a.role === "SUB_AGENT")
      : accounts.filter((a) => a.role === "SUB_AGENT" && a.tenantId === currentUser.tenantId)
    : [];

  const totalSubscriptionIncome = tenants.reduce(
    (sum, t) => sum + PLAN_SPECS[t.plan].monthlyAmount,
    0
  );

  const activeBookingsOnly = useMemo(
    () => visibleBookings.filter((b) => b.status !== "İptal Edildi"),
    [visibleBookings]
  );

  const totalAgentCommission = activeBookingsOnly.reduce(
    (acc, b) => acc + b.commissionEarned,
    0
  );

  const totalSalesVolume = activeBookingsOnly.reduce(
    (acc, b) => acc + b.totalAmount,
    0
  );

  const totalCollectedAmount = activeBookingsOnly.reduce(
    (acc, b) => acc + b.paidAmount,
    0
  );

  const calculatedNewCommission = Math.max(0, newSellPrice - newNetPrice);

  const checkTenantEditLimit = (tenantId: string | null): boolean => {
    if (!currentUser || currentUser.role === "SUPER_ADMIN") return true;
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return true;
    const spec = PLAN_SPECS[tenant.plan];
    if (tenant.plan === "Basic" && tenant.editCount >= spec.maxEdits) {
      setLimitNotice(
        `${tenant.name} (Basic paket) en fazla ${spec.maxEdits} düzenleme/ekleme hakkını doldurdu. Sınırsız düzenleme için Pro pakete geçin.`
      );
      return false;
    }
    return true;
  };

  const handleOpenAddInventoryModal = () => {
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    const activeTenantId =
      currentUser.role === "SUPER_ADMIN" ? targetTenantId : currentUser.tenantId || tenants[0]?.id;

    if (!checkTenantEditLimit(activeTenantId)) return;

    const plan = getTenantPlan(activeTenantId);
    const currentTenantInventoryCount = inventory.filter((i) => i.tenantId === activeTenantId).length;
    const limit = PLAN_SPECS[plan].maxInventory;

    if (currentUser.role !== "SUPER_ADMIN" && currentTenantInventoryCount >= limit) {
      setLimitNotice(
        `${currentUser.tenantName} (${plan} paket) kontenjan sınırına (${limit}) ulaştı. Pro pakete yükseltin.`
      );
      return;
    }

    setLimitNotice("");
    setEditingItemId(null);
    setNewCategory("TUR");
    setNewTitle("");
    setNewQuota(5);
    setNewNetPrice(1000);
    setNewSellPrice(1300);
    setNewImageSrc("/2.webp");
    setIsAddModalOpen(true);
  };

  const handleOpenEditInventoryModal = (item: InventoryItem) => {
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    if (!checkTenantEditLimit(item.tenantId)) return;

    setLimitNotice("");
    setEditingItemId(item.id);
    setTargetTenantId(item.tenantId);
    setNewCategory(item.category);
    setNewTitle(item.title);
    setNewQuota(item.quota);
    setNewNetPrice(item.netPrice);
    setNewSellPrice(item.sellPrice);
    setNewImageSrc(item.imageSrc || "/3.webp");
    setIsAddModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewImageSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInventoryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    if (!newTitle.trim() || newQuota < 0) return;

    const assignedTenantId =
      currentUser.role === "SUPER_ADMIN" ? targetTenantId : currentUser.tenantId || tenants[0]?.id;

    if (!checkTenantEditLimit(assignedTenantId)) return;

    const assignedTenantName =
      tenants.find((t) => t.id === assignedTenantId)?.name || currentUser.tenantName;

    const categoryPhotoMap: Record<string, string> = {
      TUR: "/2.webp",
      OTEL: "/3.webp",
      UÇAK: "/4.jpg",
      PANSİYON: "/5.png",
      OTOBÜS: "/1.webp",
    };

    const finalImage = newImageSrc.trim() || categoryPhotoMap[newCategory] || "/3.webp";
    const computedCommission = Math.max(0, newSellPrice - newNetPrice);

    if (editingItemId) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.id === editingItemId
            ? {
                ...inv,
                category: newCategory,
                title: newTitle.trim(),
                quota: newQuota,
                netPrice: newNetPrice,
                sellPrice: newSellPrice,
                commission: computedCommission,
                imageSrc: finalImage,
              }
            : inv
        )
      );
    } else {
      const plan = getTenantPlan(assignedTenantId);
      const currentTenantInventoryCount = inventory.filter(
        (i) => i.tenantId === assignedTenantId
      ).length;
      const limit = PLAN_SPECS[plan].maxInventory;

      if (currentUser.role !== "SUPER_ADMIN" && currentTenantInventoryCount >= limit) {
        setIsAddModalOpen(false);
        setLimitNotice(
          `${currentUser.tenantName} (${plan} paket) maksimum ${limit} kontenjan sınırına ulaştı.`
        );
        return;
      }

      const newItem: InventoryItem = {
        id: `${newCategory.slice(0, 3)}-${Math.floor(10 + Math.random() * 89)}`,
        tenantId: assignedTenantId,
        tenantName: assignedTenantName,
        category: newCategory,
        title: newTitle.trim(),
        quota: newQuota,
        netPrice: newNetPrice,
        sellPrice: newSellPrice,
        commission: computedCommission,
        imageSrc: finalImage,
        bookedDates: [],
      };

      setInventory([newItem, ...inventory]);
    }

    if (currentUser.role === "TENANT_ADMIN" && assignedTenantId) {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === assignedTenantId ? { ...t, editCount: t.editCount + 1 } : t
        )
      );
    }

    setIsAddModalOpen(false);
    setEditingItemId(null);
    setNewTitle("");
    setNewQuota(5);
    setNewNetPrice(1000);
    setNewSellPrice(1300);
  };

  const syncPaxCount = (nextPax: number) => {
    const safePax = Math.max(1, Math.min(selectedItem?.quota || 99, nextPax));
    setPaxCount(safePax);
    setGuestNames((prev) => {
      if (safePax === prev.length) return prev;
      if (safePax > prev.length) {
        return [...prev, ...Array.from({ length: safePax - prev.length }, () => "")];
      }
      return prev.slice(0, safePax);
    });
  };

  const syncFreeChildCount = (nextChildCount: number) => {
    const safeCount = Math.max(0, Math.min(10, nextChildCount));
    setFreeChildCount(safeCount);
    setFreeChildNames((prev) => {
      if (safeCount === prev.length) return prev;
      if (safeCount > prev.length) {
        return [...prev, ...Array.from({ length: safeCount - prev.length }, () => "")];
      }
      return prev.slice(0, safeCount);
    });
  };

  const syncDiscountedChildCount = (nextChildCount: number) => {
    const safeCount = Math.max(0, Math.min(10, nextChildCount));
    setDiscountedChildCount(safeCount);
    setDiscountedChildNames((prev) => {
      if (safeCount === prev.length) return prev;
      if (safeCount > prev.length) {
        return [...prev, ...Array.from({ length: safeCount - prev.length }, () => "")];
      }
      return prev.slice(0, safeCount);
    });
  };

  const openBookingModal = (item: InventoryItem) => {
    const blocked = new Set(item.bookedDates || []);
    const firstAvailable = calendarDays.find((d) => !blocked.has(d.iso))?.iso || "";
    setSelectedItem(item);
    setStartDate(firstAvailable);
    setEndDate(firstAvailable);
    setRangeWarning("");
    setPaxCount(1);
    setGuestNames([""]);
    setFreeChildCount(0);
    setFreeChildNames([]);
    setDiscountedChildCount(0);
    setDiscountedChildNames([]);
    setPaymentStatus("Ödendi");
    setDepositAmount(item.sellPrice);
    setCustomerPhone("");
    setLastCreatedBooking(null);
  };

  const handleSelectCalendarDay = (clickedIso: string) => {
    if (!selectedItem) return;
    const blocked = new Set(selectedItem.bookedDates || []);
    if (blocked.has(clickedIso)) return;

    setRangeWarning("");

    if (!startDate || (startDate && endDate && startDate !== endDate) || clickedIso < startDate) {
      setStartDate(clickedIso);
      setEndDate(clickedIso);
      return;
    }

    if (clickedIso === startDate) {
      setEndDate(clickedIso);
      return;
    }

    const startIdx = calendarDays.findIndex((d) => d.iso === startDate);
    const endIdx = calendarDays.findIndex((d) => d.iso === clickedIso);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const slice = calendarDays.slice(startIdx, endIdx + 1);
      const hasBlockedInBetween = slice.some((d) => blocked.has(d.iso));
      if (hasBlockedInBetween) {
        setRangeWarning("Seçtiğiniz aralıkta dolu tarih var. Yeni başlangıç tarihi seçildi.");
        setStartDate(clickedIso);
        setEndDate(clickedIso);
        return;
      }
    }

    setEndDate(clickedIso);
  };

  const selectedRangeIsos: string[] = (() => {
    if (!startDate) return [];
    const effectiveEnd = endDate && endDate >= startDate ? endDate : startDate;
    const startIdx = calendarDays.findIndex((d) => d.iso === startDate);
    const endIdx = calendarDays.findIndex((d) => d.iso === effectiveEnd);
    if (startIdx === -1 || endIdx === -1) return [startDate];
    return calendarDays.slice(startIdx, endIdx + 1).map((d) => d.iso);
  })();

  const effectiveEndDate = startDate ? (endDate && endDate >= startDate ? endDate : startDate) : "";
  const hasCheckoutDay = Boolean(startDate && effectiveEndDate && effectiveEndDate > startDate);

  const chargedDaysCount = Math.max(
    1,
    hasCheckoutDay ? selectedRangeIsos.length - 1 : selectedRangeIsos.length
  );

  const effectivePersonUnits = selectedItem
    ? paxCount + discountedChildCount * 0.5
    : paxCount;

  const computedTotalAmount = selectedItem
    ? Math.round(selectedItem.sellPrice * effectivePersonUnits * chargedDaysCount)
    : 0;

  const computedCommissionEarned = selectedItem
    ? Math.round(selectedItem.commission * effectivePersonUnits * chargedDaysCount)
    : 0;

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedItem || !startDate || !customerPhone.trim()) {
      return;
    }

    const normalizedGuests = Array.from({ length: paxCount }, (_, i) =>
      (guestNames[i] || "").trim()
    );
    if (normalizedGuests.some((name) => !name)) {
      return;
    }

    const normalizedFreeChildren = Array.from({ length: freeChildCount }, (_, i) =>
      (freeChildNames[i] || "").trim()
    );
    const normalizedDiscountedChildren = Array.from({ length: discountedChildCount }, (_, i) =>
      (discountedChildNames[i] || "").trim()
    );

    const finalEndDate = effectiveEndDate || startDate;
    const randomPnr = `MCF-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanPhone = customerPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("90")
      ? cleanPhone
      : `90${cleanPhone.replace(/^0/, "")}`;

    const resolvedPaidAmount =
      paymentStatus === "Ödendi"
        ? computedTotalAmount
        : paymentStatus === "Kapora Alındı"
        ? Math.min(computedTotalAmount, Math.max(0, depositAmount))
        : 0;

    const newBooking: BookingItem = {
      pnr: randomPnr,
      tenantId: selectedItem.tenantId,
      tenantName: selectedItem.tenantName,
      agentUsername: currentUser.username,
      agentName: currentUser.fullName,
      customerName: normalizedGuests[0],
      guestNames: normalizedGuests,
      freeChildCount,
      freeChildNames: normalizedFreeChildren,
      discountedChildCount,
      discountedChildNames: normalizedDiscountedChildren,
      customerPhone: formattedPhone,
      itemTitle: selectedItem.title,
      pax: paxCount,
      startDate,
      endDate: finalEndDate,
      chargedDays: chargedDaysCount,
      totalAmount: computedTotalAmount,
      paidAmount: resolvedPaidAmount,
      paymentStatus,
      commissionEarned: computedCommissionEarned,
      status: "Onaylandı",
      createdAt: todayIso,
    };

    setBookings([newBooking, ...bookings]);

    const nextQuota = Math.max(0, selectedItem.quota - paxCount);
    const nextBookedDates = Array.from(
      new Set([...(selectedItem.bookedDates || []), ...selectedRangeIsos])
    );

    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === selectedItem.id
          ? { ...inv, quota: nextQuota, bookedDates: nextBookedDates }
          : inv
      )
    );

    setSelectedItem({
      ...selectedItem,
      quota: nextQuota,
      bookedDates: nextBookedDates,
    });

    setLastCreatedBooking(newBooking);
  };

  const handleCancelBooking = (targetBooking: BookingItem) => {
    if (targetBooking.status === "İptal Edildi") return;

    setBookings((prev) =>
      prev.map((b) =>
        b.pnr === targetBooking.pnr
          ? { ...b, status: "İptal Edildi", paidAmount: 0 }
          : b
      )
    );

    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.title !== targetBooking.itemTitle || inv.tenantId !== targetBooking.tenantId) {
          return inv;
        }
        const remainingBlocked = (inv.bookedDates || []).filter(
          (d) => d < targetBooking.startDate || d > targetBooking.endDate
        );
        return {
          ...inv,
          quota: inv.quota + targetBooking.pax,
          bookedDates: remainingBlocked,
        };
      })
    );
  };

  const openRescheduleModal = (b: BookingItem) => {
    setRescheduleTarget(b);
    setRescheduleStart(b.startDate);
    setRescheduleEnd(b.endDate);
    setReschedulePayment(b.paymentStatus);
    setReschedulePaid(b.paidAmount);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget || !rescheduleStart) return;
    const finalEnd = rescheduleEnd && rescheduleEnd >= rescheduleStart ? rescheduleEnd : rescheduleStart;

    const startMs = new Date(`${rescheduleStart}T12:00:00Z`).getTime();
    const endMs = new Date(`${finalEnd}T12:00:00Z`).getTime();
    const diffDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));

    const unitSell =
      rescheduleTarget.chargedDays > 0
        ? rescheduleTarget.totalAmount / rescheduleTarget.chargedDays
        : rescheduleTarget.totalAmount;
    const unitComm =
      rescheduleTarget.chargedDays > 0
        ? rescheduleTarget.commissionEarned / rescheduleTarget.chargedDays
        : rescheduleTarget.commissionEarned;

    const updatedTotal = Math.round(unitSell * diffDays);
    const updatedComm = Math.round(unitComm * diffDays);
    const updatedPaid =
      reschedulePayment === "Ödendi"
        ? updatedTotal
        : reschedulePayment === "Acente Cari"
        ? 0
        : Math.min(updatedTotal, Math.max(0, reschedulePaid));

    setBookings((prev) =>
      prev.map((b) =>
        b.pnr === rescheduleTarget.pnr
          ? {
              ...b,
              startDate: rescheduleStart,
              endDate: finalEnd,
              chargedDays: diffDays,
              totalAmount: updatedTotal,
              commissionEarned: updatedComm,
              paymentStatus: reschedulePayment,
              paidAmount: updatedPaid,
            }
          : b
      )
    );

    setRescheduleTarget(null);
  };

  const handleExportCsv = () => {
    const headers = [
      "PNR",
      "Acente",
      "Danisman",
      "Misafirler",
      "0-6 Yas Ucretsiz",
      "7-12 Yas Indirimli",
      "Hizmet",
      "Baslangic",
      "Bitis",
      "Gun",
      "Tutar",
      "Odenen",
      "Odeme Durumu",
      "Komisyon",
      "Durum",
    ];

    const rows = visibleBookings.map((b) => [
      b.pnr,
      b.tenantName,
      b.agentName,
      (b.guestNames?.length ? b.guestNames : [b.customerName]).join(" / "),
      String(b.freeChildCount),
      String(b.discountedChildCount),
      b.itemTitle,
      b.startDate,
      b.endDate,
      String(b.chargedDays),
      String(b.totalAmount),
      String(b.paidAmount),
      b.paymentStatus,
      String(b.commissionEarned),
      b.status,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mcf-rezervasyonlar-${todayIso}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendWhatsAppVoucher = (b: BookingItem) => {
    const rules = getTenantRules(b.tenantId);
    const dateLabel =
      b.startDate === b.endDate
        ? `${b.startDate} (${b.chargedDays} Gün)`
        : `${b.startDate} → ${b.endDate} (Fiyata Dahil: ${b.chargedDays} Gün; Son gün çıkış)`;

    const guestsSummary =
      b.guestNames && b.guestNames.length > 0
        ? b.guestNames.map((g, idx) => `${idx + 1}. Kişi: ${g}`).join(", ")
        : b.customerName;

    const freeChildSummary =
      b.freeChildCount > 0
        ? `\n*0-6 Yaş Çocuk (Ücretsiz):* ${b.freeChildCount} Çocuk${
            b.freeChildNames.filter(Boolean).length > 0
              ? ` (${b.freeChildNames.filter(Boolean).join(", ")})`
              : ""
          }`
        : "";

    const discChildSummary =
      b.discountedChildCount > 0
        ? `\n*7-12 Yaş Çocuk (%50 İndirimli):* ${b.discountedChildCount} Çocuk${
            b.discountedChildNames.filter(Boolean).length > 0
              ? ` (${b.discountedChildNames.filter(Boolean).join(", ")})`
              : ""
          }`
        : "";

    const balance = Math.max(0, b.totalAmount - b.paidAmount);

    const voucherText =
      `*MCF B2B • ${b.tenantName} | RESMİ VOUCHER*\n` +
      `----------------------------------\n` +
      `*PNR Kodu:* ${b.pnr} (${b.status})\n` +
      `*Kişi Adedi:* ${b.pax} Kişi (${guestsSummary})${freeChildSummary}${discChildSummary}\n` +
      `*Hizmet:* ${b.itemTitle}\n` +
      `*Tarih Aralığı:* ${dateLabel}\n` +
      `*Saat Kuralı:* ${rules.checkInRule} | ${rules.checkOutRule}\n` +
      `*Toplam Tutar:* ${b.totalAmount} ${rules.currency} | *Ödeme:* ${b.paymentStatus} (Kalan: ${balance} ${rules.currency})\n` +
      `----------------------------------\n` +
      `MCF Technology & Software Solutions`;

    window.open(
      `https://wa.me/${b.customerPhone}?text=${encodeURIComponent(voucherText)}`,
      "_blank"
    );
  };

  if (!currentUser) {
    const activeSpec = PLAN_SPECS[showcasePlan];
    const filmLoopItems = [...HOLIDAY_SHOWCASE, ...HOLIDAY_SHOWCASE];

    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 py-5 px-3 sm:px-6">
        <style>{`
          @keyframes mcfFilmScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .mcf-film-track {
            display: flex;
            width: max-content;
            animation: mcfFilmScroll 28s linear infinite;
          }
          .mcf-film-track:hover {
            animation-play-state: paused;
          }
          @keyframes mcfIntroPop {
            0% { opacity: 0; transform: scale(0.95) translateY(8px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .mcf-intro-modal {
            animation: mcfIntroPop 0.22s ease-out forwards;
          }
        `}</style>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5 min-w-0">
              <BrandLogo size="lg" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-white truncate">
                  MCF B2B TURİZM PORTALI
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Kontenjan, rezervasyon, PNR, raporlama ve dijital voucher altyapısı
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSuperAdminLogin}
              className="flex items-center gap-2 bg-[#080c16] border border-slate-800 rounded-2xl px-3 py-2 shrink-0"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-xs font-mono font-semibold text-amber-200 select-all">
                superadmin
              </span>
              <input
                type="password"
                required
                value={superPassword}
                onChange={(e) => {
                  setSuperPassword(e.target.value);
                  setLoginError("");
                }}
                placeholder="password"
                aria-label="password"
                className="bg-[#0e1422] border border-slate-700 focus:border-amber-400 rounded-xl px-2.5 py-1 text-xs text-white w-28 sm:w-32 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-xl transition cursor-pointer"
              >
                Gir
              </button>
            </form>
          </div>

          <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl overflow-hidden">
            <div className="overflow-hidden rounded-2xl">
              <div className="mcf-film-track gap-3.5 pr-3.5">
                {filmLoopItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative w-64 sm:w-72 h-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-800 bg-[#080c16] shrink-0"
                  >
                    <ShowcaseImage
                      src={item.src}
                      alt={item.title}
                      fallbackGradient={item.accent}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3.5 flex flex-col justify-end">
                      <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div
              className={`lg:col-span-7 bg-[#0e1422] border ${activeSpec.cardBorder} rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg`}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">
                      {activeSpec.priceLabel}
                    </span>
                    <span className="text-xs text-slate-400">{activeSpec.periodLabel}</span>
                  </div>

                  <select
                    value={showcasePlan}
                    onChange={(e) => setShowcasePlan(e.target.value as PlanType)}
                    aria-label="Abonelik Paketi"
                    className="bg-[#080c16] border border-slate-700 focus:border-indigo-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Trial">Trial (14 Gün Ücretsiz)</option>
                    <option value="Basic">Basic (3.000 TL / Ay)</option>
                    <option value="Pro">Pro (5.000 TL / Ay)</option>
                  </select>
                </div>

                <ul className="space-y-2 border-t border-slate-800/90 pt-3.5 text-xs sm:text-sm text-slate-200">
                  {activeSpec.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0e1422] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  IBAN Bilgisi
                </span>
                <button
                  type="button"
                  onClick={handleCopyIban}
                  className="bg-[#080c16] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedIban ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold text-white">{IBAN_OWNER}</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-emerald-300 bg-[#080c16] border border-slate-800 rounded-xl px-3.5 py-3 select-all tracking-wider">
                  {IBAN_NUMBER}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {tenants.map((tenant) => {
                const mainAgencyAcc = accounts.find(
                  (a) => a.role === "TENANT_ADMIN" && a.tenantId === tenant.id
                );
                const subAgencyAccs = accounts.filter(
                  (a) => a.role === "SUB_AGENT" && a.tenantId === tenant.id
                );

                return (
                  <div
                    key={tenant.id}
                    className="bg-[#080c16] border border-slate-800/90 rounded-2xl p-3 space-y-2"
                  >
                    {mainAgencyAcc && (
                      <button
                        type="button"
                        onClick={() => openIntroForAccount(mainAgencyAcc)}
                        className="w-full text-left rounded-xl p-3 border transition cursor-pointer flex items-center justify-between gap-2 bg-emerald-500/20 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/30"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 opacity-90">
                              {tenant.plan}
                            </span>
                            <p className="text-sm font-bold truncate">{tenant.name}</p>
                          </div>
                          <p className="text-xs opacity-80 truncate mt-0.5">
                            {mainAgencyAcc.fullName}
                          </p>
                        </div>
                        <Lock className="w-4 h-4 shrink-0 opacity-80" />
                      </button>
                    )}

                    {subAgencyAccs.length > 0 && (
                      <div className="pl-3 border-l-2 border-sky-400/40 space-y-1.5">
                        {subAgencyAccs.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => openIntroForAccount(sub)}
                            className="w-full text-left rounded-xl px-3 py-2 border transition cursor-pointer flex items-center justify-between gap-2 bg-sky-500/20 border-sky-400/50 text-sky-100 hover:bg-sky-500/30"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CornerDownRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
                              <span className="text-xs sm:text-sm font-bold truncate">
                                {sub.fullName}
                              </span>
                            </div>
                            <Lock className="w-3.5 h-3.5 shrink-0 opacity-80" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {introAccount && (
          <div
            onClick={() => {
              setIntroAccount(null);
              setLoginPassword("");
              setLoginError("");
            }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="mcf-intro-modal bg-[#0e1422] border border-slate-700/90 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 truncate">{introAccount.tenantName}</p>
                  <h3 className="text-base font-bold text-white truncate mt-0.5">
                    {introAccount.fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIntroAccount(null);
                    setLoginPassword("");
                    setLoginError("");
                  }}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#080c16] border border-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleIntroPasswordLogin} className="space-y-4">
                <div className="flex items-center gap-2.5 bg-[#080c16] border border-slate-700 focus-within:border-indigo-500 rounded-xl px-3.5 py-2.5">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError("");
                    }}
                    placeholder="Şifre"
                    className="bg-transparent text-sm text-white w-full focus:outline-none"
                  />
                </div>

                {loginError && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl px-3.5 py-2.5">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" /> Giriş Yap
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showNewPasswordScreen) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0e1422] border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Yeni Şifre Belirle</h2>
              <p className="text-xs text-slate-400">{currentUser.fullName}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-[#080c16] border border-slate-800 cursor-pointer"
            >
              Çıkış
            </button>
          </div>

          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Yeni Şifre</label>
              <input
                type="password"
                required
                value={newPasswordInput}
                onChange={(e) => {
                  setNewPasswordInput(e.target.value);
                  setPasswordScreenError("");
                }}
                placeholder="Yeni şifreniz"
                className="bg-[#080c16] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                required
                value={confirmPasswordInput}
                onChange={(e) => {
                  setConfirmPasswordInput(e.target.value);
                  setPasswordScreenError("");
                }}
                placeholder="Yeni şifreniz tekrar"
                className="bg-[#080c16] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white w-full focus:outline-none"
              />
            </div>

            {passwordScreenError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl px-3.5 py-2.5">
                {passwordScreenError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
            >
              Şifreyi Kaydet ve Devam Et
            </button>

            <button
              type="button"
              onClick={() => setShowNewPasswordScreen(false)}
              className="w-full bg-[#080c16] hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Şimdi Değil, Panele Geç
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";
  const isTenantAdmin = currentUser.role === "TENANT_ADMIN";
  const hierarchyTenants = isSuperAdmin
    ? tenants
    : tenants.filter((t) => t.id === currentUser.tenantId);

  const blockedDatesSet = new Set(selectedItem?.bookedDates || []);
  const selectedRangeSet = new Set(selectedRangeIsos);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-voucher-area, #printable-voucher-area * { visibility: visible; }
          #printable-voucher-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #0f172a !important;
            padding: 24px !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <header className="border-b border-slate-800/80 bg-[#0b101d] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden bg-[#070b14] border border-slate-800 p-2 rounded-xl text-slate-200 hover:text-white shrink-0"
            aria-label="Menüyü Aç/Kapat"
          >
            <Menu className="w-5 h-5" />
          </button>

          <BrandLogo size="md" />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-wide text-white truncate">
              MCF B2B TURİZM
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
              <span className="truncate">{currentUser.tenantName}</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/90 text-[10px] font-mono">
                <Database
                  className={`w-3 h-3 ${
                    dbStatus === "connected"
                      ? "text-emerald-400"
                      : dbStatus === "syncing"
                      ? "text-amber-400"
                      : dbStatus === "error"
                      ? "text-rose-400"
                      : "text-sky-400"
                  }`}
                />
                {dbStatus === "connected"
                  ? `Firebase${lastSyncedAt ? ` • ${lastSyncedAt}` : ""}`
                  : dbStatus === "syncing"
                  ? "Kaydediliyor..."
                  : dbStatus === "error"
                  ? "Yerel Yedek"
                  : "Kalıcı Yerel DB"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white">{currentUser.fullName}</p>
            <p className="text-[11px] text-indigo-400">
              {currentPlan}
              {activeTenantObj
                ? ` • ${calcRemainingDays(activeTenantObj.expiresAt, todayIso)} gün`
                : ""}
            </p>
          </div>

          <button
            onClick={() => setShowNewPasswordScreen(true)}
            className="bg-[#070b14] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            Yeni Şifre
          </button>

          <button
            onClick={handleLogout}
            className="bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> <span>Çıkış</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row items-start p-4 sm:p-6 gap-5 max-w-7xl w-full mx-auto">
        <aside
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex w-full md:w-52 bg-[#0e1422] border border-slate-800/90 rounded-2xl p-3 flex-col gap-3 shrink-0 h-fit md:sticky md:top-20`}
        >
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                activeTab === "dashboard"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/35"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" /> Kontenjan & Satış
            </button>

            <button
              onClick={() => {
                setActiveTab("bookings");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                activeTab === "bookings"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/35"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" /> PNR & Rapor
            </button>

            <button
              onClick={() => {
                setActiveTab("hierarchy");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                activeTab === "hierarchy"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/35"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Network className="w-4 h-4 shrink-0" /> Hiyerarşi
            </button>

            {currentUser.role !== "SUB_AGENT" && (
              <button
                onClick={() => {
                  setActiveTab("tenants");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                  activeTab === "tenants"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/35"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">Acente & Paket</span>
              </button>
            )}
          </div>

          <div className="bg-[#080c16] border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                {isSuperAdmin ? "Paket Geliri" : "Komisyon"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PLAN_SPECS[currentPlan].badgeClass}`}
              >
                {isSuperAdmin ? "SaaS" : currentPlan}
              </span>
            </div>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              +{isSuperAdmin ? totalSubscriptionIncome.toLocaleString("tr-TR") : totalAgentCommission}{" "}
              {activeRules.currency}
            </p>
            {isTenantAdmin && activeTenantObj && (
              <p className="text-[10px] text-slate-400 mt-1">
                Düzenleme:{" "}
                <span className="text-white font-semibold">
                  {activeTenantObj.plan === "Pro"
                    ? `${activeTenantObj.editCount} / ∞`
                    : activeTenantObj.plan === "Basic"
                    ? `${activeTenantObj.editCount} / ${PLAN_SPECS.Basic.maxEdits}`
                    : `${calcRemainingDays(activeTenantObj.expiresAt, todayIso)} Gün Kaldı`}
                </span>
              </p>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0 w-full">
          {limitNotice && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{limitNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isSuperAdmin) {
                    setActiveTab("tenants");
                  } else if (currentUser.tenantId) {
                    handleChangeTenantPlan(currentUser.tenantId, "Pro");
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                Pro
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Kontenjan & Satış Havuzu
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {PLAN_SPECS[currentPlan].summary} • {activeRules.checkInRule} •{" "}
                    {activeRules.checkOutRule} • 0-6 Yaş Ücretsiz • 7-12 Yaş %50 İndirimli
                  </p>
                </div>

                {currentUser.role !== "SUB_AGENT" && (
                  <button
                    onClick={handleOpenAddInventoryModal}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer shrink-0"
                  >
                    <PackagePlus className="w-4 h-4" /> + Yeni Kontenjan
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {visibleInventory.map((item) => {
                  const itemRules = getTenantRules(item.tenantId);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#0e1422] border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition"
                    >
                      <div>
                        <div className="h-32 w-full relative bg-[#080c16]">
                          <ShowcaseImage
                            src={item.imageSrc}
                            alt={item.title}
                            fallbackGradient="from-indigo-950 via-slate-900 to-emerald-950"
                            className="w-full h-full"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-black/70 text-indigo-300 border border-white/15 backdrop-blur-sm">
                              {item.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                            {currentUser.role !== "SUB_AGENT" && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditInventoryModal(item)}
                                title="Düzenle"
                                className="bg-black/75 hover:bg-indigo-600 text-white p-1.5 rounded-md border border-white/15 backdrop-blur-sm transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm ${
                                item.quota > 0 ? "text-emerald-300" : "text-rose-300"
                              }`}
                            >
                              {item.quota > 0 ? `Kalan: ${item.quota}` : "Doldu"}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5">
                          <p className="text-[11px] text-slate-500 mb-1 truncate">{item.tenantName}</p>
                          <h3 className="text-base font-bold text-white mb-3.5">{item.title}</h3>

                          <div className="bg-[#080c16] border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs">
                            {currentUser.role !== "SUB_AGENT" && (
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-400">Net:</span>
                                <span className="font-semibold text-white">
                                  {item.netPrice} {itemRules.currency}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between gap-2">
                              <span className="text-slate-400">Satış (Günlük):</span>
                              <span className="font-bold text-indigo-400">
                                {item.sellPrice} {itemRules.currency}
                              </span>
                            </div>
                            {!isSuperAdmin && (
                              <div className="border-t border-slate-800 pt-2 flex justify-between gap-2">
                                <span className="text-slate-400">Komisyon:</span>
                                <span className="font-bold text-emerald-400">
                                  +{item.commission} {itemRules.currency}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex gap-2">
                        {currentUser.role !== "SUB_AGENT" && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditInventoryModal(item)}
                            className="bg-[#080c16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Düzenle
                          </button>
                        )}
                        <button
                          disabled={item.quota === 0}
                          onClick={() => openBookingModal(item)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Rezervasyon Gir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "hierarchy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Hiyerarşi</h2>
              </div>

              {isSuperAdmin && (
                <div className="bg-amber-500/15 border border-amber-400/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/25 text-amber-200 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                        superadmin
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        MCF B2B Platform
                      </h3>
                    </div>
                  </div>
                  <div className="text-xs text-amber-100/90">
                    <strong>{tenants.length}</strong> •{" "}
                    <strong>{accounts.filter((a) => a.role === "SUB_AGENT").length}</strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {hierarchyTenants.map((tenant) => {
                  const owner = accounts.find(
                    (a) => a.role === "TENANT_ADMIN" && a.tenantId === tenant.id
                  );
                  const subs = accounts.filter(
                    (a) => a.role === "SUB_AGENT" && a.tenantId === tenant.id
                  );
                  const invCount = inventory.filter((i) => i.tenantId === tenant.id).length;

                  return (
                    <div
                      key={tenant.id}
                      className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4"
                    >
                      <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-2xl p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <h4 className="text-base font-bold text-white">{tenant.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              PLAN_SPECS[tenant.plan].badgeClass
                            }`}
                          >
                            {tenant.plan} • {calcRemainingDays(tenant.expiresAt, todayIso)}g
                          </span>
                        </div>
                        <p className="text-xs text-emerald-100/80 mt-1">
                          {owner?.fullName || ""} • {invCount} Kontenjan • Giriş &gt;{tenant.checkInTime}{" "}
                          / Çıkış &lt;{tenant.checkOutTime}
                        </p>
                      </div>

                      <div className="pl-3 sm:pl-5 border-l-2 border-sky-400/40 space-y-2.5">
                        {subs.length === 0 ? (
                          <p className="text-xs text-slate-500 bg-[#080c16] border border-slate-800/80 rounded-xl p-3">
                            —
                          </p>
                        ) : (
                          subs.map((sub) => {
                            const isCurrentSub =
                              currentUser.role === "SUB_AGENT" && currentUser.id === sub.id;
                            return (
                              <div
                                key={sub.id}
                                className={`rounded-xl p-3 border flex items-center justify-between gap-2 ${
                                  isCurrentSub
                                    ? "bg-sky-500/30 border-sky-300 ring-1 ring-sky-300/60"
                                    : "bg-sky-500/15 border-sky-400/35"
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold text-sky-50 truncate">
                                    {sub.fullName}
                                  </p>
                                  <p className="text-[11px] text-sky-200/80 font-mono">
                                    {sub.subAgentCode || "ALT"}
                                  </p>
                                </div>
                                {isCurrentSub && (
                                  <span className="text-[10px] font-bold bg-sky-400/25 text-sky-100 px-2 py-0.5 rounded shrink-0">
                                    Aktif
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "tenants" && currentUser.role !== "SUB_AGENT" && (
            <div className="space-y-8">
              <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Kalıcı Veri Tabanı Bağlantısı (Firebase Realtime DB + Yerel Yedek)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Durum:{" "}
                    <strong
                      className={
                        dbStatus === "connected"
                          ? "text-emerald-400"
                          : dbStatus === "syncing"
                          ? "text-amber-400"
                          : dbStatus === "error"
                          ? "text-rose-400"
                          : "text-sky-400"
                      }
                    >
                      {dbStatus === "connected"
                        ? "Bağlı & Senkron"
                        : dbStatus === "syncing"
                        ? "Senkronize Ediliyor"
                        : dbStatus === "error"
                        ? "Bağlantı Hatası (Yerel Aktif)"
                        : "Yerel Kalıcı Hafıza Aktif"}
                    </strong>
                  </span>
                </div>

                <form onSubmit={handleSaveFirebaseUrl} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={dbUrlInput}
                    onChange={(e) => setDbUrlInput(e.target.value)}
                    placeholder="https://proje-adi-default-rtdb.firebaseio.com (Boş bırakılırsa yerel kalıcı DB çalışır)"
                    className="flex-1 bg-[#080c16] border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl inline-flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Bağla & Senkronize Et
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["Trial", "Basic", "Pro"] as PlanType[]).map((planKey) => (
                  <div
                    key={planKey}
                    className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {planKey} • {PLAN_SPECS[planKey].priceLabel}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PLAN_SPECS[planKey].badgeClass}`}
                      >
                        {planKey}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{PLAN_SPECS[planKey].summary}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Acente Saat, Para Birimi & Paket Süresi Kuralları
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hierarchyTenants.map((t) => (
                    <div
                      key={t.id}
                      className="bg-[#080c16] border border-slate-800 rounded-2xl p-4 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">{t.name}</span>
                        <span className="text-emerald-400 font-semibold shrink-0">
                          {calcRemainingDays(t.expiresAt, todayIso)} gün kaldı
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">
                            Giriş Saati
                          </label>
                          <input
                            type="time"
                            value={t.checkInTime}
                            onChange={(e) =>
                              handleUpdateTenantRules(t.id, { checkInTime: e.target.value })
                            }
                            className="bg-[#0e1422] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">
                            Çıkış Saati
                          </label>
                          <input
                            type="time"
                            value={t.checkOutTime}
                            onChange={(e) =>
                              handleUpdateTenantRules(t.id, { checkOutTime: e.target.value })
                            }
                            className="bg-[#0e1422] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">
                            Para Birimi
                          </label>
                          <select
                            value={t.currency}
                            onChange={(e) =>
                              handleUpdateTenantRules(t.id, {
                                currency: e.target.value as "₺" | "$" | "€",
                              })
                            }
                            className="bg-[#0e1422] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white w-full"
                          >
                            <option value="₺">TRY (₺)</option>
                            <option value="$">USD ($)</option>
                            <option value="€">EUR (€)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">
                            Paket Bitiş
                          </label>
                          <input
                            type="date"
                            value={t.expiresAt}
                            onChange={(e) =>
                              handleUpdateTenantRules(t.id, { expiresAt: e.target.value })
                            }
                            className="bg-[#0e1422] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isSuperAdmin && (
                <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-emerald-400 shrink-0" />
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Acente & Paket Yönetimi
                    </h2>
                  </div>

                  <form
                    onSubmit={handleAddTenantAgency}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#080c16] border border-slate-800 p-4 rounded-2xl"
                  >
                    <input
                      type="text"
                      required
                      value={newAgencyName}
                      onChange={(e) => setNewAgencyName(e.target.value)}
                      placeholder="Acente Adı"
                      className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={newAgencyOwnerName}
                      onChange={(e) => setNewAgencyOwnerName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newAgencyPlan}
                        onChange={(e) => setNewAgencyPlan(e.target.value as PlanType)}
                        className="bg-[#0e1422] border border-slate-700 rounded-xl px-2.5 py-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="Trial">Trial</option>
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                      </select>
                      <input
                        type="password"
                        required
                        value={newAgencyPassword}
                        onChange={(e) => setNewAgencyPassword(e.target.value)}
                        placeholder="Şifre"
                        className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Ekle
                    </button>
                  </form>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[640px]">
                      <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                        <tr>
                          <th className="p-3.5">Acente</th>
                          <th className="p-3.5">Paket</th>
                          <th className="p-3.5">Kalan Süre</th>
                          <th className="p-3.5">Paket Ücreti</th>
                          <th className="p-3.5">Durum</th>
                          <th className="p-3.5 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {tenants.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-800/30">
                            <td className="p-3.5 font-medium text-white">
                              {t.name}
                              <span className="block text-[11px] font-mono text-slate-500">{t.id}</span>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={t.plan}
                                onChange={(e) =>
                                  handleChangeTenantPlan(t.id, e.target.value as PlanType)
                                }
                                className="bg-[#080c16] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              >
                                <option value="Trial">Trial (14 Gün Ücretsiz)</option>
                                <option value="Basic">Basic (3.000 TL / Ay)</option>
                                <option value="Pro">Pro (5.000 TL / Ay)</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-xs text-slate-300">
                              {calcRemainingDays(t.expiresAt, todayIso)} gün ({t.expiresAt})
                            </td>
                            <td className="p-3.5 font-semibold text-emerald-400">
                              {PLAN_SPECS[t.plan].monthlyAmount.toLocaleString("tr-TR")} ₺
                            </td>
                            <td className="p-3.5 text-emerald-400">
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> {t.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleRemoveTenantAgency(t.id)}
                                className="bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Çıkar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-5 h-5 text-sky-400 shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold text-white">Bağlı Hesaplar</h2>
                </div>

                <form
                  onSubmit={handleAddSubAgent}
                  className={`grid grid-cols-1 ${
                    isSuperAdmin ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
                  } gap-3 bg-[#080c16] border border-slate-800 p-4 rounded-2xl`}
                >
                  {isSuperAdmin && (
                    <select
                      value={newSubTenantId}
                      onChange={(e) => setNewSubTenantId(e.target.value)}
                      className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    >
                      {tenants.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.plan})
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    required
                    value={newSubFullName}
                    onChange={(e) => setNewSubFullName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />

                  <input
                    type="password"
                    required
                    value={newSubPassword}
                    onChange={(e) => setNewSubPassword(e.target.value)}
                    placeholder="Şifre"
                    className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Ekle
                  </button>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[520px]">
                    <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                      <tr>
                        <th className="p-3.5">Kişi</th>
                        <th className="p-3.5">Acente</th>
                        <th className="p-3.5">Kod</th>
                        <th className="p-3.5 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {visibleSubAgents.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-800/30">
                          <td className="p-3.5 font-medium text-white">{sub.fullName}</td>
                          <td className="p-3.5 text-slate-300">{sub.tenantName}</td>
                          <td className="p-3.5 font-mono text-xs text-sky-400">
                            {sub.subAgentCode || "ALT"}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleRemoveSubAgent(sub.id)}
                              className="bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Çıkar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Aktif Satış Hacmi</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {totalSalesVolume.toLocaleString("tr-TR")} {activeRules.currency}
                  </p>
                </div>
                <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Tahsil Edilen / Kapora</p>
                  <p className="text-xl font-bold text-sky-400 mt-1">
                    {totalCollectedAmount.toLocaleString("tr-TR")} {activeRules.currency}
                  </p>
                </div>
                <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">
                    {isSuperAdmin ? "Toplam Paket Geliri" : "Toplam Komisyon"}
                  </p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">
                    +
                    {(isSuperAdmin
                      ? totalSubscriptionIncome
                      : totalAgentCommission
                    ).toLocaleString("tr-TR")}{" "}
                    {activeRules.currency}
                  </p>
                </div>
              </div>

              <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      PNR, Ödeme & Voucher Listesi
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      0-6 Yaş Ücretsiz • 7-12 Yaş %50 İndirimli • Tarih güncelleme, iptal ve PDF
                      voucher aktif
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="bg-[#080c16] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> CSV İndir
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[880px]">
                    <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                      <tr>
                        <th className="p-4">PNR</th>
                        <th className="p-4">Acente</th>
                        <th className="p-4">Misafirler</th>
                        <th className="p-4">Hizmet</th>
                        <th className="p-4">Tarih / Süre</th>
                        <th className="p-4">Tutar & Ödeme</th>
                        {!isSuperAdmin && <th className="p-4">Komisyon</th>}
                        <th className="p-4">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {visibleBookings.map((b, idx) => {
                        const isCancelled = b.status === "İptal Edildi";
                        const bCurrency = getTenantRules(b.tenantId).currency;
                        return (
                          <tr
                            key={`${b.pnr}-${idx}`}
                            className={`hover:bg-slate-800/30 ${
                              isCancelled ? "opacity-60" : ""
                            }`}
                          >
                            <td className="p-4 font-mono font-bold text-indigo-400">
                              <span>{b.pnr}</span>
                              <span
                                className={`block text-[10px] font-sans mt-0.5 ${
                                  isCancelled ? "text-rose-400" : "text-emerald-400"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-xs">
                              <span className="font-semibold text-white block">{b.tenantName}</span>
                              <span className="text-slate-400">{b.agentName}</span>
                            </td>
                            <td className="p-4 text-xs">
                              <span className="font-semibold text-white block">
                                {b.guestNames && b.guestNames.length > 0
                                  ? b.guestNames.join(", ")
                                  : b.customerName}
                              </span>
                              {b.freeChildCount > 0 && (
                                <span className="text-emerald-400 block mt-0.5">
                                  + {b.freeChildCount} Çocuk (0-6 Yaş Ücretsiz)
                                  {b.freeChildNames.filter(Boolean).length > 0
                                    ? `: ${b.freeChildNames.filter(Boolean).join(", ")}`
                                    : ""}
                                </span>
                              )}
                              {b.discountedChildCount > 0 && (
                                <span className="text-sky-400 block mt-0.5">
                                  + {b.discountedChildCount} Çocuk (7-12 Yaş %50 İnd.)
                                  {b.discountedChildNames.filter(Boolean).length > 0
                                    ? `: ${b.discountedChildNames.filter(Boolean).join(", ")}`
                                    : ""}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-300">{b.itemTitle}</td>
                            <td className="p-4 text-slate-300 text-xs">
                              <span className="text-emerald-400 font-semibold block">
                                {b.startDate === b.endDate
                                  ? b.startDate
                                  : `${b.startDate} → ${b.endDate}`}
                              </span>
                              <span className="text-slate-400">
                                {b.chargedDays} Gün • {b.pax} Yetişkin
                              </span>
                            </td>
                            <td className="p-4 text-xs">
                              <span className="font-bold text-white block">
                                {b.totalAmount} {bCurrency}
                              </span>
                              <span className="text-slate-400 block">
                                {b.paymentStatus} ({b.paidAmount} {bCurrency})
                              </span>
                            </td>
                            {!isSuperAdmin && (
                              <td className="p-4 font-bold text-emerald-400">
                                +{b.commissionEarned} {bCurrency}
                              </td>
                            )}
                            <td className="p-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  onClick={() => sendWhatsAppVoucher(b)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                                  title="WhatsApp Voucher"
                                >
                                  <Send className="w-3.5 h-3.5" /> WA
                                </button>
                                <button
                                  onClick={() => setPrintVoucherBooking(b)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                                  title="Yazdır / PDF Voucher"
                                >
                                  <Printer className="w-3.5 h-3.5" /> PDF
                                </button>
                                {!isCancelled && (
                                  <>
                                    <button
                                      onClick={() => openRescheduleModal(b)}
                                      className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-medium px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                                      title="Tarih & Ödeme Güncelle"
                                    >
                                      <CalendarCog className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleCancelBooking(b)}
                                      className="bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-medium px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                                      title="Rezervasyonu İptal Et"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {isAddModalOpen && currentUser.role !== "SUB_AGENT" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                {editingItemId ? (
                  <Pencil className="w-5 h-5 text-indigo-400" />
                ) : (
                  <PackagePlus className="w-5 h-5 text-emerald-400" />
                )}
                <h3 className="font-bold text-white">
                  {editingItemId ? "Bilgi, Resim & Fiyat Düzenle" : "Yeni Kontenjan"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItemId(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInventoryModal} className="space-y-4">
              {isSuperAdmin && !editingItemId && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Acente</label>
                  <select
                    value={targetTenantId}
                    onChange={(e) => setTargetTenantId(e.target.value)}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.plan})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  >
                    <option value="TUR">TUR</option>
                    <option value="OTEL">OTEL</option>
                    <option value="UÇAK">UÇAK</option>
                    <option value="PANSİYON">PANSİYON</option>
                    <option value="OTOBÜS">OTOBÜS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Adet / Kontenjan</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newQuota}
                    onChange={(e) => setNewQuota(Number(e.target.value))}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Başlık / Rota / Tesis</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Kapadokya Balon Turu / Hilton Otel / THY Uçuş"
                  className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                />
              </div>

              <div className="space-y-2 bg-[#080c16] border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs text-slate-300 font-medium inline-flex items-center gap-1.5">
                    <ImagePlus className="w-4 h-4 text-indigo-400" /> Görsel (Dosya veya Link)
                  </label>
                  <label className="bg-[#0e1422] hover:bg-slate-800 border border-slate-700 text-xs text-indigo-300 px-2.5 py-1 rounded-lg cursor-pointer transition">
                    Dosya Seç
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={newImageSrc}
                  onChange={(e) => setNewImageSrc(e.target.value)}
                  placeholder="/2.webp veya https://..."
                  className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white w-full focus:outline-none"
                />

                {newImageSrc && (
                  <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-800">
                    <ShowcaseImage
                      src={newImageSrc}
                      alt={newTitle || "Önizleme"}
                      fallbackGradient="from-indigo-950 via-slate-900 to-emerald-950"
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Net Fiyat</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newNetPrice}
                    onChange={(e) => setNewNetPrice(Number(e.target.value))}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Satış Fiyatı</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newSellPrice}
                    onChange={(e) => setNewSellPrice(Number(e.target.value))}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center">
                <span className="text-xs text-slate-300">Komisyon:</span>
                <span className="text-base font-bold text-emerald-400">
                  +{calculatedNewCommission} {activeRules.currency}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
              >
                {editingItemId ? "Değişiklikleri Kaydet" : "Yayınla"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedItem && (() => {
        const itemRules = getTenantRules(selectedItem.tenantId);
        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white">Rezervasyon & PNR</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!lastCreatedBooking ? (
                <form onSubmit={handleCreateReservation} className="space-y-4">
                  <div className="bg-[#080c16] border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                    <p className="text-xs text-indigo-400 font-semibold">
                      {selectedItem.tenantName} • {selectedItem.category}
                    </p>
                    <p className="text-sm font-bold text-white">{selectedItem.title}</p>
                    <p className="text-xs text-slate-400">
                      <span className="text-white font-semibold">
                        {selectedItem.sellPrice} {itemRules.currency} / Gün
                      </span>{" "}
                      • Kalan:{" "}
                      <span className="text-emerald-400 font-semibold">{selectedItem.quota}</span>
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-amber-300">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> {itemRules.checkInRule}
                      </span>
                      <span>•</span>
                      <span>{itemRules.checkOutRule}</span>
                    </div>
                  </div>

                  <div className="bg-[#080c16] border border-slate-800 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs text-slate-300 font-medium inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-400" /> Başlangıç & Bitiş Tarihi
                      </label>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Seçili
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" /> Dolu
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#0e1422] border border-emerald-500/30 rounded-lg px-2.5 py-1.5">
                        <span className="block text-[10px] text-slate-400">
                          Başlangıç ({itemRules.checkInRule})
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {startDate || "Seçiniz"}
                        </span>
                      </div>
                      <div className="bg-[#0e1422] border border-emerald-500/30 rounded-lg px-2.5 py-1.5">
                        <span className="block text-[10px] text-slate-400">
                          Bitiş ({itemRules.checkOutRule})
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {effectiveEndDate || "Seçiniz"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {calendarDays.map((day) => {
                        const isBlocked = blockedDatesSet.has(day.iso);
                        const isInRange = !isBlocked && selectedRangeSet.has(day.iso);
                        const isStartOrEnd =
                          !isBlocked && (day.iso === startDate || day.iso === effectiveEndDate);
                        const isCheckoutOnlyDay =
                          hasCheckoutDay && day.iso === effectiveEndDate && !isBlocked;

                        return (
                          <button
                            key={day.iso}
                            type="button"
                            disabled={isBlocked}
                            onClick={() => handleSelectCalendarDay(day.iso)}
                            title={
                              isBlocked
                                ? `${day.iso} - Dolu / Seçilmiş`
                                : isCheckoutOnlyDay
                                ? `${day.iso} - Çıkış Günü (fiyata dahil değil)`
                                : `${day.iso} - Müsait`
                            }
                            className={`py-1.5 px-1 rounded-lg border text-center transition flex flex-col items-center ${
                              isBlocked
                                ? "bg-slate-900/80 border-slate-800 text-slate-500 line-through cursor-not-allowed opacity-60"
                                : isStartOrEnd
                                ? "bg-emerald-600 border-emerald-300 text-white font-bold shadow-sm cursor-pointer"
                                : isInRange
                                ? "bg-emerald-500/35 border-emerald-400/70 text-emerald-100 font-semibold cursor-pointer"
                                : "bg-slate-800/90 hover:bg-emerald-500/20 border-slate-700 text-white font-medium cursor-pointer"
                            }`}
                          >
                            <span className="text-[9px] opacity-75 leading-tight">{day.weekday}</span>
                            <span className="text-xs leading-tight">{day.dayNum}</span>
                            {isCheckoutOnlyDay && (
                              <span className="text-[8px] font-bold text-emerald-200 leading-none mt-0.5">
                                Çıkış
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {rangeWarning && (
                      <p className="text-[11px] text-amber-400">{rangeWarning}</p>
                    )}

                    {startDate && (
                      <div className="text-[11px] text-emerald-400 font-mono space-y-0.5">
                        <p>
                          Aralık:{" "}
                          <span className="font-bold">
                            {startDate === effectiveEndDate
                              ? `${startDate} (1 Gün)`
                              : `${startDate} → ${effectiveEndDate}`}
                          </span>
                        </p>
                        <p className="text-slate-300 font-sans">
                          Fiyata dahil süre:{" "}
                          <span className="text-emerald-400 font-bold">{chargedDaysCount} Gün</span>
                          {hasCheckoutDay ? " (son gün çıkış günü olduğu için fiyata dahil değil)" : ""}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        13+ Kişi Adedi
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={Math.max(1, selectedItem.quota)}
                        required
                        value={paxCount}
                        onChange={(e) => syncPaxCount(Number(e.target.value))}
                        className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white w-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-400 font-medium mb-1">
                        0-6 Yaş (Ücretsiz)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={freeChildCount}
                        onChange={(e) => syncFreeChildCount(Number(e.target.value))}
                        className="bg-[#080c16] border border-emerald-500/35 rounded-xl px-3 py-2 text-sm text-white w-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-sky-400 font-medium mb-1">
                        7-12 Yaş (%50 İnd.)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={discountedChildCount}
                        onChange={(e) => syncDiscountedChildCount(Number(e.target.value))}
                        className="bg-[#080c16] border border-sky-500/35 rounded-xl px-3 py-2 text-sm text-white w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 bg-[#080c16] border border-slate-800 rounded-xl p-3">
                    <p className="text-xs font-semibold text-slate-300">
                      Misafir İsimleri ({paxCount} Kişi)
                    </p>
                    {Array.from({ length: paxCount }, (_, idx) => (
                      <div key={idx}>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          {idx + 1}. Kişi Adı Soyadı
                        </label>
                        <div className="flex items-center gap-2 bg-[#0e1422] border border-slate-700 focus-within:border-indigo-500 rounded-xl px-3 py-2">
                          <User className="w-4 h-4 text-slate-500 shrink-0" />
                          <input
                            type="text"
                            required
                            value={guestNames[idx] || ""}
                            onChange={(e) => {
                              const updated = [...guestNames];
                              updated[idx] = e.target.value;
                              setGuestNames(updated);
                            }}
                            placeholder={`${idx + 1}. Kişi Adı Soyadı`}
                            className="bg-transparent text-sm text-white w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {freeChildCount > 0 && (
                    <div className="space-y-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-300 inline-flex items-center gap-1.5">
                        <Baby className="w-4 h-4" /> 0-6 Yaş Çocuklar (Ücretsiz - {freeChildCount})
                      </p>
                      {Array.from({ length: freeChildCount }, (_, idx) => (
                        <div key={idx}>
                          <label className="block text-[11px] text-emerald-200/80 mb-1">
                            {idx + 1}. Çocuk Adı Soyadı (0-6 Yaş • Ücretsiz)
                          </label>
                          <input
                            type="text"
                            value={freeChildNames[idx] || ""}
                            onChange={(e) => {
                              const updated = [...freeChildNames];
                              updated[idx] = e.target.value;
                              setFreeChildNames(updated);
                            }}
                            placeholder={`${idx + 1}. Çocuk Adı Soyadı`}
                            className="bg-[#080c16] border border-emerald-500/30 rounded-xl px-3 py-2 text-sm text-white w-full focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {discountedChildCount > 0 && (
                    <div className="space-y-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl p-3">
                      <p className="text-xs font-semibold text-sky-300 inline-flex items-center gap-1.5">
                        <Baby className="w-4 h-4" /> 7-12 Yaş Çocuklar (%50 İndirimli -{" "}
                        {discountedChildCount})
                      </p>
                      {Array.from({ length: discountedChildCount }, (_, idx) => (
                        <div key={idx}>
                          <label className="block text-[11px] text-sky-200/80 mb-1">
                            {idx + 1}. Çocuk Adı Soyadı (7-12 Yaş • %50 İndirimli)
                          </label>
                          <input
                            type="text"
                            value={discountedChildNames[idx] || ""}
                            onChange={(e) => {
                              const updated = [...discountedChildNames];
                              updated[idx] = e.target.value;
                              setDiscountedChildNames(updated);
                            }}
                            placeholder={`${idx + 1}. Çocuk Adı Soyadı`}
                            className="bg-[#080c16] border border-sky-500/30 rounded-xl px-3 py-2 text-sm text-white w-full focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#080c16] border border-slate-800 rounded-xl p-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 inline-flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-indigo-400" /> Ödeme Durumu
                      </label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => {
                          const st = e.target.value as PaymentStatus;
                          setPaymentStatus(st);
                          if (st === "Ödendi") setDepositAmount(computedTotalAmount);
                          if (st === "Acente Cari") setDepositAmount(0);
                        }}
                        className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white w-full focus:outline-none"
                      >
                        <option value="Ödendi">Ödendi</option>
                        <option value="Kapora Alındı">Kapora Alındı</option>
                        <option value="Acente Cari">Acente Cari</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Alınan Tutar ({itemRules.currency})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={computedTotalAmount}
                        disabled={paymentStatus !== "Kapora Alındı"}
                        value={
                          paymentStatus === "Ödendi"
                            ? computedTotalAmount
                            : paymentStatus === "Acente Cari"
                            ? 0
                            : depositAmount
                        }
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="bg-[#0e1422] disabled:opacity-60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">İletişim Telefonu</label>
                    <div className="flex items-center gap-2 bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="05XX XXX XX XX"
                        className="bg-transparent text-sm text-white w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">
                        Tutar ({chargedDaysCount} Gün × {paxCount} Kişi
                        {discountedChildCount > 0 ? ` + ${discountedChildCount}×0.5 Çocuk` : ""}
                        {freeChildCount > 0 ? ` + ${freeChildCount} Çocuk Ücretsiz` : ""})
                      </p>
                      <p className="text-lg font-bold text-white">
                        {computedTotalAmount} {itemRules.currency}
                      </p>
                    </div>
                    {!isSuperAdmin && (
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Komisyon</p>
                        <p className="text-sm font-bold text-emerald-400">
                          +{computedCommissionEarned} {itemRules.currency}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!startDate}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
                  >
                    Onayla & PNR Üret
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-mono font-bold text-white mt-1">
                      {lastCreatedBooking.pnr}
                    </h4>
                  </div>

                  <div className="bg-[#080c16] border border-slate-800 rounded-xl p-3.5 text-left text-xs space-y-1.5">
                    <div className="text-slate-300 space-y-0.5">
                      {lastCreatedBooking.guestNames.map((g, i) => (
                        <p key={i}>
                          <span className="text-slate-400">{i + 1}. Kişi:</span>{" "}
                          <span className="text-white font-semibold">{g}</span>
                        </p>
                      ))}
                    </div>
                    {lastCreatedBooking.freeChildCount > 0 && (
                      <p className="text-emerald-400 font-medium">
                        0-6 Yaş Çocuk (Ücretsiz): {lastCreatedBooking.freeChildCount} Çocuk
                        {lastCreatedBooking.freeChildNames.filter(Boolean).length > 0
                          ? ` (${lastCreatedBooking.freeChildNames.filter(Boolean).join(", ")})`
                          : ""}
                      </p>
                    )}
                    {lastCreatedBooking.discountedChildCount > 0 && (
                      <p className="text-sky-400 font-medium">
                        7-12 Yaş Çocuk (%50 İnd.): {lastCreatedBooking.discountedChildCount} Çocuk
                        {lastCreatedBooking.discountedChildNames.filter(Boolean).length > 0
                          ? ` (${lastCreatedBooking.discountedChildNames.filter(Boolean).join(", ")})`
                          : ""}
                      </p>
                    )}
                    <p className="text-slate-400">
                      <span className="text-white font-medium">{lastCreatedBooking.itemTitle}</span>
                    </p>
                    <p className="text-emerald-400 font-semibold">
                      {lastCreatedBooking.startDate === lastCreatedBooking.endDate
                        ? `${lastCreatedBooking.startDate} (${lastCreatedBooking.chargedDays} Gün)`
                        : `${lastCreatedBooking.startDate} → ${lastCreatedBooking.endDate} (${lastCreatedBooking.chargedDays} Gün Ücretlendirildi)`}
                    </p>
                    <p className="text-slate-400">
                      {itemRules.checkInRule} • {itemRules.checkOutRule}
                    </p>
                    <p className="text-slate-400">
                      <span className="text-indigo-400 font-bold">
                        {lastCreatedBooking.totalAmount} {itemRules.currency}
                      </span>{" "}
                      • {lastCreatedBooking.paymentStatus} ({lastCreatedBooking.paidAmount}{" "}
                      {itemRules.currency})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => sendWhatsAppVoucher(lastCreatedBooking)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> WhatsApp Voucher
                    </button>
                    <button
                      onClick={() => setPrintVoucherBooking(lastCreatedBooking)}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Yazdır / PDF
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full text-xs text-slate-400 hover:text-white py-2"
                  >
                    Kapat
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-sm p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                Tarih & Ödeme Güncelle ({rescheduleTarget.pnr})
              </h3>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Başlangıç Tarihi</label>
                <input
                  type="date"
                  required
                  value={rescheduleStart}
                  onChange={(e) => setRescheduleStart(e.target.value)}
                  className="bg-[#080c16] border border-slate-700 rounded-xl px-3 py-2 text-white w-full"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Bitiş Tarihi</label>
                <input
                  type="date"
                  required
                  value={rescheduleEnd}
                  onChange={(e) => setRescheduleEnd(e.target.value)}
                  className="bg-[#080c16] border border-slate-700 rounded-xl px-3 py-2 text-white w-full"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Ödeme Durumu</label>
                <select
                  value={reschedulePayment}
                  onChange={(e) => setReschedulePayment(e.target.value as PaymentStatus)}
                  className="bg-[#080c16] border border-slate-700 rounded-xl px-3 py-2 text-white w-full"
                >
                  <option value="Ödendi">Ödendi</option>
                  <option value="Kapora Alındı">Kapora Alındı</option>
                  <option value="Acente Cari">Acente Cari</option>
                </select>
              </div>
              {reschedulePayment === "Kapora Alındı" && (
                <div>
                  <label className="block text-slate-400 mb-1">Alınan Kapora Tutarı</label>
                  <input
                    type="number"
                    min={0}
                    value={reschedulePaid}
                    onChange={(e) => setReschedulePaid(Number(e.target.value))}
                    className="bg-[#080c16] border border-slate-700 rounded-xl px-3 py-2 text-white w-full"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer"
              >
                Güncellemeyi Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {printVoucherBooking && (() => {
        const vRules = getTenantRules(printVoucherBooking.tenantId);
        const remainingBalance = Math.max(
          0,
          printVoucherBooking.totalAmount - printVoucherBooking.paidAmount
        );
        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1422] border border-slate-700 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 no-print">
                <h3 className="font-bold text-white text-sm">
                  Yazdırılabilir Voucher ({printVoucherBooking.pnr})
                </h3>
                <button
                  onClick={() => setPrintVoucherBooking(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                id="printable-voucher-area"
                className="bg-[#080c16] border border-slate-800 rounded-2xl p-5 space-y-3 text-xs text-slate-200"
              >
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold">
                      {printVoucherBooking.tenantName}
                    </p>
                    <h4 className="text-lg font-extrabold text-white mt-0.5">
                      REZERVASYON VOUCHER
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">PNR KODU</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      {printVoucherBooking.pnr}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-slate-400 block">Hizmet</span>
                    <strong className="text-white">{printVoucherBooking.itemTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Danışman / Acente</span>
                    <strong className="text-white">{printVoucherBooking.agentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tarih Aralığı</span>
                    <strong className="text-emerald-400">
                      {printVoucherBooking.startDate} → {printVoucherBooking.endDate} (
                      {printVoucherBooking.chargedDays} Gün)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Saat Kuralları</span>
                    <strong className="text-amber-300">
                      {vRules.checkInRule} • {vRules.checkOutRule}
                    </strong>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2.5 space-y-1">
                  <span className="text-slate-400 block">
                    Misafirler ({printVoucherBooking.pax} Kişi):
                  </span>
                  <p className="text-white font-semibold">
                    {(printVoucherBooking.guestNames?.length
                      ? printVoucherBooking.guestNames
                      : [printVoucherBooking.customerName]
                    )
                      .map((g, idx) => `${idx + 1}. ${g}`)
                      .join(" • ")}
                  </p>
                  {printVoucherBooking.freeChildCount > 0 && (
                    <p className="text-emerald-400">
                      0-6 Yaş Çocuk (Ücretsiz): {printVoucherBooking.freeChildCount} Çocuk
                      {printVoucherBooking.freeChildNames.filter(Boolean).length > 0
                        ? ` (${printVoucherBooking.freeChildNames.filter(Boolean).join(", ")})`
                        : ""}
                    </p>
                  )}
                  {printVoucherBooking.discountedChildCount > 0 && (
                    <p className="text-sky-400">
                      7-12 Yaş Çocuk (%50 İnd.): {printVoucherBooking.discountedChildCount} Çocuk
                      {printVoucherBooking.discountedChildNames.filter(Boolean).length > 0
                        ? ` (${printVoucherBooking.discountedChildNames.filter(Boolean).join(", ")})`
                        : ""}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-400">Ödeme: </span>
                    <strong className="text-white">
                      {printVoucherBooking.paymentStatus} ({printVoucherBooking.paidAmount}{" "}
                      {vRules.currency} • Kalan: {remainingBalance} {vRules.currency})
                    </strong>
                  </div>
                  <div className="text-sm font-extrabold text-indigo-400">
                    Toplam: {printVoucherBooking.totalAmount} {vRules.currency}
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Yazdır / PDF Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setPrintVoucherBooking(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}