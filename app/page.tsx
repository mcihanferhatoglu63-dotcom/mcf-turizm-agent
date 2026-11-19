"use client";

import React, { useState } from "react";
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
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "SUB_AGENT";
type PlanType = "Trial" | "Basic" | "Pro";
type ActiveTab = "dashboard" | "tenants" | "hierarchy" | "bookings";

interface TenantAgency {
  id: string;
  name: string;
  plan: PlanType;
  revenue: string;
  status: "Aktif" | "Deneme";
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
}

interface BookingItem {
  pnr: string;
  tenantId: string;
  tenantName: string;
  agentUsername: string;
  agentName: string;
  customerName: string;
  customerPhone: string;
  itemTitle: string;
  pax: number;
  date: string;
  totalAmount: number;
  commissionEarned: number;
  status: string;
}

interface PlanSpec {
  priceLabel: string;
  periodLabel: string;
  badgeClass: string;
  cardBorder: string;
  maxInventory: number;
  maxSubAgents: number;
  summary: string;
  features: string[];
}

const PLAN_SPECS: Record<PlanType, PlanSpec> = {
  Trial: {
    priceLabel: "14 Gün Ücretsiz",
    periodLabel: "Deneme Paketi",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    cardBorder: "border-amber-400/30",
    maxInventory: 2,
    maxSubAgents: 1,
    summary: "En fazla 2 kontenjan ve 1 alt acente",
    features: [
      "14 gün ücretsiz kullanım",
      "En fazla 2 aktif kontenjan",
      "1 alt acente (Sub-Agent) hesabı",
      "PNR üretimi ve WhatsApp voucher",
    ],
  },
  Basic: {
    priceLabel: "3.000 TL",
    periodLabel: "/ Aylık",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    cardBorder: "border-sky-400/35",
    maxInventory: 5,
    maxSubAgents: 3,
    summary: "En fazla 5 kontenjan ve 3 alt acente",
    features: [
      "En fazla 5 aktif kontenjan",
      "3 alt acente hesabı ve yetki ayrımı",
      "Net / Rack fiyat ve komisyon takibi",
      "PNR kaydı ve dijital voucher gönderimi",
    ],
  },
  Pro: {
    priceLabel: "5.000 TL",
    periodLabel: "/ Aylık",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    cardBorder: "border-emerald-400/45",
    maxInventory: Infinity,
    maxSubAgents: Infinity,
    summary: "Sınırsız kontenjan, alt acente ve tüm modüller",
    features: [
      "Sınırsız kontenjan ve hizmet havuzu",
      "Sınırsız alt acente ve hiyerarşi yönetimi",
      "Gelişmiş komisyon ve satış raporlama",
      "Öncelikli altyapı ve tüm B2B modüller",
    ],
  },
};

const HOLIDAY_SHOWCASE = [
  {
    src: "/3.webp",
    tag: "MAVİ TUR & KOYLAR",
    title: "Turkuaz Koylar ve Tekne Rotaları",
    accent: "from-cyan-950 via-sky-900 to-indigo-950",
  },
  {
    src: "/2.webp",
    tag: "KAPADOKYA & BALON",
    title: "Gündoğumu Balon ve Bölge Turları",
    accent: "from-amber-950 via-orange-900 to-sky-950",
  },
  {
    src: "/1.webp",
    tag: "DOĞA & GÖL TATİLİ",
    title: "Sonbahar Göl Kenarı Huzur Rotaları",
    accent: "from-orange-950 via-amber-900 to-stone-950",
  },
  {
    src: "/4.jpg",
    tag: "KIŞ & DAĞ EVİ",
    title: "Karlı Orman ve Dağ Evi Konaklama",
    accent: "from-slate-900 via-blue-950 to-indigo-950",
  },
  {
    src: "/5.png",
    tag: "TAŞ KONAK & BUTİK OTEL",
    title: "Begonvilli Taş Sokak Butik Otelleri",
    accent: "from-fuchsia-950 via-stone-900 to-amber-950",
  },
];

