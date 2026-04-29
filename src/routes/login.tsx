import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import heroImg from "@/assets/hero-harvest.jpg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar — Camponês" }] }),
});

function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 to-black/60" />
        <div className="relative flex h-full flex-col justify-end p-12 text-cream">
          <Sprout className="h-8 w-8 text-accent" />
          <h2 className="mt-4 font-display text-4xl">
            Bem-vindo de volta ao <em>Camponês</em>
          </h2>
          <p className="mt-2 max-w-sm text-cream/80">
            O sabor verdadeiro do interior, à distância de um clique.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Login simulado — bem-vindo!");
          }}
          className="w-full max-w-sm space-y-5"
        >
          <div>
            <h1 className="font-display text-3xl">Entrar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse sua conta para fazer pedidos.
            </p>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required placeholder="voce@email.com" />
          </div>
          <div>
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" required placeholder="••••••••" />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
