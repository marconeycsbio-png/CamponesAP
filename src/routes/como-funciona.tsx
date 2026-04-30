import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Users, MessageCircle, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/como-funciona")({
  component: ComoFuncionaPage,
  head: () => ({
    meta: [
      { title: "Como funciona — Camponês" },
      {
        name: "description",
        content:
          "Vitrine de produtores rurais. Encontre, conheça e fale direto com quem cultiva — sem intermediário.",
      },
    ],
  }),
});

const STEPS = [
  { icon: Search, t: "Descubra", d: "Explore os produtores rurais cadastrados na plataforma." },
  { icon: Users, t: "Conheça", d: "Veja a fazenda, a história e os produtos de cada um." },
  { icon: MessageCircle, t: "Fale direto", d: "Use WhatsApp, Instagram ou e-mail. Nada de intermediário." },
  { icon: Sprout, t: "Apoie o campo", d: "Compre direto do produtor e fortaleça quem cultiva." },
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
          Não somos uma loja. Somos uma vitrine que conecta você diretamente ao produtor rural.
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
          <h2 className="font-display text-3xl">Para você que consome</h2>
          <ul className="mt-4 space-y-2 text-foreground/80">
            <li>✓ Conheça quem produz o seu alimento</li>
            <li>✓ Veja produtos com origem rastreável</li>
            <li>✓ Fale direto pelo WhatsApp do produtor</li>
            <li>✓ Combine entrega ou retirada na fazenda</li>
          </ul>
          <Link to="/produtores" className="mt-6 inline-block">
            <Button size="lg">Ver produtores</Button>
          </Link>
        </div>

        <div className="rounded-3xl bg-primary p-10 text-cream shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-3xl">Para você que produz</h2>
          <ul className="mt-4 space-y-2 text-cream/90">
            <li>✓ Cadastro 100% gratuito</li>
            <li>✓ Vitrine pública para sua fazenda e produtos</li>
            <li>✓ Receba contato direto pelo seu WhatsApp</li>
            <li>✓ Sem comissão, sem intermediário</li>
          </ul>
          <Link to="/cadastro" className="mt-6 inline-block">
            <Button variant="cinema" size="lg">Quero ser produtor</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
