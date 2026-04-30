import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Package, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/painel")({
  component: ProdutorDashboard,
  head: () => ({ meta: [{ title: "Painel do produtor — Camponês" }] }),
});

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  producer_id: string;
}

interface ProducerRow {
  id: string;
  farm_name: string;
  user_id: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  image_url: string | null;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
}

const emptyForm = {
  id: "" as string | null,
  name: "",
  description: "",
  price: "",
  unit: "kg",
  stock: "0",
  image_url: "" as string | null,
};

function ProdutorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [producer, setProducer] = useState<ProducerRow | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    // Busca a ficha de produtor; cria automaticamente se não houver
    let { data: prod } = await supabase
      .from("producers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!prod) {
      const farmName =
        (user.user_metadata?.full_name as string | undefined) ||
        user.email?.split("@")[0] ||
        "Minha propriedade";
      const { data: created, error } = await supabase
        .from("producers")
        .insert({ user_id: user.id, farm_name: farmName, status: "ativo" })
        .select("id, farm_name, user_id")
        .single();
      if (error) {
        toast.error("Não foi possível criar sua ficha de produtor: " + error.message);
        setLoading(false);
        return;
      }
      prod = created;
    }
    setProducer(prod);

    const { data: prods, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .eq("producer_id", prod.id)
      .order("created_at", { ascending: false });
    if (prodErr) toast.error(prodErr.message);
    setProducts(prods ?? []);
    setLoading(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, id: null });
    setDialogOpen(true);
  };

  const openEdit = (p: ProductRow) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      unit: p.unit,
      stock: String(p.stock),
      image_url: p.image_url,
    });
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      toast.error("Erro ao enviar imagem: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Imagem enviada");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producer) return;
    const priceNum = parseFloat(form.price.replace(",", "."));
    const stockNum = parseInt(form.stock, 10);
    if (!form.name.trim() || isNaN(priceNum) || priceNum < 0) {
      toast.error("Preencha nome e preço válidos.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: priceNum,
      unit: form.unit || "kg",
      stock: isNaN(stockNum) ? 0 : stockNum,
      image_url: form.image_url || null,
      producer_id: producer.id,
      is_active: true,
    };

    if (form.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", form.id);
      if (error) toast.error(error.message);
      else toast.success("Produto atualizado");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Produto criado");
    }
    setSaving(false);
    setDialogOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else toast.success("Produto excluído");
    setDeleteId(null);
    loadData();
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Painel do produtor
          </span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">
            Olá, {producer?.farm_name || "produtor"} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie seus produtos — apenas você pode editar ou excluir.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Produtos cadastrados
            </div>
            <div className="font-display text-2xl font-semibold">{products.length}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-4 font-display text-2xl">Meus produtos</h2>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">Você ainda não cadastrou produtos.</p>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Criar primeiro produto
            </Button>
          </div>
        ) : (
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
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{p.name}</div>
                          {p.description && (
                            <div className="line-clamp-1 text-xs text-muted-foreground">
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-primary">
                      {formatBRL(Number(p.price))}{" "}
                      <span className="text-xs font-normal text-muted-foreground">/ {p.unit}</span>
                    </td>
                    <td>
                      {p.stock} {p.unit}
                    </td>
                    <td className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog criar / editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar produto" : "Novo produto"}</DialogTitle>
            <DialogDescription>
              {form.id ? "Atualize as informações do produto." : "Cadastre um novo produto."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="p-name">Nome</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="p-desc">Descrição</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="p-price">Preço (R$)</Label>
                <Input
                  id="p-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-unit">Unidade</Label>
                <Input
                  id="p-unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="kg, un, dz..."
                />
              </div>
              <div>
                <Label htmlFor="p-stock">Estoque</Label>
                <Input
                  id="p-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Imagem</Label>
              <div className="mt-2 flex items-center gap-4">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-secondary">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}{" "}
                    {form.image_url ? "Trocar imagem" : "Enviar imagem"}
                  </Button>
                  {form.image_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm({ ...form, image_url: null })}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {form.id ? "Salvar alterações" : "Criar produto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmar exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
