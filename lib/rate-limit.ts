// Simple in-memory rate limiter (per proses PM2)
// Untuk multi-instance / lebih ketat, ganti ke Redis.

interface Bucket {
    count: number
    resetAt: number
}

const buckets = new Map<string, Bucket>()

interface LimitOptions {
    key: string
    limit: number
    windowMs: number
}

export interface LimitResult {
    ok: boolean
    remaining: number
    resetAt: number
}

export function rateLimit({ key, limit, windowMs }: LimitOptions): LimitResult {
    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || bucket.resetAt <= now) {
        const resetAt = now + windowMs
        buckets.set(key, { count: 1, resetAt })
        return { ok: true, remaining: limit - 1, resetAt }
    }

    if (bucket.count >= limit) {
        return { ok: false, remaining: 0, resetAt: bucket.resetAt }
    }

    bucket.count += 1
    return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
}

// Periodic cleanup untuk buckets kedaluwarsa
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, bucket] of buckets.entries()) {
            if (bucket.resetAt <= now) buckets.delete(key)
        }
    }, 60_000).unref?.()
}

export function getClientIp(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    const real = headers.get('x-real-ip')
    if (real) return real.trim()
    return 'unknown'
}
