import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json()
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminPassword) {
            return NextResponse.json(
                { error: 'Server misconfiguration: ADMIN_PASSWORD is not set' },
                { status: 500 }
            )
        }

        if (password === adminPassword) {
            // Set cookie yang berlaku selama 24 jam
            const response = NextResponse.json({ success: true })
            response.cookies.set({
                name: 'admin_token',
                value: 'authenticated',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 jam
                path: '/',
            })

            return response
        }

        return NextResponse.json({ error: 'Password salah!' }, { status: 401 })
    } catch (err) {
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 })
    }
}
