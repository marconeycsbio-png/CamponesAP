import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PublicProducer {
  id: string;
  farmName: string;
  description: string;
  city: string;
  state: string;
  rating: number;
  imageUrl: string | null;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
}

export interface PublicProduct {
  id: string;
  producerId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  isOrganic: boolean;
}

interface MarketplaceData {
  producers: PublicProducer[];
  products: PublicProduct[];
  loading: boolean;
}

export function useMarketplaceData(): MarketplaceData {
  const [data, setData] = useState<MarketplaceData>({
    producers: [],
    products: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [{ data: prods }, { data: prodItems }] = await Promise.all([
        supabase.from("producers").select("*").eq("status", "ativo"),
        supabase.from("products").select("*").eq("is_active", true),
      ]);

      if (cancelled) return;

      const producers: PublicProducer[] = (prods ?? []).map((p) => ({
        id: p.id,
        farmName: p.farm_name,
        description: p.description ?? "",
        city: p.city ?? "",
        state: p.state ?? "",
        rating: Number(p.rating ?? 5),
        imageUrl: p.image_url,
        whatsapp: p.whatsapp,
        instagram: p.instagram,
        email: p.email,
      }));

      const products: PublicProduct[] = (prodItems ?? []).map((p) => ({
        id: p.id,
        producerId: p.producer_id,
        name: p.name,
        description: p.description ?? "",
        price: Number(p.price),
        unit: p.unit,
        stock: p.stock,
        imageUrl: p.image_url,
        isOrganic: !!p.is_organic,
      }));

      setData({ producers, products, loading: false });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
