import { useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { ArrowLeftIcon, BadgeCheckIcon } from "../components/Icons";

export default function OrderSuccessPage({
  tableNumber, onBack, onSeeStatus, onNavChange,
}) {
  // ⏱ Otomatis pindah ke halaman status setelah 3 detik
  // (kalau gak mau auto-pindah, hapus aja useEffect ini)
  useEffect(() => {
    const t = setTimeout(onSeeStatus, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col md:max-w-none">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 md:px-6">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfcd] bg-white text-[#3f2a16] transition active:scale-90"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#3f2a16]">Pesanan Terkirim</h1>
          <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
            Meja {tableNumber}
          </span>
        </header>

        {/* Konten tengah */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center">
          <BadgeCheckIcon className="h-32 w-32 text-[#3f2a16]" />
          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#3f2a16]">
            Pemesanan
            <br />
            Berhasil
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#8a7460]">
            Pesanan Anda sedang disiapkan, mohon ditunggu ya. Terima kasih!
          </p>
        </div>

        <BottomNav active="pesanan" onChange={onNavChange} />
      </div>
    </div>
  );
}