import { useState } from "react";
import { useMenus, updateMenu } from "../data/menuStore";
import { rupiah } from "../utils/format";
import { SearchIcon } from "../components/Icons";
import Switch from "../components/Switch";

const CATEGORIES = ["Semua", "Makanan", "Minuman", "Camilan"];

export default function AdminMenuPage({ onAdd, onEdit }) {
  const menus = useMenus();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Semua");

  const filtered = menus.filter((m) => {
    const okCat = cat === "Semua" || m.category === cat;
    const okSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return okCat && okSearch;
  });

  // Kelompokkan per kategori (jaga urutan kemunculan)
  const groups = [];
  filtered.forEach((m) => {
    let g = groups.find((x) => x.cat === m.category);
    if (!g) {
      g = { cat: m.category, items: [] };
      groups.push(g);
    }
    g.items.push(m);
  });

  return (
    <main className="mx-auto max-w-md px-4 pt-5 md:max-w-3xl md:px-6 xl:px-8">
      {/* Judul + tambah */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-[#3f2a16] xl:text-3xl">Kelola menu</h2>
        <button
          onClick={onAdd}
          className="shrink-0 rounded-full bg-[var(--brand-dark)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
        >
          + Tambah
        </button>
      </div>

      {/* Pencarian */}
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
        <SearchIcon className="h-4 w-4 shrink-0 text-[#a08a70]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama menu..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#b3a18c]"
        />
      </div>

      {/* Kategori */}
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
              cat === c
                ? "bg-[var(--brand-dark)] text-white"
                : "border border-[#eadfcd] bg-white text-[#6b5138]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Daftar per kategori */}
      {groups.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-[#e0d0b8] py-10 text-center text-sm text-[#b3a18c]">
          Menu tidak ditemukan
        </p>
      )}

      {groups.map((g) => (
        <section key={g.cat} className="mt-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-[#3f2a16]">{g.cat}</h3>
            <span className="text-[11px] text-[#a08a70]">{g.items.length} menu</span>
          </div>

          <div className="mt-2 divide-y divide-[#f3ead9] rounded-2xl bg-white shadow-sm">
            {g.items.map((m) => {
              const tersedia = m.available !== false;
              return (
                <div
                  key={m.id}
                  onClick={() => onEdit(m)}
                  className="flex cursor-pointer items-center gap-3 px-3.5 py-3 transition active:opacity-60"
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#3f2a16]">{m.name}</p>
                    <p className="mt-0.5 text-xs font-bold text-[var(--brand)]">
                      {rupiah(m.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center gap-0.5">
                    <Switch
                      on={tersedia}
                      onChange={(v) => updateMenu(m.id, { available: v })}
                    />
                    <span
                      className={`text-[9px] font-bold ${
                        tersedia ? "text-green-600" : "text-[#b3a18c]"
                      }`}
                    >
                      {tersedia ? "Tersedia" : "Habis"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <p className="mt-4 text-center text-[10px] text-[#b3a18c]">
        Klik menu untuk mengedit • toggle untuk atur ketersediaan
      </p>
    </main>
  );
}