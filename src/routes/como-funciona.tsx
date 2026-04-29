import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShoppingBasket, Truck, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/como-funciona")({
  component: ComoFuncionaPage,
  head: () => ({
    meta: [
      { title: "Como funciona — Camponês" },
      {
        name: "description",
        content: "Em 4 passos simples você compra direto de produtores rurais com pagamento PIX.",
      },
    ],
  }),
});

const STEPS = [
  { icon: Search, t: "Descubra", d: "Explore produtos frescos e produtores próximos a você." },
  { icon: ShoppingBasket, t: "Monte sua cesta", d: "Adicione frutas, verduras, ovos e mel artesanal." },
  { icon: Truck, t: "Receba ou retire", d: "Entrega rápida ou retirada na fazenda — você escolhe." },
  { icon: Smile, t: "Aproveite", d: "Coma melhor e apoie diretamente o produtor rural brasileiro." },
];

function ComoFuncionaPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Simples e direto
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl">
          Como o <em className="text-gradient-leaf">Camponês</em> funciona
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Conectamos a sua mesa diretamente ao campo, sem intermediários.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4 stagger">
        {STEPS.map(({ icon: Icon, t, d }, i) => (
          <div
            key={t}
            className="relative overflow-hidden rounded-3xl bg-card p-8 shadow-[var(--shadow-soft)] hover-lift"
          >
            <span className="absolute right-5 top-4 font-display text-7xl font-bold text-primary/8">
              0{i + 1}
            </span>
            <div className="relative">
              <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-[var(--gradient-warm)] p-10 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-3xl">Para você que compra</h2>
          <ul className="mt-4 space-y-2 text-foreground/80">
            <li>✓ Alimentos com origem rastreável</li>
            <li>✓ Pagamento via PIX, rápido e seguro</li>
            <li>✓ Entrega ou retirada na fazenda</li>
            <li>✓ Avalie e converse direto com o produtor</li>
          </ul>
          <Link to="/produtos" className="mt-6 inline-block">
            <Button size="lg">Comprar agora</Button>
          </Link>
        </div>

        <div className="rounded-3xl bg-primary p-10 text-cream shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-3xl">Para você que produz</h2>
          <ul className="mt-4 space-y-2 text-cream/90">
            <li>✓ Cadastro 100% gratuito</li>
            <li>✓ Painel para gerenciar produtos e pedidos</li>
            <li>✓ Receba PIX direto na sua conta</li>
            <li>✓ Construa relação direta com seus clientes</li>
          </ul>
          <Link to="/cadastro" className="mt-6 inline-block">
            <Button variant="cinema" size="lg">Quero ser produtor</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
