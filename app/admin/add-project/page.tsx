'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'

export default function AddProject() {
    const router = useRouter()
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Web Systems',
        description: '',
        long_description: '',
        tech_stack: '', // comma separated
        challenge: '',
        solution: '',
        impact: '',
        demo_url: '',
        github_url: '',
        featured: false,
        year: '',
        role: '',
        timeline: '',
        status: 'Live',
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-');    // Replace multiple - with single -
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === 'title') {
            setFormData(prev => ({ ...prev, [name]: value, slug: generateSlug(value) }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleTechToggle = (tech: string) => {
        setFormData(prev => {
            let stacks = prev.tech_stack.split(',').map(s => s.trim()).filter(s => s)
            if (stacks.includes(tech)) {
                stacks = stacks.filter(s => s !== tech)
            } else {
                stacks.push(tech)
            }
            return { ...prev, tech_stack: stacks.join(', ') }
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = null

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${formData.slug}-${Date.now()}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            // 2. Insert Data
            const { error: insertError } = await supabase
                .from('projects')
                .insert([
                    {
                        ...formData,
                        tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(s => s),
                        demo_url: formData.demo_url || null,
                        github_url: formData.github_url || null,
                        image_url: imageUrl
                    }
                ])

            if (insertError) throw insertError

            showToast('success', 'Project Added', 'Project added successfully! 🎉')
            setFormData({
                title: '',
                slug: '',
                category: 'Web Systems',
                description: '',
                long_description: '',
                tech_stack: '',
                challenge: '',
                solution: '',
                impact: '',
                demo_url: '',
                github_url: '',
                featured: false,
                year: '',
                role: '',
                timeline: '',
                status: 'Live',
            })
            setImageFile(null)

        } catch (error: any) {
            console.error('Error:', error)
            showToast('error', 'Add Failed', error.message || 'An error occurred while saving the project.')
        } finally {
            setLoading(false)
        }
    }

    const commonTechStacks = [
        'React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Node.js',
        'Express', 'NestJS', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL',
        'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'Python', 'Django',
        'Docker', 'AWS'
    ]

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
                <div className="page-header">
                    <h1 className="section-title">Add New Project</h1>
                    <p className="page-subtitle">Create a polished showcase with stable typography and clean layout.</p>
                </div>

                <form onSubmit={handleSubmit} className="form-root">
                    <div className="form-layout">
                        <div className="card">
                            <h2 className="card-title">Project Details</h2>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
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
                                    <option value="SaaS &amp; Tools">SaaS &amp; Tools</option>
                                    <option value="Open Source">Open Source</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Short Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required className="form-input" rows={3} />
                            </div>
                            <div className="form-group">
                                <label>Long Description</label>
                                <textarea name="long_description" value={formData.long_description} onChange={handleChange} className="form-input" rows={6} />
                            </div>
                            <div className="form-group">
                                <label>Challenge</label>
                                <textarea name="challenge" value={formData.challenge} onChange={handleChange} required className="form-input" rows={4} />
                            </div>
                            <div className="form-group">
                                <label>Solution</label>
                                <textarea name="solution" value={formData.solution} onChange={handleChange} required className="form-input" rows={4} />
                            </div>
                            <div className="form-group">
                                <label>Impact</label>
                                <textarea name="impact" value={formData.impact} onChange={handleChange} required className="form-input" rows={4} />
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="card-title">Options & Links</h2>
                            <div className="form-group">
                                <label style={{ marginBottom: '8px', display: 'block' }}>Tech Stack</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {commonTechStacks.map(tech => {
                                        const isActive = formData.tech_stack.split(',').map(s => s.trim()).includes(tech)
                                        return (
                                            <button
                                                type="button"
                                                key={tech}
                                                onClick={() => handleTechToggle(tech)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '18px',
                                                    border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                                                    background: isActive ? 'var(--accent-dim)' : 'var(--surface)',
                                                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s ease',
                                                    fontWeight: isActive ? '600' : '500'
                                                }}
                                            >
                                                {tech}
                                            </button>
                                        )
                                    })}
                                </div>
                                <input
                                    type="text"
                                    name="tech_stack"
                                    value={formData.tech_stack}
                                    onChange={handleChange}
                                    placeholder="Or type custom tech stacks (comma separated)"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Demo URL</label>
                                    <input type="url" name="demo_url" value={formData.demo_url} onChange={handleChange} className="form-input" placeholder="https://" />
                                </div>
                                <div className="form-group">
                                    <label>GitHub URL</label>
                                    <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="form-input" placeholder="https://github.com/" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tahun Proyek</label>
                                    <input type="text" name="year" value={formData.year} onChange={handleChange} className="form-input" placeholder="2024" />
                                </div>
                                <div className="form-group">
                                    <label>Role / Peran</label>
                                    <input type="text" name="role" value={formData.role} onChange={handleChange} className="form-input" placeholder="Fullstack Developer" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Timeline</label>
                                    <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} className="form-input" placeholder="3 Bulan" />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                                        <option value="Live">🟢 Live</option>
                                        <option value="In Progress">🟡 In Progress</option>
                                        <option value="Completed">✅ Completed</option>
                                        <option value="Archived">📦 Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Project Image (Optional)</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" className="form-input" style={{ paddingTop: '10px' }} />
                            </div>

                            <div className="form-group" style={{ marginTop: '8px' }}>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px 20px',
                                        background: formData.featured ? 'var(--accent-dim)' : 'var(--surface)',
                                        border: formData.featured ? '1px solid var(--accent)' : '1px solid var(--border)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0, marginTop: '2px' }}>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                cursor: 'pointer',
                                                accentColor: 'var(--accent)',
                                                margin: 0
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ color: 'var(--text)', fontWeight: '600', fontSize: '1.05rem' }}>Featured Project</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>Showcase this project prominently on the homepage and portfolio sections.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary save-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                                    </svg>
                                    Saving Project...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                        <path d="M17 21V8H7v13" />
                                        <path d="M7 3v5h8" />
                                    </svg>
                                    Save Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .page-header {
                    max-width: 1000px;
                    margin: 0 auto 28px auto;
                    display: grid;
                    gap: 8px;
                    text-align: center;
                }
                .page-subtitle {
                    color: var(--text-muted);
                    font-size: 0.98rem;
                }
                .form-root {
                    display: grid;
                    gap: 28px;
                    max-width: 1040px;
                    margin: 0 auto;
                }
                .form-layout {
                    display: grid;
                    grid-template-columns: 1.6fr 1fr;
                    gap: 24px;
                }
                .card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 24px;
                    box-shadow: 0 8px 28px rgba(0,0,0,0.06);
                }
                .card-title {
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--text);
                    margin-bottom: 16px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .form-group:last-child {
                    margin-bottom: 0;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .form-actions {
                    display: flex;
                    justify-content: center;
                }
                .save-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                @keyframes spin { 
                    from { transform: rotate(0deg); } 
                    to { transform: rotate(360deg); } 
                }
                label {
                    color: var(--text-muted);
                    font-size: 0.88rem;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    margin-top: 4px;
                }
                .form-input {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    color: var(--text);
                    padding: 14px 16px;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 0.98rem;
                    transition: all 0.2s ease;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 2px var(--accent-dim);
                }
                .form-input::placeholder {
                    color: var(--text-muted);
                    opacity: 0.6;
                }
                
                @media (max-width: 768px) {
                    .form-layout {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                }
            `}</style>
        </>
    )
}
