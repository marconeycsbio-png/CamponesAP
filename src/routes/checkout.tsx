import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Check, Loader2, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart, formatBRL } from "@/contexts/cart-context";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout PIX — Camponês" }] }),
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<"form" | "pix">("form");
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const navigate = useNavigate();

  const total = subtotal + 9.9;
  const pixCode =
    "00020126360014BR.GOV.BCB.PIX0114campones@pix.br5204000053039865802BR5913CAMPONES MKT6009SAO PAULO62070503***6304ABCD";

  // simulação: confirma "pagamento" após 8s
  useEffect(() => {
    if (step !== "pix" || paid) return;
    const t = setTimeout(() => {
      setPaid(true);
      toast.success("Pagamento PIX confirmado!");
      setTimeout(() => {
        clear();
        navigate({ to: "/confirmacao" });
      }, 1500);
    }, 8000);
    return () => clearTimeout(t);
  }, [step, paid, clear, navigate]);

  if (items.length === 0 && step === "form") {
    return (
      <div className="container mx-auto py-24 text-center">
        <p className="text-muted-foreground">Sua cesta está vazia.</p>
        <Link to="/produtos" className="mt-4 inline-block">
          <Button>Ir às compras</Button>
        </Link>
      </div>
    );
  }

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Pagamento
          </span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Checkout</h1>
        </div>

        {step === "form" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep("pix");
            }}
            className="space-y-5 rounded-3xl bg-card p-8 shadow-[var(--shadow-soft)]"
          >
            <h2 className="font-display text-2xl">Dados de entrega</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" required placeholder="Maria Silva" />
              </div>
              <div>
                <Label htmlFor="phone">Contato</Label>
                <Input id="phone" required placeholder="(11) 91234-5678" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addr">Endereço</Label>
                <Input id="addr" required placeholder="Rua das Flores, 123 — São Paulo, SP" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-cream/60 p-4">
              <span className="text-sm text-muted-foreground">Total a pagar</span>
              <span className="font-display text-2xl font-semibold text-primary">
                {formatBRL(total)}
              </span>
            </div>

            <Button type="submit" size="xl" className="w-full">
              Gerar QR Code PIX
            </Button>
          </form>
        ) : (
          <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft)]">
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {paid ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Pago
                  </>
                ) : (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Aguardando pagamento
                  </>
                )}
              </div>
              <h2 className="font-display text-3xl">Escaneie o QR Code</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Abra seu app do banco e finalize o pagamento.
              </p>
            </div>

            <div className="mx-auto mt-8 grid h-64 w-64 place-items-center rounded-2xl bg-foreground p-4">
              {/* QR placeholder estilizado */}
              <div className="grid h-full w-full grid-cols-12 grid-rows-12 gap-[2px]">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${
                      // padrão pseudo-aleatório determinístico
                      [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47].some((p) => i % p === 0)
                        ? "bg-cream"
                        : "bg-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <QrCode className="h-3.5 w-3.5" /> QR Code de demonstração
            </div>

            <div className="mt-6">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Copia e cola PIX
              </Label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background p-2">
                <code className="flex-1 truncate px-2 text-xs">{pixCode}</code>
                <Button size="sm" onClick={copyPix} variant={copied ? "secondary" : "default"}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between rounded-2xl bg-cream/60 p-4">
              <span className="text-sm text-muted-foreground">Valor total</span>
              <span className="font-display text-3xl font-semibold text-primary">
                {formatBRL(total)}
              </span>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Esta é uma demonstração. Pagamento será confirmado automaticamente em alguns segundos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
