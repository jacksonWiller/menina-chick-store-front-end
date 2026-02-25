import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config/appConfig";
import { staticProducts } from "@/data/staticProducts";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Funções helper para localStorage
const CART_STORAGE_KEY = 'mock-cart-items';

const getStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Modo mockado - carregar do localStorage
      await new Promise(resolve => setTimeout(resolve, 300)); // Simular latência
      const storedItems = getStoredCart();
      setItems(storedItems);
      setLoading(false);
      return;
    }

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const cartItems = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.product
      }));

      setItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Modo mockado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = staticProducts.find(p => p.id === productId);
      if (!product) {
        toast.error("Produto não encontrado");
        return;
      }

      const currentItems = getStoredCart();
      const existingItem = currentItems.find(item => item.product_id === productId);

      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = currentItems.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random()}`,
          product_id: productId,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
          }
        };
        updatedItems = [...currentItems, newItem];
      }

      setStoredCart(updatedItems);
      setItems(updatedItems);
      toast.success("Produto adicionado ao carrinho!");
      return;
    }

    if (!user) {
      toast.error("Faça login para adicionar ao carrinho");
      return;
    }

    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.product_id === productId);

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, product_id: productId, quantity });

        if (error) throw error;
      }

      await fetchCart();
      toast.success("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erro ao adicionar ao carrinho");
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const currentItems = getStoredCart();
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      setStoredCart(updatedItems);
      setItems(updatedItems);
      toast.success("Produto removido do carrinho");
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      await fetchCart();
      toast.success("Produto removido do carrinho");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Erro ao remover do carrinho");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    if (APP_CONFIG.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const currentItems = getStoredCart();
      const updatedItems = currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setStoredCart(updatedItems);
      setItems(updatedItems);
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Erro ao atualizar quantidade");
    }
  };

  const clearCart = async () => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      setStoredCart([]);
      setItems([]);
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
