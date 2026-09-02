import { env } from "@/lib/config";

const hits = new Map<string, number[]>();

export function rateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - env.rateLimitWindowMs;
  const recent = (hits.get(key) || []).filter((time) => time > windowStart);
  if (recent.length >= env.rateLimitMax) return false;
  recent.push(now);
  hits.set(key, recent);
  return true;
}
