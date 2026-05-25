import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function makeRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!ratelimit) {
    const redis = makeRedis();
    if (!redis) return null;
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
    });
  }
  return ratelimit;
}

let loginRatelimit: Ratelimit | null = null;

function getLoginRatelimit(): Ratelimit | null {
  if (!loginRatelimit) {
    const redis = makeRedis();
    if (!redis) return null;
    loginRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
    });
  }
  return loginRatelimit;
}

// In-memory fallback: enforces 5 attempts per 15 minutes per IP when Upstash is unavailable
const IN_MEMORY_MAX = 5;
const IN_MEMORY_WINDOW_MS = 15 * 60 * 1000;
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

function inMemoryLoginCheck(ip: string): {
  success: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = inMemoryStore.get(ip);

  if (!entry || now > entry.resetAt) {
    inMemoryStore.set(ip, { count: 1, resetAt: now + IN_MEMORY_WINDOW_MS });
    return { success: true, remaining: IN_MEMORY_MAX - 1 };
  }

  if (entry.count >= IN_MEMORY_MAX) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: IN_MEMORY_MAX - entry.count };
}

export async function checkRateLimit(
  identifier: string,
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRatelimit();
  if (!limiter) return { success: true, remaining: 99 };
  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}

export async function checkLoginRateLimit(
  identifier: string,
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getLoginRatelimit();
  if (!limiter) return inMemoryLoginCheck(identifier);
  const result = await limiter.limit(`login:${identifier}`);
  return { success: result.success, remaining: result.remaining };
}
