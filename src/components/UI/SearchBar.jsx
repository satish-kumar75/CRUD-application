import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Search } from "lucide-react";

const SearchBar = ({ globalFilter, setGlobalFilter }) => {
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setGlobalFilter(value);
    }, 1000),
    []
  );

  return (
    <div className="relative w-full md:w-64">
      <input
        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-800/50 border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-500 transition-colors"
        type="text"
        placeholder="Search applications..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={globalFilter}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
    </div>
  );
};

SearchBar.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

export default SearchBar;
