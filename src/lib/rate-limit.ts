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
  if (!limiter) return { success: true, remaining: 99 };
  const result = await limiter.limit(`login:${identifier}`);
  return { success: result.success, remaining: result.remaining };
}
