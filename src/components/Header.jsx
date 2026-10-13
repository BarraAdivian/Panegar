import { BagIcon } from "./Icons";

export default function Header({ cartCount, cartTotal, onOpenCart }) {
  return (
    <header className="flex items-start justify-between bg-white px-4 pt-4">
      <div>
        <h1 className="text-lg font-extrabold leading-tight text-gray-900">Raja Maja</h1>
        <p className="text-sm font-medium text-gray-700">Menteng</p>
        <p className="text-xs text-gray-400">Jl. Sabang, Menteng</p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
          <button onClick={onOpenCart} className="flex items-center gap-2 rounded-2xl bg-red-900 py-2 pl-3 pr-4 text-white shadow-md active:scale-95">
          <span className="relative">
            <BagIcon className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-red-900">
                {cartCount}
              </span>
            )}
          </span>
          <span className="text-white/40">|</span>
          <span className="text-xs font-semibold">
            Rp {cartTotal.toLocaleString("id-ID")}
          </span>
        </button>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Buka
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Kasir Online
          </span>
        </div>
      </div>
    </header>
  );
}