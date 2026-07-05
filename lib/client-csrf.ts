'use client'

// Helper client untuk fetch dengan CSRF header + credentials
let cachedToken: string | null = null

async function getToken(): Promise<string> {
    if (cachedToken) return cachedToken
    const res = await fetch('/api/csrf', { credentials: 'same-origin', cache: 'no-store' })
    if (!res.ok) throw new Error('Gagal mengambil CSRF token')
    const data = await res.json()
    cachedToken = data.token as string
    return cachedToken
}

export async function fetchCsrf(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const token = await getToken()
    const headers = new Headers(init.headers || {})
    headers.set('x-csrf-token', token)
    return fetch(input, {
        ...init,
        credentials: 'same-origin',
        headers,
    })
}

export function clearCsrfCache() {
    cachedToken = null
}
