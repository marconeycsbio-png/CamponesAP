import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Star, Search, Sprout, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMarketplaceData } from "@/hooks/use-marketplace-data";

export const Route = createFileRoute("/produtores")({
  component: ProdutoresPage,
  head: () => ({
    meta: [
      { title: "Produtores rurais — Camponês" },
      {
        name: "description",
        content:
          "Conheça os produtores rurais cadastrados. Veja a fazenda, os produtos e fale direto com cada um.",
      },
    ],
  }),
});

function ProdutoresPage() {
  const { producers, products, loading } = useMarketplaceData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return producers;
    return producers.filter(
      (p) =>
        p.farmName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [producers, query]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Pessoas reais, comida real
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          Os <em className="text-gradient-leaf">produtores</em> por trás de cada colheita
        </h1>
        <p className="mt-3 text-muted-foreground">
          Escolha um produtor para ver o que ele oferece e falar direto com ele.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-2 rounded-xl border border-border bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, cidade ou estado..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">
            {producers.length === 0
              ? "Ainda não há produtores cadastrados."
              : "Nenhum produtor encontrado para essa busca."}
          </p>
          {producers.length === 0 && (
            <Link to="/cadastro">
              <Button className="mt-4">Cadastrar minha fazenda</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {filtered.map((p) => {
            const count = products.filter((pr) => pr.producerId === p.id).length;
            return (
              <Link
                key={p.id}
                to="/produtor/$producerId"
                params={{ producerId: p.id }}
                className="group relative overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] hover-lift"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.farmName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                      <Sprout className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="font-semibold">{p.rating.toFixed(1)}</span>
                      <span className="opacity-75">· {count} produto{count === 1 ? "" : "s"}</span>
                    </div>
                    <h3 className="mt-1 font-display text-2xl">{p.farmName}</h3>
                    <p className="flex items-center gap-1 text-sm opacity-90">
                      <MapPin className="h-3.5 w-3.5" />
                      {[p.city, p.state].filter(Boolean).join(" / ") || "Brasil"}
                    </p>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 text-sm opacity-85">{p.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
