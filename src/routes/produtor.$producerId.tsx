import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  MessageCircle,
  Mail,
  Instagram,
  Sprout,
  ArrowLeft,
  Loader2,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, whatsappLink, instagramLink } from "@/lib/format";
import type { PublicProducer, PublicProduct } from "@/hooks/use-marketplace-data";

export const Route = createFileRoute("/produtor/$producerId")({
  component: ProducerProfile,
  head: () => ({
    meta: [{ title: "Produtor — Camponês" }],
  }),
});

function ProducerProfile() {
  const { producerId } = Route.useParams();
  const navigate = useNavigate();
  const [producer, setProducer] = useState<PublicProducer | null>(null);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [{ data: p }, { data: pr }] = await Promise.all([
        supabase.from("producers").select("*").eq("id", producerId).maybeSingle(),
        supabase
          .from("products")
          .select("*")
          .eq("producer_id", producerId)
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;

      if (!p || p.status !== "ativo") {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProducer({
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
      });
      setProducts(
        (pr ?? []).map((x) => ({
          id: x.id,
          producerId: x.producer_id,
          name: x.name,
          description: x.description ?? "",
          price: Number(x.price),
          unit: x.unit,
          stock: x.stock,
          imageUrl: x.image_url,
          isOrganic: !!x.is_organic,
        })),
      );
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [producerId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !producer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center md:px-6">
        <h1 className="font-display text-3xl">Produtor não encontrado</h1>
        <p className="mt-2 text-muted-foreground">Esse produtor não existe ou está inativo.</p>
        <Button className="mt-6" onClick={() => navigate({ to: "/produtores" })}>
          Ver outros produtores
        </Button>
      </div>
    );
  }

  const contactMessage = `Olá! Vi sua fazenda ${producer.farmName} no Camponês e queria saber mais sobre seus produtos.`;

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {producer.imageUrl ? (
            <img
              src={producer.imageUrl}
              alt={producer.farmName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-primary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-background" />
        </div>

        <div className="container mx-auto px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-16">
          <Link
            to="/produtores"
            className="inline-flex items-center gap-1.5 text-sm text-cream/85 hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" /> Todos os produtores
          </Link>

          <div className="mt-8 max-w-3xl text-cream">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{producer.rating.toFixed(1)}</span>
              <span className="opacity-75">
                · {products.length} produto{products.length === 1 ? "" : "s"}
              </span>
            </div>
            <h1 className="mt-2 font-display text-5xl md:text-6xl">{producer.farmName}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-cream/85">
              <MapPin className="h-4 w-4" />
              {[producer.city, producer.state].filter(Boolean).join(" / ") || "Brasil"}
            </p>
            {producer.description && (
              <p className="mt-5 text-lg text-cream/85">{producer.description}</p>
            )}

            {/* Contato */}
            <div className="mt-7 flex flex-wrap gap-3">
              {producer.whatsapp && (
                <a
                  href={whatsappLink(producer.whatsapp, contactMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="hero" size="lg">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                </a>
              )}
              {producer.instagram && (
                <a
                  href={instagramLink(producer.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="cinema" size="lg">
                    <Instagram className="h-4 w-4" /> Instagram
                  </Button>
                </a>
              )}
              {producer.email && (
                <a href={`mailto:${producer.email}`}>
                  <Button variant="cinema" size="lg">
                    <Mail className="h-4 w-4" /> E-mail
                  </Button>
                </a>
              )}
              {!producer.whatsapp && !producer.instagram && !producer.email && (
                <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs text-cream/80">
                  Este produtor ainda não cadastrou contato
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Produtos
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">
            O que {producer.farmName} oferece
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <Sprout className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">
              Este produtor ainda não publicou produtos.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
            {products.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] hover-lift"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Sprout className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  {p.isOrganic && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur">
                      <Leaf className="h-3 w-3" /> Orgânico
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-display text-lg">{p.name}</h3>
                  {p.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  )}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <div className="font-display text-xl font-semibold text-primary">
                        {formatBRL(p.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">por {p.unit}</div>
                    </div>
                    {producer.whatsapp && (
                      <a
                        href={whatsappLink(
                          producer.whatsapp,
                          `Olá! Tenho interesse em "${p.name}" da ${producer.farmName}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3.5 w-3.5" /> Quero
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
