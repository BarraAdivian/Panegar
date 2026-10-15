export default function Greeting({ tableNumber }) {
  return (
    <section className="px-4 pt-4">
      <h2 className="text-xl font-extrabold text-gray-900">
        Halo dari Meja #{tableNumber} 👋
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">
        Silakan pilih menu favorit Anda dan pesan sekali jalan, dan makan tanpa
        menunggu.
      </p>
      <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-700">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 text-[10px]">
          i
        </span>
        Cara memesan makanan di sini
      </button>
    </section>
  );
}