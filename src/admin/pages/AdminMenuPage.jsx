import { useRef, useState } from "react";
import {
  useMenus, addMenu, updateMenu, deleteMenu, resetMenus,
} from "../data/menuStore";
import { rupiah } from "../utils/format";

const CATEGORIES = ["Makanan", "Minuman", "Camilan"];

const EMPTY_FORM = {
  name: "",
  category: "Makanan",
  price: "",
  description: "",
  badge: "",
  favorite: false,
  featured: false,
  image: "",
};

// 🖼️ Kecilkan gambar sebelum disimpan biar hemat penyimpanan browser
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

export default function AdminMenuPage() {
  const menus = useMenus();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const fileRef = useRef(null);

  // 🔔 Toast = notifikasi kecil yang muncul terus hilang sendiri
  const [toast, setToast] = useState(null); // { msg, type }
  const toastTimer = useRef(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  // ❓ Konfirmasi pakai modal, bukan window.confirm
  const [confirmBox, setConfirmBox] = useState(null); // { title, desc, ... }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      name: m.name,
      category: m.category,
      price: String(m.price),
      description: m.description || "",
      badge: m.badge || "",
      favorite: !!m.favorite,
      featured: !!m.featured,
      image: m.image || "",
    });
    setShowForm(true);
  };

  // 📷 Baca file gambar → kecilkan → simpan ke form
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const small = await compressImage(reader.result);
      set("image", small);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("Nama menu wajib diisi!", "warn");
    if (!form.price) return showToast("Harga wajib diisi!", "warn");

    const payload = {
      ...form,
      price: Number(form.price),
      rating: editing?.rating ?? 4.8,
      reviews: editing?.reviews ?? 0,
      detail:
        editing?.detail ?? {
          prepTime: "10 menit",
          portion: "1 porsi",
          allergens: "",
          optionGroups: [],
        },
    };

    if (editing) {
      updateMenu(editing.id, payload);
      showToast("Perubahan tersimpan");
    } else {
      addMenu(payload);
      showToast("Menu baru ditambahkan");
    }

    setShowForm(false);
  };

  // 🗑️ Tanya dulu pakai modal, baru hapus
  const askHapus = (m) =>
    setConfirmBox({
      icon: "🗑️",
      title: "Hapus menu?",
      desc: `"${m.name}" akan dihapus dari daftar menu.`,
      confirmLabel: "Ya, hapus",
      danger: true,
      onYes: () => {
        deleteMenu(m.id);
        setConfirmBox(null);
        showToast("Menu dihapus");
      },
    });

  // ♻️ Reset juga pakai modal
  const askReset = () =>
    setConfirmBox({
      icon: "♻️",
      title: "Reset semua menu?",
      desc: "Semua perubahan kamu hilang & menu kembali ke data awal.",
      confirmLabel: "Ya, reset",
      danger: true,
      onYes: () => {
        resetMenus();
        setConfirmBox(null);
        showToast("Menu dikembalikan ke data awal");
      },
    });

  return (
    <main className="px-4 pt-6 md:px-6 xl:px-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold leading-tight text-[#3f2a16] xl:text-3xl">
            Kelola Menu
          </h2>
          <p className="mt-1 text-[11px] text-[#8a7460]">
            {menus.length} menu • tersimpan otomatis di browser ini
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={askReset}
            className="rounded-full border border-[#eadfcd] bg-white px-4 py-2 text-xs font-bold text-[#6b5138] transition active:scale-95"
          >
            Reset
          </button>
          <button
            onClick={openAdd}
            className="rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95"
          >
            + Tambah menu
          </button>
        </div>
      </div>

      {/* Grid semua menu */}
      <div className="mt-5 grid grid-cols-2 items-start gap-3 md:grid-cols-3 xl:grid-cols-4">
        {menus.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative">
              <img src={m.image} alt={m.name} className="h-24 w-full object-cover md:h-28" />
              {m.featured && (
                <span className="absolute left-2 top-2 rounded-full bg-[var(--brand-dark)] px-2 py-0.5 text-[9px] font-bold text-white">
                  ⭐ Hero
                </span>
              )}
            </div>
            <div className="p-2.5">
              <div className="flex items-center gap-1.5">
                <h4 className="min-w-0 flex-1 truncate text-sm font-bold text-[#3f2a16]">
                  {m.name}
                </h4>
                {m.favorite && <span title="Favorit">❤️</span>}
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[var(--brand)]">
                  {rupiah(m.price)}
                </span>
                <span className="text-[10px] text-[#a08a70]">{m.category}</span>
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => openEdit(m)}
                  className="flex-1 rounded-full border border-[#e0d0b8] py-1.5 text-[11px] font-bold text-[#6b5138] transition active:scale-95"
                >
                  Edit
                </button>
                <button
                  onClick={() => askHapus(m)}
                  className="flex-1 rounded-full border border-red-200 py-1.5 text-[11px] font-bold text-red-600 transition active:scale-95"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Modal form tambah/edit ===== */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setShowForm(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
          >
            <p className="text-base font-extrabold text-[#3f2a16]">
              {editing ? "Edit menu" : "Tambah menu baru"}
            </p>

            {/* Upload gambar */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative mt-4 block h-36 w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#e0d0b8] bg-[var(--brand-soft)]"
            >
              {form.image ? (
                <>
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                  <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#3f2a16]">
                    📷 Ganti gambar
                  </span>
                </>
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-1 text-[#a08a70]">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-xs font-bold">Klik untuk unggah gambar</span>
                  <span className="text-[10px]">JPG/PNG — otomatis dikecilkan</span>
                </span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />

            {/* Nama */}
            <label className="mt-4 block">
              <span className="text-xs font-bold text-[#3f2a16]">Nama menu *</span>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Contoh: Es Kopi Panegar"
                className="mt-1 w-full rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
              />
            </label>

            {/* Kategori */}
            <div className="mt-3">
              <span className="text-xs font-bold text-[#3f2a16]">Kategori</span>
              <div className="mt-1.5 flex gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("category", c)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      form.category === c
                        ? "bg-[var(--brand)] text-white"
                        : "border border-[#eadfcd] bg-white text-[#6b5138]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Harga */}
            <label className="mt-3 block">
              <span className="text-xs font-bold text-[#3f2a16]">Harga *</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 focus-within:border-[var(--brand)]">
                <span className="text-sm font-bold text-[#a08a70]">Rp</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="18000"
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[#bda98d]"
                />
              </div>
            </label>

            {/* Deskripsi */}
            <label className="mt-3 block">
              <span className="text-xs font-bold text-[#3f2a16]">Deskripsi</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Ceritakan menu-nya sebentar..."
                className="mt-1 w-full resize-none rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
              />
            </label>

            {/* Badge */}
            <label className="mt-3 block">
              <span className="text-xs font-bold text-[#3f2a16]">Badge (opsional)</span>
              <input
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="Contoh: Best Seller, Baru!"
                className="mt-1 w-full rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[#bda98d] focus:border-[var(--brand)]"
              />
            </label>

            {/* Toggle */}
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#3f2a16]">
                <input
                  type="checkbox"
                  checked={form.favorite}
                  onChange={(e) => set("favorite", e.target.checked)}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                Tandai sebagai menu favorit
              </label>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#3f2a16]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                Jadikan banner utama / Hero (cuma satu menu)
              </label>
            </div>

            {/* Tombol */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-full border border-[#e0d0b8] py-3 text-sm font-bold text-[#6b5138] transition active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-[var(--brand)] py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition active:scale-[0.98]"
              >
                {editing ? "Simpan perubahan" : "Tambah menu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Modal konfirmasi (pengganti window.confirm) ===== */}
      {confirmBox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-8"
          onClick={() => setConfirmBox(null)}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-4xl">{confirmBox.icon}</span>
            <p className="mt-2 text-base font-extrabold text-[#3f2a16]">{confirmBox.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8a7460]">{confirmBox.desc}</p>
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={() => setConfirmBox(null)}
                className="flex-1 rounded-full border border-[#e0d0b8] py-3 text-sm font-bold text-[#6b5138] transition active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={confirmBox.onYes}
                className={`flex-1 rounded-full py-3 text-sm font-bold text-white transition active:scale-95 ${
                  confirmBox.danger ? "bg-red-600" : "bg-[var(--brand)]"
                }`}
              >
                {confirmBox.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast (pengganti alert) ===== */}
      {toast && (
        <div className="fixed left-1/2 top-5 z-[80] -translate-x-1/2 animate-slide-down">
          <div
            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-xl ${
              toast.type === "warn" ? "bg-red-600" : "bg-[var(--brand-dark)]"
            }`}
          >
            <span>{toast.type === "warn" ? "⚠️" : "✅"}</span>
            {toast.msg}
          </div>
        </div>
      )}
    </main>
  );
}