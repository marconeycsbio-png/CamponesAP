import { Link } from "@tanstack/react-router";
import { Leaf, Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-[var(--gradient-warm)]">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold text-primary">Camponês</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Uma vitrine para produtores rurais. Conheça quem cultiva, veja o que oferecem
            e fale direto com eles.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Navegar</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/produtores" className="hover:text-primary">Produtores</Link></li>
            <li><Link to="/como-funciona" className="hover:text-primary">Como funciona</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Sou produtor</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cadastro" className="hover:text-primary">Cadastrar minha fazenda</Link></li>
            <li><Link to="/painel" className="hover:text-primary">Meu painel</Link></li>
          </ul>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="mailto:ola@campones.com" aria-label="Email" className="hover:text-primary"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Camponês — feito com 🌱 para o campo brasileiro.
      </div>
    </footer>
  );
}
