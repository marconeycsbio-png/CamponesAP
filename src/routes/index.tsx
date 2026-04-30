import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sprout, Users, MessageCircle, Star, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarketplaceData } from "@/hooks/use-marketplace-data";
import heroImg from "@/assets/hero-harvest.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Camponês — Conheça os produtores rurais da sua região" },
      {
        name: "description",
        content:
          "Vitrine de produtores rurais. Conheça quem cultiva, veja seus produtos e fale direto com o produtor.",
      },
    ],
  }),
});

function Index() {
  const { producers, products, loading } = useMarketplaceData();
  const featuredProducers = producers.slice(0, 6);

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
              <Sprout className="h-3.5 w-3.5" /> Vitrine de produtores rurais
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-cream md:text-7xl">
              Conheça quem cultiva
              <br />
              <span className="italic text-accent">o seu alimento.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream/85 md:text-xl">
              Produtores rurais divulgam aqui o que produzem. Você escolhe um, vê os produtos
              dele e fala direto — sem intermediário.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/produtores">
                <Button variant="hero" size="xl" className="group">
                  👨‍🌾 Ver produtores
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="cinema" size="xl">🌾 Sou produtor</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA — STRIP */}
      <section className="border-y border-border/60 bg-cream/40">
        <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
          {[
            { icon: Users, t: "Conheça o produtor", s: "Veja a fazenda, a cidade e a história." },
            { icon: Sprout, t: "Veja os produtos", s: "Cada produtor mostra o que tem na temporada." },
            { icon: MessageCircle, t: "Fale direto", s: "WhatsApp, Instagram, e-mail. Sem intermediário." },
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

      {/* PRODUTORES EM DESTAQUE */}
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Produtores cadastrados
            </span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              Conheça quem cuida do <em className="text-gradient-leaf">seu prato</em>
            </h2>
          </div>
          <Link to="/produtores">
            <Button variant="outline">Ver todos</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredProducers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-muted-foreground">Ainda não há produtores cadastrados.</p>
            <Link to="/cadastro">
              <Button className="mt-4">Seja o primeiro</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 stagger">
            {featuredProducers.map((p) => {
              const productCount = products.filter((pr) => pr.producerId === p.id).length;
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
                        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10">
                        <Sprout className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="font-semibold">{p.rating.toFixed(1)}</span>
                        <span className="opacity-75">· {productCount} produto{productCount === 1 ? "" : "s"}</span>
                      </div>
                      <h3 className="mt-1 font-display text-2xl">{p.farmName}</h3>
                      <p className="flex items-center gap-1 text-sm opacity-90">
                        <MapPin className="h-3.5 w-3.5" />
                        {[p.city, p.state].filter(Boolean).join(" / ") || "Brasil"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
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
              <span className="italic text-accent">Apareça aqui.</span>
            </h2>
            <p className="mt-4 text-lg text-cream/85">
              Cadastre sua fazenda gratuitamente, publique seus produtos e receba contato
              direto dos consumidores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cadastro">
                <Button variant="hero" size="xl">Cadastrar minha fazenda</Button>
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
