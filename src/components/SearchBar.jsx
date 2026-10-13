import { SearchIcon } from "./Icons";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mt-4 px-4">
      <div className="flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-4 py-3">
        <SearchIcon className="h-4 w-4 text-[#a08a70]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari kopi, makanan, camilan"
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#a08a70]"
        />
      </div>
    </div>
  );
}