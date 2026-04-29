import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { producers } from "@/data/mock";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Conversas — Camponês" }] }),
});

interface Msg {
  from: "me" | "them";
  text: string;
  at: string;
}

const initialThreads: Record<string, Msg[]> = {
  p1: [
    { from: "them", text: "Olá! Os tomates colhidos hoje estão lindos 🍅", at: "09:12" },
    { from: "me", text: "Que ótimo! Quando consegue entregar?", at: "09:14" },
    { from: "them", text: "Amanhã pela manhã! Posso reservar 2 kg para você?", at: "09:15" },
  ],
  p2: [{ from: "them", text: "Boa tarde! Posso te ajudar?", at: "14:02" }],
  p3: [{ from: "them", text: "Mel novo chegando esta semana! 🍯", at: "08:30" }],
};

function ChatPage() {
  const [active, setActive] = useState(producers[0].id);
  const [threads, setThreads] = useState(initialThreads);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setThreads((prev) => ({
      ...prev,
      [active]: [...(prev[active] || []), { from: "me", text: draft, at: time }],
    }));
    setDraft("");
    // resposta simulada
    setTimeout(() => {
      setThreads((prev) => ({
        ...prev,
        [active]: [
          ...(prev[active] || []),
          { from: "them", text: "Perfeito! Vou separar para você 🌱", at: time },
        ],
      }));
    }, 1200);
  };

  const activeProducer = producers.find((p) => p.id === active)!;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Conversas
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Mensagens</h1>
      </div>

      <div className="grid h-[600px] gap-4 overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] md:grid-cols-[280px_1fr]">
        {/* lista */}
        <aside className="border-r border-border/60 bg-cream/40">
          <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Produtores
          </div>
          {producers.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                active === p.id ? "bg-primary/10" : "hover:bg-secondary"
              }`}
            >
              <img src={p.image} alt={p.name} className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.farm}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {threads[p.id]?.[threads[p.id].length - 1]?.text || "Diga olá"}
                </div>
              </div>
            </button>
          ))}
        </aside>

        {/* conversa */}
        <section className="flex flex-col">
          <header className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
            <img
              src={activeProducer.image}
              alt={activeProducer.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{activeProducer.farm}</div>
              <div className="text-xs text-muted-foreground">
                {activeProducer.name} · {activeProducer.city}/{activeProducer.region}
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--gradient-warm)] p-5">
            {(threads[active] || []).map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    m.from === "me"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card text-foreground"
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`mt-1 text-[10px] ${
                      m.from === "me" ? "text-cream/70" : "text-muted-foreground"
                    }`}
                  >
                    {m.at}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-border/60 p-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escreva uma mensagem..."
              className="flex-1"
            />
            <Button onClick={send} size="icon" aria-label="Enviar">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
