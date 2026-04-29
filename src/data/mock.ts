import productTomato from "@/assets/product-tomato.jpg";
import productLettuce from "@/assets/product-lettuce.jpg";
import productCarrot from "@/assets/product-carrot.jpg";
import productStrawberry from "@/assets/product-strawberry.jpg";
import productEggs from "@/assets/product-eggs.jpg";
import productHoney from "@/assets/product-honey.jpg";
import productEggplant from "@/assets/product-eggplant.jpg";
import productOrange from "@/assets/product-orange.jpg";
import farmer1 from "@/assets/farmer-1.jpg";
import farmer2 from "@/assets/farmer-2.jpg";
import farmer3 from "@/assets/farmer-3.jpg";

export type Category = "Frutas" | "Verduras" | "Legumes" | "Outros";

export interface Producer {
  id: string;
  name: string;
  farm: string;
  city: string;
  region: string;
  image: string;
  rating: number;
  reviews: number;
  bio: string;
  distanceKm: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: Category;
  producerId: string;
  organic: boolean;
  description: string;
}

export const producers: Producer[] = [
  {
    id: "p1",
    name: "Seu João",
    farm: "Sítio Boa Esperança",
    city: "Atibaia",
    region: "SP",
    image: farmer1,
    rating: 4.9,
    reviews: 128,
    bio: "Cultivo orgânico há mais de 30 anos, com técnicas tradicionais e respeito à terra.",
    distanceKm: 18,
  },
  {
    id: "p2",
    name: "Marina Souza",
    farm: "Roça da Marina",
    city: "Vinhedo",
    region: "SP",
    image: farmer2,
    rating: 4.8,
    reviews: 94,
    bio: "Hortaliças hidropônicas e PANCs colhidas no mesmo dia da entrega.",
    distanceKm: 24,
  },
  {
    id: "p3",
    name: "Família Bertolli",
    farm: "Fazenda Três Irmãos",
    city: "Holambra",
    region: "SP",
    image: farmer3,
    rating: 5.0,
    reviews: 211,
    bio: "Tradição italiana em frutas cítricas, ovos caipiras e mel silvestre.",
    distanceKm: 42,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Tomate Italiano",
    price: 12.9,
    unit: "kg",
    image: productTomato,
    category: "Legumes",
    producerId: "p1",
    organic: true,
    description: "Colhido no ponto, doce e suculento. Ideal para molhos e saladas.",
  },
  {
    id: "2",
    name: "Alface Crespa",
    price: 5.5,
    unit: "unidade",
    image: productLettuce,
    category: "Verduras",
    producerId: "p2",
    organic: true,
    description: "Pé inteiro, crocante e fresco — colhido no mesmo dia.",
  },
  {
    id: "3",
    name: "Cenoura Orgânica",
    price: 8.9,
    unit: "kg",
    image: productCarrot,
    category: "Legumes",
    producerId: "p1",
    organic: true,
    description: "Da terra para sua casa, com leve gosto adocicado.",
  },
  {
    id: "4",
    name: "Morango Vermelho",
    price: 18.0,
    unit: "bandeja 500g",
    image: productStrawberry,
    category: "Frutas",
    producerId: "p3",
    organic: false,
    description: "Selecionados a dedo, perfumados e doces.",
  },
  {
    id: "5",
    name: "Ovos Caipiras",
    price: 22.0,
    unit: "dúzia",
    image: productEggs,
    category: "Outros",
    producerId: "p3",
    organic: true,
    description: "De galinhas livres, gema alaranjada e sabor incomparável.",
  },
  {
    id: "6",
    name: "Mel Silvestre",
    price: 35.0,
    unit: "pote 350g",
    image: productHoney,
    category: "Outros",
    producerId: "p3",
    organic: true,
    description: "Mel puro, extraído sem aquecimento, direto da colmeia.",
  },
  {
    id: "7",
    name: "Berinjela",
    price: 7.5,
    unit: "kg",
    image: productEggplant,
    category: "Legumes",
    producerId: "p2",
    organic: true,
    description: "Brilhante e firme, perfeita para receitas mediterrâneas.",
  },
  {
    id: "8",
    name: "Laranja Pera",
    price: 6.9,
    unit: "kg",
    image: productOrange,
    category: "Frutas",
    producerId: "p3",
    organic: false,
    description: "Suco abundante, doçura equilibrada. Direto do pomar.",
  },
];

export const categories: Category[] = ["Frutas", "Verduras", "Legumes", "Outros"];

export const getProducer = (id: string) => producers.find((p) => p.id === id);
export const getProduct = (id: string) => products.find((p) => p.id === id);
