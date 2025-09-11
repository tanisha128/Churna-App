import React, { createContext, useContext, useState } from "react";

// 1. Create Context
const SearchContext = createContext();

// 2. Provider Component
export function SearchProvider({ children }) {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

// 3. Custom Hook
export function useSearch() {
  return useContext(SearchContext);
}


