import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import farmer from "@/assets/farmer-1.jpg";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
  head: () => ({ meta: [{ title: "Criar conta — Camponês" }] }),
});

function CadastroPage() {
  const [role, setRole] = useState<"consumidor" | "produtor">("consumidor");

  return (
    <div className="grid min-h-[calc(100vh-5rem)] md:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(
              role === "produtor"
                ? "Cadastro de produtor enviado para análise!"
                : "Conta criada! Bem-vindo ao Camponês.",
            );
          }}
          className="w-full max-w-sm space-y-5"
        >
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
            <Input id="name" required placeholder="Seu nome" />
          </div>
          {role === "produtor" && (
            <div>
              <Label htmlFor="farm">Nome da fazenda / propriedade</Label>
              <Input id="farm" required placeholder="Sítio das Flores" />
            </div>
          )}
          <div>
            <Label htmlFor="email2">E-mail</Label>
            <Input id="email2" type="email" required placeholder="voce@email.com" />
          </div>
          <div>
            <Label htmlFor="senha2">Senha</Label>
            <Input id="senha2" type="password" required placeholder="••••••••" />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Criar conta
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
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
