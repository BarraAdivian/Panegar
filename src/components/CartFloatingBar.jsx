import { BagIcon } from "./Icons";
import { rupiah } from "../utils/format";

export default function CartFloatingBar({ count, total, onClick }) {
  if (count === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-[68px] z-40 px-4">
      <div className="mx-auto max-w-md">
        <button
          onClick={onClick}
          className="flex w-full items-center gap-3 rounded-full bg-[var(--brand-dark)] py-3.5 pr-6 pl-5 text-white shadow-xl transition active:scale-[0.98]"
        >
          <BagIcon className="h-5 w-5" />
          <span className="text-sm font-bold">
            {count} Item • {rupiah(total)}
          </span>
          <span className="ml-auto text-sm font-semibold text-white/90">
            Lihat pesanan
          </span>
        </button>
      </div>
    </div>
  );
}