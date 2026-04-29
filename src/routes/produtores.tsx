import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { producers, products } from "@/data/mock";

export const Route = createFileRoute("/produtores")({
  component: ProdutoresPage,
  head: () => ({
    meta: [
      { title: "Produtores Rurais — Camponês" },
      {
        name: "description",
        content:
          "Conheça as famílias e fazendas que cultivam o que chega à sua mesa. Histórias reais do campo brasileiro.",
      },
    ],
  }),
});

function ProdutoresPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-12 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Pessoas reais, comida real
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          Os <em className="text-gradient-leaf">produtores</em> por trás de cada colheita
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cada fazenda tem uma história. Conheça quem cuida do que você come.
        </p>
      </div>

      <div className="space-y-10 stagger">
        {producers.map((p) => {
          const myProducts = products.filter((pr) => pr.producerId === p.id);
          return (
            <article
              key={p.id}
              className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] md:grid md:grid-cols-[2fr_3fr]"
            >
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto">
                <img
                  src={p.image}
                  alt={`${p.name} - ${p.farm}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-between p-6 md:p-10">
                <div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold">{p.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">· {p.reviews} avaliações</span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl md:text-4xl">{p.farm}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {p.city}, {p.region} · a {p.distanceKm} km de você
                  </p>
                  <p className="mt-4 text-foreground/80">{p.bio}</p>

                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      O que {p.name.split(" ")[0]} oferece
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {myProducts.map((pr) => (
                        <div
                          key={pr.id}
                          className="flex items-center gap-2 rounded-full border border-border bg-cream px-3 py-1.5"
                        >
                          <img
                            src={pr.image}
                            alt={pr.name}
                            loading="lazy"
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium">{pr.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/produtos">
                    <Button>Ver produtos</Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4" /> Conversar
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
