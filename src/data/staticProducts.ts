import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.png";
import product6 from "@/assets/product-6.png";
import product7 from "@/assets/product-7.png";

export interface StaticProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  stock: number;
  is_new: boolean;
  sizes?: string[];
}

export const staticProducts: StaticProduct[] = [
  {
    id: "static-5",
    name: "Cropped Paula Tricot",
    description: "Cropped Paula Tricot elegante, veste G/GG. Peça versátil em tricot marrom, perfeita para compor looks sofisticados.",
    price: 50.00,
    original_price: null,
    image_url: product5,
    category: "Blusas",
    stock: 10,
    is_new: true,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "static-6",
    name: "Calça Jeans Mom Modeladora",
    description: "Calça jeans mom modeladora cintura alta na cor azul escuro. Conforto e estilo com efeito modelador.",
    price: 140.00,
    original_price: null,
    image_url: product6,
    category: "Calças",
    stock: 8,
    is_new: true,
    sizes: ["36", "38", "40", "42", "44"],
  },
  {
    id: "static-7",
    name: "Vestido Midi Gola Alta",
    description: "Vestido midi com gola alta e fenda lateral na cor verde. Elegância e sofisticação para ocasiões especiais.",
    price: 85.99,
    original_price: null,
    image_url: product7,
    category: "Vestidos",
    stock: 12,
    is_new: true,
    sizes: ["P", "M", "G"],
  },
  {
    id: "static-1",
    name: "Vestido Midi Elegance",
    description: "Vestido midi elegante, perfeito para ocasiões especiais. Tecido leve e confortável com acabamento premium.",
    price: 189.90,
    original_price: 249.90,
    image_url: product1,
    category: "Vestidos",
    stock: 15,
    is_new: true,
  },
  {
    id: "static-2",
    name: "Blusa Romantic",
    description: "Blusa romântica com detalhes delicados. Ideal para compor looks sofisticados e femininos.",
    price: 129.90,
    original_price: null,
    image_url: product2,
    category: "Blusas",
    stock: 20,
    is_new: true,
  },
  {
    id: "static-3",
    name: "Calça Jeans Modern",
    description: "Calça jeans moderna com corte perfeito. Conforto e estilo para o seu dia a dia.",
    price: 169.90,
    original_price: null,
    image_url: product3,
    category: "Calças",
    stock: 12,
    is_new: false,
  },
  {
    id: "static-4",
    name: "Bolsa Charm Rose",
    description: "Bolsa elegante em tom rose. Acessório perfeito para complementar qualquer look.",
    price: 219.90,
    original_price: 289.90,
    image_url: product4,
    category: "Acessórios",
    stock: 8,
    is_new: false,
  },
  {
    id: "static-8",
    name: "Saia Plissada Classic",
    description: "Saia plissada midi em tecido leve e fluido. Perfeita para looks elegantes e sofisticados.",
    price: 95.00,
    original_price: 120.00,
    image_url: product1, // Reutilizando imagens
    category: "Saias",
    stock: 15,
    is_new: true,
  },
];

export const getStaticProduct = (id: string): StaticProduct | undefined => {
  return staticProducts.find(product => product.id === id);
};

export const isStaticProductId = (id: string): boolean => {
  return id.startsWith("static-");
};
