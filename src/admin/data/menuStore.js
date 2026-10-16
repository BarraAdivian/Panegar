import { useEffect, useState } from "react";
import { allMenus as seedMenus } from "../../customer/data/menu";

// 📦 Menu admin disimpan di localStorage (catatan browser)
const KEY = "kopi-panegar-admin-menus";

let menus = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return seedMenus; // pertama kali buka → salin dari data awal
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(menus));
  } catch (e) {
    alert("Penyimpanan browser penuh! Coba gambar yang lebih kecil.");
  }
}

// 📢 Kasih tau semua komponen yang lagi nampilin menu: "hei, datanya berubah!"
function emit() {
  listeners.forEach((l) => l(menus));
}

// Sinkron antar-tab
window.addEventListener("storage", (e) => {
  if (e.key === KEY) {
    menus = load();
    emit();
  }
});

// 🪝 Hook buat baca daftar menu — otomatis re-render pas ada perubahan
export function useMenus() {
  const [snapshot, setSnapshot] = useState(menus);

  useEffect(() => {
    const listener = (m) => setSnapshot(m);
    listeners.add(listener);
    setSnapshot(menus);
    return () => listeners.delete(listener);
  }, []);

  return snapshot;
}

// ✍️ CRUD — setiap selesai, emit() biar tampilan langsung update
export function addMenu(menu) {
  let next = [
    { ...menu, id: Date.now(), available: menu.available !== false },
    ...menus,
  ];
  if (menu.featured) {
    next = next.map((m) => (m.id === next[0].id ? m : { ...m, featured: false }));
  }
  menus = next;
  save();
  emit();
}

export function updateMenu(id, patch) {
  let next = menus.map((m) => (m.id === id ? { ...m, ...patch } : m));
  if (patch.featured) {
    next = next.map((m) => (m.id === id ? m : { ...m, featured: false }));
  }
  menus = next;
  save();
  emit();
}

export function deleteMenu(id) {
  menus = menus.filter((m) => m.id !== id);
  save();
  emit();
}

export function resetMenus() {
  menus = seedMenus;
  save();
  emit();
}