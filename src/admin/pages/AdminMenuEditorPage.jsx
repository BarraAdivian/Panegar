import { useRef, useState } from "react";
import { ArrowLeftIcon } from "../components/Icons";
import Switch from "../components/Switch";
import { addMenu, updateMenu } from "../data/menuStore";

const uid = () => Math.random().toString(36).slice(2, 9);

// 🖼️ Kecilkan gambar biar hemat penyimpanan browser
function compressImage(dataUrl, maxW = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function AdminMenuEditorPage({ menu, onBack, onSaved }) {
  const isEdit = !!menu;
  const fileRef = useRef(null);

  const [name, setName] = useState(menu?.name ?? "");
  const [category, setCategory] = useState(menu?.category ?? "");
  const [priceStr, setPriceStr] = useState(menu ? String(menu.price) : "");
  const [description, setDescription] = useState(menu?.description ?? "");
  const [image, setImage] = useState(menu?.image ?? "");
  const [available, setAvailable] = useState(menu ? menu.available !== false : true);
  const [favorite, setFavorite] = useState(menu ? !!menu.favorite : true);
  const [groups, setGroups] = useState(() =>
    (menu?.detail?.optionGroups ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      options: g.options.map((o) => ({
        id: o.id,
        label: o.label.replace(" (Default)", ""),
        priceDelta: o.priceDelta || 0,
      })),
    }))
  );

  const valid = name.trim() && category && Number(priceStr) > 0;

  // ===== Helper grup & opsi =====
  const addGroup = () =>
    setGroups((g) => [
      ...g,
      { id: uid(), title: "", options: [{ id: uid(), label: "", priceDelta: 0 }] },
    ]);

  const removeGroup = (gid) => setGroups((g) => g.filter((x) => x.id !== gid));

  const setGroupTitle = (gid, title) =>
    setGroups((g) => g.map((x) => (x.id === gid ? { ...x, title } : x)));

  const addOption = (gid) =>
    setGroups((g) =>
      g.map((x) =>
        x.id === gid
          ? { ...x, options: [...x.options, { id: uid(), label: "", priceDelta: 0 }] }
          : x
      )
    );

  const removeOption = (gid, oid) =>
    setGroups((g) =>
      g.map((x) =>
        x.id === gid ? { ...x, options: x.options.filter((o) => o.id !== oid) } : x
      )
    );

  const setOption = (gid, oid, patch) =>
    setGroups((g) =>
      g.map((x) =>
        x.id === gid
          ? { ...x, options: x.options.map((o) => (o.id === oid ? { ...o, ...patch } : o)) }
          : x
      )
    );

  // ===== Gambar =====
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setImage(await compressImage(reader.result));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ===== Simpan =====
  const submit = () => {
    if (!valid) return;

    const payload = {
      name: name.trim(),
      category,
      price: Number(priceStr),
      description: description.trim(),
      image,
      available,
      favorite,
      detail: {
        prepTime: menu?.detail?.prepTime ?? "10 menit",
        portion: menu?.detail?.portion ?? "1 porsi",
        allergens: menu?.detail?.allergens ?? "",
        optionGroups: groups
          .map((g) => ({
            id: g.id,
            title: g.title.trim() || "Pilihan",
            options: g.options
              .filter((o) => o.label.trim())
              .map((o) => ({
                id: o.id,
                label: o.label.trim(),
                priceDelta: Number(o.priceDelta) || 0,
              })),
          }))
          .filter((g) => g.options.length > 0),
      },
    };

    if (isEdit) updateMenu(menu.id, payload);
    else addMenu(payload);
    onSaved();
  };

  return (
    <div className="pb-36">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-4">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-base font-extrabold text-[#3f2a16]">
          {isEdit ? "Edit menu" : "Tambah menu"}
        </h1>
      </header>

      <main className="mx-auto max-w-md px-4 md:max-w-xl">
        {/* ===== Foto ===== */}
        {isEdit ? (
          <div className="relative mt-4">
            <img
              src={image}
              alt="Foto menu"
              className="h-48 w-full rounded-3xl object-cover shadow-sm"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-[11px] font-bold text-[#3f2a16] shadow transition active:scale-95"
            >
              📷 Ganti foto
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex h-40 w-full flex-col items-center justify-center gap-1.5 rounded-3xl border-2 border-dashed border-[#e0d0b8] bg-[var(--brand-soft)]"
          >
            {image ? (
              <>
                <img src={image} alt="Preview" className="h-full w-full rounded-3xl object-cover" />
                <span className="absolute mt-24 rounded-full bg-white/95 px-3.5 py-2 text-[11px] font-bold text-[#3f2a16] shadow">
                  📷 Ganti foto
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl">🖼️</span>
                <span className="text-xs font-bold text-[#6b5138]">Unggah foto menu</span>
                <span className="text-[10px] text-[#a08a70]">
                  JPG atau PNG, maks. 2 MB, rasio 4:3
                </span>
              </>
            )}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />

        {/* ===== Nama ===== */}
        <label className="mt-5 block">
          <span className="text-xs font-bold text-[#3f2a16]">Nama menu *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Nasi Goreng Kampung"
            className="mt-1.5 w-full rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-3 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
          />
        </label>

        {/* ===== Kategori ===== */}
        <label className="mt-4 block">
          <span className="text-xs font-bold text-[#3f2a16]">Kategori *</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`mt-1.5 w-full appearance-none rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-3 text-sm outline-none focus:border-[var(--brand)] ${
              category ? "text-[#3f2a16]" : "text-[#bda98d]"
            }`}
          >
            <option value="">Pilih kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Camilan">Camilan</option>
          </select>
        </label>

        {/* ===== Harga ===== */}
        <label className="mt-4 block">
          <span className="text-xs font-bold text-[#3f2a16]">Harga *</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 focus-within:border-[var(--brand)]">
            <span className="text-sm font-bold text-[#a08a70]">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={priceStr ? Number(priceStr).toLocaleString("id-ID") : ""}
              onChange={(e) => setPriceStr(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="w-full bg-transparent py-3 text-sm font-semibold text-[#3f2a16] outline-none placeholder:text-[#bda98d]"
            />
          </div>
        </label>

        {/* ===== Deskripsi ===== */}
        <label className="mt-4 block">
          <span className="text-xs font-bold text-[#3f2a16]">Deskripsi</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan rasa, bahan, dan porsinya..."
            className="mt-1.5 w-full resize-none rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-3 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
          />
          <span className="mt-1 block text-[10px] text-[#b3a18c]">
            *Tidak wajib untuk menu minuman
          </span>
        </label>

        {/* ===== Pilihan tambahan ===== */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#3f2a16]">Pilihan tambahan</h3>
            <span className="text-[11px] text-[#a08a70]">Opsional</span>
          </div>

          {groups.length === 0 ? (
            <p className="mt-2.5 rounded-xl bg-[var(--brand-soft)] px-3.5 py-3 text-[11px] leading-relaxed text-[#8a7460]">
              Belum ada pilihan tambahan — buat variasi seperti ukuran atau level
            </p>
          ) : (
            <div className="mt-2.5 space-y-3">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="rounded-2xl border border-[#eadfcd] bg-white p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      value={g.title}
                      onChange={(e) => setGroupTitle(g.id, e.target.value)}
                      placeholder="Contoh: Level pedas"
                      className="min-w-0 flex-1 rounded-lg border border-[#eadfcd] bg-[var(--brand-soft)] px-3 py-2 text-sm font-bold outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
                    />
                    <button
                      type="button"
                      onClick={() => removeGroup(g.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#b3a18c] transition hover:bg-red-50 hover:text-red-600 active:scale-90"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-1 text-[10px] text-[#a08a70]">
                    Wajib pilih 1 — opsi pertama jadi pilihan bawaan
                  </p>

                  <div className="mt-2 space-y-2">
                    {g.options.map((o) => (
                      <div key={o.id} className="flex items-center gap-2">
                        <input
                          value={o.label}
                          onChange={(e) => setOption(g.id, o.id, { label: e.target.value })}
                          placeholder="Nama pilihan"
                          className="min-w-0 flex-1 rounded-lg border border-[#eadfcd] bg-[var(--brand-soft)] px-3 py-2 text-xs outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
                        />
                        <div className="flex w-28 shrink-0 items-center gap-1 rounded-lg border border-[#eadfcd] bg-[var(--brand-soft)] px-2 focus-within:border-[var(--brand)]">
                          <span className="text-[10px] font-bold text-[#a08a70]">+Rp</span>
                          <input
                            type="number"
                            value={o.priceDelta || ""}
                            onChange={(e) =>
                              setOption(g.id, o.id, {
                                priceDelta: e.target.value === "" ? 0 : Number(e.target.value),
                              })
                            }
                            placeholder="0"
                            className="w-full bg-transparent py-2 text-xs outline-none placeholder:text-[#bda98d]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOption(g.id, o.id)}
                          className="shrink-0 text-[#b3a18c] transition hover:text-red-600 active:scale-90"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(g.id)}
                      className="w-full rounded-lg border border-dashed border-[#e0d0b8] py-2 text-[11px] font-bold text-[#b07a3a] transition active:scale-[0.98]"
                    >
                      + Tambah pilihan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addGroup}
            className="mt-3 w-full rounded-xl border border-dashed border-[#e0d0b8] bg-white py-3 text-xs font-bold text-[#b07a3a] transition active:scale-[0.99]"
          >
            + Tambah grup pilihan
          </button>
        </section>

        {/* ===== Toggle ===== */}
        <section className="mt-6 space-y-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#3f2a16]">Tersedia untuk dipesan</p>
              <p className="text-[11px] text-[#a08a70]">
                Lanjutkan tampil dalam daftar menu
              </p>
            </div>
            <Switch on={available} onChange={setAvailable} />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#f3ead9] pt-4">
            <div>
              <p className="text-sm font-bold text-[#3f2a16]">Tampilkan di Menu Favorit</p>
              <p className="text-[11px] text-[#a08a70]">
                Muncul di bagian favorit halaman utama
              </p>
            </div>
            <Switch on={favorite} onChange={setFavorite} />
          </div>
        </section>
      </main>

      {/* ===== Bar bawah ===== */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#efe5d6] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 p-4 md:max-w-xl">
          <button
            onClick={onBack}
            className="flex-1 rounded-full border border-[#e0d0b8] bg-white py-3.5 text-sm font-bold text-[#6b5138] transition active:scale-[0.98]"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={!valid}
            className={`flex-1 rounded-full py-3.5 text-sm font-bold text-white transition ${
              valid
                ? "bg-[var(--brand-dark)] shadow-lg shadow-black/15 active:scale-[0.98]"
                : "cursor-not-allowed bg-[#d8c9b2]"
            }`}
          >
            {isEdit ? "Simpan perubahan" : "Simpan menu"}
          </button>
        </div>
      </div>
    </div>
  );
}