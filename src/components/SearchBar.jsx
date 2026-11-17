
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (term.trim()) {
      onSearch(term.trim());
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl gap-3"
    >
      <input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Buscar fotografías..."
        aria-label="Buscar fotografías"
        className="min-w-0 flex-1 rounded-xl border
                   border-gray-200 bg-white px-5 py-3
                   text-gray-900 outline-none
                   focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-6 py-3
                   font-semibold text-white
                   hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
}