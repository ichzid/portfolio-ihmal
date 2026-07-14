'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/Toast'
import { fetchCsrf, clearCsrfCache } from '@/lib/client-csrf'

interface AdminProject {
    id: string
    title: string
    slug: string
    category: string
    featured: boolean
    imageUrls: string[]
}

export default function AdminDashboard() {
    const [projects, setProjects] = useState<AdminProject[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { showToast } = useToast()

    const fetchProjects = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/projects', { credentials: 'same-origin', cache: 'no-store' })
            if (res.status === 401) {
                router.push('/admin/login')
                return
            }
            const data = await res.json()
            setProjects(data.projects || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete the project "${title}"?`)) return

        try {
            const res = await fetchCsrf(`/api/admin/projects/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                showToast('error', 'Delete Failed', err.error || 'Gagal menghapus project')
                return
            }
            showToast('success', 'Deleted', 'Project and all its images have been permanently deleted.')
            setProjects(prev => prev.filter(p => p.id !== id))
        } catch {
            showToast('error', 'Delete Failed', 'Terjadi kesalahan jaringan')
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
        } catch { /* ignore */ }
        clearCsrfCache()
        router.push('/admin/login')
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
                <div className="dash-header">
                    <div>
                        <h1 className="section-title" style={{ marginBottom: '6px', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            {projects.length} project{projects.length !== 1 ? 's' : ''} registered
                        </p>
                    </div>
                    <div className="dash-actions">
                        <Link href="/admin/add-project" className="btn btn-primary dash-btn">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            <span>Add Project</span>
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline dash-btn logout-btn">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {!loading && projects.length === 0 ? (
                    <div className="dash-state">
                        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: '12px', opacity: 0.4 }}>
                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        No projects yet. Add your first project!
                    </div>
                ) : (
                    <>
                        <div className="table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'center' }}>Featured</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => (
                                        <tr key={p.id}>
                                            <td className="td-title">{p.title}</td>
                                            <td className="td-muted">{p.category}</td>
                                            <td style={{ textAlign: 'center' }}>{p.featured ? 'Yes' : <span style={{ opacity: 0.3 }}>—</span>}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Link href={`/admin/edit-project/${p.id}`} className="btn-action edit">Edit</Link>
                                                <button onClick={() => handleDelete(p.id, p.title)} className="btn-action delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mobile-cards">
                            {projects.map(p => (
                                <div key={p.id} className="mobile-card">
                                    <div className="mc-header">
                                        <div>
                                            <div className="mc-title">{p.title}</div>
                                            <div className="mc-category">{p.category}</div>
                                        </div>
                                        {p.featured && <span title="Featured">Featured</span>}
                                    </div>
                                    <div className="mc-footer">
                                        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                            <Link href={`/admin/edit-project/${p.id}`} className="btn-action edit">Edit</Link>
                                            <button onClick={() => handleDelete(p.id, p.title)} className="btn-action delete">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .dash-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .dash-actions { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }
                .dash-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; font-size: 0.88rem; white-space: nowrap; }
                .logout-btn { color: #ef4444; border-color: rgba(239,68,68,0.4); }
                .logout-btn:hover { background: rgba(239,68,68,0.08); }
                .dash-state { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 60px 24px; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; }
                .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow-x: auto; display: block; }
                .mobile-cards { display: none; flex-direction: column; gap: 12px; }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 14px 20px; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
                .admin-table td { padding: 16px 20px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
                .td-title { font-weight: 600; max-width: 240px; }
                .td-muted { color: var(--text-muted); font-size: 0.9rem; }
                .admin-table tbody tr:last-child td { border-bottom: none; }
                .admin-table tbody tr:hover { background: var(--surface2); }
                .btn-action { font-size: 0.82rem; padding: 5px 12px; border-radius: 6px; cursor: pointer; margin-left: 6px; text-decoration: none; display: inline-block; font-weight: 500; transition: all 0.2s; border: 1px solid transparent; line-height: 1.6; }
                .btn-action.edit { background: var(--surface2); color: var(--text); border-color: var(--border); }
                .btn-action.edit:hover { background: var(--accent); color: #000; border-color: var(--accent); }
                .btn-action.delete { color: #ef4444; background: transparent; }
                .btn-action.delete:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }
                .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
                .mc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; }
                .mc-title { font-weight: 600; color: var(--text); margin-bottom: 4px; line-height: 1.4; }
                .mc-category { font-size: 0.82rem; color: var(--text-muted); }
                .mc-footer { display: flex; justify-content: space-between; align-items: center; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 640px) {
                    .table-wrap { display: none; }
                    .mobile-cards { display: flex; }
                    .dash-btn span { display: none; }
                    .dash-btn { padding: 10px 12px; }
                    .btn-action { margin-left: 0; }
                }
            `}</style>
        </>
    )
}
