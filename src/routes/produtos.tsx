import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/product-card";
import { categories, type Category } from "@/data/mock";
import { useMarketplaceData } from "@/hooks/use-marketplace-data";

export const Route = createFileRoute("/produtos")({
  component: ProdutosPage,
  head: () => ({
    meta: [
      { title: "Produtos frescos do campo — Camponês" },
      {
        name: "description",
        content:
          "Frutas, verduras, legumes e produtos artesanais direto dos produtores. Compre online com pagamento PIX.",
      },
    ],
  }),
});

function ProdutosPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Category | "Todos">("Todos");
  const [maxPrice, setMaxPrice] = useState(50);
  const { products, producers } = useMarketplaceData();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (active !== "Todos" && p.category !== active) return false;
      if (p.price > maxPrice) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, active, maxPrice]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Mercado
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          Produtos <em className="text-gradient-leaf">frescos</em> do campo
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tudo selecionado e enviado diretamente pelo produtor.
        </p>
      </div>

      {/* Filtros */}
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-y border-border/60 bg-background/90 px-4 py-4 backdrop-blur-xl md:top-20 md:mx-0 md:rounded-2xl md:border md:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["Todos", ...categories] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  active === c
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "border-border bg-card text-foreground/75 hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <label className="text-xs text-muted-foreground">Até R$ {maxPrice}</label>
            <input
              type="range"
              min={5}
              max={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">Nenhum produto encontrado com esses filtros.</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setActive("Todos");
              setMaxPrice(50);
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              producer={producers.find((pr) => pr.id === p.producerId)}
            />
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <Link to="/produtores">
          <Button variant="outline" size="lg">Conheça os produtores</Button>
        </Link>
      </div>
    </div>
  );
}
