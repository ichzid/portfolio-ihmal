import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '20px', color: 'var(--accent)' }}>404</h1>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Halaman Tidak Ditemukan</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Maaf, proyek atau rute yang Anda cari tidak tersedia.
                </p>
                <Link href="/" className="btn btn-primary">
                    Kembali ke Beranda
                </Link>
            </div>
        </>
    )
}
