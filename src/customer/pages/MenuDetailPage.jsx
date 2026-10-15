import { useState } from "react";
import { ArrowLeftIcon, BagIcon } from "../components/Icons";
import { getDefaultChoices, getUnitPrice } from "../data/menu";
import { rupiah } from "../utils/format";

export default function MenuDetailPage({ menu, tableNumber, onBack, onAdd }) {
  const [sel, setSel] = useState(() => getDefaultChoices(menu));
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const unit = getUnitPrice(menu, sel);
  const total = unit * qty;

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto min-h-screen max-w-md pb-32 md:max-w-none">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between bg-[var(--cream)]/95 px-4 py-3 backdrop-blur md:px-6">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#3f2a16]">Detail menu</h1>
          <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
            Meja {tableNumber}
          </span>
        </header>

        {/* Foto */}
        <section className="px-4 md:px-6">
          <img
            src={menu.image}
            alt={menu.name}
            className="h-60 w-full rounded-3xl object-cover shadow-sm md:h-80"
          />
        </section>

        {/* Nama + harga */}
        <section className="mt-4 flex items-start justify-between gap-3 px-4 md:px-6">
          <h2 className="text-xl font-extrabold leading-snug text-[#3f2a16]">
            {menu.name}
          </h2>
          <span className="shrink-0 text-xl font-extrabold text-[var(--brand)]">
            {rupiah(menu.price)}
          </span>
        </section>

        {/* Deskripsi */}
        <p className="mt-1.5 px-4 text-sm leading-relaxed text-[#8a7460] md:px-6">
          {menu.description}
        </p>

        {/* Grup opsi */}
        {menu.detail.optionGroups.map((g) => (
          <section key={g.id} className="mt-5 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3f2a16]">{g.title}</h3>
              <span className="text-[11px] font-medium text-[#a08a70]">Pilih 1</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {g.options.map((o) => {
                const active = sel[g.id] === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setSel({ ...sel, [g.id]: o.id })}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                      active
                        ? "bg-[var(--brand)] text-white shadow-sm"
                        : "border border-[#eadfcd] bg-white text-[#6b5138]"
                    }`}
                  >
                    {o.label.replace(" (Default)", "")}
                    {o.priceDelta > 0 && (
                      <span
                        className={`text-[10px] font-bold ${
                          active ? "text-white/80" : "text-[var(--brand)]"
                        }`}
                      >
                        + {rupiah(o.priceDelta)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Catatan */}
        <section className="mt-6 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3f2a16]">Catatan</h3>
            <span className="text-[11px] font-medium text-[#a08a70]">Opsional</span>
          </div>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: tanpa daun bawang"
            className="mt-2 w-full resize-none rounded-2xl border border-[#eadfcd] bg-[var(--brand-soft)] p-3.5 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
          />
        </section>
      </div>

      {/* Bar bawah */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#efe5d6] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-4 p-4 md:max-w-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-lg font-bold transition active:scale-90 ${
                qty > 1
                  ? "border-[var(--brand)] text-[var(--brand)]"
                  : "border-gray-200 text-gray-300"
              }`}
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-extrabold text-[#3f2a16]">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-lg font-bold text-white shadow transition active:scale-90"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onAdd({ menu, choices: sel, qty, note })}
            className="flex-1 rounded-full bg-[var(--brand)] py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition active:scale-[0.98]"
          >
            Tambah • {rupiah(total)}
          </button>
        </div>
      </div>
    </div>
  );
}