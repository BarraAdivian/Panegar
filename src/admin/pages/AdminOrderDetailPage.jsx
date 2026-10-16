import { useState } from "react";
import { ArrowLeftIcon, CheckIcon, PrinterIcon } from "../components/Icons";
import { orderTotal, orderCount, STATUS } from "../data/orders";
import { rupiah, timeAgo } from "../utils/format";

const SERVICE_RATE = 0.05;

const STEPS = ["Masuk", "Dibuat", "Siap", "Selesai"];
const ACTIONS = { 0: "Terima pesanan", 1: "Tandai siap", 2: "Tandai selesai" };

export default function AdminOrderDetailPage({ order, onBack, onAccept, onReject }) {
  const [confirmReject, setConfirmReject] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // 💰 Hitung ulang biaya (subtotal + layanan 5%)
  const subtotal = orderTotal(order);
  const service = Math.round(subtotal * SERVICE_RATE);
  const total = subtotal + service;

  // ⏰ Waktu-waktu penting
  const fmtJam = (d) =>
    `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
  const tanggal = order.createdAt.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const jamMasuk = fmtJam(order.createdAt);
  const estimasi = fmtJam(new Date(order.createdAt.getTime() + 15 * 60000));

  const action = ACTIONS[order.status];
  const canReject = order.status === 0;
  const selesai = order.status >= 3;

  return (
    <div className="pb-36">
      {/* ===== Header ===== */}
      <header className="flex items-center justify-between px-4 pt-4">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-base font-extrabold text-[#3f2a16]">Detail pesanan</h1>
        <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-[10px] font-bold text-[#8a6a3f]">
          {STATUS[order.status]}
        </span>
      </header>
      <p className="mt-1.5 text-center text-[11px] font-semibold text-[#a08a70]">
        #{order.id} • Meja {order.table} • {timeAgo(order.createdAt)}
      </p>

      {/* ===== Status pesanan ===== */}
      <section className="mt-3 px-4">
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-extrabold text-[#3f2a16]">Status pesanan</h3>
            {!selesai && (
              <p className="text-[11px] font-bold text-[#c9974f]">Estimasi siap {estimasi}</p>
            )}
          </div>

          {/* Stepper */}
          <div className="relative mt-5">
            <span className="absolute left-[12%] right-[12%] top-4 h-0.5 bg-[#f3ead9]" />
            <div className="relative flex">
              {STEPS.map((label, i) => {
                const done = i < order.status;
                const active = i === order.status;
                return (
                  <div key={label} className="flex w-1/4 flex-col items-center gap-1">
                    {done ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-dark)] text-white">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    ) : active ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-dark)] ring-4 ring-[var(--brand-soft)]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f5c26b]" />
                      </span>
                    ) : (
                      <span className="h-8 w-8 rounded-full border-2 border-[#e5d9c5] bg-white" />
                    )}
                    <p
                      className={`text-[11px] font-bold ${
                        done || active ? "text-[#3f2a16]" : "text-[#bda98d]"
                      }`}
                    >
                      {label}
                    </p>
                    {i === 0 && <p className="text-[10px] text-[#a08a70]">{jamMasuk}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Info pesanan ===== */}
      <section className="mt-3 px-4">
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex justify-between text-xs">
            <span className="text-[#8a7460]">Meja</span>
            <span className="font-bold text-[#3f2a16]">
              Meja {order.table} • {order.guests ?? 2} tamu
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#8a7460]">Waktu pesan</span>
            <span className="font-bold text-[#3f2a16]">
              {tanggal} • {jamMasuk}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#8a7460]">Dipesan lewat</span>
            <span className="font-bold text-[#3f2a16]">Scan QR meja</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8a7460]">Pembayaran</span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-[#3f2a16]">
                {order.payment === "qris" ? "QRIS" : "Kasir"}
              </span>
              {order.payment === "qris" ? (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                  Lunas
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  Bayar di kasir
                </span>
              )}
            </span>
          </div>
        </div>
      </section>

      {/* ===== Rincian pesanan ===== */}
      <section className="mt-3 px-4">
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#3f2a16]">Rincian pesanan</h3>
            <span className="text-[11px] text-[#a08a70]">{orderCount(order)} item</span>
          </div>

          <div className="mt-3 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#3f2a16]">
                    {item.qty}× {item.name}
                  </p>
                  {item.note && (
                    <p className="mt-0.5 text-[11px] leading-snug text-[#a08a70]">{item.note}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs font-extrabold text-[#3f2a16]">
                  {rupiah(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-[#f3ead9] pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-[#8a7460]">Subtotal</span>
              <span className="font-bold text-[#3f2a16]">{rupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8a7460]">Biaya layanan (5%)</span>
              <span className="font-bold text-[#3f2a16]">{rupiah(service)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-extrabold text-[#3f2a16]">Total</span>
              <span className="text-lg font-extrabold text-[#3f2a16]">{rupiah(total)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Catatan dari meja ===== */}
      {order.note && (
        <section className="mt-3 px-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#3f2a16]">Catatan dari meja</h3>
            <p className="mt-1.5 text-xs italic leading-relaxed text-[#6b5138]">
              "{order.note}"
            </p>
          </div>
        </section>
      )}

      {/* ===== Bar aksi bawah ===== */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#efe5d6] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-2.5 p-4">
          {selesai ? (
            <span className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-soft)] py-3.5 text-sm font-bold text-[#8a6a3f]">
              <CheckIcon className="h-4 w-4" /> Pesanan selesai
            </span>
          ) : (
            <>
              {canReject && (
                <button
                  onClick={() => setConfirmReject(true)}
                  className="rounded-full border border-[#e0d0b8] bg-white px-5 py-3.5 text-sm font-bold text-[#6b5138] transition active:scale-95"
                >
                  Tolak
                </button>
              )}
              <button
                onClick={() => showToast("Fitur cetak struk menyusul")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e0d0b8] bg-white text-[#6b5138] transition active:scale-90"
              >
                <PrinterIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onAccept(order.id)}
                className="flex-1 rounded-full bg-[var(--brand-dark)] py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition active:scale-[0.98]"
              >
                {action}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== Modal konfirmasi tolak ===== */}
      {confirmReject && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-8"
          onClick={() => setConfirmReject(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-4xl">🚫</span>
            <p className="mt-2 text-base font-extrabold text-[#3f2a16]">Tolak pesanan ini?</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8a7460]">
              Pesanan #{order.id} (Meja {order.table}) akan dibatalkan dan dihapus dari
              antrean.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={() => setConfirmReject(false)}
                className="flex-1 rounded-full border border-[#e0d0b8] py-3 text-sm font-bold text-[#6b5138] transition active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={() => onReject(order.id)}
                className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold text-white transition active:scale-95"
              >
                Ya, tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast ===== */}
      {toast && (
        <div className="fixed left-1/2 top-5 z-[80] -translate-x-1/2 animate-slide-down">
          <div className="rounded-full bg-[var(--brand-dark)] px-5 py-3 text-sm font-bold text-white shadow-xl">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}