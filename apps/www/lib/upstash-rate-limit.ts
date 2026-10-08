import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function makeRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ token, url });
}

const redis = makeRedis();

// Anonymous callers: 10 req / hour per IP
export const anonOgLimit = redis
  ? new Ratelimit({
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "og:anon",
      redis,
    })
  : null;

// Authenticated (session or API key): 100 req / day per user/key
export const authedOgLimit = redis
  ? new Ratelimit({
      limiter: Ratelimit.slidingWindow(100, "1 d"),
      prefix: "og:authed",
      redis,
    })
  : null;

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
