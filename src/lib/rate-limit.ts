import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimit() {
  if (!ratelimit) {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return null;
    }
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
    });
  }
  return ratelimit;
}

export async function checkRateLimit(
  identifier: string,
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRatelimit();
  if (!limiter) return { success: true, remaining: 99 };

  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}
