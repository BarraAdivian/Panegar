import { rupiah } from "../utils/format";

export default function MenuGrid({ menus, onAdd, onOpen }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {menus.map((menu) => (
        <div
          key={menu.id}
          onClick={() => onOpen(menu)}
          className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition active:scale-[0.98]"
        >
          <img src={menu.image} alt={menu.name} className="h-28 w-full object-cover" />
          <div className="p-2.5">
            <h4 className="truncate text-sm font-bold text-[#3f2a16]">{menu.name}</h4>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#3f2a16]">{rupiah(menu.price)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(menu);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)] text-lg leading-none text-white shadow transition active:scale-90"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}