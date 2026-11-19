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

const PLAN_LIMITS: Record<
  PlanType,
  {
    maxInventory: number;
    maxSubAgents: number;
    badgeClass: string;
    summary: string;
  }
> = {
  Trial: {
    maxInventory: 2,
    maxSubAgents: 1,
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    summary: "En fazla 2 kontenjan ve 1 alt acente",
  },
  Basic: {
    maxInventory: 5,
    maxSubAgents: 3,
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    summary: "En fazla 5 kontenjan ve 3 alt acente",
  },
  Pro: {
    maxInventory: Infinity,
    maxSubAgents: Infinity,
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    summary: "Sınırsız kontenjan, alt acente ve tüm modüller",
  },
};

function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [imgError, setImgError] = useState(false);

  const heightClass =
    size === "lg"
      ? "h-14 sm:h-16"
      : size === "sm"
      ? "h-6"
      : "h-9 sm:h-10";

  if (imgError) {
    return (
      <div className="inline-flex items-center gap-1.5 select-none">
        <span className="font-black tracking-tight text-amber-400 text-base">MCF</span>
        <span className="text-[11px] font-semibold tracking-wider text-purple-300 uppercase">
          B2B
        </span>
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="MCF Technology & Software Solutions"
      onError={() => setImgError(true)}
      className={`${heightClass} w-auto object-contain rounded-lg select-none shrink-0`}
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
      fullName: "Mehmet Cihan • Sistem Operatörü",
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
      id: "usr-erdemli-owner",
      username: "erdemli_ana",
      password: "123",
      fullName: "Kemal Doğan",
      role: "TENANT_ADMIN",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
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
      id: "usr-demo-owner",
      username: "demo_ana",
      password: "123",
      fullName: "Ece Demir",
      role: "TENANT_ADMIN",
      tenantId: "FIRM-DEMO",
      tenantName: "Mersin Demo Acente",
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

  const [selectedAccountId, setSelectedAccountId] = useState<string>("usr-super");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

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
      setSelectedAccountId("usr-super");
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
    const maxSubs = PLAN_LIMITS[parentTenant.plan].maxSubAgents;

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
      setSelectedAccountId("usr-super");
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
    const limit = PLAN_LIMITS[plan].maxInventory;

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
    const limit = PLAN_LIMITS[plan].maxInventory;

    if (currentUser.role !== "SUPER_ADMIN" && currentTenantInventoryCount >= limit) {
      setIsAddModalOpen(false);
      setLimitNotice(
        `${currentUser.tenantName} (${plan} paket) maksimum ${limit} kontenjan sınırına ulaştı. Pro pakete geçerek sınırsız ekleyebilirsiniz.`
      );
      return;
    }

    const assignedTenantName =
      tenants.find((t) => t.id === assignedTenantId)?.name || currentUser.tenantName;

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

  // HİYERARŞİK GİRİŞ EKRANI
  if (!currentUser) {
    const superAdmins = accounts.filter((a) => a.role === "SUPER_ADMIN");
    const tenantAdmins = accounts.filter((a) => a.role === "TENANT_ADMIN");
    const subAgents = accounts.filter((a) => a.role === "SUB_AGENT");

    const renderAccountCard = (acc: UserAccount) => {
      const isSelected = acc.id === selectedAccountId;
      return (
        <button
          key={acc.id}
          type="button"
          onClick={() => {
            setSelectedAccountId(acc.id);
            setLoginError("");
          }}
          className={`text-left rounded-xl p-3 border transition cursor-pointer ${
            isSelected
              ? "bg-indigo-600/20 border-indigo-400 ring-1 ring-indigo-400/50"
              : "bg-[#080c16] border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white truncate">{acc.fullName}</p>
            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{acc.tenantName}</p>
        </button>
      );
    };

    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-3xl bg-[#0e1422] border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
          {/* ÜST BAŞLIK & LOGO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <BrandLogo size="lg" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                  MCF B2B TURİZM PORTALI
                </h1>
                <p className="text-xs text-slate-400">
                  Hiyerarşiden hesabınızı seçin ve sadece şifrenizi girin
                </p>
              </div>
            </div>
          </div>

          {/* HİYERARŞİK HESAP SEÇİMİ */}
          <div className="space-y-4">
            {/* 1. KATMAN: SİSTEM OPERATÖRÜ */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                <Crown className="w-3.5 h-3.5" /> 1. Katman • Sistem Operatörü (Super Admin)
              </div>
              <div className="grid grid-cols-1 gap-2">{superAdmins.map(renderAccountCard)}</div>
            </div>

            {/* 2. KATMAN: ANA ACENTELER */}
            <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-emerald-500/30">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <Building className="w-3.5 h-3.5" /> 2. Katman • Ana Acenteler (Wholesaler)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {tenantAdmins.map(renderAccountCard)}
              </div>
            </div>

            {/* 3. KATMAN: ALT ACENTELER */}
            <div className="space-y-2 pl-4 sm:pl-8 border-l-2 border-indigo-500/30">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                <Users className="w-3.5 h-3.5" /> 3. Katman • Alt Acenteler (Sub-Agent)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subAgents.map(renderAccountCard)}
              </div>
            </div>
          </div>

          {/* SADECE ŞİFRE GİRİŞ FORMU */}
          <form
            onSubmit={handlePasswordLogin}
            className="bg-[#080c16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="text-slate-400">
                Seçili Hesap: <strong className="text-white">{chosenAccount.fullName}</strong>
              </span>
              <span className="text-slate-500">
                Şifre: <code className="text-indigo-400">{chosenAccount.password}</code>
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-[#0e1422] border border-slate-700 focus-within:border-indigo-500 rounded-xl px-3.5 py-2.5">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Sadece şifrenizi girin..."
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
    );
  }

  const roleLabel =
    currentUser.role === "SUPER_ADMIN"
      ? "Sistem Operatörü"
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

      {/* ANA GÖVDE */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SADE SOL MENÜ */}
        <aside
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex w-full md:w-60 bg-[#0b101d] md:bg-[#0b101d]/70 border-b md:border-b-0 md:border-r border-slate-800/80 p-4 flex-col justify-between gap-6 shrink-0`}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                OPERASYON
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeTab === "dashboard"
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeTab === "bookings"
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" /> PNR & Voucher
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                ORGANİZASYON
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("hierarchy");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeTab === "hierarchy"
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Network className="w-4 h-4 shrink-0" /> Hiyerarşi Haritası
                </button>

                {currentUser.role !== "SUB_AGENT" && (
                  <button
                    onClick={() => {
                      setActiveTab("tenants");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      activeTab === "tenants"
                        ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {currentUser.role === "SUPER_ADMIN" ? "Acente & Paketler" : "Alt Acenteler"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TEK VE SADE KOMİSYON ÖZETİ */}
          <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-slate-400">Net Komisyon</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PLAN_LIMITS[currentPlan].badgeClass}`}
              >
                {currentPlan}
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">+{totalCommission} ₺</p>
            <p className="text-[11px] text-slate-500 mt-1">{visibleBookings.length} satış kaydı</p>
          </div>
        </aside>

        {/* SAĞ İÇERİK ALANI */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full">
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
                      : `${currentUser.tenantName} (${currentPlan} Paket) • ${PLAN_LIMITS[currentPlan].summary}`}
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
                    className="bg-[#0e1422] border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.category}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            item.quota > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {item.quota > 0 ? `Kalan: ${item.quota}` : "Doldu"}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mb-1 truncate">{item.tenantName}</p>
                      <h3 className="text-base font-bold text-white mb-4">{item.title}</h3>

                      <div className="bg-[#080c16] border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
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

                    <button
                      disabled={item.quota === 0}
                      onClick={() => openBookingModal(item)}
                      className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Hemen Rezervasyon Gir
                    </button>
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
                  Yetki alanınızdaki organizasyon ve alt acente dağılımı.
                </p>
              </div>

              {currentUser.role === "SUPER_ADMIN" && (
                <div className="bg-[#0e1422] border border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        SİSTEM OPERATÖRÜ
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        MCF B2B Turizm Platformu
                      </h3>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-white">{tenants.length}</strong> Ana Acente •{" "}
                    <strong className="text-emerald-400">
                      {accounts.filter((a) => a.role === "SUB_AGENT").length}
                    </strong>{" "}
                    Alt Acente
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
                      <div className="bg-[#080c16] border border-emerald-500/30 rounded-2xl p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            ANA ACENTE (WHOLESALER)
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              PLAN_LIMITS[tenant.plan].badgeClass
                            }`}
                          >
                            {tenant.plan}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{tenant.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Yönetici: <strong className="text-slate-200">{owner?.fullName || "Tanımlı"}</strong> • Kontenjan: {invCount}
                        </p>
                      </div>

                      <div className="pl-3 sm:pl-5 border-l-2 border-indigo-500/40 space-y-2.5">
                        <p className="text-[11px] font-semibold text-indigo-300">
                          Bağlı Alt Acenteler ({subs.length})
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
                                    ? "bg-indigo-600/20 border-indigo-400"
                                    : "bg-[#080c16] border-slate-800"
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                                    {sub.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-400 font-mono">
                                    {sub.subAgentCode || "ALT"} • Sub-Agent
                                  </p>
                                </div>
                                {isCurrentSub && (
                                  <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded shrink-0">
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
                      <span className="text-sm font-bold text-white">{planKey} Sürüm</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PLAN_LIMITS[planKey].badgeClass}`}
                      >
                        {planKey === "Trial" ? "Demo" : planKey === "Basic" ? "Standart" : "Tam"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{PLAN_LIMITS[planKey].summary}</p>
                  </div>
                ))}
              </div>

              {currentUser.role === "SUPER_ADMIN" && (
                <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Ana Acenteler (Wholesaler) & Paket Yönetimi
                      </h2>
                      <p className="text-xs text-slate-400">
                        Ana acente ekleyebilir, paket değiştirebilir veya çıkarabilirsiniz.
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
                        type="text"
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
                                <option value="Trial">Trial (Demo)</option>
                                <option value="Basic">Basic</option>
                                <option value="Pro">Pro (Tam)</option>
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
                  <UserPlus className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Alt Acente (Sub-Agent) Yönetimi
                    </h2>
                    <p className="text-xs text-slate-400">
                      {currentUser.role === "SUPER_ADMIN"
                        ? "İstediğiniz ana acenteye alt acente ekleyebilir veya çıkarabilirsiniz."
                        : `${currentUser.tenantName} (${currentPlan}) • ${PLAN_LIMITS[currentPlan].summary}`}
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
                    type="text"
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
                          <td className="p-3.5 font-mono text-xs text-indigo-400">
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

      {/* REZERVASYON & PNR MODALI */}
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