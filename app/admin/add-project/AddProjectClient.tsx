'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'
import { fetchCsrf } from '@/lib/client-csrf'

interface ProjectForm {
    title: string
    slug: string
    category: string
    description: string
    longDescription: string
    techStack: string
    challenge: string
    solution: string
    impact: string
    demoUrl: string
    demoVideoUrl: string
    githubUrl: string
    featured: boolean
}

const initialForm: ProjectForm = {
    title: '',
    slug: '',
    category: 'Web Systems',
    description: '',
    longDescription: '',
    techStack: '',
    challenge: '',
    solution: '',
    impact: '',
    demoUrl: '',
    demoVideoUrl: '',
    githubUrl: '',
    featured: false,
}

const generateSlug = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/-{2,}/g, '-')

const commonTechStacks = [
    'React.js', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Laravel',
    'Python', 'Java', 'Node.js', 'Express', 'NestJS', 'Tailwind',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Prisma',
]

export default function AddProjectClient() {
    const router = useRouter()
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState<ProjectForm>(initialForm)
    const [imageUrls, setImageUrls] = useState<string[]>([])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => {
            if (name === 'title') return { ...prev, title: value, slug: generateSlug(value) }
            return { ...prev, [name]: value }
        })
    }

    const handleTechToggle = (tech: string) => {
        setFormData(prev => {
            let stacks = prev.techStack.split(',').map(s => s.trim()).filter(Boolean)
            stacks = stacks.includes(tech) ? stacks.filter(s => s !== tech) : [...stacks, tech]
            return { ...prev, techStack: stacks.join(', ') }
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const files = Array.from(e.target.files)
        e.target.value = ''

        setUploading(true)
        try {
            for (const file of files) {
                const fd = new FormData()
                fd.append('file', file)
                fd.append('slug', formData.slug || 'project')
                const res = await fetchCsrf('/api/admin/upload', { method: 'POST', body: fd })
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    showToast('error', 'Upload gagal', err.error || file.name)
                    continue
                }
                const data = await res.json()
                setImageUrls(prev => [...prev, data.image.url])
            }
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = (idx: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                title: formData.title,
                slug: formData.slug,
                category: formData.category,
                description: formData.description,
                longDescription: formData.longDescription,
                techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
                challenge: formData.challenge,
                solution: formData.solution,
                impact: formData.impact,
                demoUrl: formData.demoUrl,
                demoVideoUrl: formData.demoVideoUrl,
                githubUrl: formData.githubUrl,
                featured: formData.featured,
                imageUrls,
            }

            const res = await fetchCsrf('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                showToast('error', 'Add Failed', err.error || 'Gagal menyimpan project')
                return
            }

            showToast('success', 'Project Added', 'Project berhasil ditambahkan!')
            setFormData(initialForm)
            setImageUrls([])
            router.push('/admin/dashboard')
        } catch (err) {
            showToast('error', 'Add Failed', err instanceof Error ? err.message : 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
                <div className="page-header">
                    <button type="button" onClick={() => router.back()} className="back-btn">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        Back
                    </button>
                    <h1 className="section-title">Add New Project</h1>
                    <p className="page-subtitle">Create a polished showcase with stable typography and clean layout.</p>
                </div>

                <form onSubmit={handleSubmit} className="form-root">
                    <div className="form-layout">
                        <div className="card">
                            <h2 className="card-title">Project Details</h2>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" maxLength={255} />
                            </div>
                            <div className="form-group">
                                <label>Slug (URL) - Auto-generated</label>
                                <input type="text" name="slug" value={formData.slug} readOnly className="form-input" style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className="form-input">
                                    <option value="Web Systems">Web Systems</option>
                                    <option value="Automation">Automation</option>
                                    <option value="SaaS & Tools">SaaS &amp; Tools</option>
                                    <option value="Open Source">Open Source</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Short Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required className="form-input" rows={3} maxLength={2000} />
                            </div>
                            <div className="form-group">
                                <label>Long Description</label>
                                <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="form-input" rows={6} maxLength={20000} />
                            </div>
                            <div className="form-group">
                                <label>Challenge</label>
                                <textarea name="challenge" value={formData.challenge} onChange={handleChange} className="form-input" rows={4} maxLength={20000} />
                            </div>
                            <div className="form-group">
                                <label>Solution</label>
                                <textarea name="solution" value={formData.solution} onChange={handleChange} className="form-input" rows={4} maxLength={20000} />
                            </div>
                            <div className="form-group">
                                <label>Impact</label>
                                <textarea name="impact" value={formData.impact} onChange={handleChange} className="form-input" rows={4} maxLength={20000} />
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="card-title">Options & Links</h2>
                            <div className="form-group">
                                <label style={{ marginBottom: '8px', display: 'block' }}>Tech Stack</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {commonTechStacks.map(tech => {
                                        const isActive = formData.techStack.split(',').map(s => s.trim()).includes(tech)
                                        return (
                                            <button
                                                type="button"
                                                key={tech}
                                                onClick={() => handleTechToggle(tech)}
                                                className={`tech-btn ${isActive ? 'active' : ''}`}
                                            >
                                                {tech}
                                            </button>
                                        )
                                    })}
                                </div>
                                <input
                                    type="text"
                                    name="techStack"
                                    value={formData.techStack}
                                    onChange={handleChange}
                                    placeholder="Or type custom tech stacks (comma separated)"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Demo URL</label>
                                <input type="url" name="demoUrl" value={formData.demoUrl} onChange={handleChange} className="form-input" placeholder="https://app.example.com" maxLength={500} />
                            </div>
                            <div className="form-group">
                                <label>Demo Video URL</label>
                                <input type="url" name="demoVideoUrl" value={formData.demoVideoUrl} onChange={handleChange} className="form-input" placeholder="https://youtube.com/watch?v=..." maxLength={500} />
                            </div>
                            <div className="form-group">
                                <label>GitHub URL</label>
                                <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="form-input" placeholder="https://github.com/username/repo" maxLength={500} />
                            </div>

                            <div className="form-group">
                                <label>Project Images</label>
                                <label className="upload-zone">
                                    <input type="file" multiple onChange={handleFileChange} accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} style={{ display: 'none' }} />
                                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    <span>Click to select photos</span>
                                    <span style={{ fontSize: '0.78rem', opacity: 0.5 }}>JPG, PNG, WEBP, AVIF · max 5MB / file</span>
                                </label>
                                {imageUrls.length > 0 && (
                                    <div className="preview-grid">
                                        {imageUrls.map((src, idx) => (
                                            <div key={idx} className="preview-item">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={src} alt={`Preview ${idx + 1}`} />
                                                <button type="button" className="preview-remove" onClick={() => handleRemoveImage(idx)}>&times;</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group" style={{ marginTop: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: formData.featured ? 'var(--accent-dim)' : 'var(--surface)', border: formData.featured ? '1px solid var(--accent)' : '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Featured Project</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tampilkan menonjol di homepage.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary save-btn" disabled={loading || uploading}>
                            Save Project
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .page-header { max-width: 1000px; margin: 0 auto 28px auto; display: grid; gap: 8px; text-align: center; }
                .page-subtitle { color: var(--text-muted); font-size: 0.98rem; }
                .form-root { display: grid; gap: 28px; max-width: 1040px; margin: 0 auto; }
                .form-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; }
                .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
                .card-title { font-size: 1.15rem; font-weight: 600; color: var(--text); margin-bottom: 16px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
                .form-group:last-child { margin-bottom: 0; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .form-actions { display: flex; justify-content: center; }
                .save-btn { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; }
                label { color: var(--text-muted); font-size: 0.88rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin-top: 4px; }
                .form-input { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 14px 16px; border-radius: 10px; font-family: inherit; font-size: 0.98rem; transition: all 0.2s ease; }
                .form-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-dim); }
                .form-input::placeholder { color: var(--text-muted); opacity: 0.6; }
                .tech-btn { padding: 8px 16px; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); cursor: pointer; font-size: 0.9rem; transition: all 0.2s; font-weight: 500; }
                .tech-btn.active { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); font-weight: 600; }
                .back-btn { display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.85rem; background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 16px; }
                .upload-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 28px 16px; border: 2px dashed var(--border); border-radius: 12px; cursor: pointer; transition: all 0.2s; color: var(--text-muted); text-align: center; text-transform: none; letter-spacing: 0; font-weight: 400; font-size: 0.9rem; background: rgba(255,255,255,0.02); }
                .upload-zone:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
                .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 8px; margin-top: 4px; }
                .preview-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
                .preview-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .preview-remove { position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; background: rgba(0,0,0,0.65); color: #fff; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
                .preview-remove:hover { background: rgba(239,68,68,0.85); }
                @media (max-width: 768px) {
                    .form-layout { grid-template-columns: 1fr; gap: 20px; }
                    .form-row { grid-template-columns: 1fr; gap: 16px; }
                }
            `}</style>
        </>
    )
}
