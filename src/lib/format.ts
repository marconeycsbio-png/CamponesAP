export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function whatsappLink(phone: string, message?: string) {
  const digits = (phone || "").replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function instagramLink(handle: string) {
  const clean = (handle || "").replace(/^@/, "").trim();
  return `https://instagram.com/${clean}`;
}
