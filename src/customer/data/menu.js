export const categories = ["Semua", "Makanan", "Minuman", "Camilan"];

const pedas = (harga = 2000) => ({
  id: "pedas",
  title: "Level pedas",
  options: [
    { id: "tidak", label: "Tidak pedas", note: "Ramah anak", priceDelta: 0 },
    { id: "sedang", label: "Sedang (Default)", tag: "Favorit", priceDelta: 0, default: true },
    { id: "ekstra", label: "Pedas", priceDelta: harga },
  ],
});

export const allMenus = [
  {
    id: 1,
    name: "Nasi Goreng Raja",
    description: "Nasi goreng rempah dengan sate ayam bumbu kacang, telur mata sapi, dan kerupuk.",
    price: 42000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 248,
    favorite: true,
    featured: true,
    badge: "Tersedia minggu ini",
    detail: {
      prepTime: "12 menit",
      portion: "1 porsi",
      allergens: "Telur, Kacang",
      optionGroups: [
        pedas(2000),
        {
          id: "telur",
          title: "Telur",
          options: [
            { id: "setengah", label: "Setengah matang", tag: "Rekomendasi", priceDelta: 0, default: true },
            { id: "matang", label: "Matang", note: "Matang sempurna", priceDelta: 0 },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: "Sate Madura",
    description: "Sate ayam dengan bumbu kacang khas Madura, dibakar di atas arang. Disajikan dengan nasi hangat.",
    price: 38000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 210,
    favorite: true,
    badge: "Best Seller",
    detail: {
      prepTime: "10 menit",
      portion: "10 tusuk",
      allergens: "Kacang, Kedelai",
      optionGroups: [
        pedas(2000),
        {
          id: "tambahan",
          title: "Tambahan",
          options: [
            { id: "tanpa", label: "Tanpa tambahan", priceDelta: 0, default: true },
            { id: "nasi", label: "Extra nasi putih", priceDelta: 5000 },
            { id: "lontong", label: "Extra lontong", priceDelta: 5000 },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: "Ayam Taliwang",
    description: "Ayam kampung marinasi rempah 12 jam, dibakar hingga harum. Disajikan dengan sambal terasi dan lalapan.",
    price: 45000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 185,
    favorite: true,
    badge: "Favorit",
    detail: {
      prepTime: "15 menit",
      portion: "1 porsi",
      allergens: "Kedelai, Terasi",
      optionGroups: [
        pedas(3000),
        {
          id: "nasi",
          title: "Pilihan nasi",
          options: [
            { id: "putih", label: "Nasi putih", priceDelta: 0, default: true },
            { id: "uduk", label: "Nasi uduk", priceDelta: 3000 },
            { id: "merah", label: "Nasi merah", priceDelta: 4000 },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: "Es Teh Pandan",
    description: "Teh hitam diseduh dengan daun pandan segar. Manisnya pas, cocok nemenin menu pedas.",
    price: 12000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 402,
    favorite: true,
    badge: "Paling segar",
    detail: {
      prepTime: "3 menit",
      portion: "1 gelas",
      allergens: "Pandan",
      optionGroups: [
        {
          id: "manis",
          title: "Tingkat kemanisan",
          options: [
            { id: "normal", label: "Manis (Default)", tag: "Favorit", priceDelta: 0, default: true },
            { id: "less", label: "Sedikit gula", priceDelta: 0 },
            { id: "tanpa", label: "Tanpa gula", priceDelta: 0 },
          ],
        },
        {
          id: "ukuran",
          title: "Ukuran",
          options: [
            { id: "regular", label: "Regular", priceDelta: 0, default: true },
            { id: "jumbo", label: "Jumbo", note: "Beser banget", priceDelta: 3000 },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    name: "Pisang Goreng Keju",
    description: "Pisang goreng crispy dengan lelehan keju mozzarella dan susu kental manis.",
    price: 22000,
    category: "Camilan",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 156,
    favorite: true,
    badge: "Camilan manis",
    detail: {
      prepTime: "8 menit",
      portion: "5 potong",
      allergens: "Gluten, Susu",
      optionGroups: [
        {
          id: "topping",
          title: "Topping",
          options: [
            { id: "keju", label: "Keju melimpah", tag: "Rekomendasi", priceDelta: 0, default: true },
            { id: "coklat", label: "Tambah coklat", priceDelta: 2000 },
            { id: "skm", label: "Tambah susu kental manis", priceDelta: 1500 },
          ],
        },
        {
          id: "saus",
          title: "Saus",
          options: [
            { id: "tanpa", label: "Tanpa saus", priceDelta: 0, default: true },
            { id: "mayo", label: "Saus mayonaise", priceDelta: 2500 },
            { id: "srikaya", label: "Saus srikaya", priceDelta: 3000 },
          ],
        },
      ],
    },
  },
  {
    id: 6,
    name: "Es Kopi Panegar",
    description: "Espresso robusta dengan susu segar dan gula aren asli. Creamy, nikmat, dan pas manisnya.",
    price: 18000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 512,
    favorite: true,
    badge: "Terlaris",
    detail: {
      prepTime: "5 menit",
      portion: "1 gelas",
      allergens: "Susu, Kafein",
      optionGroups: [
        {
          id: "gula",
          title: "Tingkat kemanisan",
          options: [
            { id: "normal", label: "Normal (Default)", tag: "Favorit", priceDelta: 0, default: true },
            { id: "less", label: "Less sugar", priceDelta: 0 },
            { id: "tanpa", label: "Tanpa gula", priceDelta: 0 },
          ],
        },
        {
          id: "suhu",
          title: "Suhu",
          options: [
            { id: "es", label: "Dingin (Es)", priceDelta: 0, default: true },
            { id: "panas", label: "Panas", priceDelta: 0 },
          ],
        },
      ],
    },
  },
  {
    id: 7,
    name: "Roti Bakar Coklat",
    description: "Roti bakar buttery dengan lelehan coklat melimpah. Camilan manis yang simpel tapi memuaskan.",
    price: 15000,
    category: "Camilan",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 98,
    favorite: false,
    badge: "Baru!",
    detail: {
      prepTime: "6 menit",
      portion: "2 potong",
      allergens: "Gluten, Susu",
      optionGroups: [
        {
          id: "topping",
          title: "Topping",
          options: [
            { id: "coklat", label: "Coklat melimpah", tag: "Rekomendasi", priceDelta: 0, default: true },
            { id: "keju", label: "Coklat + keju", priceDelta: 3000 },
            { id: "skm", label: "Tambah susu kental manis", priceDelta: 1500 },
          ],
        },
      ],
    },
  },
  {
    id: 8,
    name: "Mie Goreng Jawa",
    description: "Mie goreng manis-gurih khas Jawa dengan sayuran, ayam, dan telur. Dimasak dengan api besar.",
    price: 35000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 143,
    favorite: false,
    badge: "Kenyang maksimal",
    detail: {
      prepTime: "10 menit",
      portion: "1 porsi",
      allergens: "Telur, Gluten, Kedelai",
      optionGroups: [
        pedas(2000),
        {
          id: "tambahan",
          title: "Tambahan",
          options: [
            { id: "tanpa", label: "Tanpa tambahan", priceDelta: 0, default: true },
            { id: "telur", label: "Extra telur", priceDelta: 4000 },
            { id: "ayam", label: "Extra ayam", priceDelta: 6000 },
          ],
        },
      ],
    },
  },
];

export const featuredMenu = allMenus.find((m) => m.featured);
export const favoriteMenus = allMenus.filter((m) => m.favorite);

export function getDefaultChoices(menu) {
  const sel = {};
  menu.detail?.optionGroups?.forEach((g) => {
    sel[g.id] = (g.options.find((o) => o.default) || g.options[0]).id;
  });
  return sel;
}

export function getUnitPrice(menu, sel) {
  let p = menu.price;
  menu.detail?.optionGroups?.forEach((g) => {
    const o = g.options.find((x) => x.id === sel[g.id]);
    if (o) p += o.priceDelta || 0;
  });
  return p;
}

export function getOptionLabels(menu, sel) {
  const out = [];
  menu.detail?.optionGroups?.forEach((g) => {
    const o = g.options.find((x) => x.id === sel[g.id]);
    if (o) out.push(o.label);
  });
  return out;
}