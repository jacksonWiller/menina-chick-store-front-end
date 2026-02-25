import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart, CartItem } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const { items, loading, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const [cep, setCep] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateShipping = async () => {
    if (cep.length !== 8) {
      toast.error(`CEP deve ter 8 dígitos (você digitou ${cep.length})`);
      return;
    }

    setCalculatingShipping(true);
    
    // Simulating Correios API call - in production, this would call an edge function
    // For now, we'll simulate based on CEP region
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cepNumber = parseInt(cep.replace("-", ""));
    let cost = 15.90; // Base cost
    
    // Simulate different regions
    if (cepNumber >= 10000000 && cepNumber <= 19999999) {
      cost = 12.90; // São Paulo
    } else if (cepNumber >= 20000000 && cepNumber <= 29999999) {
      cost = 15.90; // Rio de Janeiro, ES
    } else if (cepNumber >= 30000000 && cepNumber <= 39999999) {
      cost = 18.90; // Minas Gerais
    } else if (cepNumber >= 70000000 && cepNumber <= 79999999) {
      cost = 25.90; // Centro-Oeste
    } else {
      cost = 29.90; // Other regions
    }
    
    setShippingCost(cost);
    setCalculatingShipping(false);
    toast.success("Frete calculado com sucesso!");
  };

  const total = subtotal + (shippingCost || 0);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="font-display text-2xl">Faça login para ver seu carrinho</CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cadastro">Criar conta</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">Carregando carrinho...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="font-display text-2xl">Seu carrinho está vazio</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/">Continuar Comprando</Link>
              </Button>
            </CardFooter>
          </Card>
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
            Continuar comprando
          </button>

          <h1 className="font-display text-4xl mb-8">Meu Carrinho</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: CartItem) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-medium text-lg mb-1">{item.product.name}</h3>
                        <span className="text-primary font-semibold">
                          {formatPrice(item.product.price)}
                        </span>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors rounded-l-full"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted transition-colors rounded-r-full"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Calculator */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Calcular Frete</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite seu CEP"
                        value={cep}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        maxLength={8}
                      />
                      <Button
                        variant="outline"
                        onClick={calculateShipping}
                        disabled={calculatingShipping}
                      >
                        {calculatingShipping ? "..." : "Calcular"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>{shippingCost ? formatPrice(shippingCost) : "A calcular"}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      if (!shippingCost) {
                        toast.error("Calcule o frete antes de continuar");
                        return;
                      }
                      navigate("/checkout", { state: { cep, shippingCost } });
                    }}
                  >
                    Finalizar Compra
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
