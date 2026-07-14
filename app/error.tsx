'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
        
        // Auto-refresh jika error karena file JS tidak ditemukan (ChunkLoadError setelah build ulang)
        if (
            error.message?.toLowerCase().includes('loading chunk') ||
            error.name === 'ChunkLoadError' ||
            error.message?.toLowerCase().includes('failed to fetch dynamically imported module')
        ) {
            window.location.reload()
        }
    }, [error])

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--accent)' }}>Oops! Terjadi Kesalahan.</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Maaf, sepertinya ada masalah teknis dalam memuat halaman ini.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button onClick={() => reset()} className="btn btn-primary">
                        Coba Lagi
                    </button>
                    <Link href="/" className="btn btn-outline">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </>
    )
}
