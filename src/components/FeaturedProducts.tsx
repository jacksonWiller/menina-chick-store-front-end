import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { staticProducts } from "@/data/staticProducts";
import { APP_CONFIG } from "@/config/appConfig";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_new: boolean | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      // Se estiver usando dados mockados, usar apenas os produtos estáticos
      if (APP_CONFIG.USE_MOCK_DATA) {
        setProducts(staticProducts);
        setLoading(false);
        return;
      }

      // Caso contrário, buscar da API
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching products:", error);
        // Fallback para produtos estáticos em caso de erro
        setProducts(staticProducts);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Usar apenas produtos do estado (já inclui estáticos ou da API)
  const displayProducts = products.slice(0, 8);

  return (
    <section id="novidades" className="py-20 bg-pink-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-2 block">
            Destaques
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
            Novidades da Semana
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Peças cuidadosamente selecionadas para você arrasar em qualquer ocasião
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-xl mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price || undefined}
                image={product.image_url || "/placeholder.svg"}
                isNew={product.is_new ?? undefined}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/#novidades"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-pink-dark transition-colors group"
          >
            Ver todos os produtos
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
