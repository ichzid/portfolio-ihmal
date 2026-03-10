import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 })
        }

        const { error } = await supabase
            .from('messages')
            .insert([{ name, email, message }])

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: 'Gagal menyimpan pesan. Coba lagi nanti.' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('API error:', err)
        return NextResponse.json({ error: 'A server error occurred.' }, { status: 500 })
    }
}
