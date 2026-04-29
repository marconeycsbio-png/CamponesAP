import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ShoppingBasket, Menu, X, Search, Shield, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/produtores", label: "Produtores" },
  { to: "/como-funciona", label: "Como Funciona" },
];

export function Header() {
  const { count } = useCart();
  const { user, isAdmin, isProducer, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 transition-transform duration-500 group-hover:rotate-[-8deg]">
            <img src={logo} alt="Camponês" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-primary">Camponês</span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              Do campo para sua mesa
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-foreground/75 hover:text-primary"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/produtos" aria-label="Buscar" className="hidden md:block">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/cadastro" className="hidden md:block">
                <Button variant="default" size="sm">Criar Conta</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Painel admin</Link>
                  </DropdownMenuItem>
                )}
                {isProducer && (
                  <DropdownMenuItem asChild>
                    <Link to="/produtor">Painel produtor</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link to="/carrinho" aria-label="Carrinho" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBasket className="h-5 w-5" />
            </Button>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground shadow-md animate-fade-in">
                {count}
              </span>
            )}
          </Link>

          <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background animate-fade-in">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-primary hover:bg-secondary">
                🛡️ Painel admin
              </Link>
            )}
            <div className="mt-2 flex gap-2">
              {!user ? (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Entrar</Button>
                  </Link>
                  <Link to="/cadastro" className="flex-1" onClick={() => setOpen(false)}>
                    <Button className="w-full">Criar Conta</Button>
                  </Link>
                </>
              ) : (
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Sair
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
