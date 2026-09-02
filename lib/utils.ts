import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) return "Price on request";
  if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2)} Cr`;
  if (price >= 100000) return `Rs ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}

export function todayIso() {
  return new Date().toISOString();
}

export function nextId(existing: string[], prefix: string, width: number) {
  const max = existing.reduce((highest, id) => {
    const match = id.match(new RegExp(`^${prefix}(\\d+)$`));
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `${prefix}${String(max + 1).padStart(width, "0")}`;
}

export function whatsappLink(number: string, message: string) {
  const clean = number.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function toBool(value: string | undefined) {
  return value?.toLowerCase() === "yes" || value?.toLowerCase() === "true";
}

export function parseList(value: string) {
  return value
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
