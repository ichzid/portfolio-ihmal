import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const CSRF_COOKIE = 'csrf_token'
const CSRF_HEADER = 'x-csrf-token'

export async function ensureCsrfToken(): Promise<string> {
    const store = await cookies()
    const existing = store.get(CSRF_COOKIE)?.value
    if (existing && existing.length === 64) return existing

    const token = crypto.randomBytes(32).toString('hex')
    store.set({
        name: CSRF_COOKIE,
        value: token,
        httpOnly: false, // dibaca oleh client untuk dikirim di header
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    })
    return token
}

/**
 * Double-submit cookie pattern:
 * cookie value dan header value harus cocok.
 */
export function verifyCsrf(req: NextRequest): boolean {
    const cookieToken = req.cookies.get(CSRF_COOKIE)?.value
    const headerToken = req.headers.get(CSRF_HEADER)
    if (!cookieToken || !headerToken) return false
    if (cookieToken.length !== headerToken.length) return false
    try {
        return crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))
    } catch {
        return false
    }
}

export { CSRF_COOKIE, CSRF_HEADER }
