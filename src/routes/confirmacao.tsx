import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/confirmacao")({
  component: ConfirmacaoPage,
  head: () => ({ meta: [{ title: "Pedido confirmado — Camponês" }] }),
});

function ConfirmacaoPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-float-soft">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl">
          Pedido enviado com <em className="text-gradient-leaf">sucesso!</em>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Obrigado por apoiar o produtor rural brasileiro. Você receberá atualizações em breve.
        </p>

        <div className="mt-8 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] text-left">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-semibold">Tempo estimado de entrega</div>
              <div className="text-xs text-muted-foreground">Entre 24h e 48h, dependendo da sua região.</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
            <span className="font-display text-2xl text-primary">#CMP-{Math.floor(1000 + Math.random() * 9000)}</span>
            <span className="text-xs text-muted-foreground">número do pedido</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/produtor">
            <Button>Acompanhar pedido</Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline">
              <MessageCircle className="h-4 w-4" /> Falar com produtor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
