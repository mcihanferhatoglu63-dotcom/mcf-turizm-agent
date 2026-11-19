"use client";

import React, { useState } from "react";
import {
  Building2,
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
  Briefcase,
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "SUB_AGENT";
type ActiveTab = "dashboard" | "tenants" | "bookings";

interface UserAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  tenantId: string | null; // SUPER_ADMIN için null, firmalar için firma kodu
  tenantName: string;
  subAgentCode?: string; // SUB_AGENT için kendi acente/aracı kodu
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

const USER_ACCOUNTS: UserAccount[] = [
  {
    id: "usr-super",
    username: "superadmin",
    password: "123",
    fullName: "Sistem Yöneticisi (Süper Admin)",
    role: "SUPER_ADMIN",
    tenantId: null,
    tenantName: "MCF SaaS Platform",
  },
  {
    id: "usr-akdeniz-owner",
    username: "akdeniz_sahip",
    password: "123",
    fullName: "Hakan Kaya",
    role: "TENANT_ADMIN",
    tenantId: "FIRM-AKDENIZ",
    tenantName: "Akdeniz Turizm A.Ş.",
  },
  {
    id: "usr-akdeniz-agent1",
    username: "akdeniz_araci1",
    password: "123",
    fullName: "Mert Arslan",
    role: "SUB_AGENT",
    tenantId: "FIRM-AKDENIZ",
    tenantName: "Akdeniz Turizm A.Ş.",
    subAgentCode: "AGT-01",
  },
  {
    id: "usr-akdeniz-agent2",
    username: "akdeniz_araci2",
    password: "123",
    fullName: "Selin Yıldız",
    role: "SUB_AGENT",
    tenantId: "FIRM-AKDENIZ",
    tenantName: "Akdeniz Turizm A.Ş.",
    subAgentCode: "AGT-02",
  },
  {
    id: "usr-erdemli-owner",
    username: "erdemli_sahip",
    password: "123",
    fullName: "Kemal Doğan",
    role: "TENANT_ADMIN",
    tenantId: "FIRM-ERDEMLI",
    tenantName: "Erdemli & Silifke Travel",
  },
  {
    id: "usr-erdemli-agent1",
    username: "erdemli_araci1",
    password: "123",
    fullName: "Deniz Koç",
    role: "SUB_AGENT",
    tenantId: "FIRM-ERDEMLI",
    tenantName: "Erdemli & Silifke Travel",
    subAgentCode: "ERD-01",
  },
];

export default function TurizmSaaSPanel() {
  // Giriş State'leri
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  // Firma Bazlı Canlı Envanter & Kontenjan State'i
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
      id: "OTB-04",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      category: "OTOBÜS",
      title: "Mersin - İstanbul 2+1 VIP Koltuk",
      quota: 4,
      netPrice: 850,
      sellPrice: 1000,
      commission: 150,
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
      id: "UCK-05",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
      category: "UÇAK",
      title: "Çukurova - Sabiha Gökçen Blok Bilet",
      quota: 7,
      netPrice: 1650,
      sellPrice: 1950,
      commission: 300,
    },
  ]);

  // Firma & Aracı Bazlı Canlı Rezervasyon & PNR State'i
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      pnr: "MCF-4821",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      agentUsername: "akdeniz_araci1",
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
      pnr: "MCF-4822",
      tenantId: "FIRM-AKDENIZ",
      tenantName: "Akdeniz Turizm A.Ş.",
      agentUsername: "akdeniz_araci2",
      agentName: "Selin Yıldız",
      customerName: "Zeynep Demir",
      customerPhone: "905554445566",
      itemTitle: "Mersin - İstanbul 2+1 VIP Koltuk",
      pax: 1,
      date: "2026-11-24",
      totalAmount: 1000,
      commissionEarned: 150,
      status: "Onaylandı",
    },
    {
      pnr: "MCF-4823",
      tenantId: "FIRM-ERDEMLI",
      tenantName: "Erdemli & Silifke Travel",
      agentUsername: "erdemli_araci1",
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

  // Rezervasyon Modal State'leri
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paxCount, setPaxCount] = useState(1);
  const [travelDate, setTravelDate] = useState("2026-11-25");
  const [lastCreatedBooking, setLastCreatedBooking] = useState<BookingItem | null>(null);

  // Yeni Kontenjan Ekleme Modal State'leri
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("OTEL");
  const [newTitle, setNewTitle] = useState("");
  const [newQuota, setNewQuota] = useState(5);
  const [newNetPrice, setNewNetPrice] = useState(1000);
  const [newSellPrice, setNewSellPrice] = useState(1300);
  const [targetTenantId, setTargetTenantId] = useState("FIRM-AKDENIZ");

  // Örnek İşletmeler (Süper Admin sekmesi için)
  const tenants = [
    {
      id: "FIRM-AKDENIZ",
      name: "Akdeniz Turizm A.Ş.",
      ownerUser: "akdeniz_sahip",
      plan: "Pro",
      subAgents: 2,
      revenue: "425.000 ₺",
      status: "Aktif",
    },
    {
      id: "FIRM-ERDEMLI",
      name: "Erdemli & Silifke Travel",
      ownerUser: "erdemli_sahip",
      plan: "Basic",
      subAgents: 1,
      revenue: "148.000 ₺",
      status: "Aktif",
    },
    {
      id: "FIRM-CUKUROVA",
      name: "Çukurova Express Acente",
      ownerUser: "cukurova_sahip",
      plan: "Trial",
      subAgents: 1,
      revenue: "34.500 ₺",
      status: "Deneme",
    },
  ];

  // Giriş İşlemi
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUsername.trim().toLowerCase();
    const found = USER_ACCOUNTS.find(
      (acc) => acc.username.toLowerCase() === cleanUser && acc.password === loginPassword
    );

    if (!found) {
      setLoginError("Kullanıcı adı veya şifre hatalı. Lütfen kontrol edin.");
      return;
    }

    setCurrentUser(found);
    setLoginError("");
    setActiveTab("dashboard");
    if (found.tenantId) {
      setTargetTenantId(found.tenantId);
    }
  };

  const quickFillLogin = (username: string, password: string) => {
    setLoginUsername(username);
    setLoginPassword(password);
    setLoginError("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginUsername("");
    setLoginPassword("");
    setSelectedItem(null);
    setIsAddModalOpen(false);
  };

  // KULLANICI ROLÜNE VE FİRMASINA GÖRE FİLTRELENMİŞ VERİLER
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

  const totalCommission = visibleBookings.reduce((acc, b) => acc + b.commissionEarned, 0);
  const calculatedNewCommission = Math.max(0, newSellPrice - newNetPrice);

  // Yeni Kontenjan Kaydetme Fonksiyonu
  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role === "SUB_AGENT") return;
    if (!newTitle.trim() || newQuota <= 0) return;

    const assignedTenantId =
      currentUser.role === "SUPER_ADMIN" ? targetTenantId : currentUser.tenantId || "FIRM-AKDENIZ";
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
      `*${b.tenantName} | RESMİ VOUCHER*\n` +
      `----------------------------------\n` +
      `*PNR Kodu:* ${b.pnr}\n` +
      `*Misafir:* ${b.customerName}\n` +
      `*Hizmet:* ${b.itemTitle}\n` +
      `*Tarih:* ${b.date}\n` +
      `*Kişi / Adet:* ${b.pax}\n` +
      `*Toplam Tutar:* ${b.totalAmount} ₺\n` +
      `*Durum:* ${b.status}\n` +
      `----------------------------------\n` +
      `İyi yolculuklar ve iyi tatiller dileriz!`;

    window.open(
      `https://wa.me/${b.customerPhone}?text=${encodeURIComponent(voucherText)}`,
      "_blank"
    );
  };

  // GİRİŞ EKRANI (KULLANICI ADI & ŞİFRE)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#0e1422] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/25">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">MCF TURİZM-ACENTE B2B</h1>
              <p className="text-xs text-slate-400">
                Süper Admin, İşletme Sahibi ve Aracı (Sub-Agent) Giriş Paneli
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Kullanıcı Adı</label>
              <div className="flex items-center gap-2.5 bg-[#080c16] border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3.5 py-2.5">
                <User className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Örn: superadmin, akdeniz_sahip, akdeniz_araci1"
                  className="bg-transparent text-sm text-white w-full focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Şifre</label>
              <div className="flex items-center gap-2.5 bg-[#080c16] border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3.5 py-2.5">
                <Lock className="w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  className="bg-transparent text-sm text-white w-full focus:outline-none"
                />
              </div>
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
              <KeyRound className="w-4 h-4" /> Sisteme Güvenli Giriş Yap
            </button>
          </form>

          {/* HIZLI TEST HESAPLARI */}
          <div className="mt-7 pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-300 mb-3">
              Hızlı Test Hesapları (Tıkla ve Giriş Yap — Şifre: <span className="text-indigo-400 font-mono">123</span>)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => quickFillLogin("superadmin", "123")}
                className="text-left bg-[#080c16] hover:bg-slate-800/70 border border-slate-800 rounded-xl p-3 transition cursor-pointer"
              >
                <span className="font-bold text-indigo-400 block">Süper Admin</span>
                <span className="text-slate-400 font-mono">superadmin</span>
              </button>

              <button
                type="button"
                onClick={() => quickFillLogin("akdeniz_sahip", "123")}
                className="text-left bg-[#080c16] hover:bg-slate-800/70 border border-slate-800 rounded-xl p-3 transition cursor-pointer"
              >
                <span className="font-bold text-emerald-400 block">İşletme Sahibi (Akdeniz Turizm)</span>
                <span className="text-slate-400 font-mono">akdeniz_sahip</span>
              </button>

              <button
                type="button"
                onClick={() => quickFillLogin("akdeniz_araci1", "123")}
                className="text-left bg-[#080c16] hover:bg-slate-800/70 border border-slate-800 rounded-xl p-3 transition cursor-pointer"
              >
                <span className="font-bold text-amber-400 block">Aracı 1 (Akdeniz - Mert Arslan)</span>
                <span className="text-slate-400 font-mono">akdeniz_araci1</span>
              </button>

              <button
                type="button"
                onClick={() => quickFillLogin("erdemli_sahip", "123")}
                className="text-left bg-[#080c16] hover:bg-slate-800/70 border border-slate-800 rounded-xl p-3 transition cursor-pointer"
              >
                <span className="font-bold text-sky-400 block">İşletme Sahibi (Erdemli Travel)</span>
                <span className="text-slate-400 font-mono">erdemli_sahip</span>
              </button>
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
      ? "İşletme Sahibi"
      : "Aracı / Sub-Agent";

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* ÜST BAR */}
      <header className="border-b border-slate-800/80 bg-[#0b101d] px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">MCF TURİZM-ACENTE</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentUser.tenantName}</span>
            </p>
          </div>
        </div>

        {/* AKTİF KULLANICI BİLGİSİ & ÇIKIŞ */}
        <div className="flex flex-wrap items-center gap-3 bg-[#070b14] border border-slate-800 px-3.5 py-2 rounded-2xl">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
            <p className="text-[11px] text-indigo-400">
              {roleLabel} • <span className="font-mono text-slate-400">@{currentUser.username}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
          </button>
        </div>
      </header>

      {/* ANA GÖVDE */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SOL MENÜ */}
        <aside className="w-full md:w-64 bg-[#0b101d]/70 border-r border-slate-800/80 p-4 flex flex-col gap-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-1">
            {currentUser.role === "SUPER_ADMIN"
              ? "SİSTEM YÖNETİMİ"
              : currentUser.role === "TENANT_ADMIN"
              ? "FİRMA YÖNETİM PANELİ"
              : "ARACI SATIŞ PANELİ"}
          </p>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "dashboard"
                ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" /> Müsaitlik & Hızlı Satış
          </button>

          {currentUser.role === "SUPER_ADMIN" && (
            <button
              onClick={() => setActiveTab("tenants")}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === "tenants"
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> İşletmeler & Paketler
            </button>
          )}

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "bookings"
                ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" /> Rezervasyonlar & Voucher
          </button>

          {/* SOL ALT KOMİSYON KARTI */}
          <div className="mt-auto bg-[#0f1626] border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">
              {currentUser.role === "SUB_AGENT" ? "Kişisel Komisyon Kazancım" : "Görünen Toplam Komisyon"}
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">+{totalCommission} ₺</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {visibleBookings.length} adet yetkili satıştan
            </p>
          </div>
        </aside>

        {/* SAĞ İÇERİK ALANI */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          {/* SEKME 1: MÜSAİTLİK & HIZLI SATIŞ HAVUZU */}
          {activeTab === "dashboard" && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Anlık Müsaitlik ve Hızlı Satış Havuzu</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {currentUser.role === "SUPER_ADMIN"
                      ? "Tüm firmalara ait aktif blok kontenjanları görüntülüyorsunuz."
                      : `${currentUser.tenantName} firmasına tanımlı aktif kontenjanlar.`}
                  </p>
                </div>

                {currentUser.role !== "SUB_AGENT" && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer shrink-0"
                  >
                    <PackagePlus className="w-4 h-4" /> + Yeni Kontenjan Ekle
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleInventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0e1422] border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.category}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            item.quota > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {item.quota > 0 ? `Kalan: ${item.quota} Kontenjan` : "Kontenjan Doldu"}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mb-1">Firma: {item.tenantName}</p>
                      <h3 className="text-base font-bold text-white mb-4">{item.title}</h3>

                      <div className="bg-[#080c16] border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                        {currentUser.role !== "SUB_AGENT" && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Net B2B Maliyet:</span>
                            <span className="font-semibold text-white">{item.netPrice} ₺</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Müşteri Satış Fiyatı:</span>
                          <span className="font-bold text-indigo-400">{item.sellPrice} ₺</span>
                        </div>
                        <div className="border-t border-slate-800 pt-2 flex justify-between">
                          <span className="text-slate-400">Aracı Net Kazancı:</span>
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

          {/* SEKME 2: İŞLETMELER & PAKETLER (SADECE SUPER ADMIN) */}
          {activeTab === "tenants" && currentUser.role === "SUPER_ADMIN" && (
            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">Kayıtlı Acenteler & SaaS Paketleri</h2>
                  <p className="text-xs text-slate-400">
                    Sisteme bağlı tüm firmaların abonelik, firma kodu ve hacim durumu
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="p-4">Firma / Acente</th>
                      <th className="p-4">Sahip Kullanıcı</th>
                      <th className="p-4">Paket</th>
                      <th className="p-4">Aracı Sayısı</th>
                      <th className="p-4">Toplam Ciro</th>
                      <th className="p-4">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tenants.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-medium text-white">
                          {t.name}
                          <span className="block text-[11px] font-mono text-slate-500">{t.id}</span>
                        </td>
                        <td className="p-4 font-mono text-xs text-indigo-300">@{t.ownerUser}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {t.plan}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{t.subAgents} Aracı</td>
                        <td className="p-4 font-semibold text-white">{t.revenue}</td>
                        <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> {t.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEKME 3: REZERVASYONLAR & VOUCHER */}
          {activeTab === "bookings" && (
            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">Kesilen PNR Kayıtları & Dijital Voucher</h2>
                  <p className="text-xs text-slate-400">
                    {currentUser.role === "SUB_AGENT"
                      ? "Yalnızca kendi kestiğiniz PNR ve komisyon kayıtlarınız listelenmektedir."
                      : "Yetki alanınızdaki rezervasyonları tek tıkla WhatsApp üzerinden paylaşın."}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#080c16] text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="p-4">PNR Kodu</th>
                      <th className="p-4">Firma / Aracı</th>
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
                          <span className="text-slate-400">
                            {b.agentName} (@{b.agentUsername})
                          </span>
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
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> WhatsApp Voucher
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

      {/* YENİ KONTENJAN / ÜRÜN EKLEME MODALI */}
      {isAddModalOpen && currentUser.role !== "SUB_AGENT" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Sisteme Yeni Kontenjan Ekle</h3>
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
                  <label className="block text-xs text-slate-400 mb-1.5">Hedef Firma</label>
                  <select
                    value={targetTenantId}
                    onChange={(e) => setTargetTenantId(e.target.value)}
                    className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Hizmet Kategorisi</label>
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
                  <label className="block text-xs text-slate-400 mb-1.5">Açık Kontenjan Adedi</label>
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
                  placeholder="Örn: Erdemli Kızkalesi Deniz Manzaralı Oda"
                  className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Net B2B Maliyet (₺)</label>
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
                  <label className="block text-xs text-slate-400 mb-1.5">Müşteri Satış Fiyatı (₺)</label>
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
                <span className="text-xs text-slate-300">Aracı Net Kazancı (Otomatik):</span>
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
          <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl">
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
                    Birim Satış:{" "}
                    <span className="text-white font-semibold">{selectedItem.sellPrice} ₺</span> • Kalan
                    Kontenjan:{" "}
                    <span className="text-emerald-400 font-semibold">{selectedItem.quota}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Misafir Adı Soyadı</label>
                  <div className="flex items-center gap-2 bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5">
                    <User className="w-4 h-4 text-slate-500" />
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
                  <label className="block text-xs text-slate-400 mb-1.5">WhatsApp Telefon Numarası</label>
                  <div className="flex items-center gap-2 bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5">
                    <Phone className="w-4 h-4 text-slate-500" />
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Hizmet Tarihi</label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="bg-[#080c16] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Kişi / Koltuk Adedi</label>
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
                    <p className="text-xs text-slate-400">Tahsil Edilecek Tutar</p>
                    <p className="text-lg font-bold text-white">{selectedItem.sellPrice * paxCount} ₺</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Net Komisyonun</p>
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
                    Kontenjan güncellendi ve komisyon hesabınıza işlendi.
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
                  <Send className="w-4 h-4" /> Müşteriye WhatsApp Voucher Gönder
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full text-xs text-slate-400 hover:text-white py-2"
                >
                  Pencereyi Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}