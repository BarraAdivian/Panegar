import { useState } from "react";
import BottomNav from "../components/BottomNav";
import {
  BellIcon, ChatIcon, ChevronDownIcon, ReceiptIcon, UtensilsIcon, WifiIcon,
} from "../components/Icons";

// ⚙️ Ganti sesuai resto lo
const WIFI = { name: "KopiPanegar-Guest", password: "panegar2024" };

const FAQS = [
  {
    q: "Bagaimana cara bayar?",
    a: "Bayar di kasir setelah selesai makan, bisa tunai, debit, atau QRIS.",
  },
  {
    q: "Bisa ubah pesanan yang sudah dikirim?",
    a: "Bisa, selama pesanan belum diproses dapur. Panggil pelayan atau langsung ke kasir untuk perubahan.",
  },
  {
    q: "Berapa lama pesanan siap?",
    a: "Rata-rata 15–20 menit, tergantung jumlah pesanan dan antrian dapur.",
  },
];

export default function HelpPage({ tableNumber, navActive, onNavChange }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [modal, setModal] = useState(null);
  const [reqText, setReqText] = useState("");
  const [reqSent, setReqSent] = useState(false);

  const closeModal = () => {
    setModal(null);
    setReqText("");
    setReqSent(false);
  };

  const quickRequests = [
    { id: "tagihan", icon: ReceiptIcon, title: "Minta tagihan", desc: "Bayar di meja" },
    { id: "alat", icon: UtensilsIcon, title: "Alat makan", desc: "Sendok, garpu, tisu" },
    { id: "wifi", icon: WifiIcon, title: "Info Wi-Fi", desc: "Nama & kata sandi" },
    { id: "lainnya", icon: ChatIcon, title: "Lainnya", desc: "Tulis permintaan" },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto min-h-screen max-w-md pb-28 md:max-w-none">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 md:px-6">
          <h1 className="text-base font-extrabold text-[#3f2a16]">Bantuan</h1>
          <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
            Meja {tableNumber}
          </span>
        </header>

        {/* Hero */}
        <section className="mt-4 px-4 md:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[var(--brand-dark)] to-[#5c3a1c] p-5 shadow-md">
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <BellIcon className="h-5 w-5 text-[#f5c26b]" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-white">Butuh sesuatu?</h2>
                <p className="text-xs text-white/60">
                  Pelayan akan datang ke Meja {tableNumber}
                </p>
              </div>
            </div>

            <button
              onClick={() => setModal("waiter")}
              className="mt-4 w-full rounded-full bg-gradient-to-b from-[#f5c26b] to-[#e8a83e] py-3.5 text-sm font-extrabold text-[#3f2a16] shadow-lg shadow-black/20 transition active:scale-[0.98]"
            >
              Panggil pelayan
            </button>
          </div>
        </section>

        {/* Permintaan cepat */}
        <section className="mt-6 px-4 md:px-6">
          <h3 className="text-base font-extrabold text-[#3f2a16]">Permintaan cepat</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickRequests.map(({ id, icon: Icon, title, desc }) => (
              <button
                key={id}
                onClick={() => setModal(id)}
                className="rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.97]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfcd] text-[var(--brand)]">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-bold text-[#3f2a16]">{title}</p>
                <p className="mt-0.5 text-[11px] text-[#b07a3a]">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Pertanyaan umum */}
        <section className="mt-6 px-4 md:px-6">
          <h3 className="text-base font-extrabold text-[#3f2a16]">Pertanyaan umum</h3>
          <div className="mt-3 rounded-3xl bg-white px-4 shadow-sm">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className={i !== 0 ? "border-t border-[#f3ead9]" : ""}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-[#3f2a16]">{faq.q}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 shrink-0 text-[#a08a70] transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="-mt-1 pb-4 text-xs leading-relaxed text-[#8a7460]">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ===== Modals ===== */}
      {modal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-8"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modal === "waiter" && (
              <>
                <span className="text-4xl">🔔</span>
                <p className="mt-2 text-base font-extrabold text-[#3f2a16]">Pelayan dipanggil!</p>
                <p className="mt-1 text-xs leading-relaxed text-[#8a7460]">
                  Tenang, pelayan akan segera menuju <b>Meja {tableNumber}</b>. Ditunggu di
                  tempat yaa 😊
                </p>
              </>
            )}

            {modal === "tagihan" && (
              <>
                <span className="text-4xl">🧾</span>
                <p className="mt-2 text-base font-extrabold text-[#3f2a16]">
                  Tagihan sedang disiapkan
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#8a7460]">
                  Pelayan akan membawa tagihan ke <b>Meja {tableNumber}</b>. Pembayaran bisa
                  tunai, debit, atau QRIS.
                </p>
              </>
            )}

            {modal === "alat" && (
              <>
                <span className="text-4xl">🍴</span>
                <p className="mt-2 text-base font-extrabold text-[#3f2a16]">Alat makan dipesan!</p>
                <p className="mt-1 text-xs leading-relaxed text-[#8a7460]">
                  Sendok, garpu, dan tisu akan segera diantar ke <b>Meja {tableNumber}</b>.
                </p>
              </>
            )}

            {modal === "wifi" && (
              <>
                <span className="text-4xl">📶</span>
                <p className="mt-2 text-base font-extrabold text-[#3f2a16]">Info Wi-Fi</p>
                <div className="mt-3 space-y-2 rounded-2xl bg-[var(--brand-soft)] p-4 text-left">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-[#a08a70]">Nama</p>
                    <p className="text-sm font-bold text-[#3f2a16]">{WIFI.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-[#a08a70]">Kata sandi</p>
                    <p className="text-sm font-bold text-[#3f2a16]">{WIFI.password}</p>
                  </div>
                </div>
              </>
            )}

            {modal === "lainnya" && (
              <>
                <span className="text-4xl">💬</span>
                <p className="mt-2 text-base font-extrabold text-[#3f2a16]">Tulis permintaan</p>
                {reqSent ? (
                  <p className="mt-2 text-xs leading-relaxed text-[#8a7460]">
                    Permintaan kamu terkirim! Pelayan akan segera menuju{" "}
                    <b>Meja {tableNumber}</b> 🙌
                  </p>
                ) : (
                  <>
                    <textarea
                      rows={3}
                      value={reqText}
                      onChange={(e) => setReqText(e.target.value)}
                      placeholder="Contoh: minta piring kecil, air gelas..."
                      className="mt-3 w-full resize-none rounded-2xl border border-[#eadfcd] bg-[var(--brand-soft)] p-3 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
                    />
                    <button
                      onClick={() => reqText.trim() && setReqSent(true)}
                      disabled={!reqText.trim()}
                      className="mt-3 w-full rounded-full bg-[var(--brand)] py-3 text-sm font-bold text-white transition active:scale-95 disabled:opacity-40"
                    >
                      Kirim permintaan
                    </button>
                  </>
                )}
              </>
            )}

            {modal !== "lainnya" && (
              <button
                onClick={closeModal}
                className="mt-4 w-full rounded-full bg-[var(--brand)] py-3 text-sm font-bold text-white transition active:scale-95"
              >
                Oke, siap!
              </button>
            )}
            {modal === "lainnya" && reqSent && (
              <button
                onClick={closeModal}
                className="mt-4 w-full rounded-full bg-[var(--brand)] py-3 text-sm font-bold text-white transition active:scale-95"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}

      <BottomNav active={navActive} onChange={onNavChange} />
    </div>
  );
}