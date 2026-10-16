import { useMemo } from "react";
import { orderTotal, orderCount, STATUS } from "../data/orders";
import { rupiah } from "../utils/format";

const MEDALI = ["🥇", "🥈", "🥉"];

export default function AdminLaporanPage({ orders }) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ===== Hitung semua angka dari data pesanan =====
  const totalPendapatan = orders.reduce((s, o) => s + orderTotal(o), 0);
  const totalItem = orders.reduce((s, o) => s + orderCount(o), 0);
  const rataRata = orders.length > 0 ? Math.round(totalPendapatan / orders.length) : 0;

  // 🏆 Menu terlaris — jumlahkan qty per nama menu
  const terlaris = useMemo(() => {
    const map = {};
    orders.forEach((o) =>
      o.items.forEach((i) => {
        if (!map[i.name]) map[i.name] = { name: i.name, qty: 0, revenue: 0 };
        map[i.name].qty += i.qty;
        map[i.name].revenue += i.price * i.qty;
      })
    );
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  }, [orders]);

  const maxQty = terlaris[0]?.qty ?? 1;

  // 💳 Split metode bayar
  const bayar = useMemo(() => {
    const res = {
      kasir: { count: 0, revenue: 0 },
      qris: { count: 0, revenue: 0 },
    };
    orders.forEach((o) => {
      if (res[o.payment]) {
        res[o.payment].count += 1;
        res[o.payment].revenue += orderTotal(o);
      }
    });
    return res;
  }, [orders]);

  const bayarMax = Math.max(bayar.kasir.revenue, bayar.qris.revenue, 1);

  // 📜 Riwayat — terbaru dulu
  const riwayat = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="px-4 pt-6 md:px-6 xl:px-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold leading-tight text-[#3f2a16] xl:text-3xl">
          Laporan
        </h2>
        <p className="mt-1 text-[11px] text-[#8a7460]">{today}</p>
      </div>

      {/* ===== Kartu ringkasan ===== */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-lg">
            💰
          </span>
          <p className="mt-3 text-xl font-extrabold text-[#3f2a16]">
            {rupiah(totalPendapatan)}
          </p>
          <p className="text-xs text-[#a08a70]">Total pendapatan</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg">
            🧾
          </span>
          <p className="mt-3 text-xl font-extrabold text-[#3f2a16]">{orders.length}</p>
          <p className="text-xs text-[#a08a70]">Total pesanan</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-lg">
            🍽️
          </span>
          <p className="mt-3 text-xl font-extrabold text-[#3f2a16]">{totalItem}</p>
          <p className="text-xs text-[#a08a70]">Item terjual</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-lg">
            📊
          </span>
          <p className="mt-3 text-xl font-extrabold text-[#3f2a16]">{rupiah(rataRata)}</p>
          <p className="text-xs text-[#a08a70]">Rata-rata / pesanan</p>
        </div>
      </div>

      {/* ===== Menu terlaris + metode bayar ===== */}
      <div className="mt-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        {/* Terlaris */}
        <section className="rounded-3xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#3f2a16]">Menu terlaris</h3>
          <div className="mt-3 space-y-3">
            {terlaris.length === 0 && (
              <p className="py-6 text-center text-xs text-[#b3a18c]">
                Belum ada data penjualan
              </p>
            )}
            {terlaris.slice(0, 5).map((m, i) => (
              <div key={m.name}>
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-xs font-bold text-[#3f2a16]">
                    {MEDALI[i] ?? `${i + 1}.`} {m.name}
                  </p>
                  <p className="shrink-0 text-[11px] font-semibold text-[#8a7460]">
                    {m.qty} terjual • {rupiah(m.revenue)}
                  </p>
                </div>
                {/* Bar visual */}
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f3ead9]">
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
                    style={{ width: `${(m.qty / maxQty) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metode bayar */}
        <section className="rounded-3xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#3f2a16]">Metode pembayaran</h3>
          <div className="mt-4 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#3f2a16]">
                  💵 Bayar di kasir{" "}
                  <span className="font-medium text-[#a08a70]">({bayar.kasir.count} pesanan)</span>
                </p>
                <p className="text-xs font-extrabold text-[#3f2a16]">
                  {rupiah(bayar.kasir.revenue)}
                </p>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f3ead9]">
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
                  style={{ width: `${(bayar.kasir.revenue / bayarMax) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#3f2a16]">
                  📱 QRIS{" "}
                  <span className="font-medium text-[#a08a70]">({bayar.qris.count} pesanan)</span>
                </p>
                <p className="text-xs font-extrabold text-[#3f2a16]">
                  {rupiah(bayar.qris.revenue)}
                </p>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f3ead9]">
                <div
                  className="h-full rounded-full bg-[#c9974f] transition-all duration-500"
                  style={{ width: `${(bayar.qris.revenue / bayarMax) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Komposisi status */}
          <h3 className="mt-6 text-sm font-extrabold text-[#3f2a16]">Status pesanan</h3>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((s) => (
              <span
                key={s}
                className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-[11px] font-bold text-[#8a6a3f]"
              >
                {STATUS[s]}: {orders.filter((o) => o.status === s).length}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* ===== Riwayat pesanan ===== */}
      <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#3f2a16]">Riwayat pesanan</h3>
        <div className="mt-3 divide-y divide-[#f3ead9]">
          {riwayat.length === 0 && (
            <p className="py-6 text-center text-xs text-[#b3a18c]">Belum ada pesanan</p>
          )}
          {riwayat.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-xs font-extrabold text-[var(--brand)]">
                  {o.table}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#3f2a16]">#{o.code}</p>
                  <p className="text-[11px] text-[#a08a70]">
                    {o.createdAt.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • {orderCount(o)} item •{" "}
                    {o.payment === "qris" ? "QRIS" : "Kasir"}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-extrabold text-[#3f2a16]">{rupiah(orderTotal(o))}</p>
                <p className="text-[10px] font-semibold text-[#a08a70]">{STATUS[o.status]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-4 text-center text-[10px] text-[#b3a18c]">
        Laporan dihitung dari pesanan yang masuk ke panel ini — nanti otomatis
        terhubung data asli saat backend siap
      </p>
    </main>
  );
}