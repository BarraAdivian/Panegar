import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { ArrowLeftIcon, BagIcon, BellIcon, CheckIcon } from "../components/Icons";
import { rupiah } from "../utils/format";

// ⏱ Durasi demo tiap tahap (ms)
const DELAYS = [10000, 12000, 12000];

const STEPS = [
  { title: "Pesanan diterima", desc: "Masuk ke dapur" },
  { title: "Sedang dimasak", desc: "Pesanan kamu sedang di proses" },
  { title: "Diantar ke meja", desc: "Diantar langsung ke" },
];

const HERO_INFO = {
  0: { badge: "Sedang diproses", title: "Pesanan kamu diterima dapur" },
  1: { badge: "Sedang dimasak", title: "Pesanan kamu lagi disiapkan" },
  2: { badge: "Sedang diantar", title: "Pesanan menuju ke mejamu" },
  3: { badge: "Selesai", title: "Pesanan selesai, selamat menikmati!" },
};

const PAYMENT_LABELS = {
  kasir: "Bayar di kasir setelah selesai makan",
  qris: "Dibayar via QRIS — terima kasih!",
};

export default function OrderStatusPage({
  order, tableNumber, onAdvance, onAddMore, onGoToMenu, onNavChange,
}) {
  const [showWaiter, setShowWaiter] = useState(false);

  // 🔄 Simulasi progres status otomatis (demo)
  useEffect(() => {
    if (!order || order.status >= 3) return;
    const t = setTimeout(onAdvance, DELAYS[order.status]);
    return () => clearTimeout(t);
  }, [order?.status]);

  // ===== Empty state: belum ada pesanan =====
  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="mx-auto flex min-h-screen max-w-md flex-col pb-24 md:max-w-none">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
            <span className="text-6xl">🧾</span>
            <p className="text-lg font-extrabold text-[#3f2a16]">Belum ada pesanan</p>
            <p className="text-sm text-[#8a7460]">
              Kamu belum mengirim pesanan ke dapur. Yuk pilih menu favoritmu dulu!
            </p>
            <button
              onClick={onGoToMenu}
              className="mt-4 rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-bold text-white transition active:scale-95"
            >
              Lihat menu
            </button>
          </div>
          <BottomNav active="pesanan" onChange={onNavChange} />
        </div>
      </div>
    );
  }

  const info = HERO_INFO[order.status];
  const currentStep = Math.min(order.status, 2);
  const done = order.status >= 3;

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto min-h-screen max-w-md pb-36 md:max-w-none">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 md:px-6">
          <button
            onClick={onGoToMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#3f2a16]">Status pesanan</h1>
          <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
            Meja {tableNumber}
          </span>
        </header>

        {/* Hero card */}
        <section className="mt-4 px-4 md:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[var(--brand-dark)] to-[#5c3a1c] p-5 text-white shadow-md">
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5c26b] text-[#3f2a16]">
                <BagIcon className="h-6 w-6" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-[#f5c26b]">
                  {info.badge}
                </span>
                <h2 className="mt-1.5 text-lg font-extrabold leading-snug">{info.title}</h2>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-3.5">
              <div>
                <p className="text-[10px] text-white/60">No. pesanan</p>
                <p className="text-sm font-extrabold">#{order.code}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60">Perkiraan siap</p>
                <p className="text-sm font-extrabold">{order.est}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progres pesanan */}
        <section className="mt-5 px-4 md:px-6">
          <h3 className="text-base font-extrabold text-[#3f2a16]">Progres pesanan</h3>
          <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="relative">
              <span className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-[#f3ead9]" />

              {STEPS.map((step, i) => {
                const isDone = i < currentStep || done;
                const isActive = i === currentStep && !done;
                return (
                  <div key={step.title} className="relative flex gap-3.5 pb-5 last:pb-0">
                    {isDone ? (
                      <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    ) : isActive ? (
                      <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-dark)] ring-4 ring-[var(--brand-soft)]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f5c26b]" />
                      </span>
                    ) : (
                      <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#e5d9c5] bg-white text-xs font-bold text-[#bda98d]">
                        {i + 1}
                      </span>
                    )}

                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm font-bold ${
                            isDone || isActive ? "text-[#3f2a16]" : "text-[#bda98d]"
                          }`}
                        >
                          {step.title}
                        </p>
                        {isActive && (
                          <span className="shrink-0 rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--brand)]">
                            Sekarang
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] ${
                          isActive || isDone ? "text-[#a08a70]" : "text-[#c9b99f]"
                        }`}
                      >
                        {step.title === "Diantar ke meja"
                          ? `${step.desc} Meja ${tableNumber}`
                          : i === 0 && isDone
                          ? `${order.time.replace(" WIB", "")} • ${step.desc}`
                          : step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Rincian pesanan */}
        <section className="mt-5 px-4 md:px-6">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#3f2a16]">Rincian pesanan</h3>
              <span className="text-[11px] text-[#a08a70]">
                {order.items.reduce((s, i) => s + i.qty, 0)} menu
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {order.items.map((item) => (
                <div key={item.key} className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                  />
                  <p className="min-w-0 flex-1 truncate text-xs text-[#6b5138]">
                    {item.qty}× {item.name}
                  </p>
                  <span className="shrink-0 text-xs font-bold text-[#3f2a16]">
                    {rupiah(item.price * item.qty)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[#8a7460]">Pajak & layanan</span>
                <span className="font-bold text-[#3f2a16]">
                  {rupiah(order.tax + order.service)}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#f3ead9] pt-3">
              <span className="text-sm font-extrabold text-[#3f2a16]">Total</span>
              <span className="text-lg font-extrabold text-[var(--brand)]">
                {rupiah(order.total)}
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-[var(--brand-soft)] px-3.5 py-2.5 text-[11px] font-medium text-[#6b5138]">
              {PAYMENT_LABELS[order.payment]}
            </div>
          </div>
        </section>

        {/* Aksi */}
        <section className="mt-5 space-y-2.5 px-4 md:px-6">
          <button
            onClick={onAddMore}
            className="w-full rounded-full bg-[var(--brand)] py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition active:scale-[0.98]"
          >
            + Pesan menu lagi
          </button>
          <button
            onClick={() => setShowWaiter(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#eadfcd] bg-white py-3.5 text-sm font-bold text-[#3f2a16] transition active:scale-[0.98]"
          >
            <BellIcon className="h-4 w-4" />
            Panggil pelayan
          </button>
        </section>
      </div>

      {/* Modal panggil pelayan */}
      {showWaiter && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-8"
          onClick={() => setShowWaiter(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-4xl">🔔</span>
            <p className="mt-2 text-base font-extrabold text-[#3f2a16]">Pelayan dipanggil!</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8a7460]">
              Tenang, pelayan akan segera menuju <b>Meja {tableNumber}</b>. Ditunggu di
              tempat yaa 😊
            </p>
            <button
              onClick={() => setShowWaiter(false)}
              className="mt-4 w-full rounded-full bg-[var(--brand)] py-3 text-sm font-bold text-white transition active:scale-95"
            >
              Oke, siap!
            </button>
          </div>
        </div>
      )}

      <BottomNav active="pesanan" onChange={onNavChange} />
    </div>
  );
}