const IBAN_OWNER = "Mehmet Cihan Ferhatoğlu";
const IBAN_NUMBER = "TR11 0004 904482759750 06";

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
  const [tenants, setTenants] = useState<TenantAgency[]>([
    {
      id: "FIRM-AKDENIZ",
      name: "Akdeniz Turizm A.Ş.",
      plan: "Pro",
      revenue: "425.000 ₺",
      status: "Aktif",
    },
    {
      id: "FIRM-ERDEMLI",
      name: "Erdemli & Silifke Travel",
      plan: "Basic",
      revenue: "148.000 ₺",
      status: "Aktif",
    },
    {
      id: "FIRM-DEMO",
      name: "Mersin Demo Acente",
      plan: "Trial",
      revenue: "12.000 ₺",
      status: "Deneme",
    },
  ]);

  const [accounts, setAccounts] = useState<UserAccount[]>([
    {
      id: "usr-super",
      username: "superadmin",
      password: "123",
      fullName: "Mehmet Cihan • Süper Admin",
      role: "SUPER_ADMIN",
      tenantId: null,
      tenantName: "MCF B2B Turizm Altyapısı",
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

  const [selectedAccountId, setSelectedAccountId] = useState<string>("usr-akdeniz-owner");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
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
      customerPhone: "905551112233",
      itemTitle: "Kızkalesi Panorama Butik Otel",
      pax: 1,
      date: "2026-11-22",
      totalAmount: 1500,
      commissionEarned: 300,
      status: "Onaylandı",
    },
    {
      pnr: "MCF-4823",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
      agentUsername: "erdemli_alt1",
      agentName: "Deniz Koç",
      customerName: "Caner Özkan",
      customerPhone: "905557778899",
      itemTitle: "Silifke Sahil Aile Pansiyonu",
      pax: 1,
      date: "2026-11-26",
      totalAmount: 1000,
      commissionEarned: 200,
      status: "Onaylandı",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paxCount, setPaxCount] = useState(1);
  const [travelDate, setTravelDate] = useState("2026-11-25");
  const [lastCreatedBooking, setLastCreatedBooking] = useState<BookingItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("OTEL");
  const [newTitle, setNewTitle] = useState("");
  const [newQuota, setNewQuota] = useState(5);
  const [newNetPrice, setNewNetPrice] = useState(1000);
  const [newSellPrice, setNewSellPrice] = useState(1300);
  const [targetTenantId, setTargetTenantId] = useState("FIRM-AKDENIZ");

  const chosenAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const getTenantPlan = (tenantId: string | null): PlanType => {
    if (!tenantId) return "Pro";
    return tenants.find((t) => t.id === tenantId)?.plan || "Trial";
  };

  const currentPlan: PlanType = currentUser
    ? currentUser.role === "SUPER_ADMIN"
      ? "Pro"
      : getTenantPlan(currentUser.tenantId)
    : "Trial";

  const handleCopyIban = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(IBAN_NUMBER).catch(() => {});
    }
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenAccount) return;

    if (loginPassword !== chosenAccount.password) {
      setLoginError(`"${chosenAccount.fullName}" hesabı için şifre hatalı.`);
      return;
    }

    setCurrentUser(chosenAccount);
    setLoginPassword("");
    setLoginError("");
    setLimitNotice("");
    setActiveTab("dashboard");
    setMobileMenuOpen(false);
    if (chosenAccount.tenantId) {
      setNewSubTenantId(chosenAccount.tenantId);
      setTargetTenantId(chosenAccount.tenantId);
    } else if (tenants[0]) {
      setNewSubTenantId(tenants[0].id);
      setTargetTenantId(tenants[0].id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginPassword("");
    setLoginError("");
    setLimitNotice("");
    setSelectedItem(null);
    setIsAddModalOpen(false);
    setMobileMenuOpen(false);
  };

  const handleChangeTenantPlan = (tenantId: string, nextPlan: PlanType) => {
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") return;
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? { ...t, plan: nextPlan, status: nextPlan === "Trial" ? "Deneme" : "Aktif" }
          : t
      )
    );
    setLimitNotice("");
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
    if (selectedAccountId && accounts.find((a) => a.id === selectedAccountId)?.tenantId === tenantId) {
      setSelectedAccountId("usr-akdeniz-owner");
    }
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
        `${parentTenant.name} (${parentTenant.plan} paket) alt acente limitine (${maxSubs}) ulaştı. Sınırsız alt acente için Pro pakete geçin.`
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
    if (selectedAccountId === subId) {
      setSelectedAccountId("usr-akdeniz-owner");
    }
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

  const totalCommission = visibleBookings.reduce((acc, b) => acc + b.commissionEarned, 0);
  const calculatedNewCommission = Math.max(0, newSellPrice - newNetPrice);

  const handleOpenAddInventoryModal = () => {
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    const activeTenantId =
      currentUser.role === "SUPER_ADMIN" ? targetTenantId : currentUser.tenantId || tenants[0]?.id;
    const plan = getTenantPlan(activeTenantId);
    const currentTenantInventoryCount = inventory.filter((i) => i.tenantId === activeTenantId).length;
    const limit = PLAN_SPECS[plan].maxInventory;

    if (currentUser.role !== "SUPER_ADMIN" && currentTenantInventoryCount >= limit) {
      setLimitNotice(
        `${currentUser.tenantName} (${plan} paket) kontenjan ekleme sınırına (${limit} adet) ulaştı. Daha fazla kontenjan eklemek için Pro pakete yükseltin.`
      );
      return;
    }

    setLimitNotice("");
    setIsAddModalOpen(true);
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    if (!newTitle.trim() || newQuota <= 0) return;

    const assignedTenantId =
      currentUser.role === "SUPER_ADMIN" ? targetTenantId : currentUser.tenantId || tenants[0]?.id;
    const plan = getTenantPlan(assignedTenantId);
    const currentTenantInventoryCount = inventory.filter((i) => i.tenantId === assignedTenantId).length;
    const limit = PLAN_SPECS[plan].maxInventory;

    if (currentUser.role !== "SUPER_ADMIN" && currentTenantInventoryCount >= limit) {
      setIsAddModalOpen(false);
      setLimitNotice(
        `${currentUser.tenantName} (${plan} paket) maksimum ${limit} kontenjan sınırına ulaştı. Pro pakete geçerek sınırsız ekleyebilirsiniz.`
      );
      return;
    }

    const assignedTenantName =
      tenants.find((t) => t.id === assignedTenantId)?.name || currentUser.tenantName;

    const categoryPhotoMap: Record<string, string> = {
      OTEL: "/3.webp",
      PANSİYON: "/5.png",
      TUR: "/2.webp",
      OTOBÜS: "/1.webp",
      UÇAK: "/4.jpg",
    };

    const newItem: InventoryItem = {
      id: `${newCategory.slice(0, 3)}-${Math.floor(10 + Math.random() * 89)}`,
      tenantId: assignedTenantId,
      tenantName: assignedTenantName,
      category: newCategory,
      title: newTitle.trim(),
      quota: newQuota,
      netPrice: newNetPrice,
      sellPrice: newSellPrice,
      commission: calculatedNewCommission,
      imageSrc: categoryPhotoMap[newCategory] || "/3.webp",
    };

    setInventory([newItem, ...inventory]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewQuota(5);
    setNewNetPrice(1000);
    setNewSellPrice(1300);
  };

  const openBookingModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setCustomerName("");
    setCustomerPhone("");
    setPaxCount(1);
    setLastCreatedBooking(null);
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedItem || !customerName.trim() || !customerPhone.trim()) return;

    const randomPnr = `MCF-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanPhone = customerPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("90")
      ? cleanPhone
      : `90${cleanPhone.replace(/^0/, "")}`;

    const newBooking: BookingItem = {
      pnr: randomPnr,
      tenantId: selectedItem.tenantId,
      tenantName: selectedItem.tenantName,
      agentUsername: currentUser.username,
      agentName: currentUser.fullName,
      customerName: customerName.trim(),
      customerPhone: formattedPhone,
      itemTitle: selectedItem.title,
      pax: paxCount,
      date: travelDate,
      totalAmount: selectedItem.sellPrice * paxCount,
      commissionEarned: selectedItem.commission * paxCount,
      status: "Onaylandı",
    };

    setBookings([newBooking, ...bookings]);

    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === selectedItem.id
          ? { ...inv, quota: Math.max(0, inv.quota - paxCount) }
          : inv
      )
    );

    setLastCreatedBooking(newBooking);
  };

  const sendWhatsAppVoucher = (b: BookingItem) => {
    const voucherText =
      `*MCF B2B • ${b.tenantName} | RESMİ VOUCHER*\n` +
      `----------------------------------\n` +
      `*PNR Kodu:* ${b.pnr}\n` +
      `*Misafir:* ${b.customerName}\n` +
      `*Hizmet:* ${b.itemTitle}\n` +
      `*Tarih:* ${b.date}\n` +
      `*Kişi / Adet:* ${b.pax}\n` +
      `*Toplam Tutar:* ${b.totalAmount} ₺\n` +
      `*Durum:* ${b.status}\n` +
      `----------------------------------\n` +
      `MCF Technology & Software Solutions`;

    window.open(
      `https://wa.me/${b.customerPhone}?text=${encodeURIComponent(voucherText)}`,
      "_blank"
    );
  };

  // ÖN YÜZ TASARIMI: TATİL GÖRSELLERİ, ABONELİK PAKETLERİ & İÇERİKLERİ, IBAN VE HİYERARŞİK GİRİŞ
  if (!currentUser) {
    const superAdminAcc = accounts.find((a) => a.role === "SUPER_ADMIN");
    const isSuperSelected = superAdminAcc?.id === selectedAccountId;

    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 py-5 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ÜST BAR + SAĞ ÜSTTE KÜÇÜK SÜPER ADMİN */}
          <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5 min-w-0">
              <BrandLogo size="lg" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-white truncate">
                  MCF B2B TURİZM & KONTENJAN PORTALI
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Ana acente, alt acente, anlık kontenjan, PNR ve WhatsApp voucher yönetimi
                </p>
              </div>
            </div>

            {superAdminAcc && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAccountId(superAdminAcc.id);
                  setLoginError("");
                }}
                title="Sistem Operatörü Girişi"
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  isSuperSelected
                    ? "bg-amber-500/25 border-amber-400 text-amber-200"
                    : "bg-[#080c16] border-slate-800 text-slate-400 hover:text-amber-200 hover:border-amber-500/40"
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* TATİL VİTRİN GÖRSELLERİ */}
          <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Seçkin Tatil & Tur Rotaları
                </h2>
                <p className="text-xs text-slate-400">
                  Koy turları, balon safarileri, göl evleri, kış otelleri ve taş konak kontenjanları
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {HOLIDAY_SHOWCASE.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080c16] h-40 sm:h-44"
                >
                  <ShowcaseImage
                    src={item.src}
                    alt={item.title}
                    fallbackGradient={item.accent}
                    className="w-full h-full group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-extrabold tracking-wider text-amber-300 uppercase">
                      {item.tag}
                    </span>
                    <p className="text-xs font-bold text-white leading-snug mt-0.5">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ABONELİK PAKETLERİ & İÇERİKLERİ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["Trial", "Basic", "Pro"] as PlanType[]).map((planKey) => {
              const spec = PLAN_SPECS[planKey];
              return (
                <div
                  key={planKey}
                  className={`bg-[#0e1422] border ${spec.cardBorder} rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-white">{planKey} Paket</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${spec.badgeClass}`}
                      >
                        {planKey === "Trial"
                          ? "Ücretsiz Deneme"
                          : planKey === "Basic"
                          ? "Standart"
                          : "Kurumsal"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white">{spec.priceLabel}</span>
                      <span className="text-xs text-slate-400">{spec.periodLabel}</span>
                    </div>

                    <ul className="space-y-2 border-t border-slate-800/90 pt-3 text-xs text-slate-300">
                      {spec.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ALT KISIM: SOLDA HİYERARŞİK ACENTE GİRİŞİ, SAĞDA ŞİFRE GİRİŞİ & IBAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ANA ACENTE & ALT ACENTE HİYERARŞİSİ */}
            <div className="lg:col-span-7 bg-[#0e1422] border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Acente ve Alt Acente Hesapları
                </h2>
                <span className="text-[11px] text-slate-400">Ana Acente → Alt Acente</span>
              </div>

              <div className="space-y-3">
                {tenants.map((tenant) => {
                  const mainAgencyAcc = accounts.find(
                    (a) => a.role === "TENANT_ADMIN" && a.tenantId === tenant.id
                  );
                  const subAgencyAccs = accounts.filter(
                    (a) => a.role === "SUB_AGENT" && a.tenantId === tenant.id
                  );
                  const isMainSelected = mainAgencyAcc?.id === selectedAccountId;

                  return (
                    <div
                      key={tenant.id}
                      className="bg-[#080c16] border border-slate-800/90 rounded-2xl p-3 space-y-2"
                    >
                      {mainAgencyAcc && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountId(mainAgencyAcc.id);
                            setLoginError("");
                          }}
                          className={`w-full text-left rounded-xl p-3 border transition cursor-pointer flex items-center justify-between gap-2 ${
                            isMainSelected
                              ? "bg-emerald-500/35 border-emerald-300 text-emerald-50 ring-2 ring-emerald-300/60"
                              : "bg-emerald-500/20 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/30"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">
                                ANA ACENTE
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 opacity-90">
                                {tenant.plan}
                              </span>
                            </div>
                            <p className="text-sm font-bold truncate mt-0.5">{tenant.name}</p>
                            <p className="text-[11px] opacity-80 truncate">
                              {mainAgencyAcc.fullName}
                            </p>
                          </div>
                          {isMainSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        </button>
                      )}

                      {subAgencyAccs.length > 0 && (
                        <div className="pl-3 sm:pl-5 border-l-2 border-sky-400/40 space-y-1.5">
                          {subAgencyAccs.map((sub) => {
                            const isSubSelected = sub.id === selectedAccountId;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  setSelectedAccountId(sub.id);
                                  setLoginError("");
                                }}
                                className={`w-full text-left rounded-xl px-3 py-2 border transition cursor-pointer flex items-center justify-between gap-2 ${
                                  isSubSelected
                                    ? "bg-sky-500/35 border-sky-300 text-sky-50 ring-2 ring-sky-300/60"
                                    : "bg-sky-500/20 border-sky-400/50 text-sky-100 hover:bg-sky-500/30"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <CornerDownRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90 mr-2">
                                      ALT ACENTE
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold truncate">
                                      {sub.fullName}
                                    </span>
                                  </div>
                                </div>
                                {isSubSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SAĞ KOLON: ŞİFRE GİRİŞ FORMU & IBAN BİLGİSİ */}
            <div className="lg:col-span-5 space-y-4">
              <form
                onSubmit={handlePasswordLogin}
                className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4"
              >
                <div className="text-xs text-slate-400">
                  Seçili Hesap: <strong className="text-white">{chosenAccount.fullName}</strong>
                </div>

                <div className="flex items-center gap-2.5 bg-[#080c16] border border-slate-700 focus-within:border-indigo-500 rounded-xl px-3.5 py-2.5">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Şifrenizi girin..."
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

              {/* IBAN & HESAP SAHİBİ KARTI */}
              <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    Abonelik Ödeme / IBAN
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
                        <span>IBAN Kopyala</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm font-bold text-white">{IBAN_OWNER}</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-emerald-300 bg-[#080c16] border border-slate-800 rounded-xl px-3.5 py-2.5 select-all">
                  {IBAN_NUMBER}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel =
    currentUser.role === "SUPER_ADMIN"
      ? "Süper Admin"
      : currentUser.role === "TENANT_ADMIN"
      ? "Ana Acente"
      : "Alt Acente";

  const hierarchyTenants =
    currentUser.role === "SUPER_ADMIN"
      ? tenants
      : tenants.filter((t) => t.id === currentUser.tenantId);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* ÜST BAR */}
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
            <p className="text-[11px] text-slate-400 truncate">{currentUser.tenantName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white">{currentUser.fullName}</p>
            <p className="text-[11px] text-indigo-400">
              {roleLabel} • {currentPlan}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> <span>Çıkış</span>
          </button>
        </div>
      </header>

      {/* ANA GÖVDE: KISA SOL MENÜ + SAĞ İÇERİK */}
      <div className="flex-1 flex flex-col md:flex-row items-start p-4 sm:p-6 gap-5 max-w-7xl w-full mx-auto">
        {/* KISA SOL MENÜ */}
        <aside
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex w-full md:w-56 bg-[#0e1422] border border-slate-800/90 rounded-2xl p-3 flex-col gap-3 shrink-0 h-fit md:sticky md:top-20`}
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
              <Users className="w-4 h-4 shrink-0" /> PNR & Voucher
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
                <span className="truncate">
                  {currentUser.role === "SUPER_ADMIN" ? "Acente & Paket" : "Alt Acenteler"}
                </span>
              </button>
            )}
          </div>

          <div className="bg-[#080c16] border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">Komisyon</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PLAN_SPECS[currentPlan].badgeClass}`}
              >
                {currentPlan}
              </span>
            </div>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">+{totalCommission} ₺</p>
          </div>
        </aside>

        {/* SAĞ İÇERİK ALANI */}
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
                  if (currentUser.role === "SUPER_ADMIN") {
                    setActiveTab("tenants");
                  } else if (currentUser.tenantId) {
                    handleChangeTenantPlan(currentUser.tenantId, "Pro");
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                {currentUser.role === "SUPER_ADMIN" ? "Paketleri Yönet" : "Pro'ya Yükselt"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* SEKME 1: KONTENJAN & SATIŞ */}
          {activeTab === "dashboard" && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Anlık Kontenjan ve B2B Satış Havuzu
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {currentUser.role === "SUPER_ADMIN"
                      ? "Tüm ana acentelere ait blok kontenjanlar."
                      : `${currentUser.tenantName} (${currentPlan}) • ${PLAN_SPECS[currentPlan].summary}`}
                  </p>
                </div>

                {currentUser.role !== "SUB_AGENT" && (
                  <button
                    onClick={handleOpenAddInventoryModal}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer shrink-0"
                  >
                    <PackagePlus className="w-4 h-4" /> + Yeni Kontenjan Ekle
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {visibleInventory.map((item) => (
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
                        <div className="absolute top-2.5 right-2.5">
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
                              <span className="text-slate-400">Net Fiyat (Kontrat Rate):</span>
                              <span className="font-semibold text-white">{item.netPrice} ₺</span>
                            </div>
                          )}
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400">Satış Fiyatı (Rack Rate):</span>
                            <span className="font-bold text-indigo-400">{item.sellPrice} ₺</span>
                          </div>
                          <div className="border-t border-slate-800 pt-2 flex justify-between gap-2">
                            <span className="text-slate-400">Komisyon (Markup):</span>
                            <span className="font-bold text-emerald-400">+{item.commission} ₺</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <button
                        disabled={item.quota === 0}
                        onClick={() => openBookingModal(item)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Hemen Rezervasyon Gir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEKME 2: HİYERARŞİ HARİTASI */}
          {activeTab === "hierarchy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Ana Acente & Alt Acente Hiyerarşi Haritası
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Üst menüde Ana Acente, alt menüde bağlı Alt Acenteler.
                </p>
              </div>

              {currentUser.role === "SUPER_ADMIN" && (
                <div className="bg-amber-500/15 border border-amber-400/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/25 text-amber-200 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        SÜPER ADMİN
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        MCF B2B Turizm Platformu
                      </h3>
                    </div>
                  </div>
                  <div className="text-xs text-amber-100/90">
                    <strong>{tenants.length}</strong> Ana Acente •{" "}
                    <strong>{accounts.filter((a) => a.role === "SUB_AGENT").length}</strong> Alt Acente
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
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                            ANA ACENTE
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              PLAN_SPECS[tenant.plan].badgeClass
                            }`}
                          >
                            {tenant.plan}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{tenant.name}</h4>
                        <p className="text-xs text-emerald-100/80 mt-1">
                          Yönetici: <strong>{owner?.fullName || "Tanımlı"}</strong> • Kontenjan:{" "}
                          {invCount}
                        </p>
                      </div>

                      <div className="pl-3 sm:pl-5 border-l-2 border-sky-400/40 space-y-2.5">
                        <p className="text-[11px] font-semibold text-sky-300">
                          Alt Acenteler ({subs.length})
                        </p>
                        {subs.length === 0 ? (
                          <p className="text-xs text-slate-500 bg-[#080c16] border border-slate-800/80 rounded-xl p-3">
                            Henüz alt acente eklenmemiş.
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
                                    Siz
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

          {/* SEKME 3: ACENTE, PAKET & ALT ACENTE YÖNETİMİ */}
          {activeTab === "tenants" && currentUser.role !== "SUB_AGENT" && (
            <div className="space-y-8">
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
                        {planKey === "Trial" ? "Demo" : planKey === "Basic" ? "Standart" : "Tam"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{PLAN_SPECS[planKey].summary}</p>
                  </div>
                ))}
              </div>

              {currentUser.role === "SUPER_ADMIN" && (
                <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Ana Acente & Paket Yönetimi
                      </h2>
                      <p className="text-xs text-slate-400">
                        Ana acente ekleyin, paket değiştirin veya çıkarın.
                      </p>
                    </div>
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
                      placeholder="Ana Acente Adı"
                      className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={newAgencyOwnerName}
                      onChange={(e) => setNewAgencyOwnerName(e.target.value)}
                      placeholder="Yönetici Ad Soyad"
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
                      <Plus className="w-4 h-4" /> Ana Acente Ekle
                    </button>
                  </form>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[580px]">
                      <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                        <tr>
                          <th className="p-3.5">Ana Acente</th>
                          <th className="p-3.5">Paket</th>
                          <th className="p-3.5">Ciro</th>
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
                            <td className="p-3.5 font-semibold text-white">{t.revenue}</td>
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
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">Alt Acente Yönetimi</h2>
                    <p className="text-xs text-slate-400">
                      {currentUser.role === "SUPER_ADMIN"
                        ? "İstediğiniz ana acenteye alt acente ekleyin veya çıkarın."
                        : `${currentUser.tenantName} (${currentPlan}) • ${PLAN_SPECS[currentPlan].summary}`}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleAddSubAgent}
                  className={`grid grid-cols-1 ${
                    currentUser.role === "SUPER_ADMIN" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
                  } gap-3 bg-[#080c16] border border-slate-800 p-4 rounded-2xl`}
                >
                  {currentUser.role === "SUPER_ADMIN" && (
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
                    placeholder="Alt Acente Ad Soyad / Firma"
                    className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />

                  <input
                    type="password"
                    required
                    value={newSubPassword}
                    onChange={(e) => setNewSubPassword(e.target.value)}
                    placeholder="Giriş Şifresi"
                    className="bg-[#0e1422] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Alt Acente Ekle
                  </button>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[520px]">
                    <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                      <tr>
                        <th className="p-3.5">Alt Acente</th>
                        <th className="p-3.5">Bağlı Ana Acente</th>
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

          {/* SEKME 4: PNR & VOUCHER */}
          {activeTab === "bookings" && (
            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Kesilen PNR Kayıtları & Dijital Voucher
                </h2>
                <p className="text-xs text-slate-400">
                  {currentUser.role === "SUB_AGENT"
                    ? "Yalnızca kendi kestiğiniz PNR ve komisyon kayıtları."
                    : "Yetki alanınızdaki rezervasyonlar ve WhatsApp voucher paylaşımı."}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[660px]">
                  <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="p-4">PNR</th>
                      <th className="p-4">Ana / Alt Acente</th>
                      <th className="p-4">Misafir</th>
                      <th className="p-4">Hizmet</th>
                      <th className="p-4">Tarih / Kişi</th>
                      <th className="p-4">Tutar</th>
                      <th className="p-4">Komisyon</th>
                      <th className="p-4">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {visibleBookings.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-4 font-mono font-bold text-indigo-400">{b.pnr}</td>
                        <td className="p-4 text-xs">
                          <span className="font-semibold text-white block">{b.tenantName}</span>
                          <span className="text-slate-400">{b.agentName}</span>
                        </td>
                        <td className="p-4 font-medium text-white">{b.customerName}</td>
                        <td className="p-4 text-slate-300">{b.itemTitle}</td>
                        <td className="p-4 text-slate-400 text-xs">
                          {b.date} • {b.pax} Kişi
                        </td>
                        <td className="p-4 font-semibold text-white">{b.totalAmount} ₺</td>
                        <td className="p-4 font-bold text-emerald-400">+{b.commissionEarned} ₺</td>
                        <td className="p-4">
                          <button
                            onClick={() => sendWhatsAppVoucher(b)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* YENİ KONTENJAN MODALI */}
      {isAddModalOpen && currentUser.role !== "SUB_AGENT" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Yeni Kontenjan Ekle</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInventory} className="space-y-4">
              {currentUser.role === "SUPER_ADMIN" && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Hedef Ana Acente</label>
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
                    <option value="OTEL">OTEL</option>
                    <option value="PANSİYON">PANSİYON</option>
                    <option value="TUR">TUR</option>
                    <option value="OTOBÜS">OTOBÜS</option>
                    <option value="UÇAK">UÇAK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Kontenjan Adedi</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newQuota}
                    onChange={(e) => setNewQuota(Number(e.target.value))}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tesis / Tur / Hat Adı</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Kızkalesi Deniz Manzaralı Oda"
                  className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Net Fiyat / Kontrat (₺)</label>
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
                  <label className="block text-xs text-slate-400 mb-1.5">Satış Fiyatı / Rack (₺)</label>
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
                <span className="text-xs text-slate-300">Komisyon (Markup):</span>
                <span className="text-base font-bold text-emerald-400">+{calculatedNewCommission} ₺</span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
              >
                Havuzda Yayınla
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REZERVASYON & PNR OLUŞTURMA MODALI */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">Hızlı Rezervasyon & PNR</h3>
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
                <div className="bg-[#080c16] border border-slate-800 p-3.5 rounded-xl">
                  <p className="text-xs text-indigo-400 font-semibold">
                    {selectedItem.tenantName} • {selectedItem.category}
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedItem.title}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Rack Rate:{" "}
                    <span className="text-white font-semibold">{selectedItem.sellPrice} ₺</span> • Kalan:{" "}
                    <span className="text-emerald-400 font-semibold">{selectedItem.quota}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Misafir Adı Soyadı</label>
                  <div className="flex items-center gap-2 bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Örn: Mehmet Yılmaz"
                      className="bg-transparent text-sm text-white w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">WhatsApp Telefon</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Tarih</label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Kişi / Adet</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedItem.quota}
                      required
                      value={paxCount}
                      onChange={(e) => setPaxCount(Number(e.target.value))}
                      className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400">Tahsilat (Rack Rate)</p>
                    <p className="text-lg font-bold text-white">{selectedItem.sellPrice * paxCount} ₺</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Komisyon (Markup)</p>
                    <p className="text-sm font-bold text-emerald-400">
                      +{selectedItem.commission * paxCount} ₺
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
                >
                  Rezervasyonu Onayla & PNR Üret
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    Rezervasyon Onaylandı
                  </p>
                  <h4 className="text-2xl font-mono font-bold text-white mt-1">
                    {lastCreatedBooking.pnr}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Kontenjan güncellendi ve komisyon işlendi.
                  </p>
                </div>

                <div className="bg-[#080c16] border border-slate-800 rounded-xl p-3.5 text-left text-xs space-y-1.5">
                  <p className="text-slate-400">
                    Misafir:{" "}
                    <span className="text-white font-medium">{lastCreatedBooking.customerName}</span>
                  </p>
                  <p className="text-slate-400">
                    Hizmet:{" "}
                    <span className="text-white font-medium">{lastCreatedBooking.itemTitle}</span>
                  </p>
                  <p className="text-slate-400">
                    Tutar:{" "}
                    <span className="text-indigo-400 font-bold">
                      {lastCreatedBooking.totalAmount} ₺
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => sendWhatsAppVoucher(lastCreatedBooking)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" /> WhatsApp Voucher Gönder
                </button>

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
      )}
    </div>
  );
}