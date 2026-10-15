import { categories } from "../data/menu";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4 md:px-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            active === cat
              ? "bg-[var(--brand)] text-white shadow"
              : "border border-[#eadfcd] bg-white text-[#6b5138]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}