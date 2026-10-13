import { useState } from "react";
import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import MenuGrid from "../components/MenuGrid";
import CartFloatingBar from "../components/CartFloatingBar";
import BottomNav from "../components/BottomNav";
import { ArrowLeftIcon } from "../components/Icons";
import { allMenus } from "../data/menu";

export default function AllMenuPage({
  tableNumber, cart, addToCart, onOpenDetail,
  onBack, onOpenCart, navActive, onNavChange,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const filtered = allMenus.filter((m) => {
    const okCat = category === "Semua" || m.category === category;
    const okSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return okCat && okSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto min-h-screen max-w-md pb-44">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-[20px] font-bold text-[#3f2a16]">Kembali</span>
          </div>

          <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
            Meja {tableNumber}
          </span>
        </div>

        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs active={category} onChange={setCategory} />

        <div className="mt-5">
          <MenuGrid menus={filtered} onAdd={addToCart} onOpen={onOpenDetail} />
          {filtered.length === 0 && (
            <p className="mt-10 text-center text-sm text-[#a08a70]">
              Menu tidak ditemukan 😢
            </p>
          )}
        </div>
      </div>

      <CartFloatingBar count={cartCount} total={cartTotal} onClick={onOpenCart} />
      <BottomNav active={navActive} onChange={onNavChange} />
    </div>
  );
}