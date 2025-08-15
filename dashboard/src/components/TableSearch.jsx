
import { useState } from "react";

const TableSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full md:w-68 flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search sellers..."
        value={query}
        onChange={handleChange}
        className="w-full py-[10px] bg-transparent outline-none"
        aria-label="Search sellers"
      />
    </div>
  );
};

export default TableSearch;
