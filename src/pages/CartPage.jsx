import { ArrowLeftIcon, ClockIcon } from "../components/Icons";
import { rupiah } from "../utils/format";

const TAX_RATE = 0.1;    // Pajak PB1 10%
const SERVICE_RATE = 0.05; // Biaya layanan 5%

const paymentMethods = [
  { id: "kasir", title: "Bayar di kasir", desc: "Tunai atau debit setelah makan", icon: "/tunai.svg" },
  { id: "qris", title: "QRIS", desc: "Scan kode QR dari HP kamu", icon: "/qris.svg" },
];

export default function CartPage({
  cart, updateQty, removeItem,
  payment, setPayment,
  tableNumber, onBack, onAddMore, onConfirm,
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const service = Math.round(subtotal * SERVICE_RATE);
  const total = subtotal + tax + service;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  // ===== Empty state =====
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="mx-auto min-h-screen max-w-md bg-[var(--cream)]">
          <Header tableNumber={tableNumber} onBack={onBack} />
          <div className="flex h-[70vh] flex-col items-center justify-center gap-2 text-center">
            <span className="text-5xl">🛒</span>
            <p className="font-extrabold text-[#3f2a16]">Belum ada pesanan</p>
            <p className="text-sm text-[#8a7460]">Yuk pilih menu favoritmu dulu!</p>
            <button
              onClick={onBack}
              className="mt-3 rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-bold text-white transition active:scale-95"
            >
              Lihat menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto min-h-screen max-w-md pb-36">
        <Header tableNumber={tableNumber} onBack={onBack} />

        {/* Judul + tambah menu */}
        <section className="mt-4 flex items-center justify-between px-4">
          <h2 className="text-base font-extrabold text-[#3f2a16]">
            {itemCount} menu dipesan
          </h2>
          <button
            onClick={onAddMore}
            className="text-xs font-bold text-[var(--brand)] active:opacity-60"
          >
            + Tambah menu
          </button>
        </section>

        {/* Daftar item — satu kartu putih */}
        <section className="mt-3 px-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            {cart.map((item, idx) => (
              <div
                key={item.key}
                className={`flex items-center gap-3 py-3 ${
                  idx !== 0 ? "border-t border-[#f3ead9]" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-[#3f2a16]">{item.name}</h4>
                  {item.options?.length > 0 && (
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[#a08a70]">
                      {item.options.join(" • ")}
                    </p>
                  )}
                  <p className="mt-0.5 text-sm font-extrabold text-[var(--brand)]">
                    {rupiah(item.price * item.qty)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => updateQty(item.key, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--brand)] text-sm font-bold text-[var(--brand)] transition active:scale-90"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-bold text-[#3f2a16]">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.key, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white shadow transition active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cara bayar */}
        <section className="mt-6 px-4">
          <h3 className="text-base font-extrabold text-[#3f2a16]">Cara bayar</h3>
          <div className="mt-3 space-y-3">
            {paymentMethods.map((m) => {
              const active = payment === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[var(--brand)] bg-white shadow-sm"
                      : "border-[#eadfcd] bg-white/60"
                  }`}
                >
                  <img src={m.icon} alt={m.title} className="h-8 w-8 shrink-0 object-contain" />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-[#3f2a16]">{m.title}</span>
                    <span className="block text-[11px] text-[#a08a70]">{m.desc}</span>
                  </span>
                  {/* Radio bulat */}
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      active ? "border-[var(--brand)] bg-[var(--brand)]" : "border-[#d5c5ab]"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Rincian pembayaran */}
        <section className="mt-6 px-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7460]">Subtotal</span>
              <span className="font-semibold text-[#3f2a16]">{rupiah(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-[#8a7460]">Pajak PB1 (10%)</span>
              <span className="font-semibold text-[#3f2a16]">{rupiah(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-[#8a7460]">Biaya layanan (5%)</span>
              <span className="font-semibold text-[#3f2a16]">{rupiah(service)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#f3ead9] pt-3">
              <span className="text-sm font-extrabold text-[#3f2a16]">Total</span>
              <span className="text-lg font-extrabold text-[var(--brand)]">{rupiah(total)}</span>
            </div>
          </div>
        </section>

        {/* Estimasi */}
        <div className="mt-4 flex items-center gap-2 px-4 text-xs text-[#8a7460]">
          <ClockIcon className="h-4 w-4" />
          <span>Pesanan siap sekitar 15–20 menit</span>
        </div>
      </div>

      {/* Tombol kirim (fixed) */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-[var(--cream)] via-[var(--cream)] to-transparent pt-6">
        <div className="mx-auto max-w-md p-4">
          <button
            onClick={() => onConfirm({ items: cart, note: "", payment })}
            className="w-full rounded-full bg-[var(--brand)] py-4 text-sm font-bold text-white shadow-lg shadow-black/15 transition active:scale-[0.98]"
          >
            Kirim pesanan • {rupiah(total)}
          </button>
          <p className="mt-2 text-center text-[10px] text-[#a08a70]">
            Pesanan langsung masuk ke dapur
          </p>
        </div>
      </div>
    </div>
  );
}

function Header({ tableNumber, onBack }) {
  return (
    <header className="flex items-center justify-between px-4 pt-4">
      <button
        onClick={onBack}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <h1 className="text-base font-extrabold text-[#3f2a16]">Pesanan kamu</h1>
      <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
        Meja {tableNumber}
      </span>
    </header>
  );
}