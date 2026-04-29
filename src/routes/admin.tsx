import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Users, Package, FileText, Tag, LogOut, Trash2, Pencil, Check, X, Plus, Sprout } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Painel Admin — Camponês" }] }),
});

type Tab = "produtores" | "produtos" | "categorias" | "conteudo";

interface Producer {
  id: string;
  user_id: string | null;
  farm_name: string;
  description: string | null;
  city: string | null;
  state: string | null;
  image_url: string | null;
  status: "pendente" | "ativo" | "suspenso";
}
interface Product {
  id: string;
  producer_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  is_organic: boolean | null;
}
interface Category { id: string; slug: string; name: string; emoji: string | null; sort_order: number; }
interface SiteContent { key: string; value: string; description: string | null; }

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("produtores");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/login" });
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Carregando...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl">Acesso restrito</h1>
        <p className="mt-2 text-muted-foreground">Você não tem permissão de administrador.</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "produtores", label: "Produtores", icon: Users },
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "categorias", label: "Categorias", icon: Tag },
    { id: "conteudo", label: "Conteúdo do site", icon: FileText },
  ];

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <Shield className="h-3.5 w-3.5" /> Painel administrativo
          </span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Camponês · Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "produtores" && <ProducersAdmin />}
      {tab === "produtos" && <ProductsAdmin />}
      {tab === "categorias" && <CategoriesAdmin />}
      {tab === "conteudo" && <ContentAdmin />}
    </div>
  );
}

/* ------------ PRODUTORES ------------ */
function ProducersAdmin() {
  const [items, setItems] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("producers").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Producer[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: Producer["status"]) => {
    const { error } = await supabase.from("producers").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status atualizado para ${status}`);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Excluir este produtor e todos os produtos dele?")) return;
    const { error } = await supabase.from("producers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produtor excluído");
    load();
  };

  const pending = items.filter((p) => p.status === "pendente");
  const others = items.filter((p) => p.status !== "pendente");

  return (
    <div className="space-y-8">
      <Section
        title={`Aguardando aprovação (${pending.length})`}
        empty={loading ? "Carregando..." : "Nenhum cadastro pendente."}
        items={pending}
        renderRow={(p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/5 p-4">
            <div>
              <div className="font-display text-lg">{p.farm_name}</div>
              <div className="text-xs text-muted-foreground">{p.city || "—"}{p.state ? `/${p.state}` : ""}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setStatus(p.id, "ativo")}><Check className="h-4 w-4" /> Aprovar</Button>
              <Button size="sm" variant="outline" onClick={() => setStatus(p.id, "suspenso")}><X className="h-4 w-4" /> Rejeitar</Button>
            </div>
          </div>
        )}
      />
      <Section
        title={`Produtores (${others.length})`}
        empty={loading ? "Carregando..." : "Nenhum produtor cadastrado ainda."}
        items={others}
        renderRow={(p) => <ProducerRow key={p.id} producer={p} onChanged={load} onSuspend={(s) => setStatus(p.id, s)} onDelete={() => remove(p.id)} />}
      />
    </div>
  );
}

function ProducerRow({ producer, onChanged, onSuspend, onDelete }: {
  producer: Producer; onChanged: () => void; onSuspend: (s: Producer["status"]) => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [farm, setFarm] = useState(producer.farm_name);
  const [city, setCity] = useState(producer.city ?? "");
  const [state, setState] = useState(producer.state ?? "");
  const [desc, setDesc] = useState(producer.description ?? "");
  const [img, setImg] = useState(producer.image_url ?? "");

  const save = async () => {
    const { error } = await supabase.from("producers").update({
      farm_name: farm, city, state, description: desc, image_url: img || null,
    }).eq("id", producer.id);
    if (error) return toast.error(error.message);
    toast.success("Produtor atualizado");
    setOpen(false);
    onChanged();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        {producer.image_url ? (
          <img src={producer.image_url} className="h-10 w-10 rounded-full object-cover" alt="" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Sprout className="h-5 w-5" /></div>
        )}
        <div>
          <div className="font-medium">{producer.farm_name}</div>
          <div className="text-xs text-muted-foreground">{producer.city || "—"}{producer.state ? `/${producer.state}` : ""}</div>
        </div>
      </div>
      <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
        producer.status === "ativo" ? "border-primary/40 bg-primary/10 text-primary"
        : "border-destructive/40 bg-destructive/10 text-destructive"
      }`}>{producer.status}</span>
      <div className="flex gap-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar produtor</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome da propriedade</Label><Input value={farm} onChange={(e) => setFarm(e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2"><Label>Cidade</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
                <div><Label>UF</Label><Input value={state} maxLength={2} onChange={(e) => setState(e.target.value.toUpperCase())} /></div>
              </div>
              <div><Label>Descrição</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
              <div><Label>URL da imagem</Label><Input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." /></div>
            </div>
            <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        {producer.status === "ativo" ? (
          <Button variant="ghost" size="sm" onClick={() => onSuspend("suspenso")}>Suspender</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => onSuspend("ativo")}>Reativar</Button>
        )}
        <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
  );
}

