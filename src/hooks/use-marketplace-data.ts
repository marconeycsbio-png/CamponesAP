import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  producers as mockProducers,
  products as mockProducts,
  type Producer,
  type Product,
  type Category,
} from "@/data/mock";

const CATEGORY_MAP: Record<string, Category> = {
  frutas: "Frutas",
  verduras: "Verduras",
  legumes: "Legumes",
  outros: "Outros",
};

interface MarketplaceData {
  producers: Producer[];
  products: Product[];
  loading: boolean;
  fromDatabase: boolean;
}

export function useMarketplaceData(): MarketplaceData {
  const [data, setData] = useState<MarketplaceData>({
    producers: mockProducers,
    products: mockProducts,
    loading: true,
    fromDatabase: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [{ data: prods }, { data: prodItems }, { data: cats }] = await Promise.all([
        supabase.from("producers").select("*").eq("status", "ativo"),
        supabase.from("products").select("*").eq("is_active", true),
        supabase.from("categories").select("*"),
      ]);

      if (cancelled) return;

      // se banco vazio, mantém mocks
      if (!prods || prods.length === 0 || !prodItems || prodItems.length === 0) {
        setData({
          producers: mockProducers,
          products: mockProducts,
          loading: false,
          fromDatabase: false,
        });
        return;
      }

      const catById = new Map((cats ?? []).map((c) => [c.id, c.slug]));

      const dbProducers: Producer[] = prods.map((p) => ({
        id: p.id,
        name: p.farm_name,
        farm: p.farm_name,
        city: p.city ?? "",
        region: p.state ?? "",
        image: p.image_url || mockProducers[0].image,
        rating: Number(p.rating ?? 5),
        reviews: 0,
        bio: p.description ?? "",
        distanceKm: 0,
      }));

      const dbProducts: Product[] = prodItems.map((p) => {
        const slug = p.category_id ? catById.get(p.category_id) : undefined;
        const category = (slug && CATEGORY_MAP[slug]) || "Outros";
        return {
          id: p.id,
          name: p.name,
          price: Number(p.price),
          unit: p.unit,
          image: p.image_url || mockProducts[0].image,
          category,
          producerId: p.producer_id,
          organic: !!p.is_organic,
          description: p.description ?? "",
        };
      });

      setData({
        producers: dbProducers,
        products: dbProducts,
        loading: false,
        fromDatabase: true,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
