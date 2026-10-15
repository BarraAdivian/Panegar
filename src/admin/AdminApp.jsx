import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Sidebar from "./components/Sidebar";
import OrderCard from "./components/OrderCard";
import Logo from "./components/Logo";
import { BellIcon, UtensilsIcon, ChartIcon, UserIcon } from "./components/Icons";
import { initialOrders, orderTotal, orderCount, STATUS } from "./data/orders";
import { rupiah } from "./utils/format";

const FILTERS = [
  { label: "Semua", status: null },
  { label: "Baru", status: 0 },
  { label: "Dibuat", status: 1 },
  { label: "Siap", status: 2 },
  { label: "Selesai", status: 3 },
];

export default function AdminApp() {
  const [tab, setTab] = useState("pesanan");
  const [filter, setFilter] = useState("Semua");
  const [sortOld, setSortOld] = useState(true);
  const [orders, setOrders] = useState(initialOrders);
  const [updatedAt, setUpdatedAt] = useState(Date.now());
  const [detail, setDetail] = useState(null);
  const [, setTick] = useState(0);

  // ⏱ Refresh label waktu tiap 5 detik
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const advanceOrder = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: Math.min(o.status + 1, 3) } : o))
    );
    setUpdatedAt(Date.now());
  };

  // ===== Data turunan =====
  const baru = orders.filter((o) => o.status === 0);
  const dibuat = orders.filter((o) => o.status === 1);
  const siap = orders.filter((o) => o.status === 2);

  const avgMnt = (() => {
    if (dibuat.length === 0) return null;
    const total = dibuat.reduce(
      (s, o) => s + Math.floor((Date.now() - o.createdAt) / 60000),
      0
    );
    return Math.round(total / dibuat.length);
  })();

  const activeFilter = FILTERS.find((f) => f.label === filter);
  const visible = orders
    .filter((o) => activeFilter.status === null || o.status === activeFilter.status)
    .sort((a, b) => (sortOld ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));

  const secs = Math.floor((Date.now() - updatedAt) / 1000);
  const updatedLabel =
    secs < 5 ? "baru saja" : secs < 60 ? `${secs} detik lalu` : `${Math.floor(secs / 60)} mnt lalu`;
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const placeholders = {
    menu: { icon: UtensilsIcon, title: "Kelola Menu", desc: "Atur menu & ketersediaan" },
    laporan: { icon: ChartIcon, title: "Laporan", desc: "Penjualan & statistik harian" },
    akun: { icon: UserIcon, title: "Akun", desc: "Profil & pengaturan admin" },
  };

  return (
    <div className="min-h-screen bg-[#e9e2d6] xl:bg-[var(--cream)]">
      <Sidebar active={tab} onChange={setTab} />

      <div className="xl:pl-64">
        <div className="mx-auto min-h-screen max-w-md bg-[var(--cream)] pb-28 shadow-2xl md:max-w-none md:shadow-none xl:max-w-6xl xl:bg-transparent xl:pb-10 xl:shadow-none">
          {/* ===== Header ===== */}
          <header className="flex items-center justify-between px-4 pt-5 md:px-6 md:pt-6 xl:px-8 xl:pt-8">
            <div className="flex items-center gap-2.5">
              <Logo />
              <div>
                <h1 className="text-base font-extrabold leading-tight text-[#3f2a16]">
                  Kopi Panegar
                </h1>
                <p className="text-[11px] text-[#a08a70]">Panel Admin • Dapur</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#6b5138] transition active:scale-90">
                <BellIcon className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-dark)] text-xs font-bold text-white transition active:scale-90">
                FK
              </button>
            </div>
          </header>

          {tab === "pesanan" ? (
            <main className="px-4 md:px-6 xl:px-8">
              {/* Judul */}
              <h2 className="mt-5 text-2xl font-extrabold leading-tight text-[#3f2a16] md:mt-6 xl:mt-8 xl:text-3xl">
                Antrean pesanan hari ini
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8a7460]">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Diperbarui {updatedLabel} • {today}
              </p>

              {/* Stat cards */}
              <div className="mt-4 grid grid-cols-3 gap-2.5 md:gap-4">
                <div className="rounded-2xl bg-white p-3 shadow-sm md:p-5">
                  <p className="text-[11px] font-medium text-[#a08a70]">Baru masuk</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#3f2a16] xl:text-3xl">
                    {baru.length}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#b3a18c]">
                    {baru.reduce((s, o) => s + orderCount(o), 0)} item menunggu
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm md:p-5">
                  <p className="text-[11px] font-medium text-[#a08a70]">Dibuat</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#3f2a16] xl:text-3xl">
                    {dibuat.length}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#b3a18c]">
                    {avgMnt !== null ? `±${avgMnt} mnt` : "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm md:p-5">
                  <p className="text-[11px] font-medium text-[#a08a70]">Siap</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#3f2a16] xl:text-3xl">
                    {siap.length}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#b3a18c]">
                    {siap.length > 0 ? `Meja ${siap.map((o) => o.table).join(", ")}` : "—"}
                  </p>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
                {FILTERS.map((f) => {
                  const active = filter === f.label;
                  return (
                    <button
                      key={f.label}
                      onClick={() => setFilter(f.label)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-[var(--brand)] text-white shadow-sm"
                          : "border border-[#eadfcd] bg-white text-[#6b5138]"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Section header */}
              <div className="mt-5 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#3f2a16]">Antrean meja</h3>
                <button
                  onClick={() => setSortOld(!sortOld)}
                  className="text-xs font-semibold text-[#b07a3a] active:opacity-60"
                >
                  Urut: {sortOld ? "terlama" : "terbaru"} {sortOld ? "↓" : "↑"}
                </button>
              </div>

              {/* Daftar order */}
              <div className="mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visible.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-[#e0d0b8] py-10 text-center text-sm text-[#b3a18c] md:col-span-full">
                    Tidak ada pesanan di kategori ini
                  </p>
                )}
                {visible.map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    onAdvance={advanceOrder}
                    onDetail={setDetail}
                  />
                ))}
              </div>
            </main>
          ) : (
            <main className="flex h-[70vh] flex-col items-center justify-center gap-2 px-8 text-center">
              {(() => {
                const { icon: Icon, title, desc } = placeholders[tab];
                return (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                      <Icon className="h-7 w-7 text-[var(--brand)]" />
                    </span>
                    <p className="mt-2 text-lg font-extrabold text-[#3f2a16]">{title}</p>
                    <p className="text-sm text-[#a08a70]">{desc}</p>
                    <span className="mt-1 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[11px] font-bold text-[#8a6a3f]">
                      Segera hadir
                    </span>
                  </>
                );
              })()}
            </main>
          )}
        </div>
      </div>

      {/* ===== Modal detail pesanan ===== */}
      {detail && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setDetail(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-extrabold text-[#3f2a16]">#{detail.id}</p>
                <p className="mt-0.5 text-[11px] text-[#a08a70]">
                  Meja {detail.table} •{" "}
                  {detail.createdAt.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold text-[#8a6a3f]">
                {STATUS[detail.status]}
              </span>
            </div>

            <div className="mt-4 space-y-3 border-t border-[#f3ead9] pt-4">
              {detail.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#3f2a16]">
                      {item.name}{" "}
                      <span className="text-xs font-semibold text-[#a08a70]">×{item.qty}</span>
                    </p>
                    {item.note && <p className="text-[11px] text-[#a08a70]">{item.note}</p>}
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#6b5138]">
                    {rupiah(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#e5d9c5] pt-3">
              <div>
                <p className="text-sm font-extrabold text-[#3f2a16]">Total</p>
                <p className="text-[10px] text-[#b3a18c]">
                  {detail.payment === "qris" ? "Dibayar via QRIS" : "Bayar di kasir"}
                </p>
              </div>
              <span className="text-lg font-extrabold text-[var(--brand)]">
                {rupiah(orderTotal(detail))}
              </span>
            </div>

            <button
              onClick={() => setDetail(null)}
              className="mt-5 w-full rounded-full bg-[var(--brand)] py-3.5 text-sm font-bold text-white transition active:scale-[0.98]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}