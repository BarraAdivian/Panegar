import { useEffect, useState } from "react";
import MenuPage from "./pages/MenuPage";
import AllMenuPage from "./pages/AllMenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import MenuDetailPage from "./pages/MenuDetailPage";
import HelpPage from "./pages/HelpPage";
import {
  allMenus, getDefaultChoices, getUnitPrice, getOptionLabels,
} from "./data/menu";

const TAX_RATE = 0.1;      // Pajak PB1 10%
const SERVICE_RATE = 0.05; // Biaya layanan 5%
const DISCOUNT = 0;        // Promo (0 = tidak ada)

export default function App() {
  // Nanti pas QR: ?meja=04
  const tableNumber = new URLSearchParams(window.location.search).get("meja") ?? "04";

  const [view, setView] = useState("menu"); // menu | allmenu | detail | cart | pesanan | bantuan
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [detailFrom, setDetailFrom] = useState("menu"); // asal buka detail (menu / allmenu)

  // State halaman Lihat Semua diangkat ke sini biar gak reset pas back dari detail
  const [allMenuSearch, setAllMenuSearch] = useState("");
  const [allMenuCategory, setAllMenuCategory] = useState("Semua");

  // Keranjang awal (contoh biar bar-nya kelihatan — hapus aja kalau mau mulai kosong)
  const [cart, setCart] = useState(() => {
    const sate = allMenus.find((m) => m.id === 2);
    const teh = allMenus.find((m) => m.id === 4);
    return [
      {
        key: "2|tidak-tanpa", id: 2, name: sate.name, image: sate.image,
        price: sate.price, qty: 1, note: "",
        options: ["Tidak Pedas", "Tanpa Tambahan"],
      },
      {
        key: "4|normal-regular", id: 4, name: teh.name, image: teh.image,
        price: teh.price, qty: 1, note: "",
        options: ["Manis (Default)", "Regular"],
      },
    ];
  });

  const [payment, setPayment] = useState("kasir");
  const [order, setOrder] = useState(null);

  // 📍 Scroll ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // 🛒 Masukkan item ke keranjang (dipakai quick-add & halaman detail)
  const pushItem = (menu, choices, qty, itemNote) => {
    const labels = getOptionLabels(menu, choices);
    const key = `${menu.id}|${Object.keys(choices).sort().map((k) => choices[k]).join("-")}`;
    const price = getUnitPrice(menu, choices);

    setCart((prev) => {
      const exists = prev.find((i) => i.key === key);
      if (exists) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { key, id: menu.id, name: menu.name, image: menu.image, price, qty, note: itemNote, options: labels }];
    });
  };

  const quickAdd = (menu) => pushItem(menu, getDefaultChoices(menu), 1, "");

  const addFromDetail = ({ menu, choices, qty, note }) => {
    pushItem(menu, choices, qty, note);
    setView(detailFrom); // balik ke asal (home atau lihat semua)
  };

  const openDetail = (menu) => {
    setDetailFrom(view); // catet: dibuka dari "menu" atau "allmenu"
    setSelectedMenu(menu);
    setView("detail");
  };

  const updateQty = (key, delta) =>
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );

  const removeItem = (key) => setCart((prev) => prev.filter((item) => item.key !== key));

  // 🧾 Buat order dari isi keranjang
  const createOrder = ({ items, note, payment }) => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const service = Math.round(subtotal * SERVICE_RATE);
    const total = Math.max(subtotal + tax + service - DISCOUNT, 0);

    // Perkiraan siap: sekarang + 15 s/d 20 menit
    const fmt = (d) =>
      `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
    const now = new Date();
    const est = `${fmt(new Date(now.getTime() + 15 * 60000))} – ${fmt(new Date(now.getTime() + 20 * 60000))}`;

    setOrder({
      code: `PN-${Math.floor(1000 + Math.random() * 9000)}`,
      time: fmt(now) + " WIB",
      est,
      items, note, payment, subtotal, tax, service, discount: DISCOUNT, total, status: 0,
    });
    setCart([]);
    setView("pesanan");
  };

  const advanceOrder = () =>
    setOrder((o) => (o ? { ...o, status: Math.min(o.status + 1, 3) } : o));

  // ===== Routing =====

  if (view === "detail" && selectedMenu) {
    return (
      <MenuDetailPage
        menu={selectedMenu}
        tableNumber={tableNumber}
        onBack={() => setView(detailFrom)}
        onAdd={addFromDetail}
      />
    );
  }

  if (view === "allmenu") {
    return (
      <AllMenuPage
        tableNumber={tableNumber}
        cart={cart}
        addToCart={quickAdd}
        onOpenDetail={openDetail}
        onOpenCart={() => setView("cart")}
        onBack={() => setView("menu")}
        navActive="menu"
        onNavChange={setView}
        search={allMenuSearch}
        setSearch={setAllMenuSearch}
        category={allMenuCategory}
        setCategory={setAllMenuCategory}
      />
    );
  }

  if (view === "cart") {
    return (
      <CartPage
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        payment={payment}
        setPayment={setPayment}
        tableNumber={tableNumber}
        onBack={() => setView("menu")}
        onAddMore={() => setView("allmenu")}
        onConfirm={createOrder}
      />
    );
  }

  if (view === "pesanan") {
    return (
      <OrderStatusPage
        order={order}
        tableNumber={tableNumber}
        onAdvance={advanceOrder}
        onAddMore={() => setView("menu")}
        onGoToMenu={() => setView("menu")}
        onNavChange={setView}
      />
    );
  }

  if (view === "bantuan") {
    return (
      <HelpPage
        tableNumber={tableNumber}
        navActive="bantuan"
        onNavChange={setView}
      />
    );
  }

  return (
    <MenuPage
      tableNumber={tableNumber}
      cart={cart}
      addToCart={quickAdd}
      onOpenDetail={openDetail}
      onOpenCart={() => setView("cart")}
      onSeeAll={() => setView("allmenu")}
      navActive="menu"
      onNavChange={setView}
    />
  );
}