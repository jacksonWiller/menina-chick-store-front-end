import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductById, ApiProduct } from "@/productApi";
import { APP_CONFIG } from "@/config/appConfig";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  category: string | null;
  stock: number | null;
  is_new: boolean | null;
  sizes?: string[];
}

// Função para converter ApiProduct para Product
const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const name = apiProduct.name.toLowerCase();
  let sizes: string[] | undefined = undefined;

  if (
    name.includes("blusa") ||
    name.includes("camisa") ||
    name.includes("top") ||
    name.includes("cropped") ||
    name.includes("t-shirt") ||
    name.includes("t shirt") ||
    name.includes("camiseta") ||
    name.includes("regata")
  ) {
    sizes = ["P", "M", "G", "GG"];
  } else if (name.includes("vestido")) {
    sizes = ["P", "M"];
  } else if (
    name.includes("short") ||
    name.includes("calça") ||
    name.includes("calca") ||
    name.includes("jeans") ||
    name.includes("legging")
  ) {
    sizes = ["36", "38", "40", "42", "44"];
  } else if (name.includes("saia")) {
    sizes = ["36", "38", "40", "42", "44"];
  }

  return {
    id: apiProduct.productId,
    name: apiProduct.name,
    description: apiProduct.description || apiProduct.title || null,
    price: apiProduct.price,
    original_price: apiProduct.compareAtPrice,
    image: apiProduct.image,
    category: apiProduct.brand,
    stock: apiProduct.stockQuantity,
    is_new: false,
    sizes,
  };
};

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

      try {
        const apiProduct = await getProductById(id);

        if (!apiProduct) {
          toast.error("Produto não encontrado");
          navigate("/");
          return;
        }

        const mappedProduct = mapApiProductToProduct(apiProduct);
        setProduct(mappedProduct);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        toast.error("Erro ao carregar o produto");
        navigate("/");
      }
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
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">
            Carregando...
          </div>
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
            <h1 className="text-2xl font-display mb-4">
              Produto não encontrado
            </h1>
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
                src={product.image || "/placeholder.svg"}
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
                {product.category && product.category !== "string"
                  ? product.category
                  : undefined}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-body text-3xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {typeof product.original_price === "number" &&
                  product.original_price > 0 && (
                    <span className="font-body text-xl text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
              </div>

              {product.description && product.description !== "string" && (
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <span className="text-sm font-medium block mb-3">
                    Tamanho:
                  </span>
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

              {/* Quantidade */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center border border-border rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity > 0 ? quantity : ""}
                  </span>
                  <button
                    onClick={() => {
                      if (quantity >= APP_CONFIG.MAX_ITEMS_PER_PRODUCT) {
                        toast.error(
                          `Você pode adicionar no máximo ${APP_CONFIG.MAX_ITEMS_PER_PRODUCT} unidades deste produto`,
                        );
                        return;
                      }
                      if (
                        (product.stock ?? 0) > 0 &&
                        quantity >= (product.stock ?? 0)
                      ) {
                        toast.error("Estoque insuficiente");
                        return;
                      }
                      setQuantity(quantity + 1);
                    }}
                    className={`p-3 transition-colors rounded-r-full ${
                      quantity >= APP_CONFIG.MAX_ITEMS_PER_PRODUCT ||
                      ((product.stock ?? 0) > 0 &&
                        quantity >= (product.stock ?? 0))
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted cursor-pointer"
                    }`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 gap-2 bg-pink-600 hover:bg-pink-700"
                  onClick={handleWhatsApp}
                >
                  <ShoppingBag size={20} />
                  Comprar via WhatsApp
                </Button>
              </div>

              {/* Stock Info */}
              {typeof product.stock === "number" &&
                product.stock > 0 &&
                product.stock < 10 && (
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
