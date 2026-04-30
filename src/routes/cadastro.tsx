import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import farmer from "@/assets/farmer-1.jpg";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
  head: () => ({ meta: [{ title: "Criar conta — Camponês" }] }),
});

function CadastroPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"consumidor" | "produtor">("consumidor");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: name, signup_role: role },
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message.includes("already registered") ? "Este e-mail já está cadastrado." : error.message);
      return;
    }

    // Se for produtor, cria a ficha (sem aguardar admin — auto-aprovado)
    if (role === "produtor" && data.user) {
      const { error: prodError } = await supabase.from("producers").insert({
        user_id: data.user.id,
        farm_name: farmName,
        status: "ativo",
      });
      if (prodError) console.warn("erro ao criar ficha de produtor:", prodError.message);
      // adiciona role 'produtor' (consumidor já vem por trigger)
      // Nota: precisaria de uma função SECURITY DEFINER para inserir role do produtor.
      // Por simplicidade do MVP, o admin promove via painel.
    }

    setLoading(false);
    toast.success("Conta criada! Verifique seu e-mail (se exigido) e faça login.");
    navigate({ to: "/login" });
  };

  return (
    <div className="grid min-h-[calc(100vh-5rem)] md:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="font-display text-3xl">Criar conta</h1>
            <p className="mt-1 text-sm text-muted-foreground">É grátis e leva menos de 1 minuto.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1">
            {(["consumidor", "produtor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg py-2 text-sm font-medium capitalize transition-all ${
                  role === r
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "consumidor" ? "Sou consumidor" : "Sou produtor"}
              </button>
            ))}
          </div>

          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </div>
          {role === "produtor" && (
            <div>
              <Label htmlFor="farm">Nome da propriedade</Label>
              <Input id="farm" required value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="Sítio das Flores" />
            </div>
          )}
          <div>
            <Label htmlFor="email2">E-mail</Label>
            <Input id="email2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
          </div>
          <div>
            <Label htmlFor="senha2">Senha</Label>
            <Input id="senha2" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="mín. 6 caracteres" />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Entrar</Link>
          </p>
        </form>
      </div>

      <div className="relative hidden md:block">
        <img src={farmer} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/85 to-black/60" />
        <div className="relative flex h-full flex-col justify-end p-12 text-cream">
          <Sprout className="h-8 w-8 text-accent" />
          <h2 className="mt-4 font-display text-4xl">
            Junte-se à <em>nova economia rural</em>
          </h2>
          <p className="mt-2 max-w-sm text-cream/80">
            Mais de 1.200 produtores já vendem direto para suas comunidades.
          </p>
        </div>
      </div>
    </div>
  );
}
