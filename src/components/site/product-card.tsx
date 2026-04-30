import { Link } from "@tanstack/react-router";
import { Plus, MapPin, Star } from "lucide-react";
import type { Product, Producer } from "@/data/mock";
import { useCart, formatBRL } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProductCard({ product, producer }: { product: Product; producer?: Producer }) {
  const { add } = useCart();

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] hover-lift">
      <Link to="/produtos" className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.organic && (
            <span className="absolute left-3 top-3 rounded-full bg-primary/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow">
              Orgânico
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="font-display text-lg leading-tight text-foreground">{product.name}</h3>
          {producer && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {producer.farm} · {producer.city}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            <div className="font-display text-2xl font-semibold text-primary">
              {formatBRL(product.price)}
            </div>
            <div className="text-xs text-muted-foreground">/ {product.unit}</div>
          </div>
          <Button
            size="icon"
            variant="default"
            onClick={() => {
              add(product);
              toast.success(`${product.name} adicionado à cesta`);
            }}
            className="rounded-full shadow-[var(--shadow-soft)] hover:rotate-90 transition-transform duration-300"
            aria-label={`Adicionar ${product.name} à cesta`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {producer && (
          <div className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="font-medium text-foreground">{producer.rating.toFixed(1)}</span>
            <span>· {producer.reviews} avaliações</span>
          </div>
        )}
      </div>
    </article>
  );
}
