import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getStaticProduct, isStaticProductId } from "@/data/staticProducts";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category: string | null;
  stock: number | null;
  is_new: boolean | null;
  sizes?: string[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      // Check if it's a static product first
      if (isStaticProductId(id)) {
        const staticProduct = getStaticProduct(id);
        if (staticProduct) {
          setProduct(staticProduct);
          setLoading(false);
          return;
        }
      }

      // Fetch from database
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        toast.error("Produto não encontrado");
        navigate("/");
        return;
      }

      if (!data) {
        toast.error("Produto não encontrado");
        navigate("/");
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleWhatsApp = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Selecione um tamanho antes de continuar");
      return;
    }

    const productUrl = `${window.location.origin}/produto/${product.id}`;
    const sizePart = selectedSize ? `\nTamanho: ${selectedSize}` : "";
    const qtyPart = quantity > 1 ? `\nQuantidade: ${quantity}` : "";
    const message = `Olá! Tenho interesse no produto:\n\n*${product.name}*${sizePart}${qtyPart}\nPreço: ${formatPrice(product.price)}\n\nLink: ${productUrl}`;

    const whatsappUrl = `https://wa.me/553898707072?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      window.location.href = whatsappUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-display mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/")}>Voltar para a loja</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_new && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-body font-medium px-4 py-2 rounded-full">
                  Novo
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.category || "Produto"}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-body text-3xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="font-body text-xl text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <span className="text-sm font-medium block mb-3">Tamanho:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-12 px-4 border rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center border border-border rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors rounded-l-full"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors rounded-r-full"
                    disabled={(product.stock ?? 0) > 0 && quantity >= (product.stock ?? 0)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={handleWhatsApp}
                >
                  <ShoppingBag size={20} />
                  Comprar via WhatsApp
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Heart size={20} />
                  Favoritar
                </Button>
              </div>

              {/* Stock Info */}
              {product.stock && product.stock > 0 && product.stock < 10 && (
                <p className="text-sm text-amber-600 mt-4">
                  Apenas {product.stock} unidades em estoque!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
