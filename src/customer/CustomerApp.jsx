import { useEffect, useState } from "react";
import MenuPage from "./pages/MenuPage";
import AllMenuPage from "./pages/AllMenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MenuDetailPage from "./pages/MenuDetailPage";
import HelpPage from "./pages/HelpPage";
import { tableTokens } from "./data/token";
import {
  allMenus,
  getDefaultChoices,
  getUnitPrice,
  getOptionLabels,
} from "./data/menu";

const TAX_RATE = 0.1; // Pajak PB1 10%
const SERVICE_RATE = 0.05; // Biaya layanan 5%

export default function CustomerApp() {
  const params = new URLSearchParams(window.location.search);

  const tableNumber = params.get("meja");
  const tableToken = params.get("token");

  const isValidTable =
    tableNumber !== null && tableTokens[tableNumber] === tableToken;

  const [view, setView] = useState("menu"); // menu | allmenu | detail | cart | sukses | pesanan | bantuan
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [detailFrom, setDetailFrom] = useState("menu");

  const [allMenuSearch, setAllMenuSearch] = useState("");
  const [allMenuCategory, setAllMenuCategory] = useState("Semua");

  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState("kasir");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const pushItem = (menu, choices, qty, itemNote) => {
    const labels = getOptionLabels(menu, choices);
    const key = `${menu.id}|${Object.keys(choices)
      .sort()
      .map((k) => choices[k])
      .join("-")}`;
    const price = getUnitPrice(menu, choices);

    setCart((prev) => {
      const exists = prev.find((i) => i.key === key);
      if (exists) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [
        ...prev,
        {
          key,
          id: menu.id,
          name: menu.name,
          image: menu.image,
          price,
          qty,
          note: itemNote,
          options: labels,
        },
      ];
    });
  };

  const quickAdd = (menu) => pushItem(menu, getDefaultChoices(menu), 1, "");

  const addFromDetail = ({ menu, choices, qty, note }) => {
    pushItem(menu, choices, qty, note);
    setView(detailFrom);
  };

  const openDetail = (menu) => {
    setDetailFrom(view);
    setSelectedMenu(menu);
    setView("detail");
  };

  const updateQty = (key, delta) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, qty: item.qty + delta } : item,
        )
        .filter((item) => item.qty > 0),
    );

  const removeItem = (key) =>
    setCart((prev) => prev.filter((item) => item.key !== key));

  // 🧾 Buat order dari isi keranjang (simulasi lokal, tanpa database)
  const createOrder = ({ items, note, payment }) => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const service = Math.round(subtotal * SERVICE_RATE);
    const total = Math.max(subtotal + tax + service, 0);

    // Perkiraan siap: sekarang + 15 s/d 20 menit
    const fmt = (d) =>
      `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
    const now = new Date();
    const est = `${fmt(new Date(now.getTime() + 15 * 60000))} – ${fmt(new Date(now.getTime() + 20 * 60000))}`;

    setOrder({
      code: `PN-${Math.floor(1000 + Math.random() * 9000)}`,
      time: fmt(now) + " WIB",
      est,
      items,
      note,
      payment,
      subtotal,
      tax,
      service,
      total,
      status: 0,
    });
    setCart([]);
    setView("sukses"); // ← lewat halaman sukses dulu
  };

  if (!isValidTable) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-bold">Link meja tidak valid</h1>

          <p className="mt-2 text-sm text-gray-500">
            Silakan scan QR Code yang tersedia di meja untuk membuka menu
            restoran.
          </p>
        </div>
      </main>
    );
  }

  // ===== Routing =====

  if (view === "sukses" && order) {
    return (
      <OrderSuccessPage
        tableNumber={tableNumber}
        onBack={() => setView("menu")}
        onSeeStatus={() => setView("pesanan")}
        onNavChange={setView}
      />
    );
  }

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
