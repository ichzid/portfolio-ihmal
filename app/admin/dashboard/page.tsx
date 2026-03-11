'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/Toast'

export default function AdminDashboard() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { showToast } = useToast()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('projects')
            .select('id, title, category, status, featured, image_urls')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setProjects(data)
        }
        setLoading(false)
    }

    const handleDelete = async (id: string, title: string, imageUrls: string[]) => {
        if (!confirm(`Are you sure you want to delete the project "${title}"?`)) return

        // 1. Delete images from Storage first
        if (imageUrls && imageUrls.length > 0) {
            const fileNames = imageUrls.map(url => {
                const parts = url.split('/project-images/')
                return parts.length > 1 ? parts[1].split('?')[0] : null
            }).filter(Boolean) as string[]
            if (fileNames.length > 0) {
                await supabase.storage.from('project-images').remove(fileNames)
            }
        }

        // 2. Delete the project record
        const { error } = await supabase.from('projects').delete().eq('id', id)

        if (error) {
            showToast('error', 'Delete Failed', error.message)
        } else {
            showToast('success', 'Deleted', 'Project and all its images have been permanently deleted.')
            setProjects(prev => prev.filter(p => p.id !== id))
        }
    }

    const handleLogout = async () => {
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/admin/login')
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
                {/* Header */}
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

                {/* Content */}
                {loading ? (
                    <div className="dash-state">
                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--accent)' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                        </svg>
                        Loading data...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="dash-state">
                        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: '12px', opacity: 0.4 }}>
                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        No projects yet. Add your first project!
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'center' }}>★</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => (
                                        <tr key={p.id}>
                                            <td className="td-title">{p.title}</td>
                                            <td className="td-muted">{p.category}</td>
                                            <td>
                                                <span className={`status-badge ${p.status === 'Live' ? 'live' : p.status === 'In Progress' ? 'progress' : ''}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{p.featured ? '⭐' : <span style={{ opacity: 0.3 }}>—</span>}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Link href={`/admin/edit-project/${p.id}`} className="btn-action edit">Edit</Link>
                                                <button onClick={() => handleDelete(p.id, p.title, p.image_urls || [])} className="btn-action delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="mobile-cards">
                            {projects.map(p => (
                                <div key={p.id} className="mobile-card">
                                    <div className="mc-header">
                                        <div>
                                            <div className="mc-title">{p.title}</div>
                                            <div className="mc-category">{p.category}</div>
                                        </div>
                                        {p.featured && <span title="Featured">⭐</span>}
                                    </div>
                                    <div className="mc-footer">
                                        <span className={`status-badge ${p.status === 'Live' ? 'live' : p.status === 'In Progress' ? 'progress' : ''}`}>
                                            {p.status}
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link href={`/admin/edit-project/${p.id}`} className="btn-action edit">Edit</Link>
                                            <button onClick={() => handleDelete(p.id, p.title, p.image_urls || [])} className="btn-action delete">Delete</button>
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
                .dash-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-shrink: 0;
                }
                .dash-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 18px;
                    font-size: 0.88rem;
                    white-space: nowrap;
                }
                .logout-btn {
                    color: #ef4444;
                    border-color: rgba(239,68,68,0.4);
                }
                .logout-btn:hover {
                    background: rgba(239,68,68,0.08);
                }
                .dash-state {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 60px 24px;
                    text-align: center;
                    color: var(--text-muted);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                /* Desktop table */
                .table-wrap {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    overflow-x: auto;
                    display: block;
                }
                .mobile-cards {
                    display: none;
                    flex-direction: column;
                    gap: 12px;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .admin-table th {
                    text-align: left;
                    padding: 14px 20px;
                    border-bottom: 1px solid var(--border);
                    color: var(--text-muted);
                    font-size: 0.78rem;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    white-space: nowrap;
                }
                .admin-table td {
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--border);
                    color: var(--text);
                    vertical-align: middle;
                }
                .td-title {
                    font-weight: 600;
                    max-width: 240px;
                }
                .td-muted {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .admin-table tbody tr:last-child td {
                    border-bottom: none;
                }
                .admin-table tbody tr:hover {
                    background: var(--surface2);
                }
                /* Status badge */
                .status-badge {
                    font-size: 0.75rem;
                    padding: 3px 10px;
                    border-radius: 20px;
                    background: var(--surface2);
                    border: 1px solid var(--border);
                    white-space: nowrap;
                    color: var(--text-muted);
                }
                .status-badge.live {
                    color: var(--green);
                    background: rgba(74,222,128,0.1);
                    border-color: rgba(74,222,128,0.25);
                }
                .status-badge.progress {
                    color: #facc15;
                    background: rgba(250,204,21,0.1);
                    border-color: rgba(250,204,21,0.25);
                }
                /* Action buttons */
                .btn-action {
                    font-size: 0.82rem;
                    padding: 5px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-left: 6px;
                    text-decoration: none;
                    display: inline-block;
                    font-weight: 500;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    line-height: 1.6;
                }
                .btn-action.edit {
                    background: var(--surface2);
                    color: var(--text);
                    border-color: var(--border);
                }
                .btn-action.edit:hover {
                    background: var(--accent);
                    color: #000;
                    border-color: var(--accent);
                }
                .btn-action.delete {
                    color: #ef4444;
                    background: transparent;
                }
                .btn-action.delete:hover {
                    background: rgba(239,68,68,0.1);
                    border-color: rgba(239,68,68,0.3);
                }
                /* Mobile card */
                .mobile-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 16px;
                }
                .mc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                    gap: 8px;
                }
                .mc-title {
                    font-weight: 600;
                    color: var(--text);
                    margin-bottom: 4px;
                    line-height: 1.4;
                }
                .mc-category {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                }
                .mc-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 640px) {
                    .table-wrap { display: none; }
                    .mobile-cards { display: flex; }
                    .dash-btn span { display: none; }
                    .dash-btn {
                        padding: 10px 12px;
                    }
                    .btn-action { margin-left: 0; }
                }
            `}</style>
        </>
    )
}