/* ------------ PRODUTOS ------------ */
function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [p, pr, c] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("producers").select("*"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setItems((p.data as Product[]) ?? []);
    setProducers((pr.data as Producer[]) ?? []);
    setCategories((c.data as Category[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto excluído");
    load();
  };
  const toggleActive = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Produtos ({items.length})</h2>
        <ProductDialog producers={producers} categories={categories} onSaved={load} />
      </div>
      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto cadastrado. Cadastre um produtor primeiro e depois adicione produtos.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-[var(--shadow-soft)]">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Produto</th><th>Produtor</th><th>Preço</th><th>Estoque</th><th>Ativo</th><th className="text-right pr-4">Ações</th></tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const prod = producers.find((x) => x.id === p.producer_id);
                return (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.image_url && <img src={p.image_url} className="h-10 w-10 rounded-lg object-cover" alt="" />}
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{prod?.farm_name ?? "—"}</td>
                    <td className="font-semibold text-primary">R$ {p.price.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/{p.unit}</span></td>
                    <td>{p.stock} {p.unit}</td>
                    <td>
                      <button onClick={() => toggleActive(p)} className={`rounded-full px-2 py-0.5 text-xs ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {p.is_active ? "ativo" : "inativo"}
                      </button>
                    </td>
                    <td className="text-right pr-4">
                      <ProductDialog producers={producers} categories={categories} product={p} onSaved={load} />
                      <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductDialog({ producers, categories, product, onSaved }: {
  producers: Producer[]; categories: Category[]; product?: Product; onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [desc, setDesc] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [unit, setUnit] = useState(product?.unit ?? "kg");
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [img, setImg] = useState(product?.image_url ?? "");
  const [producerId, setProducerId] = useState(product?.producer_id ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [isOrganic, setIsOrganic] = useState(product?.is_organic ?? false);

  const save = async () => {
    if (!producerId) return toast.error("Selecione um produtor");
    const payload = {
      name, description: desc || null, price: Number(price), unit, stock: Number(stock),
      image_url: img || null, producer_id: producerId, category_id: categoryId || null, is_organic: isOrganic,
    };
    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(product ? "Produto atualizado" : "Produto criado");
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        ) : (
          <Button><Plus className="h-4 w-4" /> Novo produto</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{product ? "Editar produto" : "Novo produto"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Descrição</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label>Preço</Label><Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
            <div><Label>Unidade</Label><Input value={unit} onChange={(e) => setUnit(e.target.value)} /></div>
            <div><Label>Estoque</Label><Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></div>
          </div>
          <div><Label>URL da imagem</Label><Input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." /></div>
          <div>
            <Label>Produtor</Label>
            <Select value={producerId} onValueChange={setProducerId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {producers.map((p) => <SelectItem key={p.id} value={p.id}>{p.farm_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isOrganic} onChange={(e) => setIsOrganic(e.target.checked)} /> Orgânico
          </label>
        </div>
        <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------ CATEGORIAS ------------ */
function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [emoji, setEmoji] = useState("");

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setItems((data as Category[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !slug) return toast.error("Nome e slug obrigatórios");
    const { error } = await supabase.from("categories").insert({ name, slug, emoji: emoji || null, sort_order: items.length + 1 });
    if (error) return toast.error(error.message);
    toast.success("Categoria adicionada");
    setName(""); setSlug(""); setEmoji("");
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
        <h3 className="mb-3 font-display text-lg">Adicionar categoria</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="slug-url" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} />
          <Input placeholder="🥬" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          <Button onClick={add}><Plus className="h-4 w-4" /> Adicionar</Button>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">/{c.slug}</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------ CONTEÚDO ------------ */
function ContentAdmin() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("key");
    const list = (data as SiteContent[]) ?? [];
    setItems(list);
    setDrafts(Object.fromEntries(list.map((i) => [i.key, i.value])));
  };
  useEffect(() => { load(); }, []);

  const save = async (key: string) => {
    const { error } = await supabase.from("site_content").update({ value: drafts[key] }).eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Conteúdo salvo");
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Edite os textos exibidos no site. As alterações aparecem em tempo real para os visitantes.</p>
      {items.map((c) => (
        <div key={c.key} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.description || c.key}</div>
              <div className="text-xs text-muted-foreground font-mono">{c.key}</div>
            </div>
            <Button size="sm" onClick={() => save(c.key)}>Salvar</Button>
          </div>
          <Textarea
            value={drafts[c.key] ?? ""}
            onChange={(e) => setDrafts((d) => ({ ...d, [c.key]: e.target.value }))}
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}

/* ------------ helpers ------------ */
function Section<T>({ title, items, empty, renderRow }: {
  title: string; items: T[]; empty: string; renderRow: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 font-display text-2xl">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="space-y-2">{items.map(renderRow)}</div>
      )}
    </div>
  );
}
