import { useEffect, useState } from "react";

// ⚙️ Setelan resto disimpan di localStorage
const KEY = "kopi-panegar-settings";

const DEFAULTS = {
  adminName: "Fikri Kurniawan",      // ← ganti nama lo
  adminInitials: "FK",
  restaurantName: "Kopi Panegar",
  address: "Jl. Sabang No. 24, Menteng, Jakarta Pusat",
  phone: "0812-3456-7890",
  isOpen: true,
  autoAccept: false,        // otomatis "Terima" pesanan baru
  serviceRate: 5,           // biaya layanan (%)
  taxRate: 10,              // pajak PB1 (%)
};

let settings = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (e) {}
  return { ...DEFAULTS };
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch (e) {}
}

const listeners = new Set();

function emit() {
  listeners.forEach((l) => l(settings));
}

window.addEventListener("storage", (e) => {
  if (e.key === KEY) {
    settings = load();
    emit();
  }
});

// 🪝 Hook buat baca setelan
export function useSettings() {
  const [snapshot, setSnapshot] = useState(settings);

  useEffect(() => {
    const listener = (s) => setSnapshot(s);
    listeners.add(listener);
    setSnapshot(settings);
    return () => listeners.delete(listener);
  }, []);

  return snapshot;
}

// ✍️ Update sebagian setelan
export function updateSettings(patch) {
  settings = { ...settings, ...patch };
  save();
  emit();
}

export function resetSettings() {
  settings = { ...DEFAULTS };
  save();
  emit();
}