import { rupiah } from "../utils/format";

export default function FeaturedCard({ menu, onOpen, onAdd }) {
  return (
    <section className="mt-4 px-4">
      <div
        onClick={() => onOpen(menu)}
        className="relative cursor-pointer overflow-hidden rounded-3xl shadow-md transition active:scale-[0.99]"
      >
        <img src={menu.image} alt={menu.name} className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e0]/95 px-2.5 py-1 text-[10px] font-bold text-[#7a4e28]">
            ✨ {menu.badge}
          </span>
          <h3 className="mt-1.5 text-lg font-extrabold text-white">{menu.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/80">{menu.description}</p>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-base font-extrabold text-white">{rupiah(menu.price)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(menu);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl leading-none font-bold text-[var(--brand)] shadow-md transition active:scale-90"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}