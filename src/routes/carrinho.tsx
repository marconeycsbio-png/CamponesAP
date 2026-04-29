import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart, formatBRL } from "@/contexts/cart-context";

export const Route = createFileRoute("/carrinho")({
  component: CarrinhoPage,
  head: () => ({
    meta: [{ title: "Minha cesta — Camponês" }],
  }),
});

function CarrinhoPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [delivery, setDelivery] = useState<"entrega" | "retirada">("entrega");
  const navigate = useNavigate();

  const fee = delivery === "entrega" ? 9.9 : 0;
  const total = subtotal + fee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6 text-primary animate-float-soft">
          <ShoppingBasket className="h-12 w-12" />
        </div>
        <h1 className="font-display text-4xl">Sua cesta está vazia</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Que tal começar com um pouco de tudo que o campo tem a oferecer?
        </p>
        <Link to="/produtos" className="mt-8">
          <Button size="lg">Explorar produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Sua cesta
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Minha Cesta</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* itens */}
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] animate-fade-in"
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-24 w-24 shrink-0 rounded-xl object-cover md:h-28 md:w-28"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg leading-tight">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatBRL(product.price)} / {product.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-border bg-background">
                    <button
                      onClick={() => setQty(product.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-l-full hover:bg-secondary"
                      aria-label="Diminuir"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQty(product.id, quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-r-full hover:bg-secondary"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="font-display text-lg font-semibold text-primary">
                    {formatBRL(product.price * quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clear}
            className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Esvaziar cesta
          </button>
        </div>

        {/* sumário */}
        <aside className="h-fit rounded-3xl bg-[var(--gradient-warm)] p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Resumo do pedido</h2>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["entrega", "retirada"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setDelivery(opt)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium capitalize transition-all ${
                  delivery === opt
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {opt === "entrega" ? "🚚 Entrega" : "🌾 Retirada"}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{delivery === "entrega" ? "Entrega" : "Retirada"}</span>
              <span>{fee === 0 ? "Grátis" : formatBRL(fee)}</span>
            </div>
            <div className="border-t border-border/60 pt-3" />
            <div className="flex items-end justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="font-display text-3xl font-semibold text-primary">
                {formatBRL(total)}
              </span>
            </div>
          </div>

          <Button
            size="xl"
            className="mt-6 w-full"
            onClick={() => navigate({ to: "/checkout" })}
          >
            Finalizar Pedido <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pagamento via PIX, confirmado em segundos.
          </p>
        </aside>
      </div>
    </div>
  );
}
