import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts, ApiProduct, searchProducts } from "@/productApi";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

export type CategoryType =
  | "todos"
  | "novidades"
  | "vestidos"
  | "blusas"
  | "calças"
  | "shorts"
  | "saias"
  | "acessórios";

const Index = () => {
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("todos");
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        if (response.success && response.result.products) {
          const activeProducts = response.result.products.filter(
            (product) => !product.deleted,
          );
          setAllProducts(activeProducts);
          setFilteredProducts(activeProducts);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let results = searchProducts(allProducts, searchTerm);

    if (searchTerm && selectedCategory !== "novidades") {
      setFilteredProducts(results);
      return;
    }

    if (showOnlyNew || selectedCategory === "novidades") {
      results = results.filter((product) => isNewProduct(product.createdAt));
    }

    if (selectedCategory !== "todos" && selectedCategory !== "novidades") {
      results = results.filter((product) => {
        const category = categorizeProduct(product.name);
        return category === selectedCategory;
      });
    }

    setFilteredProducts(results);
  }, [searchTerm, allProducts, showOnlyNew, selectedCategory]);

  const isNewProduct = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays <= 15;
  };

  const categorizeProduct = (productName: string): CategoryType => {
    const name = productName.toLowerCase();

    if (name.includes("vestido")) return "vestidos";
    if (
      name.includes("blusa") ||
      name.includes("camisa") ||
      name.includes("top") ||
      name.includes("cropped") ||
      name.includes("t-shirt") ||
      name.includes("t shirt") ||
      name.includes("camiseta") ||
      name.includes("regata")
    )
      return "blusas";
    if (
      name.includes("calça") ||
      name.includes("jeans") ||
      name.includes("legging")
    )
      return "calças";
    if (name.includes("short")) return "shorts";
    if (name.includes("saia")) return "saias";

    return "acessórios";
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const scrollToProducts = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowNewProducts = () => {
    setShowOnlyNew(true);
    setSelectedCategory("novidades");
    setSearchTerm("");
    setTimeout(() => {
      scrollToProducts();
    }, 100);
  };

  const handleShowAllProducts = () => {
    setShowOnlyNew(false);
    setSelectedCategory("todos");
    scrollToProducts();
  };

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
    setShowOnlyNew(category === "novidades");
    setSearchTerm("");

    if (category === "todos") {
      scrollToTop();
    } else {
      setTimeout(() => {
        scrollToProducts();
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">
            Carregando produtos...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <main className="flex-1">
        <Hero
          onShowCollection={handleShowAllProducts}
          onShowNewProducts={handleShowNewProducts}
        />

        <section id="produtos" className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-light mb-4">
              {searchTerm && `Resultados para "${searchTerm}"`}
              {!searchTerm && selectedCategory === "todos" && "Nossa Coleção"}
              {!searchTerm && selectedCategory === "novidades" && "Novidades"}
              {!searchTerm && selectedCategory === "vestidos" && "Vestidos"}
              {!searchTerm && selectedCategory === "blusas" && "Blusas & Tops"}
              {!searchTerm && selectedCategory === "calças" && "Calças"}
              {!searchTerm && selectedCategory === "shorts" && "Shorts"}
              {!searchTerm && selectedCategory === "saias" && "Saias"}
              {!searchTerm && selectedCategory === "acessórios" && "Acessórios"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "produto disponível"
                : "produtos disponíveis"}
            </p>
            {selectedCategory !== "todos" && (
              <Button
                variant="outline"
                onClick={() => handleCategoryChange("todos")}
                className="mb-4"
              >
                Ver toda coleção
              </Button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm
                  ? "Nenhum produto encontrado. Tente outra busca."
                  : "Nenhum produto disponível no momento."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Limpar busca
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.compareAtPrice || undefined}
                  image={product.image || "/placeholder.svg"}
                  isNew={isNewProduct(product.createdAt)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer onShowNewProducts={handleShowNewProducts} />
    </div>
  );
};

export default Index;
