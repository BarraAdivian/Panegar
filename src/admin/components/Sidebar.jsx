import Logo from "./Logo";
import { ListIcon, UtensilsIcon, ChartIcon, UserIcon } from "./Icons";

const TABS = [
  { id: "pesanan", label: "Pesanan", icon: ListIcon },
  { id: "menu", label: "Menu", icon: UtensilsIcon },
  { id: "laporan", label: "Laporan", icon: ChartIcon },
  { id: "akun", label: "Akun", icon: UserIcon },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[#eadfcd] bg-white xl:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#f3ead9] px-5 py-5">
        <Logo />
        <div>
          <p className="text-base font-extrabold leading-tight text-[#3f2a16]">
            Kopi Panegar
          </p>
          <p className="text-[11px] text-[#a08a70]">Panel Admin • Dapur</p>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 space-y-1 p-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
              active === id
                ? "bg-[var(--brand)] text-white shadow-sm"
                : "text-[#6b5138] hover:bg-[var(--brand-soft)]"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>

      {/* Status dapur */}
      <div className="border-t border-[#f3ead9] p-4">
        <p className="text-[11px] font-bold text-[#3f2a16]">Status Dapur</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-[11px] text-[#6b5138]">Online • Menerima pesanan</span>
        </div>
      </div>
    </aside>
  );
}