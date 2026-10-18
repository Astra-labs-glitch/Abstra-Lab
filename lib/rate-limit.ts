import { hasDatabase, prisma } from "./prisma";

// Shared rate limits. Serverless functions run as many short-lived copies, so a
// counter kept in memory only sees a slice of the traffic. Counters live in the
// database instead; if the database is unreachable we fall back to memory.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number };

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  return { ok: true, retryAfterSeconds: 0 };
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (!hasDatabase()) return memoryLimit(key, limit, windowMs);
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  try {
    // One atomic statement: start a fresh window if the old one ended, otherwise count up.
    const rows = await prisma.$queryRaw<{ count: number; reset_at: Date }[]>`
      INSERT INTO astra_rate_limit (key, count, reset_at) VALUES (${key}, 1, ${resetAt})
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN astra_rate_limit.reset_at <= ${now} THEN 1 ELSE astra_rate_limit.count + 1 END,
        reset_at = CASE WHEN astra_rate_limit.reset_at <= ${now} THEN ${resetAt} ELSE astra_rate_limit.reset_at END
      RETURNING count, reset_at`;
    const row = rows[0];
    // Now and then, clear out windows that ended long ago.
    if (Math.random() < 0.02) {
      prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date(now.getTime() - 86_400_000) } } }).catch(() => {});
    }
    if (row && Number(row.count) > limit) {
      return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((new Date(row.reset_at).getTime() - now.getTime()) / 1000)) };
    }
    return { ok: true, retryAfterSeconds: 0 };
  } catch (error) {
    console.error("rate limit store unavailable, using memory", error);
    return memoryLimit(key, limit, windowMs);
  }
}

export function clientIp(forwardedFor: string | null): string {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
