import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Package, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products as seedProducts } from "@/data/mock";
import { formatBRL } from "@/contexts/cart-context";

export const Route = createFileRoute("/produtor")({
  component: ProdutorDashboard,
  head: () => ({ meta: [{ title: "Painel do produtor — Camponês" }] }),
});

const ORDERS = [
  { id: "#CMP-1042", customer: "Maria Silva", items: 3, total: 78.5, status: "Novo" },
  { id: "#CMP-1041", customer: "João Pereira", items: 2, total: 41.0, status: "Em preparo" },
  { id: "#CMP-1039", customer: "Ana Costa", items: 5, total: 134.2, status: "Enviado" },
  { id: "#CMP-1038", customer: "Pedro Lima", items: 1, total: 22.0, status: "Enviado" },
];

const STATUS_COLORS: Record<string, string> = {
  Novo: "bg-accent/20 text-accent-foreground border-accent/40",
  "Em preparo": "bg-primary/15 text-primary border-primary/40",
  Enviado: "bg-secondary text-secondary-foreground border-border",
};

function ProdutorDashboard() {
  const [tab, setTab] = useState<"produtos" | "pedidos">("produtos");
  // pega produtos do produtor p1 como exemplo
  const myProducts = seedProducts.filter((p) => p.producerId === "p1");

  const stats = [
    { icon: ShoppingBag, label: "Pedidos hoje", value: "12" },
    { icon: TrendingUp, label: "Vendas no mês", value: formatBRL(3420) },
    { icon: Package, label: "Produtos ativos", value: String(myProducts.length) },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Painel do produtor
          </span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Olá, Seu João 👋</h1>
          <p className="mt-1 text-muted-foreground">Sítio Boa Esperança · Atibaia/SP</p>
        </div>
        <Link to="/chat">
          <Button variant="outline">Ver conversas</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 stagger">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
              <div className="font-display text-2xl font-semibold">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-10 flex gap-2">
        {(["produtos", "pedidos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-5 py-2 text-sm font-medium capitalize transition-all ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "produtos" ? (
        <div className="mt-6 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Meus produtos</h2>
            <Button>
              <Plus className="h-4 w-4" /> Adicionar produto
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3">Produto</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-primary">
                      {formatBRL(p.price)} <span className="text-xs font-normal text-muted-foreground">/ {p.unit}</span>
                    </td>
                    <td>{Math.floor(20 + Math.random() * 80)} {p.unit}</td>
                    <td className="text-right">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {ORDERS.map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div>
                <div className="font-display text-lg">{o.id}</div>
                <div className="text-xs text-muted-foreground">
                  {o.customer} · {o.items} itens
                </div>
              </div>
              <div className="font-display text-xl font-semibold text-primary">
                {formatBRL(o.total)}
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[o.status]}`}
              >
                {o.status}
              </span>
              <Button variant="outline" size="sm">Detalhes</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
