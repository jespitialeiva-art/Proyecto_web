
const categories = [
  { label: "Naturaleza", query: "nature" },
  { label: "Ciudades", query: "city" },
  { label: "Tecnología", query: "technology" },
  { label: "Animales", query: "animals" },
  { label: "Arquitectura", query: "architecture" },
];

export default function CategoryFilters({
  onSelect,
  activeCategory,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category.query}
          type="button"
          onClick={() => onSelect(category.query)}
          className={`rounded-full border px-5 py-2
            text-sm font-medium transition ${
              activeCategory === category.query
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}