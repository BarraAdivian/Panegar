import { useState } from "react";
import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import FeaturedCard from "../components/FeaturedCard";
import MenuGrid from "../components/MenuGrid";
import CartFloatingBar from "../components/CartFloatingBar";
import BottomNav from "../components/BottomNav";
import { featuredMenu, favoriteMenus } from "../data/menu";

export default function MenuPage({
  tableNumber, cart, addToCart, onOpenDetail,
  onOpenCart, onSeeAll, navActive, onNavChange,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const favs = favoriteMenus.filter((m) => {
    const okCat = category === "Semua" || m.category === category;
    const okSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return okCat && okSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto min-h-screen max-w-md pb-44">
        <HomeHeader tableNumber={tableNumber} />

        <section className="px-4 pt-5">
          <p className="text-[11px] font-medium text-[#8a7460]">
            Pesanan langsung dari meja, tanpa antre
          </p>
          <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-[#3f2a16]">
            Lagi pengen apa hari ini?
          </h2>
        </section>

        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs active={category} onChange={setCategory} />

        {category === "Semua" && (
          <FeaturedCard menu={featuredMenu} onOpen={onOpenDetail} onAdd={addToCart} />
        )}

        <section className="mt-6 flex items-center justify-between px-4">
          <h3 className="text-base font-extrabold text-[#3f2a16]">Menu favorit</h3>
          <button
            onClick={onSeeAll}
            className="text-xs font-bold text-[var(--brand)] active:opacity-60"
          >
            Lihat semua
          </button>
        </section>

        <div className="mt-3">
          <MenuGrid menus={favs} onAdd={addToCart} onOpen={onOpenDetail} />
        </div>
      </div>

      <CartFloatingBar count={cartCount} total={cartTotal} onClick={onOpenCart} />
      <BottomNav active={navActive} onChange={onNavChange} />
    </div>
  );
}