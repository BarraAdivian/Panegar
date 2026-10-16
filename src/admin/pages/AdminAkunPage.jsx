import { useState } from "react";
import { useSettings, updateSettings, resetSettings } from "../data/settingsStore";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[var(--brand)]" : "bg-[#e0d0b8]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function AdminAkunPage() {
  const settings = useSettings();
  const [editProfile, setEditProfile] = useState(false);
  const [form, setForm] = useState({
    adminName: settings.adminName,
    restaurantName: settings.restaurantName,
    address: settings.address,
    phone: settings.phone,
  });
  const [toast, setToast] = useState(null);
  const [confirmBox, setConfirmBox] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const saveProfile = () => {
    if (!form.adminName.trim()) return showToast("Nama admin wajib diisi");
    // Auto buat inisial dari nama
    const initials = form.adminName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    updateSettings({
      adminName: form.adminName,
      adminInitials: initials,
      restaurantName: form.restaurantName,
      address: form.address,
      phone: form.phone,
    });
    setEditProfile(false);
    showToast("Profil tersimpan");
  };

  return (
    <main className="px-4 pt-6 md:px-6 xl:px-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold leading-tight text-[#3f2a16] xl:text-3xl">
          Akun
        </h2>
        <p className="mt-1 text-[11px] text-[#8a7460]">Profil & pengaturan panel admin</p>
      </div>

      {/* ===== Kartu profil ===== */}
      <section className="mt-4 rounded-3xl bg-gradient-to-br from-[var(--brand-dark)] to-[#5c3a1c] p-5 text-white shadow-md">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-xl font-extrabold">
            {settings.adminInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold">{settings.adminName}</p>
            <p className="text-xs text-white/60">Admin • Panel Dapur</p>
          </div>
          <button
            onClick={() => setEditProfile(!editProfile)}
            className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-xs font-bold transition active:scale-95"
          >
            {editProfile ? "Batal" : "✏️ Edit"}
          </button>
        </div>

        {/* Form edit profil */}
        {editProfile && (
          <div className="mt-4 space-y-3 border-t border-white/15 pt-4">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wide text-white/60">
                Nama admin
              </span>
              <input
                value={form.adminName}
                onChange={(e) => set("adminName", e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wide text-white/60">
                Nama restoran
              </span>
              <input
                value={form.restaurantName}
                onChange={(e) => set("restaurantName", e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wide text-white/60">
                Alamat
              </span>
              <input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wide text-white/60">
                No. telepon
              </span>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
            </label>
            <button
              onClick={saveProfile}
              className="w-full rounded-full bg-gradient-to-b from-[#f5c26b] to-[#e8a83e] py-3 text-sm font-extrabold text-[#3f2a16] shadow-lg shadow-black/20 transition active:scale-[0.98]"
            >
              Simpan profil
            </button>
          </div>
        )}
      </section>

      {/* ===== Status restoran ===== */}
      <section className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#3f2a16]">Status restoran</h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                settings.isOpen ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {settings.isOpen ? "🟢" : "🔴"}
            </span>
            <div>
              <p className="text-sm font-bold text-[#3f2a16]">
                {settings.isOpen ? "Sedang buka" : "Tutup"}
              </p>
              <p className="text-[11px] text-[#a08a70]">
                {settings.isOpen
                  ? "Menerima pesanan dari customer"
                  : "Customer tidak bisa mengirim pesanan"}
              </p>
            </div>
          </div>
          <Toggle
            checked={settings.isOpen}
            onChange={(v) => {
              updateSettings({ isOpen: v });
              showToast(v ? "Restoran dibuka" : "Restoran ditutup");
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#f3ead9] pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-lg">
              ⚡
            </span>
            <div>
              <p className="text-sm font-bold text-[#3f2a16]">Terima otomatis</p>
              <p className="text-[11px] text-[#a08a70]">
                Pesanan baru langsung berstatus "Dibuat"
              </p>
            </div>
          </div>
          <Toggle
            checked={settings.autoAccept}
            onChange={(v) => {
              updateSettings({ autoAccept: v });
              showToast(v ? "Terima otomatis aktif" : "Terima otomatis mati");
            }}
          />
        </div>
      </section>

      {/* ===== Biaya & pajak ===== */}
      <section className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#3f2a16]">Biaya & pajak</h3>
        <p className="mt-0.5 text-[11px] text-[#a08a70]">
          Dipakai saat menghitung total pesanan customer
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold text-[#3f2a16]">Pajak PB1 (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.taxRate}
              onChange={(e) => updateSettings({ taxRate: Number(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-[#3f2a16]">Biaya layanan (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.serviceRate}
              onChange={(e) => updateSettings({ serviceRate: Number(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-[#eadfcd] bg-[var(--brand-soft)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
            />
          </label>
        </div>
      </section>

      {/* ===== Info aplikasi ===== */}
      <section className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#3f2a16]">Info aplikasi</h3>
        <div className="mt-3 space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#a08a70]">Nama aplikasi</span>
            <span className="font-bold text-[#3f2a16]">KOPi Panegar</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#a08a70]">Versi</span>
            <span className="font-bold text-[#3f2a16]">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#a08a70]">Backend</span>
            <span className="font-bold text-[#8a7460]">Menunggu integrasi API</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#a08a70]">Penyimpanan</span>
            <span className="font-bold text-[#3f2a16]">localStorage browser</span>
          </div>
        </div>

        <button
          onClick={() =>
            setConfirmBox({
              icon: "🔄",
              title: "Reset semua setelan?",
              desc: "Nama, status restoran, dan biaya kembali ke pengaturan awal.",
              confirmLabel: "Ya, reset",
              onYes: () => {
                resetSettings();
                setConfirmBox(null);
                showToast("Setelan dikembalikan ke awal");
              },
            })
          }
          className="mt-4 w-full rounded-full border border-red-200 py-3 text-sm font-bold text-red-600 transition active:scale-[0.98]"
        >
          Reset setelan
        </button>
      </section>

      {/* ===== Keluar ===== */}
      <section className="mt-4 mb-4">
        <button
          onClick={() =>
            setConfirmBox({
              icon: "👋",
              title: "Keluar dari panel admin?",
              desc: "Kamu perlu login lagi untuk membuka panel ini. (fitur login menyusul)",
              confirmLabel: "Keluar",
              danger: true,
              onYes: () => {
                setConfirmBox(null);
                showToast("Fitur login menyusul — ini demo 🙂");
              },
            })
          }
          className="w-full rounded-full border border-[#eadfcd] bg-white py-3.5 text-sm font-bold text-[#6b5138] shadow-sm transition active:scale-[0.98]"
        >
          Keluar
        </button>
      </section>

      {/* ===== Modal konfirmasi ===== */}
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

      {/* ===== Toast ===== */}
      {toast && (
        <div className="fixed left-1/2 top-5 z-[80] -translate-x-1/2 animate-slide-down">
          <div className="flex items-center gap-2 rounded-full bg-[var(--brand-dark)] px-5 py-3 text-sm font-bold text-white shadow-xl">
            <span>✅</span>
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}