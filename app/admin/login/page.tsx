'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/Toast'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { showToast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login gagal')
            }

            showToast('success', 'Login Berhasil', 'Selamat datang di Admin Panel.')
            router.push('/admin/dashboard')
            router.refresh()
        } catch (error: any) {
            showToast('error', 'Akses Ditolak', error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '160px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
                <div className="login-card">
                    <h1 className="login-title">Admin Access</h1>
                    <p className="login-subtitle">Silakan masukkan kata sandi untuk mengelola portofolio.</p>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password Admin"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .login-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 40px;
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }
                .login-title {
                    font-size: 1.8rem;
                    margin-bottom: 8px;
                    font-weight: 700;
                    color: var(--text);
                }
                .login-subtitle {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    margin-bottom: 32px;
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .form-input {
                    width: 100%;
                    background: var(--surface2);
                    border: 1px solid var(--border);
                    color: var(--text);
                    padding: 14px 16px;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 1rem;
                    text-align: center;
                    transition: all 0.2s ease;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 2px var(--accent-dim);
                }
            `}</style>
        </>
    )
}
