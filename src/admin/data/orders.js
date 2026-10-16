// Status: 0 = Baru masuk | 1 = Sedang dibuat | 2 = Siap diantar | 3 = Selesai
const mnt = (m) => new Date(Date.now() - m * 60000);

export const initialOrders = [
  {
    id: "PSN-1042",
    table: "04",
    status: 0,
    payment: "qris",
    createdAt: mnt(2),
    items: [
      { name: "Nasi Goreng Raja", note: "Pedas sedang, telur mata sapi", qty: 2, price: 42000 },
      { name: "Es Kopi Panegar", note: "Less sugar", qty: 1, price: 18000 },
      { name: "Pisang Goreng Keju", note: "Tanpa topping", qty: 1, price: 22000 },
    ],
  },
  {
    id: "PSN-1041",
    table: "07",
    status: 1,
    payment: "qris",
    createdAt: mnt(9),
    items: [
      { name: "Ayam Taliwang", note: "Level 3, nasi tambahan", qty: 1, price: 45000 },
      { name: "Es Teh Pandan", note: "Sedikit gula", qty: 2, price: 12000 },
    ],
  },
  {
    id: "PSN-1039",
    table: "02",
    status: 2,
    payment: "kasir",
    createdAt: mnt(14),
    items: [
      { name: "Sate Madura", note: "Bumbu kacang dipisah", qty: 1, price: 38000 },
    ],
  },
  {
    id: "PSN-1038",
    table: "09",
    status: 2,
    payment: "qris",
    createdAt: mnt(18),
    items: [
      { name: "Mie Goreng Jawa", note: "Extra telur", qty: 1, price: 35000 },
      { name: "Es Teh Pandan", note: "Manis", qty: 1, price: 12000 },
    ],
  },
  {
    id: "PSN-1035",
    table: "01",
    status: 3,
    payment: "kasir",
    createdAt: mnt(32),
    items: [
      { name: "Nasi Goreng Raja", note: "Pedas sedang", qty: 2, price: 42000 },
      { name: "Roti Bakar Coklat", note: "", qty: 1, price: 15000 },
    ],
  },
  {
    id: "PSN-1032",
    table: "05",
    status: 3,
    payment: "qris",
    createdAt: mnt(41),
    items: [
      { name: "Kopi Susu Gula Aren", note: "Less sugar", qty: 2, price: 18000 },
    ],
  },
];

export const orderTotal = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0);
export const orderCount = (o) => o.items.reduce((s, i) => s + i.qty, 0);

export const STATUS = {
  0: "Baru masuk",
  1: "Sedang dibuat",
  2: "Siap diantar",
  3: "Selesai",
};