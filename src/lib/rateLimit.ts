type RateBucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  __phoneStoreRateLimits?: Map<string, RateBucket>;
};

const buckets =
  globalRateLimit.__phoneStoreRateLimits ||
  (globalRateLimit.__phoneStoreRateLimits = new Map<string, RateBucket>());

function getClientAddress(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwarded ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function pruneExpired(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  req: Request,
  namespace: string,
  limit: number,
  windowMs: number,
  discriminator = "",
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const key = `${namespace}:${getClientAddress(req)}:${discriminator}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
