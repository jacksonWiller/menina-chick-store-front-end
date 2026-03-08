import { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  searchTerm: "",
  setSearchTerm: (term: string) => {},
  isSearchOpen: false,
  setIsSearchOpen: (open: boolean) => {},
});

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, isSearchOpen, setIsSearchOpen }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
