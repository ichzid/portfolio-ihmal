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
        demo_video_url: '',
        github_url: '',
        featured: false,
        year: '',
        role: '',
        timeline: '',
        status: 'Live',
    })
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

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
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImageFiles(prev => [...prev, ...files])
            const previews = files.map(f => URL.createObjectURL(f))
            setImagePreviews(prev => [...prev, ...previews])
        }
        // Reset input value so same file can be selected again
        e.target.value = ''
    }

    const handleRemoveFile = (idx: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== idx))
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[idx])
            return prev.filter((_, i) => i !== idx)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let uploadedUrls: string[] = []

            // 1. Upload Images if exists
            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i]
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${formData.slug}-${Date.now()}-${i}.${fileExt}`
                    
                    const { error: uploadError } = await supabase.storage
                        .from('project-images')
                        .upload(fileName, file)

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('project-images')
                        .getPublicUrl(fileName)

                    uploadedUrls.push(publicUrl)
                }
            }

            // 2. Insert Data
            const { error: insertError } = await supabase
                .from('projects')
                .insert([{
                    ...formData,
                    tech_stack: formData.tech_stack.split(',').map((s: string) => s.trim()).filter((s: string) => s),
                    demo_url: formData.demo_url || null,
                    demo_video_url: formData.demo_video_url || null,
                    github_url: formData.github_url || null,
                    image_url: uploadedUrls[0] || null,
                    image_urls: uploadedUrls,
                }])

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
                demo_video_url: '',
                github_url: '',
                featured: false,
                year: '',
                role: '',
                timeline: '',
                status: 'Live',
            })
            setImageFiles([])
            setImagePreviews([])

        } catch (error: any) {
            console.error('Error:', error)
            showToast('error', 'Add Failed', error.message || 'An error occurred while saving the project.')
        } finally {
            setLoading(false)
        }
    }

    const commonTechStacks = [
        'React.js', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Laravel',
        'Python', 'Java', 'Node.js', 'Express', 'NestJS', 'Tailwind CSS', 'PostgreSQL',
        'MySQL', 'MongoDB', 'Supabase'
    ]

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
                                    <label>Year</label>
                                    <input type="text" name="year" value={formData.year} onChange={handleChange} className="form-input" placeholder="2024" />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input type="text" name="role" value={formData.role} onChange={handleChange} className="form-input" placeholder="Fullstack Developer" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Timeline</label>
                                    <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} className="form-input" placeholder="3 months" />
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
                                <label>Demo URL (link live)</label>
                                <input type="url" name="demo_url" value={formData.demo_url} onChange={handleChange} className="form-input" placeholder="https://app.example.com" />
                            </div>
                            <div className="form-group">
                                <label>Demo Video URL (YouTube / Loom)</label>
                                <input type="url" name="demo_video_url" value={formData.demo_video_url} onChange={handleChange} className="form-input" placeholder="https://youtube.com/watch?v=..." />
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>YouTube or Loom link · will appear as a video embed on the project page</span>
                            </div>
                            <div className="form-group">
                                <label>GitHub URL</label>
                                <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="form-input" placeholder="https://github.com/username/repo" />
                            </div>

                            <div className="form-group">
                                <label>Project Images (select one or more)</label>
                                <label className="upload-zone">
                                    <input type="file" multiple onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    <span>Click to select photos</span>
                                    <span style={{ fontSize: '0.78rem', opacity: 0.5 }}>PNG, JPG, WEBP · select multiple</span>
                                </label>
                                {imagePreviews.length > 0 && (
                                    <div className="preview-grid">
                                        {imagePreviews.map((src, idx) => (
                                            <div key={idx} className="preview-item">
                                                <img src={src} alt={`Preview ${idx + 1}`} />
                                                <button type="button" className="preview-remove" onClick={() => handleRemoveFile(idx)}>&times;</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 16px;
                    transition: color 0.2s;
                    font-family: inherit;
                }
                .back-btn:hover {
                    color: var(--accent);
                }
                .upload-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 28px 16px;
                    border: 2px dashed var(--border);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: var(--text-muted);
                    text-align: center;
                    text-transform: none;
                    letter-spacing: 0;
                    font-weight: 400;
                    font-size: 0.9rem;
                    background: rgba(255,255,255,0.02);
                }
                .upload-zone:hover {
                    border-color: var(--accent);
                    color: var(--accent);
                    background: var(--accent-dim);
                }
                .preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
                    gap: 8px;
                    margin-top: 4px;
                }
                .preview-item {
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid var(--border);
                }
                .preview-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .preview-remove {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 22px;
                    height: 22px;
                    background: rgba(0,0,0,0.65);
                    color: #fff;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    line-height: 1;
                    transition: background 0.2s;
                }
                .preview-remove:hover {
                    background: rgba(239,68,68,0.85);
                }
            `}</style>
        </>
    )
}
