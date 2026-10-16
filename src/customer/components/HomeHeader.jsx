import Logo from "./Logo";
import { useParams } from "react-router";

export default function HomeHeader({ tableNumber }) {
  const { table } = useParams();
  const displayTableNumber = table || tableNumber;
  return (
    <header className="flex items-center justify-between px-4 pt-4 md:px-6">
      <div className="flex items-center gap-2.5">
        <Logo />
        <h1 className="text-base font-extrabold text-[#3f2a16]">Kopi Panegar</h1>
      </div>
      <span className="rounded-full bg-[var(--brand-dark)] px-3.5 py-1.5 text-[11px] font-bold text-white">
        Meja {displayTableNumber}
      </span>
    </header>
  );
}