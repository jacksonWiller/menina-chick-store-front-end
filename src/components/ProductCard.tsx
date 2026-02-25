import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, price, originalPrice, image, isNew }: ProductCardProps) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/produto/${id}`;
    const message = `Olá! Tenho interesse no produto:\n\n*${name}*\nPreço: ${formatPrice(price)}\n\nLink: ${productUrl}`;
    const whatsappUrl = `https://wa.me/553898707072?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <Link to={`/produto/${id}`} className="group hover-lift block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] mb-4 rounded-xl overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* New Badge */}
        {isNew && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
            Novo
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Heart size={18} />
          </button>
          <button 
            onClick={handleWhatsApp}
            className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-green-600 hover:text-white transition-colors"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-body text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-lg text-foreground">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
