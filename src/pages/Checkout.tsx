import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useCart, CartItem } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { QrCode, Copy, Check, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const shippingCost = (location.state as any)?.shippingCost || 0;
  const cep = (location.state as any)?.cep || "";

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: cep,
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0 && !orderComplete) {
      navigate("/carrinho");
      return;
    }

    fetchProfile();
  }, [user, items, navigate, orderComplete]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zip_code: cep || data.zip_code || "",
      });
    } else {
      setProfile(prev => ({
        ...prev,
        email: user.email || "",
      }));
    }
    setLoading(false);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const total = subtotal + shippingCost;

  const generatePixCode = () => {
    // Generate PIX EMV code for phone key (38)998707072
    const pixKey = "38998707072";
    const merchantName = "MENINA CHICK";
    const merchantCity = "SAO PAULO";
    const amount = total.toFixed(2);
    
    // Build PIX payload following EMV specification
    const formatField = (id: string, value: string) => {
      const length = value.length.toString().padStart(2, '0');
      return `${id}${length}${value}`;
    };
    
    // Merchant Account Information (ID 26)
    const gui = formatField("00", "BR.GOV.BCB.PIX");
    const key = formatField("01", pixKey);
    const merchantAccountInfo = formatField("26", gui + key);
    
    // Build payload
    let payload = "";
    payload += formatField("00", "01"); // Payload Format Indicator
    payload += merchantAccountInfo; // Merchant Account Information
    payload += formatField("52", "0000"); // Merchant Category Code
    payload += formatField("53", "986"); // Transaction Currency (BRL)
    payload += formatField("54", amount); // Transaction Amount
    payload += formatField("58", "BR"); // Country Code
    payload += formatField("59", merchantName.toUpperCase().substring(0, 25)); // Merchant Name
    payload += formatField("60", merchantCity.toUpperCase().substring(0, 15)); // Merchant City
    payload += formatField("62", formatField("05", "***")); // Additional Data Field
    
    // Calculate CRC16
    payload += "6304";
    const crc = calculateCRC16(payload);
    payload += crc;
    
    return payload;
  };

  const calculateCRC16 = (str: string) => {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
      }
    }
    
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.full_name || !profile.address || !profile.city || !profile.state) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setProcessing(true);

    try {
      // Update profile
      await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          zip_code: profile.zip_code,
        })
        .eq("user_id", user!.id);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          subtotal,
          shipping_cost: shippingCost,
          total,
          payment_method: "pix",
          pix_code: generatePixCode(),
          shipping_address: profile.address,
          shipping_city: profile.city,
          shipping_state: profile.state,
          shipping_zip: profile.zip_code,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item: CartItem) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Set PIX code and show confirmation
      setPixCode(order.pix_code || generatePixCode());
      setOrderComplete(true);
      
      toast.success("Pedido realizado com sucesso!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
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

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="font-display text-3xl text-green-600">
                  Pedido Realizado!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Seu pedido foi recebido com sucesso. Efetue o pagamento via PIX para confirmar.
                </p>

                <div className="bg-muted p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <QrCode className="w-8 h-8 text-primary" />
                    <span className="text-lg font-semibold">Pagamento via PIX</span>
                  </div>

                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(total)}
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg">
                      <QRCodeSVG 
                        value={pixCode} 
                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-center text-muted-foreground">
                    Escaneie o QR Code acima ou copie o código abaixo
                  </p>

                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">PIX Copia e Cola:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all max-h-20 overflow-y-auto">
                        {pixCode}
                      </code>
                      <Button size="sm" variant="outline" onClick={copyPixCode}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Após o pagamento, você receberá um email de confirmação em {profile.email}
                  </p>
                </div>

                <Button onClick={() => navigate("/")} className="mt-6">
                  Voltar para a Loja
                </Button>
              </CardContent>
            </Card>
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
            onClick={() => navigate("/carrinho")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Voltar ao carrinho
          </button>

          <h1 className="font-display text-4xl mb-8">Finalizar Compra</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Dados Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo *</Label>
                        <Input
                          id="fullName"
                          value={profile.full_name || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, full_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço Completo *</Label>
                      <Input
                        id="address"
                        value={profile.address || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="Rua, número, complemento"
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          value={profile.city || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          value={profile.state || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, state: e.target.value })}
                          placeholder="SP"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          value={profile.zip_code || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, zip_code: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <QrCode className="w-6 h-6" />
                      Pagamento via PIX
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Após confirmar o pedido, você receberá um código PIX para efetuar o pagamento.
                      O pagamento é processado instantaneamente.
                    </p>
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={processing}>
                  {processing ? "Processando..." : "Confirmar Pedido"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
