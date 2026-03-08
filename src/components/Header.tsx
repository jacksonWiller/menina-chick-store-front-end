import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import logo from "@/assets/logorosa.svg";
import { Input } from "./ui/input";

export type CategoryType =
  | "todos"
  | "novidades"
  | "vestidos"
  | "blusas"
  | "calças"
  | "shorts"
  | "saias"
  | "acessórios";

interface HeaderProps {
  onCategoryChange?: (category: CategoryType) => void;
  selectedCategory?: CategoryType;
}

const Header = ({
  onCategoryChange,
  selectedCategory = "todos",
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsSearchOpen } = useSearch();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks: { name: string; category: CategoryType }[] = [
    { name: "Início", category: "todos" },
    { name: "Novidades", category: "novidades" },
    { name: "Vestidos", category: "vestidos" },
    { name: "Blusas", category: "blusas" },
    { name: "Calças", category: "calças" },
    { name: "Shorts", category: "shorts" },
    { name: "Saias", category: "saias" },
    { name: "Acessórios", category: "acessórios" },
  ];

  const { searchTerm, setSearchTerm } = useSearch();
  const handleClearSearch = () => setSearchTerm("");

  const handleSearchClick = () => {
    setShowMobileSearch(true);
    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    if (!showMobileSearch) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileInputRef.current &&
        !mobileInputRef.current.contains(e.target as Node)
      ) {
        setShowMobileSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSearch]);

  const handleNavClick = (category: CategoryType) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        onCategoryChange?.(category);
      }, 100);
    } else {
      onCategoryChange?.(category);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={logo} alt="Menina Chick Store" className="h-14 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.category)}
                className={`font-body text-sm font-medium tracking-wide transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all ${
                  selectedCategory === link.category
                    ? "text-primary after:w-full"
                    : "text-foreground hover:text-primary after:w-0 hover:after:w-full"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-full sm:w-auto sm:max-w-[300px]">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (location.pathname !== "/") {
                      navigate("/", { replace: true });
                      setTimeout(() => {
                        document.getElementById("produtos")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }, 200);
                    } else {
                      document.getElementById("produtos")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }
                }}
                className="pl-12 pr-12 h-10 rounded-full border focus-visible:ring-primary w-full"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="sm:hidden flex items-center relative">
              {!showMobileSearch && (
                <button
                  onClick={handleSearchClick}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Buscar"
                >
                  <Search size={22} />
                </button>
              )}
              {showMobileSearch && (
                <div className="absolute right-0 top-0 w-[280px] max-w-[calc(100vw-80px)] z-50 bg-background rounded-full shadow-lg flex items-center px-2 py-1 border border-border">
                  <Search
                    className="ml-2 text-muted-foreground flex-shrink-0"
                    size={20}
                  />
                  <input
                    ref={mobileInputRef}
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setShowMobileSearch(false);
                        if (location.pathname !== "/") {
                          navigate("/", { replace: true });
                          setTimeout(() => {
                            document
                              .getElementById("produtos")
                              ?.scrollIntoView({
                                behavior: "smooth",
                              });
                          }, 200);
                        } else {
                          document.getElementById("produtos")?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }
                    }}
                    className="flex-1 bg-transparent outline-none px-2 py-2 text-base min-w-0"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileSearch(false)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
            <a
              href="https://wa.me/553898707072"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground hover:text-green-600 transition-colors"
              aria-label="WhatsApp"
            >
              <ShoppingBag size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleNavClick(link.category);
                    setIsMenuOpen(false);
                  }}
                  className={`font-body text-base font-medium transition-colors py-2 text-left ${
                    selectedCategory === link.category
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => {
                  handleSearchClick();
                  setIsMenuOpen(false);
                }}
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors py-2 text-left flex items-center gap-2"
              >
                <Search size={18} />
                Pesquisar
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
