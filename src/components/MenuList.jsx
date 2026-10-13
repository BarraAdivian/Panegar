function MenuCard({ menu, onAdd, onOpen }) {
  return (
    <div
      onClick={() => onOpen(menu)}
      className="flex cursor-pointer gap-3 py-4 transition active:opacity-70"
    >
      <img src={menu.image} alt={menu.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
      <div className="flex flex-1 flex-col">
        <h4 className="text-sm font-bold text-gray-900">{menu.name}</h4>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{menu.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-extrabold text-red-900">
            Rp {menu.price.toLocaleString("id-ID")}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(menu); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-900 text-lg leading-none text-red-900 transition active:scale-90"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuList({ menus, onAdd, onOpen }) {
  return (
    <section className="mt-6 px-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Pilih Menu Favorit</h3>
        <span className="text-[10px] font-bold tracking-wide text-gray-400">
          {menus.length} MENU REKOMENDASI
        </span>
      </div>
      <div className="mt-2 divide-y divide-gray-100">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAdd={onAdd} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}