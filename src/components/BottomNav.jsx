import { UtensilsIcon, ReceiptIcon, HeadsetIcon } from "./Icons";

const TABS = [
  { id: "menu", label: "Menu", icon: UtensilsIcon },
  { id: "pesanan", label: "Pesanan", icon: ReceiptIcon },
  { id: "bantuan", label: "Bantuan", icon: HeadsetIcon },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#efe5d6] bg-white">
      <div className="mx-auto flex max-w-md items-stretch justify-around py-2 md:max-w-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 px-6 py-1 text-[11px] font-semibold transition ${
              active === id ? "text-[var(--brand)]" : "text-[#b3a18c]"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}