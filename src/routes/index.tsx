import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, Sprout, Truck, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/site/product-card";
import { useMarketplaceData } from "@/hooks/use-marketplace-data";
import heroImg from "@/assets/hero-harvest.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Camponês — Do campo direto para sua mesa" },
      {
        name: "description",
        content:
          "Marketplace agrícola que conecta produtores rurais a você. Frutas, verduras e legumes frescos, com origem rastreável e pagamento via PIX.",
      },
    ],
  }),
});

function Index() {
  const { products, producers } = useMarketplaceData();
  const featured = products.slice(0, 4);
  const featuredProducers = producers.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Mesa rústica com colheita fresca ao pôr do sol"
            width={1920}
            height={1080}
            className="h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 pb-24 pt-20 md:px-6 md:pb-36 md:pt-32">
          <div className="max-w-2xl text-cream animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-black/25 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cream backdrop-blur">
              <Sprout className="h-3.5 w-3.5" /> Marketplace Agrícola
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-cream md:text-7xl">
              Do campo direto
              <br />
              <span className="italic text-accent">para sua mesa.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream/85 md:text-xl">
              Alimentos frescos, colhidos hoje. Conecte-se diretamente com produtores rurais
              e leve para casa o sabor verdadeiro do interior.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/produtos">
                <Button variant="hero" size="xl" className="group">
                  🛒 Comprar Agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="cinema" size="xl">🌾 Sou Produtor</Button>
              </Link>
            </div>
          </div>

          {/* search bar */}
          <div className="mt-12 max-w-2xl animate-fade-up">
            <div className="flex items-center gap-2 rounded-2xl border border-cream/20 bg-background/95 p-2 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos, produtores ou categorias..."
                className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              />
              <Link to="/produtos">
                <Button size="lg" className="rounded-xl">
                  Buscar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border/60 bg-cream/40">
        <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
          {[
            { icon: Sprout, t: "100% rastreável", s: "Você sabe quem plantou e onde nasceu." },
            { icon: Truck, t: "Entrega rápida", s: "Direto da fazenda, sem intermediários." },
            { icon: ShieldCheck, t: "Pagamento seguro", s: "PIX confirmado em segundos." },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{t}</div>
                <div className="text-sm text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUTORES PRÓXIMOS */}
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Produtores próximos
            </span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              Conheça quem cuida do <em className="text-gradient-leaf">seu prato</em>
            </h2>
          </div>
          <Link to="/produtores">
            <Button variant="outline">Ver todos</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 stagger">
          {featuredProducers.map((p) => (
            <Link
              key={p.id}
              to="/produtores"
              className="group relative overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] hover-lift"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} - ${p.farm}`}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="font-semibold">{p.rating.toFixed(1)}</span>
                    <span className="opacity-75">· {p.reviews} avaliações</span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl">{p.farm}</h3>
                  <p className="text-sm opacity-90">
                    {p.name} · {p.city}/{p.region} · a {p.distanceKm} km
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES DA SEMANA */}
      <section className="bg-[var(--gradient-warm)]">
        <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Destaques da semana
              </span>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">
                Colhido <em className="text-gradient-leaf">hoje</em>
              </h2>
            </div>
            <Link to="/produtos">
              <Button variant="outline">
                Ver todos os produtos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                producer={producers.find((pr) => pr.id === p.producerId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-cream shadow-[var(--shadow-card)] md:p-16">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl text-cream md:text-5xl">
              É produtor rural?
              <br />
              <span className="italic text-accent">Multiplique seu alcance.</span>
            </h2>
            <p className="mt-4 text-lg text-cream/85">
              Cadastre sua fazenda gratuitamente, controle pedidos pelo painel e venda direto
              para milhares de famílias.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cadastro">
                <Button variant="hero" size="xl">Quero vender no Camponês</Button>
              </Link>
              <Link to="/como-funciona">
                <Button variant="cinema" size="xl">Como funciona</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
