/**
 * Simple in-memory rate limiting for API routes
 * For production, consider using a Redis-based solution
 */

const rateLimitStore = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // Cleanup every minute

// Cleanup old entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.firstRequest > value.windowMs) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    keyGenerator = (req) => req.ip || "unknown",
  } = options;

  return (req) => {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        firstRequest: now,
        windowMs,
      });
      return { limited: false, remaining: maxRequests - 1 };
    }

    const record = rateLimitStore.get(key);

    // Check if window has expired
    if (now - record.firstRequest > record.windowMs) {
      record.count = 1;
      record.firstRequest = now;
      return { limited: false, remaining: maxRequests - 1 };
    }

    record.count++;

    if (record.count > maxRequests) {
      return {
        limited: true,
        remaining: 0,
        retryAfter: Math.ceil((record.firstRequest + record.windowMs - now) / 1000),
      };
    }

    return { limited: false, remaining: maxRequests - record.count };
  };
}

// Specific limiters for different endpoints
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes for auth
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute for general API
});

export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50, // 50 uploads per hour
});
