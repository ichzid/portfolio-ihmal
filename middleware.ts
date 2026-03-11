import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Lindungi semua route di dalam /admin KECUALI /admin/login
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value

        // Verifikasi token sederhana
        if (token !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // Jika sudah login dan mencoba ke halaman login, redirect ke dashboard
    if (pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value
        if (token === 'authenticated') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
