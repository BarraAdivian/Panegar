import { rupiah, timeAgo } from "../utils/format";
import { orderTotal, orderCount, STATUS } from "../data/orders";

const ACTIONS = { 0: "Terima", 1: "Tandai siap", 2: "Selesai" };

export default function OrderCard({ order, onAdvance, onDetail }) {
  const action = ACTIONS[order.status];

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-4 shadow-sm">
      {/* Header: meja + no + badge status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--brand-dark)] px-3 py-1 text-[11px] font-bold text-white">
            Meja {order.table}
          </span>
          <span className="text-xs font-bold text-[#8a7460]">#{order.id}</span>
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold text-[#8a6a3f]">
            {STATUS[order.status]}
          </span>
          <p className="mt-0.5 text-[10px] text-[#b3a18c]">{timeAgo(order.createdAt)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-3 flex-1 space-y-2.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#3f2a16]">{item.name}</p>
              {item.note && (
                <p className="mt-0.5 text-[11px] leading-snug text-[#a08a70]">{item.note}</p>
              )}
            </div>
            <span className="shrink-0 pt-0.5 text-xs font-bold text-[#a08a70]">
              ×{item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: total + aksi */}
      <div className="mt-3 flex items-end justify-between border-t border-[#f3ead9] pt-3">
        <div>
          <p className="text-[10px] font-medium text-[#b3a18c]">
            Total • {orderCount(order)} item
          </p>
          <p className="text-base font-extrabold text-[#3f2a16]">
            {rupiah(orderTotal(order))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDetail(order)}
            className="rounded-full border border-[#e0d0b8] bg-white px-4 py-2 text-xs font-bold text-[#6b5138] transition active:scale-95"
          >
            Detail
          </button>
          {action && (
            <button
              onClick={() => onAdvance(order.id)}
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95"
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}